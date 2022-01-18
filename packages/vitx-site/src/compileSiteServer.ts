import markdownItTocDoneRight from 'markdown-it-toc-done-right'
import vitePluginJsx from '@vitejs/plugin-vue-jsx'
import vitePluginReact from '@vitejs/plugin-react'
import markdownItAnchor from 'markdown-it-anchor'
import vitePluginVue from '@vitejs/plugin-vue'
import { injectHtml } from 'vite-plugin-html'
import vitePluginMdn from 'vite-plugin-mds'
import type { PluginOption } from 'vite'
import { createServer } from 'vite'
import path from 'path'

import { mdBodyWrapper, vueAnchorsLink, reactAnchorsLink, markdownHighlight } from './transforms'
import { IFrame, type IVitxSiteConfig } from './types'
import { commonScript } from './commonScript'
import { genRoute } from './genRouter'
import smoothFC from './smoothFC'

const mainHtmlFileName = 'index.html'
const mobileHtmlFileName = 'mobile.html'
const commonDirName = 'common'
const templateDirName = 'template'

export function createSiteServer(options: { cwd: string; frame: IFrame; config: IVitxSiteConfig }) {
  const { cwd, frame, config } = options
  const {
    site: { title, description, logo }
  } = config

  const root = path.join(__dirname, '..', templateDirName)

  const rootFrame = path.join(root, frame)
  const vitxSiteCommon = path.join(root, commonDirName)
  const mainHtml = path.join(rootFrame, mainHtmlFileName)
  const mobileHtml = path.join(rootFrame, mobileHtmlFileName)

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
      vueTransforms: vueAnchorsLink,
      reactTransforms: reactAnchorsLink,
      markdownItOptions: {
        typographer: false,
        highlight: markdownHighlight
      },
      markdownItSetup(md) {
        md.use(markdownItAnchor, {
          permalink: markdownItAnchor.permalink.ariaHidden({
            placement: 'before',
            symbol: '#'
          }),
          level: 2
        }).use(markdownItTocDoneRight, {
          listType: 'ul',
          level: 2
        })
      },
      transforms: {
        before: mdBodyWrapper
      }
    }),
    genRoute({ isVue, isReact, config, cwd, frame }),
    commonScript(frame)
  ]

  if (isVue) {
    plugins.push(
      smoothFC(),
      vitePluginVue({
        include: [/\.vue$/]
      }),
      vitePluginJsx()
    )
  }

  if (isReact) {
    plugins.push(vitePluginReact())
  }

  return createServer({
    root,
    plugins,
    server: {
      host: true
    },
    resolve: {
      alias: {
        'vitx-site-common': vitxSiteCommon
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: mainHtml,
          mobile: mobileHtml
        }
      }
    }
  })
}
