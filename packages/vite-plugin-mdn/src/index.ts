import type { PluginOption, ResolvedConfig } from 'vite'
import { compileTemplate } from '@vue/compiler-sfc'
// import { transformAsync } from '@babel/core'
import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'

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
  const resolved: ResolvedOptions = {
    markdownItOptions: {},
    markdownItUses: [],
    markdownItSetup: () => {},
    wrapperClasses: 'markdown-body',
    wrapperComponent: null,
    transforms: {},
    ...(options ?? {})
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

  let props: string

  if (resolved.frame === 'vue') {
    props = ':frontmatter="frontmatter"'
  }

  if (resolved.frame === 'react') {
    props = 'frontmatter={frontmatter}'
  }

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
        const result = `function ${path}(){
          const __matter = ${JSON.stringify(frontmatter)};
          return (${code.replace(/class=/g, 'className=')})
        }`

        return result
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
