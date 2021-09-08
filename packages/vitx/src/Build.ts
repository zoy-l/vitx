import chokidar from '@vitx/bundles/model/chokidar'
import vinylFs from '@vitx/bundles/model/vinyl-fs'
import figures from '@vitx/bundles/model/figures'
import rimraf from '@vitx/bundles/model/rimraf'
import chalk from '@vitx/bundles/model/chalk'
import path from 'path'
import fs from 'fs'

import {
  compileDeclaration,
  compileJsOrTs,
  compileAlias,
  compileLess,
  enableSourcemap,
  enablePlumber,
  enablefileCache,
  applyBeforeHook,
  applyAfterHook,
  modifySourcemap,
  logger
} from './compiles'
import type { IZnoConfig } from './types'
import getTSConfig from './getTsConifg'
import getConfig from './config'

interface IBuildOptions {
  cwd: string
  watch?: boolean
  userConfig?: IZnoConfig
}

type IModes = 'cjs' | 'esm'

function compile(watch: boolean, currentDirPath: string, mode: IModes, currentConfig: IZnoConfig) {
  const {
    entry,
    output,
    moduleType,
    sourcemap,
    lessOptions,
    paths,
    afterHook,
    beforeReadWriteStream,
    afterReadWriteStream
  } = currentConfig

  const currentEntryPath = path.join(currentDirPath, entry)
  let currentOutputPath = path.join(currentDirPath, output)

  if (moduleType === 'all') {
    currentOutputPath = path.join(currentOutputPath, mode)
  }

  rimraf.sync(currentOutputPath)

  const patterns = [
    path.join(currentEntryPath, '**/*'),
    `!${path.join(currentEntryPath, '**/*.mdx')}`,
    `!${path.join(currentEntryPath, '**/*.md')}`,
    `!${path.join(currentEntryPath, '**/demos{,/**}')}`,
    `!${path.join(currentEntryPath, '**/fixtures{,/**}')}`,
    `!${path.join(currentEntryPath, '**/__test__{,/**}')}`,
    `!${path.join(currentEntryPath, '**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)')}`
  ]

  function createStream(options: {
    patterns: string | string[]
    currentEntryPath: string
    currentOutputPath: string
    mode: IModes
  }) {
    const { patterns, currentEntryPath, currentOutputPath, mode } = options
    const { tsConfig } = getTSConfig(currentEntryPath)

    return vinylFs
      .src(patterns, { base: currentEntryPath, allowEmpty: true })
      .pipe(enableSourcemap(sourcemap))
      .pipe(enablePlumber(watch))
      .pipe(enablefileCache())
      .pipe(compileLess(lessOptions))
      .pipe(applyBeforeHook(beforeReadWriteStream))
      .pipe(compileAlias(paths))
      .pipe(compileDeclaration(tsConfig))
      .pipe(compileJsOrTs(currentConfig, { currentEntryPath, mode }))
      .pipe(applyAfterHook(afterReadWriteStream))
      .pipe(modifySourcemap(sourcemap))
      .pipe(logger(output, mode))
      .pipe(vinylFs.dest(currentOutputPath))
  }

  return new Promise<void>((resolve) => {
    const streamOptions = { patterns, currentEntryPath, currentOutputPath, mode }
    createStream(streamOptions).on('end', () => {
      afterHook && afterHook()

      if (watch) {
        console.log(`${chalk.blue(figures.info)} ${chalk.green('Start watching directory!')}`)

        const watcher = chokidar.watch(patterns, {
          ignoreInitial: true,
          awaitWriteFinish: {
            stabilityThreshold: 200
          }
        })

        const cache = {}

        watcher.on('all', (evnet, fullEnterPath) => {
          console.log(`${chalk.blue(figures.info, evnet.charAt(0).toUpperCase() + evnet.slice(1))}`)

          if (!fs.existsSync(fullEnterPath)) {
            const fullOutputPath = fullEnterPath.replace(entry, output)

            rimraf.sync(fullOutputPath.replace('.ts', '.js'))
            rimraf.sync(fullOutputPath.replace('.ts', '.d.ts'))
            return
          }

          if (fs.statSync(fullEnterPath).isFile()) {
            const content = fs.readFileSync(fullEnterPath, 'utf-8')
            if (cache[fullEnterPath] !== content) {
              cache[fullEnterPath] = content
              createStream({ ...streamOptions, patterns: fullEnterPath })
            }
          }
        })
      }

      resolve()
    })
  })
}

export async function build(options: IBuildOptions) {
  const config = getConfig(options.cwd)

  async function run(currentPath: string, currentConfig: IZnoConfig) {
    let modes = [currentConfig.moduleType]

    if (currentConfig.moduleType === 'all') {
      rimraf.sync(currentConfig.output!)
      modes = ['cjs', 'esm']
    }

    while (modes.length) {
      const mode = modes.shift()

      await compile(!!options.watch, currentPath, mode as IModes, currentConfig)
    }
  }

  if (config.packages) {
    const packagesPaths = config.packages
      .map((dir) => path.join(options.cwd, config.packageDirName!, dir))
      .filter((dir) => fs.statSync(dir).isDirectory())

    while (packagesPaths.length) {
      const packagePath = packagesPaths.shift()!
      const packageConfig = getConfig(packagePath, false)
      process.chdir(packagePath)

      console.log(
        `${chalk.blue(figures.info, 'Package:')} ${chalk.red(path.basename(packagePath))}`
      )

      await run(packagePath, { ...config, ...packageConfig })
    }
  } else {
    run(options.cwd, config)
  }
}
