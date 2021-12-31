import vitePluginJsx from '@vitejs/plugin-vue-jsx'
import vitePluginReact from '@vitejs/plugin-react'
import vitePluginVue from '@vitejs/plugin-vue'
import { injectHtml } from 'vite-plugin-html'
import vitePluginMdn from 'vite-plugin-mdn'
import type { PluginOption } from 'vite'
import highlight from 'highlight.js'
import { createServer } from 'vite'
import path from 'path'

import { IDocuments, modifyRoute } from './genRouter'
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
  const { title, description, logo, lazy } = site

  const root = path.join(cwd, 'template')
  const rootFrame = path.join(root, frame)
  const isVue = frame === IFrame.vue
  const isReact = frame === IFrame.react

  const plugins: (PluginOption | PluginOption[])[] = [
    injectHtml({
      data: {
        title,
        description,
        logo,
        frame
      }
    }),
    vitePluginMdn({
      frame,
      markdownItOptions: {
        typographer: false,
        highlight: markdownHighlight
      }
    }),
    modifyRoute({ documents, isVue, isReact, lazy })
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
    root,
    plugins,
    server: {
      host: true
    },
    resolve: {
      alias: {
        'vitx-site-common': siteTemplateCommon
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: path.join(rootFrame, 'index.html'),
          mobile: path.join(rootFrame, 'mobile.html')
        }
      }
    }
  })
}
