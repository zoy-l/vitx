import vitePluginJsx from '@vitejs/plugin-vue-jsx'
import vitePluginReact from '@vitejs/plugin-react'
import vitePluginVue from '@vitejs/plugin-vue'
import { injectHtml } from 'vite-plugin-html'
import vitePluginMdn from 'vite-plugin-mdn'
import type { PluginOption } from 'vite'
import highlight from 'highlight.js'
import { createServer } from 'vite'
import path from 'path'

import { IDocuments, modifyVueRoute, modifyReactRoute } from './gen-router'
import { IFrame, IVitxSiteConfig } from './types'
import { siteTemplateCommon } from './constants'

function markdownHighlight(code: string, lang: string) {
  if (lang && highlight.getLanguage(lang)) {
    return highlight.highlight(code, { language: lang, ignoreIllegals: true }).value
  }

  return ''
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
    })
  ]

  if (isVue) {
    plugins.push(
      vitePluginVue({
        include: [/\.vue$/]
      }),
      vitePluginJsx(),
      modifyVueRoute(documents)
    )
  }

  if (isReact) {
    plugins.push(vitePluginReact({}), modifyReactRoute(documents))
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
