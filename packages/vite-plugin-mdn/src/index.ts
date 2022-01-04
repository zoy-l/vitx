import type { PluginOption, ResolvedConfig } from 'vite'
import { compileTemplate } from '@vue/compiler-sfc'
import { transformSync } from 'esBuild'
import MarkdownIt from 'markdown-it'
import HtmlToJsx from 'htmltojsx'
import matter from 'gray-matter'

import { basename } from 'path'

import { IOptions, ResolvedOptions } from './types'

function toArray<T>(n: T | T[]): T[] {
  if (!Array.isArray(n)) return [n]
  return n
}

export function parseId(id: string) {
  const index = id.indexOf('?')
  if (index < 0) return id
  return id.slice(0, index)
}

function vitePluginMarkdown(options: IOptions): PluginOption {
  const resolved = {
    markdownItOptions: {},
    markdownItUses: [],
    markdownItSetup: () => {},
    wrapperClasses: 'markdown-body',
    transforms: {},
    ...(options ?? {})
  } as ResolvedOptions

  const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    ...resolved.markdownItOptions
  })

  resolved.markdownItUses.forEach((e) => {
    const [plugin, options] = toArray(e)

    markdown.use(plugin, options)
  })

  resolved.markdownItSetup(markdown)

  const wrapperClasses = toArray(resolved.wrapperClasses)
    .filter((i) => i)
    .join(' ')
  let config: ResolvedConfig | undefined

  return {
    name: 'vite-plugin-mdn',
    enforce: 'pre',
    configResolved(_config) {
      config = _config
    },
    transform(raw, id) {
      const path = parseId(id)

      if (!path.endsWith('.md')) {
        return raw
      }

      if (resolved.transforms.before) {
        raw = resolved.transforms.before(raw, id)
      }

      const { content: md, data: frontmatter } = matter(raw)
      let code = markdown.render(md, {})

      if (resolved.wrapperClasses) {
        code = `<div class="${wrapperClasses}">${code}</div>`
      }

      if (resolved.transforms.after) {
        code = resolved.transforms.after(code, id)
      }

      function componentVue() {
        let { code: result } = compileTemplate({
          filename: path,
          id: path,
          source: code,
          transformAssetUrls: false
        })

        result = result.replace('export function render', 'function render')
        result += `\nconst __matter = ${JSON.stringify(frontmatter)};`
        result += '\nconst data = () => ({ frontmatter: __matter });'
        result += '\nconst __script = { render, data };'

        if (!config?.isProduction) {
          result += `\n__script.__hmrId = ${JSON.stringify(path)};`
        }

        result += '\nexport default __script;'

        return result
      }

      function componentReact() {
        let componentName = basename(path, '.md')
        componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1)

        const RE = /\{\{((?:.|\r?\n))+?\}\}/g

        code = code.replace(RE, (interpolation) => {
          const variable = interpolation.replace(/{|}|\s/g, '')
          const keys = variable.split('.').slice(1)

          return frontmatter[keys.join('.')]
        })

        const converter = new HtmlToJsx({
          createClass: false
        })

        const content = `
        import React from 'react'
        export default function ${componentName}(props){
          const html = ${converter.convert(code)}
          return {...html,...{props:{...html.props,...props}}}
        }`

        const result = transformSync(content, { loader: 'jsx' })

        return result.code
      }

      const transfromFrame = {
        vue: componentVue,
        react: componentReact
      }

      return transfromFrame[resolved.frame]()
    }
  }
}

export function vitePluginMarkdownReact(options: Omit<IOptions, 'frame'>) {
  return vitePluginMarkdown({
    frame: 'react',
    ...options
  })
}

export function vitePluginMarkdownVue(options: Omit<IOptions, 'frame'>) {
  return vitePluginMarkdown({
    frame: 'vue',
    ...options
  })
}

export default vitePluginMarkdown
