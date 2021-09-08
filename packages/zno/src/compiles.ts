import {
  BabelFileResult,
  transformSync as babelTransformSync
} from '@zno/bundles/model/@babel/core'
import sourcemaps from '@zno/bundles/model/gulp-sourcemaps'
import gulpPlumber from '@zno/bundles/model/gulp-plumber'
import glupTs from '@zno/bundles/model/gulp-typescript'
import insert from '@zno/bundles/model/gulp-insert'
import through from '@zno/bundles/model/through2'
import figures from '@zno/bundles/model/figures'
import gulpIf from '@zno/bundles/model/gulp-if'
import less from '@zno/bundles/model/gulp-less'
import chalk from '@zno/bundles/model/chalk'
import path from 'path'

import getBabelConfig from './getBabelConifg'
import type { IZnoConfig } from './types'
import replaceAll from './replaceAll'

const cache = {}

const empty = () => {}

export function logger(output: string, mode: 'cjs' | 'esm') {
  return insert.transform((contents, file) => {
    if (!/d.ts/.test(file.path)) {
      console.log(
        chalk.green(figures.tick),
        chalk.yellow(`Success ${mode.toUpperCase()}:`),
        `${output}/${path.basename(file.path)}`
      )
    }

    return contents
  })
}

function isTransform(regExp: RegExp, filePath: string) {
  return regExp.test(filePath) && !filePath.endsWith('.d.ts')
}

export function applyHook(func: any, args: any): NodeJS.ReadWriteStream {
  return typeof func === 'function' ? func(args) : through.obj()
}

export function modifySourcemap(sourcemap: IZnoConfig['sourcemap']) {
  return gulpIf((file) => !!sourcemap && !file.path.endsWith('.d.ts'), sourcemaps.write('.'))
}

export function enablefileCache() {
  return insert.transform((contents, file) => {
    cache[file.path] = contents
    return contents
  })
}

export function enableSourcemap(sourcemap: IZnoConfig['sourcemap']) {
  return gulpIf(() => !!sourcemap, sourcemaps.init())
}

export function enablePlumber(watch: boolean | undefined) {
  return gulpIf(!!watch, gulpPlumber(empty))
}

export function applyBeforeHook(hook: IZnoConfig['beforeReadWriteStream']) {
  return applyHook(hook, { through, insert, gulpIf })
}

export function applyAfterHook(hook: IZnoConfig['afterReadWriteStream']) {
  return applyHook(hook, { through, insert, gulpIf })
}

export function compileLess(lessOptions: IZnoConfig['lessOptions']) {
  return gulpIf((file) => file.path.endsWith('.less'), less(lessOptions))
}

export function compileDeclaration(tsConfig: Record<string, any>) {
  return gulpIf(
    (file) => tsConfig.compilerOptions.declaration && isTransform(/\.tsx?$/, file.path),
    glupTs(tsConfig.compilerOptions, {
      error: (err) => {
        console.log(`${chalk.red('➜ [Error]: ')}${err.message}`)
      }
    })
  )
}

export function compileAlias(paths: IZnoConfig['paths']) {
  return insert.transform((contents, file) => {
    const alias = { ...paths }

    if (Object.keys(alias).length) {
      const dirname = path.dirname(file.path)
      const ext = path.extname(file.relative)

      contents = replaceAll({
        ext,
        contents,
        dirname,
        aliasMap: alias
      })
    }

    return contents
  })
}

export function compileJsOrTs(
  config: IZnoConfig,
  options: { currentEntryPath: string; mode: any }
) {
  const { sourcemap, target, nodeFiles, browserFiles } = config
  const { currentEntryPath, mode } = options

  let isBrowser = target === 'browser'

  const babelConfig = getBabelConfig(config, isBrowser, mode)

  return gulpIf(
    (file: { path: string }) => isTransform(/\.(t|j)sx?$/, file.path),
    through.obj((chunk, _enc, callback) => {
      if (/\.(t|j)sx$/.test(chunk.path)) {
        isBrowser = true
      } else {
        const currentFilePath = path.relative(currentEntryPath, chunk.path)

        if (isBrowser && nodeFiles && nodeFiles.includes(currentFilePath)) {
          isBrowser = false
        }

        if (!isBrowser && browserFiles && browserFiles.includes(currentFilePath)) {
          isBrowser = true
        }
      }

      const babelFileResult: BabelFileResult = babelTransformSync(chunk.contents, {
        ...babelConfig,
        filename: chunk.path,
        configFile: false,
        sourceMaps: sourcemap
      })!

      const replaceExtname = (file: string) => file.replace(path.extname(file), '.js')
      chunk.contents = Buffer.from(babelFileResult.code ?? '')

      if (chunk.sourceMap && sourcemap) {
        if (!Object.prototype.hasOwnProperty.call(babelFileResult.map, 'file')) {
          if (typeof babelFileResult.map === 'string') {
            babelFileResult.map = JSON.parse(babelFileResult.map ?? '{}')
            babelFileResult.map!.sources = [path.basename(chunk.path)]
          }

          babelFileResult.map!.file = chunk.sourceMap.file
        }
        require('@zno/bundles/model/vinyl-sourcemaps-apply')(chunk, babelFileResult.map)
      }

      chunk.path = replaceExtname(chunk.path)
      callback(null, chunk)
    })
  )
}
