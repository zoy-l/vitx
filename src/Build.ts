import { transformSync as babelTransformSync } from '@babel/core'
import { transformSync as esBuildTransformSync } from 'esbuild'
import { Diagnostic } from 'typescript'
import gulpPlumber from 'gulp-plumber'
import glupTs from 'gulp-typescript'
import merge from 'lodash.merge'
import chokidar from 'chokidar'
import through from 'through2'
import vinylFs from 'vinyl-fs'
import gulpIf from 'gulp-if'
import rimraf from 'rimraf'
import assert from 'assert'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

import { colorLog, conversion, eventColor } from './utils'
import getEsBuildConfig from './getEsBuildConfig'
import getBabelConfig from './getBabelConifg'
import type { IBundleOpt, IBundleOptions } from './types'
import getTSConfig from './getTsConifg'
import config from './config'

interface IBuild {
  cwd: string
  watch?: boolean
}

export default class Build {
  cwd: string

  isLerna: boolean

  watch: boolean

  rootConfig = {}

  tsConifgError: Diagnostic | undefined

  constructor(options: IBuild) {
    this.cwd = options.cwd
    this.watch = !!options.watch
    this.isLerna = fs.existsSync(path.join(options.cwd, 'lerna.json'))
  }

  logInfo({ pkg, msg }: { pkg?: string; msg: string }) {
    console.log(`${pkg ? `${colorLog(pkg)}: ` : ''}${msg}`)
  }

  addDefaultConfigValue(config: IBundleOptions): IBundleOpt {
    return merge(
      {
        entry: 'src',
        output: 'lib',
        moduleType: 'cjs'
      },
      config
    )
  }

  getBundleOpts(cwd: string) {
    const userConfig = config(cwd) as IBundleOpt

    const bundleOpts = this.addDefaultConfigValue(
      merge(this.rootConfig, userConfig)
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
      if (isBrowser) {
        if (nodeFiles && nodeFiles.includes(path.relative(currentDir, paths)))
          isBrowser = false
      } else if (
        browserFiles &&
        browserFiles.includes(path.relative(currentDir, paths))
      )
        isBrowser = true
    }

    if (esBuild) {
      const esBuildConfig = getEsBuildConfig(bundleOpts, isBrowser, paths)
      return esBuildTransformSync(content, esBuildConfig).code
    }

    const babelConfig = getBabelConfig(bundleOpts, isBrowser)
    return babelTransformSync(content, {
      ...babelConfig,
      filename: paths,
      configFile: false
    })?.code
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
      moduleType,
      entry,
      output,
      esBuild,
      beforeReadWriteStream,
      afterReadWriteStream
    } = bundleOpts

    const { tsConfig, error } = getTSConfig(this.cwd, this.isLerna ? dir : '')
    const basePath = path.join(dir, entry)

    if (tsConfig.declaration === true) {
      if (bundleOpts.disableTypes === true) {
        tsConfig.declaration = false
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
        gulpIf(
          this.watch,
          gulpPlumber(() => {})
        )
      )
      .pipe(
        typeof beforeReadWriteStream === 'function'
          ? beforeReadWriteStream(through)
          : through.obj()
      )
      .pipe(
        gulpIf(
          ({ path }) =>
            tsConfig.declaration &&
            /\.tsx?$/.test(path) &&
            !path.endsWith('.d.ts'),
          glupTs(tsConfig)
        )
      )
      .pipe(
        gulpIf(
          ({ path }) => /\.(t|j)sx?$/.test(path) && !path.endsWith('.d.ts'),
          through.obj((chunk, _enc, callback) => {
            chunk.contents = Buffer.from(
              this.transform({
                content: chunk.contents,
                paths: conversion(chunk.path),
                bundleOpts,
                currentDir: dir
              }) as string
            )

            this.logInfo({
              pkg,
              msg: `${chalk.green(
                `➜ ${esBuild ? 'esBuild' : 'babel'}`
              )} ${chalk.yellow(moduleType)} for ${chalk.blue(
                `${output}${chunk.path.replace(basePath, '')}`
              )}`
            })

            chunk.path = chunk.path.replace(path.extname(chunk.path), '.js')

            callback(null, chunk)
          }) as NodeJS.ReadWriteStream
        )
      )
      .pipe(
        typeof afterReadWriteStream === 'function'
          ? afterReadWriteStream(through)
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

      await this.compile(pkgPath, pkg)
    }
  }

  compile(dir: string, pkg?: string) {
    const bundleOpts = this.getBundleOpts(dir)

    const { entry, output } = bundleOpts

    this.logInfo({ pkg, msg: chalk.gray(`➜ Clean ${output} directory`) })
    rimraf.sync(path.join(dir, output))

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
                pkg ?? conversion(srcPath).replace(`${this.cwd}/`, '')
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
              msg: chalk.yellow(`❗${messageText}\n`)
            })
          }

          const watcher = chokidar.watch(patterns, {
            ignoreInitial: true,
            awaitWriteFinish: {
              stabilityThreshold: 800
            }
          })

          const files: string[] = []

          watcher.on('all', (event, fullPath) => {
            const relPath = fullPath.replace(srcPath, '')

            this.logInfo({
              msg: `${eventColor(event)} ${conversion(
                path.join(srcPath, relPath)
              ).replace(`${this.cwd}/`, '')}`
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
