import {
  parse,
  SFCStyleBlock,
  compileTemplate,
  compileStyle,
  compileScript
} from '@build-easy/bundles/model/@vue/compiler-sfc'
import {
  BabelFileResult,
  transformSync as babelTransformSync
} from '@build-easy/bundles/model/@babel/core'
import gulpTypescript from '@build-easy/bundles/model/gulp-typescript'
import sourcemaps from '@build-easy/bundles/model/gulp-sourcemaps'
import gulpPlumber from '@build-easy/bundles/model/gulp-plumber'
import through from '@build-easy/bundles/model/through2'
import figures from '@build-easy/bundles/model/figures'
import gulpIf from '@build-easy/bundles/model/gulp-if'
import less from '@build-easy/bundles/model/gulp-less'
import hash from '@build-easy/bundles/model/hash-sum'
import chalk from '@build-easy/bundles/model/chalk'
import Vinyl from '@build-easy/bundles/model/vinyl'
import Stream from 'stream'
import path from 'path'
import fs from 'fs'
import type { BuildConfig } from './types'
import getBabelConfig from './getBabelConifg'
import replaceAll from './alias'

const empty = () => {}
const jsxIdent = '__build-easy__jsx__file__'

export function logger() {
  return through.obj((file, _, cb) => {
    const ext = path.extname(file.path)
    if (!/d.ts/.test(file.path) && ext) {
      console.log(
        chalk.green(figures.tick),
        chalk.green(`Success ${ext.slice(1).toUpperCase()}:`),
        path.join(path.basename(file.cwd), file.path.replace(file.cwd, ''))
      )
    }

    cb(null, file)
  })
}

function isTransform(regExp: RegExp, filePath: string) {
  return regExp.test(filePath) && !filePath.endsWith('.d.ts')
}

export function applyHook(func: any, args: any): NodeJS.ReadWriteStream {
  return typeof func === 'function' ? func(args) : through.obj()
}

export function modifySourcemap(sourcemap: BuildConfig['sourcemap']) {
  return gulpIf((file) => !!sourcemap && !file.path.endsWith('.d.ts'), sourcemaps.write('.'))
}

export function enablefileCache(cache: Record<string, string>) {
  return through.obj((file, _, cb) => {
    cache[file.path] = file.contents?.toString()

    if (/\.(t|j)sx$/.test(file.basename)) {
      file.contents = Buffer.from(`/*${jsxIdent}*/\n${cache[file.path]}`)
    }
    cb(null, file)
  })
}

export function enableSourcemap(sourcemap: BuildConfig['sourcemap']) {
  return gulpIf(() => !!sourcemap, sourcemaps.init())
}

export function enablePlumber(watch: boolean | undefined) {
  return gulpIf(!!watch, gulpPlumber(empty))
}

export function applyBeforeHook(hook: BuildConfig['beforeReadWriteStream']) {
  return applyHook(hook, { through, gulpIf })
}

export function applyAfterHook(hook: BuildConfig['afterReadWriteStream']) {
  return applyHook(hook, { through, gulpIf })
}

export function compileLess(lessOptions: BuildConfig['lessOptions']) {
  return gulpIf((file) => file.path.endsWith('.less'), less(lessOptions))
}

export function hackSaveFile() {
  return gulpIf(
    (file: { path: string }) => {
      return isTransform(/\.tsx?$/, file.path)
    },
    through.obj(function (file, _, cb) {
      this.push(
        new Vinyl({
          cwd: file.cwd,
          base: file.base,
          contents: file.contents,
          path: file.path + 'backup',
          sourceMap: file.sourceMap
        })
      )

      cb(null, file)
    })
  )
}

export function hackGetFile(moduleType: string, output: string) {
  return through.obj(function (file, _, cb) {
    if (isTransform(/\.tsx?backup$/, file.path)) {
      file.path = file.path.replace('backup', '')

      return cb(null, file)
    }

    if (moduleType === 'all' && /\.d\.ts$/.test(file.path)) {
      file.path = path.join(file.cwd, output, 'types', file.path.replace(file.base, ''))
      return cb(null, file)
    }

    if (moduleType === 'all' && !/\.(j|t)sx?$/.test(file.path)) {
      const esmFile = {
        path: path.join(file.cwd, output, 'esm', file.path.replace(file.base, '')),
        base: file.base,
        contents: file.contents,
        cwd: file.cwd
      }

      const cjsFile = {
        path: path.join(file.cwd, output, 'cjs', file.path.replace(file.base, '')),
        base: file.base,
        contents: file.contents,
        cwd: file.cwd
      }

      this.push(new Vinyl(esmFile))
      this.push(new Vinyl(cjsFile))

      cb()
    } else {
      cb(null, file)
    }
  })
}

