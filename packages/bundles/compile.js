const { join, basename } = require('path')
const ncc = require('@vercel/ncc')
const rimraf = require('rimraf')
const fs = require('fs-extra')
const glob = require('glob')
const chalk = require('chalk')
const ora = require('ora')

const revise = require('./revise')

const outDir = 'model'
const indexDts = 'index.d.ts'
const outDirPath = join(__dirname, outDir)

function isNamespaceNodeModulesPath(modelName) {
  return modelName[0] === '@' ? '../../../' : '../../'
}

function getModelPackageJson(name, sep = '../') {
  const dir = join(require.resolve(name), sep)
  const namespace = name[0] === '@'

  if (basename(dir) === (namespace ? basename(name) : name)) {
    const pkg = require(join(dir, 'package.json'))

    return { dir, pkg }
  }

  return getModelPackageJson(name, sep + '../')
}

function sizeFilter(byte) {
  let i = 0

  while (Math.abs(byte) >= 1024) {
    byte /= 1024
    i++
    if (i === 2) break
  }

  const units = ['B', 'Kb', 'Mb']
  const size = Math.round(byte, 2)
  return ' ' + size + units[i]
}

async function compileBundles(name, options = {}) {
  const spinner = ora({
    color: 'white',
    text: `compile: ${chalk.cyan(name)}`
  }).start()

  const defaultOptions = { externals, minify: true, quiet: true }
  const { code, assets } = await ncc(require.resolve(name), Object.assign(defaultOptions, options))

  const buf = Buffer.from(code)

  const outPath = join(outDirPath, name, 'index.js')

  fs.outputFileSync(outPath, code.replace(/new Buffer\(/g, 'Buffer.from('))

  if (assets) {
    Object.keys(assets).forEach((fileName) => {
      fs.outputFileSync(join(outPath, '..', fileName), assets[fileName].source)
    })
  }

  externals[name] = `@vitx/bundles/${outDir}/${name}`
  spinner.succeed(chalk.green('Success: ') + chalk.yellow(name + sizeFilter(buf.byteLength))).stop()
}

async function run() {
  rimraf.sync(outDirPath)

  while (dependencies.length) {
    const describe = dependencies.shift()

    const [modelName, modelTypeName] = describe
    // safe
    // eslint-disable-next-line no-await-in-loop
    await compileBundles(modelName)
    if (describe.length > 1) {
      const { dir, pkg } = getModelPackageJson(modelName)
      let mainDtsPath = join(dir, pkg.types || indexDts)

      if (modelTypeName !== 'self') {
        const absPath = isNamespaceNodeModulesPath(modelName)
        mainDtsPath = join(mainDtsPath, absPath, modelTypeName, indexDts)
      } else if (modelTypeName === 'manual') {
        mainDtsPath = modelTypeName
      }

      const mainDtsFileName = basename(mainDtsPath)
      const dtss = glob.sync(join(mainDtsPath, '..', '*.d.ts'))

      dtss.forEach((path) => {
        let outDtsName = basename(path)

        if (outDtsName === mainDtsFileName && outDtsName !== indexDts) {
          outDtsName = indexDts
        }

        const outPath = join(outDirPath, modelName, outDtsName)
        fs.copyFileSync(path, outPath)
      })

      revise[modelName] && revise[modelName](`${outDir}/${modelName}`)
    }
  }
}

const externals = {
  typescript: 'typescript',
  'node-libs-browser': 'node-libs-browser',
  fsevents: 'fsevents'
}

const dependencies = [
  ['@babel/types'],
  ['@babel/core', '@types/babel__core'],
  ['@babel/plugin-transform-modules-commonjs'],
  ['@babel/plugin-proposal-do-expressions'],
  ['@babel/plugin-proposal-export-default-from'],
  ['@babel/plugin-transform-runtime'],
  ['@babel/preset-react'],
  ['@babel/preset-typescript'],
  ['@babel/preset-env'],
  ['@babel/register'],
  ['hash-sum', '@types/hash-sum'],
  ['chalk', 'self'],
  ['slash', 'self'],
  ['deepmerge', 'self'],
  ['through2', '@types/through2'],
  ['vinyl', '@types/vinyl'],
  ['gulp-if', '@types/gulp-if'],
  ['gulp-less', '@types/gulp-less'],
  ['gulp-plumber', '@types/gulp-plumber'],
  ['gulp-sourcemaps', '@types/gulp-sourcemaps'],
  ['gulp-typescript', 'self'],
  ['chokidar', 'self'],
  ['rimraf', '@types/rimraf'],
  ['vinyl-fs', '@types/vinyl-fs'],
  ['vinyl-sourcemaps-apply'],
  ['yargs-parser', '@types/yargs-parser'],
  ['less'],
  ['joi', 'self'],
  ['figures', 'self'],
  ['ora', 'self'],
  ['@vue/compiler-sfc', 'self']
]

run()
