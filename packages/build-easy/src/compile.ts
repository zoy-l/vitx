import chokidar from '@build-easy/bundles/model/chokidar'
import vinylFs from '@build-easy/bundles/model/vinyl-fs'
import figures from '@build-easy/bundles/model/figures'
import findUp from '@build-easy/bundles/model/find-up'
import rimraf from '@build-easy/bundles/model/rimraf'
import chalk from '@build-easy/bundles/model/chalk'
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
  logger,
  hackGetFile,
  hackSaveFile
} from './host'
import getConfig, { IGetUserConfig } from './getUserConfig'
import type { BuildConfig } from './types'
import schema from './configSchema'

const configFileNames = ['build.easy.ts', 'build.easy.js']
const extSignals = ['SIGINT', 'SIGQUIT', 'SIGTERM']
const cache = {}
const getUserConfig = (cwd: IGetUserConfig['cwd']) =>
  getConfig({ cwd, schema, configFileNames }) as BuildConfig
const defaultConfig = <const>{
  entry: 'src',
  output: 'lib',
  target: 'browser',
  moduleType: 'esm',
  sourcemap: false,
  packageDirName: 'packages'
}

function compile(options: { watch: boolean; currentDirPath: string; currentConfig: BuildConfig }) {
  const { watch, currentDirPath, currentConfig } = options
  const {
    entry,
    output,
    sourcemap,
    lessOptions,
    moduleType,
    alias,
    afterHook,
    beforeReadWriteStream,
    afterReadWriteStream,
    injectVueCss,
    tsCompilerOptions = {},
    patterns: inputPatterns
  } = currentConfig as Required<BuildConfig>

  const currentEntryPath = path.join(currentDirPath, entry)
  const currentOutputPath = path.join(currentDirPath, output)

  rimraf.sync(currentOutputPath)

  let patterns = [
    path.join(currentEntryPath, '**/*'),
    `!${path.join(currentEntryPath, '**/*.mdx')}`,
    `!${path.join(currentEntryPath, '**/*.md')}`,
    `!${path.join(currentEntryPath, '**/demos{,/**}')}`,
    `!${path.join(currentEntryPath, '**/demo{,/**}')}`,
    `!${path.join(currentEntryPath, '**/fixtures{,/**}')}`,
    `!${path.join(currentEntryPath, '**/__snapshots__{,/**}')}`,
    `!${path.join(currentEntryPath, '**/__test__{,/**}')}`,
    `!${path.join(currentEntryPath, '**/__tests__{,/**}')}`,
    `!${path.join(currentEntryPath, '**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)')}`,
    `!${path.join(currentEntryPath, '**/*.snap')}`
  ]

  if (inputPatterns) {
    patterns = inputPatterns(patterns, currentEntryPath)
  }

  function createStream(options: {
    patterns: string | string[]
    currentEntryDirPath: string
    currentOutputDirPath: string
  }) {
    const { patterns, currentEntryDirPath, currentOutputDirPath } = options

    return vinylFs
      .src(patterns, { base: currentEntryDirPath, allowEmpty: true })
      .pipe(enableSourcemap(sourcemap))
      .pipe(enablePlumber(watch))
      .pipe(enablefileCache(cache))
      .pipe(applyBeforeHook(beforeReadWriteStream))
      .pipe(compileAlias(alias))
      .pipe(compileVueSfc(injectVueCss))
      .pipe(compileLess(lessOptions))
      .pipe(hackSaveFile())
      .pipe(compileDeclaration(tsCompilerOptions))
      .pipe(hackGetFile(moduleType))
      .pipe(compileJsOrTs(currentConfig, currentEntryDirPath))
      .pipe(applyAfterHook(afterReadWriteStream))
      .pipe(modifySourcemap(sourcemap))
      .pipe(logger(output))
      .pipe(vinylFs.dest(currentOutputDirPath))
  }

  return new Promise<void>((resolve) => {
    const streamOptions = {
      patterns,
      currentEntryDirPath: currentEntryPath,
      currentOutputDirPath: currentOutputPath
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
 * @param {{ cwd: string; watch?: boolean; userConfig?: BuildConfig }} options - Node api startup parameters.
 * @param {string} options.cwd - Root directory.
 * @param {boolean} options.watch - Whether to enable monitoring.
 * @param {BuildConfig} options.userConfig - User configuration
 */
export async function build(options: { cwd: string; watch?: boolean; userConfig?: BuildConfig }) {
  let userConfig = getUserConfig(options.cwd)

  if (userConfig && !Object.keys(userConfig).length) {
    let rootConfigPath

    for (let i = 0; i < configFileNames.length; i++) {
      rootConfigPath = await findUp(configFileNames[i])

      if (rootConfigPath) {
        rootConfigPath = path.join(rootConfigPath, '..')
        break
      }
    }

    if (rootConfigPath) {
      userConfig = getUserConfig(rootConfigPath)
      delete userConfig.packages
    }
  }

  const config = { ...defaultConfig, ...userConfig }

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

      await compile({
        watch: !!options.watch,
        currentDirPath: packagePath,
        currentConfig: { ...config, ...packageConfig }
      })
    }
  } else {
    await compile({ watch: !!options.watch, currentDirPath: options.cwd, currentConfig: config })
  }
}
