import { transformSync as babelTransformSync } from '@babel/core'
import { transformSync as esBuildTransformSync } from 'esbuild'
import { Diagnostic } from 'typescript'
import gulpPlumber from 'gulp-plumber'
import glupTs from 'gulp-typescript'
import insert from 'gulp-insert'
import { merge } from 'lodash'
import chokidar from 'chokidar'
import through from 'through2'
import vinylFs from 'vinyl-fs'
import gulpIf from 'gulp-if'
import rimraf from 'rimraf'
import assert from 'assert'
import chalk from 'chalk'
import slash from 'slash'
import path from 'path'
import fs from 'fs'

import type { IBundleOpt, IBundleOptions } from './types'
import getEsBuildConfig from './getEsBuildConfig'
import { colorLog, eventColor } from './utils'
import getBabelConfig from './getBabelConifg'
import getTSConfig from './getTsConifg'
import replaceAll from './replaceAll'
import config from './config'

interface IBuild {
  cwd?: string
  watch?: boolean
  userConfig?: IBundleOptions
  customPrefix?: string
}

const modeType = {
  cjs: 'Commonjs',
  esm: 'ES Modules'
}

export default class Build {
  cwd: string

  isLerna: boolean

  watch: boolean

  rootConfig = {}

  userConfig?: IBundleOptions

  customPrefix?: string

  tsConifgError?: Diagnostic

  cache: Record<string, string> = {}

  constructor(options: IBuild) {
    this.cwd = options.cwd ?? process.cwd()
    this.userConfig = options.userConfig
    this.customPrefix = options.customPrefix
    this.watch = !!options.watch
    this.isLerna = !this.userConfig
      ? fs.existsSync(path.join(this.cwd, 'lerna.json'))
      : false
  }

  logInfo({ pkg, msg }: { pkg?: string; msg: string }) {
    console.log(`${pkg ? `${colorLog(pkg)}: ` : ''}${msg}`)
  }

  applyHook(func: any, args: any) {
    return typeof func === 'function' ? func(args) : through.obj()
  }

  addDefaultConfigValue(config: IBundleOptions): IBundleOpt {
    return merge(
      {
        entry: 'src',
        output: 'lib',
        target: 'browser',
        moduleType: 'esm',
        sourceMaps: false
      },
      config
    )
  }

  getBundleOpts(cwd: string) {
    const userConfig = this.userConfig ?? (config(cwd) as IBundleOpt)

    // The merge method will change the source object
    const bundleOpts = this.addDefaultConfigValue(
      merge({ ...this.rootConfig }, userConfig)
    )

    return bundleOpts
  }

  transform(opts: {
    content: string
    paths: string
    bundleOpts: IBundleOpt
    currentDir: string
  }) {
    const { content, paths, bundleOpts, currentDir } = opts
    const { esBuild, target, nodeFiles, browserFiles } = bundleOpts

    let isBrowser = target === 'browser'

    if (/\.(t|j)sx$/.test(paths)) {
      isBrowser = true
    } else {
      const currentPath = path.relative(currentDir, paths)

      if (isBrowser && nodeFiles && nodeFiles.includes(currentPath)) {
        isBrowser = false
      }

      if (!isBrowser && browserFiles && browserFiles.includes(currentPath)) {
        isBrowser = true
      }
    }

    if (esBuild) {
      const esBuildConfig = getEsBuildConfig(bundleOpts, isBrowser, paths)
      return esBuildTransformSync(content, esBuildConfig)
    }

    const babelConfig = getBabelConfig(bundleOpts, isBrowser)

    return babelTransformSync(content, {
      ...babelConfig,
      filename: paths,
      configFile: false
    })
  }

  isTransform(regExp: RegExp, filePath: string) {
    return regExp.test(filePath) && !filePath.endsWith('.d.ts')
  }

  createStream({
    src,
    pkg,
    dir,
    bundleOpts
  }: {
    pkg?: string
    dir: string
    src: string[] | string
    bundleOpts: IBundleOpt
  }) {
    const {
      entry,
      output,
      esBuild,
      paths,
      beforeReadWriteStream,
      afterReadWriteStream
    } = bundleOpts

    const { tsConfig, error } = getTSConfig(this.cwd, this.isLerna ? dir : '')
    const basePath = path.join(dir, entry)

    if (tsConfig.compilerOptions.declaration === true) {
      if (bundleOpts.disableTypes === true) {
        tsConfig.compilerOptions.declaration = false
      }
    } else {
      bundleOpts.disableTypes = true
    }

    if (error) {
      this.tsConifgError = error
    }

    return vinylFs
      .src(src, {
        base: basePath,
        allowEmpty: true
      })
      .pipe(
        insert.transform((contents, file) => {
          this.cache[file.path] = contents
          return contents
        })
      )
      .pipe(
        gulpIf(
          this.watch,
          gulpPlumber(() => {})
        )
      )
      .pipe(this.applyHook(beforeReadWriteStream, { through, insert, gulpIf }))
      .pipe(
        insert.transform((contents, file) => {
          const _paths = { ...paths }

          if (Object.keys(_paths).length) {
            const dirname = path.dirname(file.path)
            const ext = path.extname(file.relative)

            contents = replaceAll({
              ext,
              contents,
              dirname,
              aliasMap: _paths
            })
          }

          return contents
        })
      )
      .pipe(
        gulpIf(
          (file) =>
            tsConfig.compilerOptions.declaration &&
            this.isTransform(/\.tsx?$/, file.path),
          glupTs(tsConfig.compilerOptions)
        )
      )
      .pipe(
        gulpIf(
          (file) => this.isTransform(/\.(t|j)sx?$/, file.path),
          through.obj((chunk, _enc, callback) => {
            const res: Record<string, any> = this.transform({
              content: chunk.contents,
              paths: slash(chunk.path),
              bundleOpts,
              currentDir: dir
            })!

            const replaceExtname = (file: string) =>
              file.replace(path.extname(file), '.js')

            chunk.contents = Buffer.from(res.code)

            const logType = chalk.yellow(
              `[${this.customPrefix ?? (esBuild ? 'esBuild' : 'babel')}]:`
            )
            const logOutput = chalk.blue(
              output + chunk.path.replace(basePath, '')
            )

            this.logInfo({
              pkg,
              msg: `➜ ${logType} for ${logOutput}`
            })

            chunk.path = replaceExtname(chunk.path)

            callback(null, chunk)
          }) as NodeJS.ReadWriteStream,
          insert.transform((contents, file) => {
            if (!file.path.endsWith('.d.ts')) {
              const logType = chalk.yellow(`[${this.customPrefix ?? 'Copys'}]:`)
              const logOutput = chalk.blue(
                output + file.path.replace(basePath, '')
              )

              this.logInfo({
                pkg,
                msg: `➜ ${logType} for ${logOutput}`
              })
            }

            return contents
          })
        )
      )
      .pipe(
        typeof afterReadWriteStream === 'function'
          ? afterReadWriteStream({ through, insert, gulpIf })
          : through.obj()
      )
      .pipe(vinylFs.dest(path.join(dir, output)))
  }

