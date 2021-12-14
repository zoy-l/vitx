import vitePluginJsx from '@vitejs/plugin-vue-jsx'
import vitePluginReact from '@vitejs/plugin-react'
import vitePluginVue from '@vitejs/plugin-vue'
import { injectHtml } from 'vite-plugin-html'
import type { PluginOption } from 'vite'
import { createServer } from 'vite'
import path from 'path'

import { siteTemplateCommon } from './constants'
import { IFrame } from './types'

export function createSiteServer(options: { cwd: string; frame: IFrame }) {
  const { cwd, frame } = options

  const isVue = frame === IFrame.vue
  const isReact = frame === IFrame.react

  const plugins: (PluginOption | PluginOption[])[] = [
    injectHtml({
      data: {
        title: 'vitx-site',
        description: 'vitx site demo',
        logo: '1'
      }
    })
  ]

  if (isVue) {
    plugins.push(
      vitePluginVue({
        include: [/\.vue$/, /\.md$/]
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
