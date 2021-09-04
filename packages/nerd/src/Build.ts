// import chokidar from '@nerd/bundles/model/chokidar'
import vinylFs from '@nerd/bundles/model/vinyl-fs'
import rimraf from '@nerd/bundles/model/rimraf'
import path from 'path'

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
// import { colorLog, eventColor } from './utils'

import getTSConfig from './getTsConifg'
import getConfig from './config'

interface IBuildOptions {
  cwd: string
  watch?: boolean
  userConfig?: IBundleOptions
  customPrefix?: string
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
    watch = false,
    /**
     * @description Custom log output prefix
     */
    customPrefix
  } = options

  const config = getConfig(cwd)
  const {
    beforeReadWriteStream,
    afterReadWriteStream,
    afterHook,
    // packages,
    entry,
    output,
    sourcemap,
    lessOptions,
    paths
  } = config

  function createStream(currentDirPath: string) {
    const { tsConfig } = getTSConfig(cwd)
    const currentEntryPath = path.join(currentDirPath, entry)
    const currentOutputPath = path.join(currentDirPath, output)

    const patterns = [
      path.join(currentEntryPath, '**/*'),
      `!${path.join(currentEntryPath, '**/*.mdx')}`,
      `!${path.join(currentEntryPath, '**/*.md')}`,
      `!${path.join(currentEntryPath, '**/demos{,/**}')}`,
      `!${path.join(currentEntryPath, '**/fixtures{,/**}')}`,
      `!${path.join(currentEntryPath, '**/__test__{,/**}')}`,
      `!${path.join(currentEntryPath, '**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)')}`
    ]

    rimraf.sync(currentOutputPath)

    return vinylFs
      .src(patterns, { base: currentEntryPath, allowEmpty: true })
      .pipe(enableSourcemap(sourcemap))
      .pipe(enablePlumber(watch))
      .pipe(enablefileCache())
      .pipe(compileLess(lessOptions))
      .pipe(applyBeforeHook(beforeReadWriteStream))
      .pipe(compileAlias(paths))
      .pipe(compileDeclaration(tsConfig))
      .pipe(compileJsOrTs(config, { currentEntryPath, customPrefix }))
      .pipe(applyAfterHook(afterReadWriteStream))
      .pipe(modifySourcemap(sourcemap))
      .pipe(logger(output))
      .pipe(vinylFs.dest(currentOutputPath))
  }

  function compile(currentDirPath: string) {
    return new Promise<void>((resolve) => {
      createStream(currentDirPath).on('end', () => {
        afterHook && afterHook()
        resolve()
      })
    })
  }

  await compile(cwd)
}

// const modeType = {
//   cjs: 'Commonjs',
//   esm: 'ES Modules'
// }

// export default class Build {

//   cwd: string

//   /**
//    * @description Turn on watch
//    */
//   watch: boolean

//   /**
//    * @description Change directory configuration file
//    */
//   rootConfig = {}

//   /**
//    * @description Api call configuration file
//    */
//   userConfig?: IBundleOptions

//   /**
//    * @description Custom log output prefix
//    */
//   customPrefix?: string

//   /**
//    * @description typescript related
//    */
//   tsConifgError?: Diagnostic

//   /**
//    * @description File content cache in watch mode
//    */
//   cache: Record<string, string> = {}

//   constructor(options: IBuild) {
//     this.cwd = options.cwd ?? process.cwd()

//     this.userConfig = options.userConfig

//     this.customPrefix = options.customPrefix

//     this.watch = !!options.watch
//   }
// }