  async compileLerna() {
    let userPkgs = fs.readdirSync(path.join(this.cwd, 'packages'))
    const userConifg = config(this.cwd)

    if (userConifg.pkgs) {
      userPkgs = userConifg.pkgs
    }

    this.rootConfig = this.addDefaultConfigValue(userConifg)

    userPkgs = userPkgs.reduce((memo, pkg) => {
      const pkgPath = path.join(this.cwd, 'packages', pkg)

      if (fs.statSync(pkgPath).isDirectory()) {
        memo = memo.concat(pkg)
      }
      return memo
    }, [] as string[])

    for (const pkg of userPkgs) {
      const pkgPath = path.join(this.cwd, 'packages', pkg)
      assert(
        fs.existsSync(path.join(pkgPath, 'package.json')),
        `package.json not found in packages/${pkg}`
      )
      process.chdir(pkgPath)

      // here is safe
      // eslint-disable-next-line no-await-in-loop
      await this.compile(pkgPath, pkg)
    }
  }

  compile(dir: string, pkg?: string) {
    const bundleOpts = this.getBundleOpts(dir)

    const { entry, output } = bundleOpts

    this.logInfo({
      pkg,
      msg: chalk.redBright(`➜ [Clean]: ${output} directory`)
    })

    rimraf.sync(path.join(dir, output))

    this.logInfo({
      pkg,
      msg: chalk.red(
        `➜ [Target]: ${this.customPrefix ?? modeType[bundleOpts.moduleType!]}`
      )
    })

    const createStream = (src: string | string[]) =>
      this.createStream({ src, pkg, dir, bundleOpts })

    return new Promise<void>((resolve) => {
      const srcPath = path.join(dir, entry)
      const patterns = [
        path.join(srcPath, '**/*'),
        `!${path.join(srcPath, '**/*.mdx')}`,
        `!${path.join(srcPath, '**/*.md')}`,
        `!${path.join(srcPath, '**/demos{,/**}')}`,
        `!${path.join(srcPath, '**/fixtures{,/**}')}`,
        `!${path.join(srcPath, '**/__test__{,/**}')}`,
        `!${path.join(srcPath, '**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)')}`
      ]

      createStream(patterns).on('end', () => {
        if (this.watch) {
          this.logInfo({
            pkg,
            msg: chalk.blue(
              `➜ Start watching ${
                pkg ?? slash(srcPath).replace(`${this.cwd}/`, '')
              } directory...`
            )
          })

          if (this.tsConifgError) {
            let { messageText } = this.tsConifgError
            if (this.tsConifgError.code === 5012) {
              messageText =
                'Cannot find tsconfig.json, use the default configuration'
            }
            this.logInfo({
              msg: chalk.yellow('❗' + messageText + '\n')
            })
          }

          const watcher = chokidar.watch(patterns, {
            ignoreInitial: true,
            awaitWriteFinish: {
              stabilityThreshold: 500
            }
          })

          const files: string[] = []

          watcher.on('all', (event, fullPath) => {
            const relPath = fullPath.replace(srcPath, '')
            const outPath = slash(path.join(srcPath, relPath)).replace(
              this.cwd + '/',
              ''
            )

            this.logInfo({
              msg: `${eventColor(event)} ${outPath}`
            })

            if (!fs.existsSync(fullPath)) {
              const fullLibPath = fullPath.replace(entry, output)

              if (fullLibPath.endsWith('.ts')) {
                rimraf.sync(fullLibPath.replace('.ts', '.js'))
                rimraf.sync(fullLibPath.replace('.ts', '.d.ts'))
                return
              }

              rimraf.sync(fullLibPath)
              return
            }
            if (fs.statSync(fullPath).isFile()) {
              const data = fs.readFileSync(fullPath, 'utf-8')
              if (this.cache[fullPath] === data) return
              if (!files.includes(fullPath)) files.push(fullPath)
              while (files.length) {
                createStream(files.pop()!)
              }
            }
          })
          process.once('SIGINT', () => {
            watcher.close()
          })
        }

        resolve()
      })
    })
  }

  async step() {
    if (this.isLerna) {
      await this.compileLerna()
    } else {
      await this.compile(this.cwd)
    }
  }
}