export function compileDeclaration(currentDirPath: string, cwd: string) {
  let tsconfigPath = path.join(currentDirPath, 'tsconfig.json')
  let isTsconfig = fs.existsSync(tsconfigPath)

  if (cwd !== currentDirPath && !isTsconfig) {
    tsconfigPath = path.join(cwd, 'tsconfig.json')
    isTsconfig = fs.existsSync(tsconfigPath)
  }

  const ts = isTsconfig
    ? gulpTypescript.createProject(tsconfigPath, {
        declaration: true,
        emitDeclarationOnly: true,
        moduleResolution: 'node'
      })
    : () =>
        through.obj((file, _, cb) => {
          cb(null, file)
        })
  // typescript may not be installed
  return gulpIf(
    (file: { path: string }) => {
      return isTransform(/\.tsx?$/, file.path) && isTsconfig
    },
    ts({
      error: (err: { message: string }) => {
        console.log(`${chalk.red('➜ [Error]: ')}${err.message}`)
      }
    })
  )

  // No files are output except d.ts
}

export function compileAlias(alias: BuildConfig['alias']) {
  return through.obj((file, _, cb) => {
    const _alias = { ...alias }

    if (Object.keys(_alias).length) {
      const dirname = path.dirname(file.path)
      const ext = path.extname(file.relative)

      file.contents = Buffer.from(
        replaceAll({
          ext,
          contents: file.contents.toString(),
          dirname,
          aliasMap: _alias
        })
      )
    }

    cb(null, file)
  })
}

export function compileVueSfc(injectCss: BuildConfig['injectVueCss']) {
  const EXT_REGEXP = /\.\w+$/
  const RENDER_FN = '__vue_render__'
  const VUEIDS = '__vue_sfc__'
  const EXPORT = 'export default'

  function trim(code: string) {
    return code.replace(/\/\/\n/g, '').trim()
  }

  function injectRender(render: string) {
    return render.replace('export function render', `function ${RENDER_FN}`)
  }

  function injectScopeId(scopeId: string) {
    return `\n${VUEIDS}.__scopeId = '${scopeId}'`
  }

  function getSfcStylePath(filePath: string, ext: string, index: number) {
    const number = index !== 0 ? `-${index}` : ''
    return filePath.replace(EXT_REGEXP, `${number}.${ext}`)
  }

  function injectStyle(styles: SFCStyleBlock[], filePath: string) {
    const imports = styles.reduce(
      (code, _, index) =>
        code + `import './${path.basename(getSfcStylePath(filePath, 'css', index))}';\n`,
      ''
    )

    return imports
  }

  function transform(this: Stream.Transform, file: Vinyl.BufferFile, _: unknown, cb: () => void) {
    const content = file.contents.toString()
    const { descriptor } = parse(content, { filename: file.path })
    const { template, styles, script, filename, scriptSetup } = descriptor

    const hasScoped = styles.some((s) => s.scoped)
    const scopeId = hasScoped ? `data-v-${hash(content)}` : null

    if (script || scriptSetup) {
      const lang = script?.lang ?? 'js'
      const scriptFilePath = file.path.replace(EXT_REGEXP, `.${lang}`)
      let makeScript = injectCss ? injectStyle(styles, file.path) : ''

      if (script) {
        if (template) {
          const render = compileTemplate({
            id: scopeId ?? filename,
            source: template.content,
            filename: file.path
          }).code
          makeScript += injectRender(render)
        }
        makeScript += script.content
        makeScript += template ? `${VUEIDS}.render = ${RENDER_FN}\n` : ''
      }

      if (scriptSetup) {
        makeScript += compileScript(descriptor, {
          id: scopeId ?? filename,
          refTransform: true,
          inlineTemplate: true
        }).content
      }

      makeScript = makeScript.replace(EXPORT, `const ${VUEIDS} =`)

      if (scopeId) {
        makeScript += injectScopeId(scopeId)
      }

      makeScript += `\n${VUEIDS}.__file = '${path.basename(filename)}'\n${EXPORT} ${VUEIDS}`

      this.push(
        new Vinyl({
          path: scriptFilePath,
          contents: Buffer.from(makeScript),
          cwd: file.cwd,
          base: file.base
        })
      )
    }

    if (styles) {
      styles.forEach((style, index) => {
        const cssFilePath = getSfcStylePath(file.path, style.lang ?? 'css', index)
        let styleSource = trim(style.content)

        if (style.scoped) {
          styleSource = compileStyle({
            id: scopeId!,
            scoped: true,
            source: styleSource,
            filename: cssFilePath
          }).code
        }

        this.push(
          new Vinyl({
            path: cssFilePath,
            contents: Buffer.from(styleSource),
            cwd: file.cwd,
            base: file.base
          })
        )
      })
    }

    cb()
  }

  return gulpIf(
    (file: { path: string }) => isTransform(/\.vue$/, file.path),
    through.obj(transform)
  )
}

