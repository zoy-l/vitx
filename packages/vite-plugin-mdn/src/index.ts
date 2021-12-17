import type { PluginOption, ResolvedConfig } from 'vite'
import { compileTemplate } from '@vue/compiler-sfc'
// import { transformAsync } from '@babel/core'
import { transformSync } from 'esBuild'
import MarkdownIt from 'markdown-it'
import HtmlToJsx from 'htmltojsx'
import matter from 'gray-matter'

import { basename } from 'path'

import { Options, ResolvedOptions } from './types'

function toArray<T>(n: T | T[]): T[] {
  if (!Array.isArray(n)) return [n]
  return n
}

export function parseId(id: string) {
  const index = id.indexOf('?')
  if (index < 0) return id
  return id.slice(0, index)
}

function VitePluginMarkdown(options: Options): PluginOption {
  const resolved = {
    markdownItOptions: {},
    markdownItUses: [],
    markdownItSetup: () => {},
    wrapperClasses: 'markdown-body',
    wrapperComponent: null,
    transforms: {},
    ...(options ?? {})
  } as ResolvedOptions

  let props: string

  if (resolved.frame === 'vue') {
    props = ':frontmatter="frontmatter"'
  } else if (resolved.frame === 'react') {
    props = 'frontmatter={frontmatter}'
  } else {
    throw new Error('You need to specify a framework `react or vue`')
  }

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

      if (resolved.wrapperComponent) {
        code = `<${resolved.wrapperComponent} ${props}>${code}</${resolved.wrapperComponent}>`
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

        const converter = new HtmlToJsx({
          createClass: false
        })

        const content = `
        import React from 'react'
        export default function ${componentName}(props){
          const frontmatter = ${JSON.stringify(frontmatter)};
          const __html = ${converter.convert(code)}
          return <div {...props}>{ __html }</div>
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

export default VitePluginMarkdown
