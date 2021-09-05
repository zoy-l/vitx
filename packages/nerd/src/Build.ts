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
    // packages,
    entry,
    output,
    sourcemap,
    lessOptions,
    moduleType,
    paths
  } = config

  function createStream(currentDirPath: string, mode: any) {
    const { tsConfig } = getTSConfig(cwd)
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
    return new Promise<void>((resolve) => {
      createStream(currentDirPath, mode).on('end', () => {
        afterHook && afterHook()
        resolve()
      })
    })
  }

  const modes = moduleType === 'all' ? ['cjs', 'esm'] : [moduleType]

  while (modes.length) {
    const mode = modes.shift()
    // safe
    // eslint-disable-next-line no-await-in-loop
    await compile(cwd, mode)
  }
}
