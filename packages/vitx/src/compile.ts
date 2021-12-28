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
  compileVueSfc,
  enableSourcemap,
  enablePlumber,
  enablefileCache,
  applyBeforeHook,
  applyAfterHook,
  modifySourcemap,
  logger
} from './host'
import getConfig, { IGetUserConfig } from './getUserConfig'
import type { IModes, IVitxConfig } from './types'
import schema from './configSchema'

const configFileNames = ['.vitxrc.ts', '.vitxrc.js']
const extSignals = ['SIGINT', 'SIGQUIT', 'SIGTERM']
const cache = {}
const getUserConfig = (cwd: IGetUserConfig['cwd']) =>
  getConfig({ cwd, schema, configFileNames }) as IVitxConfig
const defaultConfig = <const>{
  entry: 'src',
  output: 'lib',
  target: 'browser',
  moduleType: 'esm',
  sourcemap: false,
  packageDirName: 'packages'
}

function compile(watch: boolean, currentDirPath: string, mode: IModes, currentConfig: IVitxConfig) {
  const {
    entry,
    output,
    moduleType,
    sourcemap,
    lessOptions,
    alias,
    afterHook,
    beforeReadWriteStream,
    afterReadWriteStream,
    injectVueCss,
    disableTypes
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
    currentEntryDirPath: string
    currentOutputDirPath: string
    mode: IModes
  }) {
    const { patterns, currentEntryDirPath, currentOutputDirPath, mode } = options

    return vinylFs
      .src(patterns, { base: currentEntryDirPath, allowEmpty: true })
      .pipe(enableSourcemap(sourcemap))
      .pipe(enablePlumber(watch))
      .pipe(enablefileCache(cache))
      .pipe(compileVueSfc(injectVueCss))
      .pipe(compileLess(lessOptions))
      .pipe(applyBeforeHook(beforeReadWriteStream))
      .pipe(compileAlias(alias))
      .pipe(compileDeclaration(currentDirPath, disableTypes))
      .pipe(compileJsOrTs(currentConfig, { currentEntryDirPath, mode }))
      .pipe(applyAfterHook(afterReadWriteStream))
      .pipe(modifySourcemap(sourcemap))
      .pipe(logger(output, mode))
      .pipe(vinylFs.dest(currentOutputDirPath))
  }

  return new Promise<void>((resolve) => {
    const streamOptions = {
      patterns,
      currentEntryDirPath: currentEntryPath,
      currentOutputDirPath: currentOutputPath,
      mode
    }
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

        const eventLoger = (evnet: string, fullEnterPath: string) => {
          console.log(
            `${chalk.blue(
              figures.info,
              evnet.charAt(0).toUpperCase() + evnet.slice(1)
            )} ${fullEnterPath.replace(currentDirPath, '').slice(1)}`
          )
        }

        watcher.on('all', (evnet, fullEnterPath) => {
          if (!fs.existsSync(fullEnterPath)) {
            eventLoger(evnet, fullEnterPath)

            const fullOutputPath = fullEnterPath.replace(entry, output)

            rimraf.sync(fullOutputPath.replace('.ts', '.js'))
            rimraf.sync(fullOutputPath.replace('.ts', '.d.ts'))

            return
          }

          if (fs.statSync(fullEnterPath).isFile()) {
            const content = fs.readFileSync(fullEnterPath, 'utf-8')

            // Cache files to reduce unnecessary compilation
            if (cache[fullEnterPath] !== content) {
              eventLoger(evnet, fullEnterPath)
              cache[fullEnterPath] = content
              createStream({ ...streamOptions, patterns: fullEnterPath })
            }
          }
        })

        //  used for node api shutdown monitoring
        extSignals.forEach((signal) => {
          process.once(signal, () => watcher.close())
        })
      }

      resolve()
    })
  })
}

/**
 * @param {{ cwd: string; watch?: boolean; userConfig?: IVitxConfig }} options - Node api startup parameters.
 * @param {string} options.cwd - Root directory.
 * @param {boolean} options.watch - Whether to enable monitoring.
 * @param {IVitxConfig} options.userConfig - User configuration
 */
export async function build(options: { cwd: string; watch?: boolean; userConfig?: IVitxConfig }) {
  const config = { ...defaultConfig, ...getUserConfig(options.cwd) }

  async function run(currentPath: string, currentConfig: IVitxConfig) {
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
      const packageConfig = getUserConfig(packagePath)
      process.chdir(packagePath)

      console.log(
        `${chalk.blue(figures.info, 'Package:')} ${chalk.red(path.basename(packagePath))}`
      )

      await run(packagePath, { ...config, ...packageConfig })
    }
  } else {
    await run(options.cwd, config)
  }
}
