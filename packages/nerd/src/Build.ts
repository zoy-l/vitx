import chokidar from '@nerd/bundles/model/chokidar'
import vinylFs from '@nerd/bundles/model/vinyl-fs'
import figures from '@nerd/bundles/model/figures'
import rimraf from '@nerd/bundles/model/rimraf'
import chalk from '@nerd/bundles/model/chalk'
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
import type { IBundleOptions } from './types'
import getTSConfig from './getTsConifg'
import getConfig from './config'

interface IBuildOptions {
  cwd: string
  watch?: boolean
  userConfig?: IBundleOptions
}

export async function build(options: IBuildOptions) {
  const {
    /**
     * @description Root path
     */
    cwd,
    /**
     * @description Turn on watch
     */
    watch = false
  } = options

  const config = getConfig(cwd)
  const {
    beforeReadWriteStream,
    afterReadWriteStream,
    afterHook,
    packages,
    packageDirName,
    entry,
    output,
    sourcemap,
    lessOptions,
    moduleType,
    paths
  } = config

  function createStream(options: {
    patterns: string | string[]
    currentEntryPath: string
    currentOutputPath: string
    mode: 'cjs' | 'esm'
  }) {
    const { patterns, currentEntryPath, currentOutputPath, mode } = options
    const { tsConfig } = getTSConfig(cwd)

    return vinylFs
      .src(patterns, { base: currentEntryPath, allowEmpty: true })
      .pipe(enableSourcemap(sourcemap))
      .pipe(enablePlumber(watch))
      .pipe(enablefileCache())
      .pipe(compileLess(lessOptions))
      .pipe(applyBeforeHook(beforeReadWriteStream))
      .pipe(compileAlias(paths))
      .pipe(compileDeclaration(tsConfig))
      .pipe(compileJsOrTs(config, { currentEntryPath, mode }))
      .pipe(applyAfterHook(afterReadWriteStream))
      .pipe(modifySourcemap(sourcemap))
      .pipe(logger(output, mode))
      .pipe(vinylFs.dest(currentOutputPath))
  }

  function compile(currentDirPath: string, mode: any) {
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

          watcher.on('all', (_, fullEnterPath) => {
            if (!fs.existsSync(fullEnterPath)) {
              rimraf.sync(fullEnterPath.replace('.ts', '.js'))
              rimraf.sync(fullEnterPath.replace('.ts', '.d.ts'))
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

  async function run() {
    let modes = [moduleType]

    if (moduleType === 'all') {
      rimraf.sync(output)
      modes = ['cjs', 'esm']
    }
    while (modes.length) {
      const mode = modes.shift()
      // safe
      // eslint-disable-next-line no-await-in-loop
      await compile(cwd, mode)
    }
  }

  if (packages) {
    const pkgs = packages
      .map((dir) => path.join(cwd, packageDirName!, dir))
      .filter((dir) => fs.statSync(dir).isDirectory())

    while (pkgs.length) {
      const pkg = pkgs.shift()!
      process.chdir(pkg)
      run()
    }
  } else {
    run()
  }
}