export function compileJsOrTs(config: BuildConfig, currentEntryDirPath: string) {
  return gulpIf(
    (file: { path: string }) => isTransform(/\.(t|j)sx?$/, file.path),
    through.obj(function (this: Stream.Transform, file, _, cb) {
      const { sourcemap, target, nodeFiles, browserFiles, moduleType, output } = config

      const vinylSourcemapsApply = require('@build-easy/bundles/model/vinyl-sourcemaps-apply')

      let isBrowser = target === 'browser'

      const ident = new RegExp(`/*${jsxIdent}*/`)

      if (/\.(t|j)sx$/.test(file.path) || ident.test(file.contents.toString())) {
        isBrowser = true
      } else {
        const currentFilePath = path.relative(currentEntryDirPath, file.path)

        if (isBrowser && nodeFiles && nodeFiles.includes(currentFilePath)) {
          isBrowser = false
        }

        if (!isBrowser && browserFiles && browserFiles.includes(currentFilePath)) {
          isBrowser = true
        }
      }

      const replaceExtname = (file: string) => file.replace(path.extname(file), '.js')

      if (moduleType === 'all') {
        const babelConfigCjs = getBabelConfig(config, isBrowser, 'cjs')
        const babelFileResultCjs = babelTransformSync(file.contents, {
          ...babelConfigCjs,
          filename: file.path,
          configFile: false,
          sourceMaps: sourcemap
        })!

        if (file.sourceMap && sourcemap) {
          if (!babelFileResultCjs.map!.file) {
            babelFileResultCjs.map!.file = file.sourceMap.file
          }
          vinylSourcemapsApply(file, babelFileResultCjs.map)
        }

        this.push(
          new Vinyl({
            contents: Buffer.from(babelFileResultCjs.code ?? ''),
            cwd: file.cwd,
            base: file.base,
            path: path.join(
              file.cwd,
              output!,
              'cjs',
              replaceExtname(file.path.replace(file.base, ''))
            )
          })
        )

        const babelConfigEsm = getBabelConfig(config, isBrowser, 'esm')
        const babelFileResultEsm = babelTransformSync(file.contents, {
          ...babelConfigEsm,
          filename: file.path,
          configFile: false,
          sourceMaps: sourcemap
        })!

        if (file.sourceMap && sourcemap) {
          if (!babelFileResultEsm.map!.file) {
            babelFileResultEsm.map!.file = file.sourceMap.file
          }
          vinylSourcemapsApply(file, babelFileResultEsm.map)
        }

        this.push(
          new Vinyl({
            contents: Buffer.from(babelFileResultEsm.code ?? ''),
            cwd: file.cwd,
            base: file.base,
            path: path.join(
              file.cwd,
              output!,
              'esm',
              replaceExtname(file.path.replace(file.base, ''))
            )
          })
        )

        return cb()
      }

      const babelConfig = getBabelConfig(config, isBrowser, moduleType)
      const babelFileResult: BabelFileResult = babelTransformSync(file.contents, {
        ...babelConfig,
        filename: file.path,
        configFile: false,
        sourceMaps: sourcemap
      })!

      file.contents = Buffer.from(babelFileResult.code ?? '')

      if (file.sourceMap && sourcemap) {
        if (!babelFileResult.map!.file) {
          babelFileResult.map!.file = file.sourceMap.file
        }

        vinylSourcemapsApply(file, babelFileResult.map)
      }

      file.path = replaceExtname(file.path)
      cb(null, file)
    })
  )
}
