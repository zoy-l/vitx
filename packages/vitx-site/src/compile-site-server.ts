import type { PluginOption, ResolvedConfig } from 'vite'
import vitePluginJsx from '@vitejs/plugin-vue-jsx'
import vitePluginReact from '@vitejs/plugin-react'
import vitePluginVue from '@vitejs/plugin-vue'
import { injectHtml } from 'vite-plugin-html'
import vitePluginMdn from 'vite-plugin-mdn'
import highlight from 'highlight.js'
import { createServer } from 'vite'
import path from 'path'

import { IFrame, IVitxSiteConfig } from './types'
import { siteTemplateCommon } from './constants'

export type IDocuments = { name: string; path: string }[]

function markdownHighlight(code: string, lang: string) {
  if (lang && highlight.getLanguage(lang)) {
    return highlight.highlight(code, { language: lang, ignoreIllegals: true }).value
  }

  return ''
}

function modifyRoute(documents: IDocuments): PluginOption {
  const virtualModuleId = '@vitx-documents'
  const resolvedVirtualModuleId = `vitx:${virtualModuleId}`
  let config: ResolvedConfig | undefined
  return {
    name: 'vite-plugin-vitx-route',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
        ${documents.reduce((memo, current) => {
          if (config.isProduction) {
            memo += `import ${current.name} from "${current.path}";\n`
          } else {
            memo += `const ${current.name} = () => import("${current.path}");\n`
          }
          return memo
        }, '')}
        export default {
          ${documents.map((item) => item.name).join(',')}
        }`
      }
    },
    configResolved(_config) {
      config = _config
    }
  }
}

export function createSiteServer(options: {
  cwd: string
  frame: IFrame
  documents: IDocuments
  site: IVitxSiteConfig['site']
}) {
  const { cwd, frame, documents, site } = options
  const { title, description, logo } = site

  const isVue = frame === IFrame.vue
  const isReact = frame === IFrame.react

  const plugins: (PluginOption | PluginOption[])[] = [
    injectHtml({
      data: {
        title,
        description,
        logo
      }
    }),
    vitePluginMdn({
      frame,
      markdownItOptions: {
        typographer: false,
        highlight: markdownHighlight
      }
    }),
    modifyRoute(documents)
  ]

  if (isVue) {
    plugins.push(
      vitePluginVue({
        include: [/\.vue$/]
      }),
      vitePluginJsx()
    )
  }

  if (isReact) {
    plugins.push(vitePluginReact({}))
  }

  return createServer({
    root: path.join(cwd, 'template', frame),
    plugins,
    server: {
      host: true
    },
    resolve: {
      alias: {
        'vitx-site-common': siteTemplateCommon
      }
    }
  })
}
