import {
  BabelFileResult,
  transformSync as babelTransformSync
} from '@nerd/bundles/model/@babel/core'
import glupTs from '@nerd/bundles/model/gulp-typescript'
import insert from '@nerd/bundles/model/gulp-insert'
import through from '@nerd/bundles/model/through2'
import gulpIf from '@nerd/bundles/model/gulp-if'
import less from '@nerd/bundles/model/gulp-less'
import chalk from '@nerd/bundles/model/chalk'
import slash from '@nerd/bundles/model/slash'
import path from 'path'

import type { IBundleOptions } from './types'
import getBabelConfig from './getBabelConifg'
import replaceAll from './replaceAll'

const cache = {}

function isTransform(regExp: RegExp, filePath: string) {
  return regExp.test(filePath) && !filePath.endsWith('.d.ts')
}

export function applyHook(func: any, args: any): NodeJS.ReadWriteStream {
  return typeof func === 'function' ? func(args) : through.obj()
}

export function fileCache() {
  return insert.transform((contents, file) => {
    cache[file.path] = contents
    return contents
  })
}

export function compileLess(lessOptions: IBundleOptions['lessOptions']) {
  return gulpIf((file) => file.path.endsWith('.less'), less(lessOptions))
}

export function compileDeclaration(tsConfig: any) {
  return gulpIf(
    (file) => tsConfig.compilerOptions.declaration && isTransform(/\.tsx?$/, file.path),
    glupTs(tsConfig.compilerOptions, {
      error: (err) => {
        console.log(`${chalk.red('➜ [Error]: ')}${err.message}`)
      }
    })
  )
}

export function compileAlias(paths: IBundleOptions['paths']) {
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
  config: IBundleOptions,
  options: { currentDirPath: string; customPrefix: string }
) {
  const { output, sourcemap, target, nodeFiles, browserFiles } = config
  const { currentDirPath, customPrefix } = options

  let isBrowser = target === 'browser'

  const babelConfig = getBabelConfig(config, isBrowser)

  return gulpIf(
    (file: { path: string }) => isTransform(/\.(t|j)sx?$/, file.path),
    through.obj((chunk, _enc, callback) => {
      if (/\.(t|j)sx$/.test(chunk.path)) {
        isBrowser = true
      } else {
        const currentFilePath = path.relative(currentDirPath, chunk.path)

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

      const logType = chalk.yellow(`[${customPrefix ?? 'babel'}]:`)
      const logOutput = chalk.blue(output + chunk.path.replace(currentDirPath, ''))

      if (chunk.sourceMap && sourcemap) {
        if (!Object.prototype.hasOwnProperty.call(babelFileResult.map, 'file')) {
          if (typeof babelFileResult.map === 'string') {
            babelFileResult.map = JSON.parse(babelFileResult.map ?? '{}')
            babelFileResult.map!.sources = [path.basename(chunk.path)]
          }

          babelFileResult.map!.file = chunk.sourceMap.file
        }
        require('vinyl-sourcemaps-apply')(chunk, babelFileResult.map)
      }

      console.log(`${chalk.yellow(`${logType} for ${slash(logOutput)}`)}`)

      chunk.path = replaceExtname(chunk.path)
      callback(null, chunk)
    }),
    insert.transform((contents, file) => {
      if (!file.path.endsWith('.d.ts')) {
        const logType = chalk.yellow(`[${customPrefix ?? 'Copys'}]:`)
        const logOutput = chalk.blue(output + file.path.replace(currentDirPath, ''))
        console.log(`${chalk.yellow(`${logType} for ${slash(logOutput)}`)}`)
      }
      return contents
    })
  )
}
