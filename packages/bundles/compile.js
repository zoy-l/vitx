const { join, basename } = require('path')
const ncc = require('@vercel/ncc')
const fs = require('fs-extra')
const glob = require('glob')
const rimraf = require('rimraf')

const revise = require('./revise')

function getModelPackageJson(name, sep = '../') {
  const dir = join(require.resolve(name), sep)
  const namespace = name[0] === '@'

  if (basename(dir) === (namespace ? basename(name) : name)) {
    const pkg = require(join(dir, 'package.json'))

    return join(dir, pkg.types || 'index.d.ts')
  }

  return getModelPackageJson(name, sep + '../')
}

async function compileBundles(name, options = {}) {
  const defaultOptions = { externals, minify: true }
  const { code } = await ncc(
    require.resolve(name),
    Object.assign(defaultOptions, options)
  )

  fs.outputFileSync(
    join(__dirname, `model/${name}`, 'index.js'),
    code.replace(/new Buffer\(/g, 'Buffer.from(')
  )

  externals[name] = `@nerd/bundles/model/${name}`
}

const subPackage = ['through2']

async function run() {
  rimraf.sync('./model')

  subPackage.forEach((name) => {
    fs.removeSync(join(__dirname, 'node_modules', name))
  })

  while (dependencies.length) {
    const describe = dependencies.shift()

    const modelName = describe[0]
    await compileBundles(modelName)
    if (describe.length > 1) {
      let mainDtsPath = getModelPackageJson(modelName)

      if (describe[1] !== 'self') {
        const namespace = modelName[0] === '@'
        mainDtsPath =
          join(mainDtsPath, namespace ? '../../../' : '../../', describe[1]) +
          '/index.d.ts'
      } else if (describe[1] === 'manual') {
        mainDtsPath = describe[1]
      }

      const mainDtsFileName = basename(mainDtsPath)
      const dtss = glob.sync(join(mainDtsPath, '..') + '/*.d.ts')

      dtss.forEach((path) => {
        let outDtsName = basename(path)

        if (outDtsName === mainDtsFileName && outDtsName !== 'index.d.ts') {
          outDtsName = 'index.d.ts'
        }

        const outPath = join(__dirname, `model/${modelName}`, outDtsName)
        fs.copyFileSync(path, outPath)
      })

      revise[modelName] && revise[modelName](`model/${modelName}`)
    }
  }
}

const externals = {
  typescript: 'typescript',
  'source-map': 'source-map',
  'node-libs-browser': 'node-libs-browser'
}

const dependencies = [
  ['@babel/core', '@types/babel__core'],
  ['@babel/plugin-transform-modules-commonjs'],
  ['@babel/plugin-proposal-do-expressions'],
  ['@babel/plugin-proposal-export-default-from'],
  ['@babel/plugin-transform-runtime'],
  ['@babel/preset-react'],
  ['@babel/preset-typescript'],
  ['@babel/preset-env'],
  ['@babel/register'],
  ['chalk', 'self'],
  ['slash', 'self'],
  ['deepmerge', 'self'],
  ['through2', '@types/through2'],
  ['gulp-if', '@types/gulp-if'],
  ['gulp-insert', '@types/gulp-insert'],
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
  ['joi', 'self']
]

run()
