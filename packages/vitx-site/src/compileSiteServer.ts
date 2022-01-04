import markdownItTocDoneRight from 'markdown-it-toc-done-right'
import vitePluginJsx from '@vitejs/plugin-vue-jsx'
import vitePluginReact from '@vitejs/plugin-react'
import markdownItAnchor from 'markdown-it-anchor'
import vitePluginVue from '@vitejs/plugin-vue'
import { injectHtml } from 'vite-plugin-html'
import vitePluginMdn from 'vite-plugin-mdn'
import type { PluginOption } from 'vite'
import highlight from 'highlight.js'
import { createServer } from 'vite'
import path from 'path'
import fs from 'fs'

import { IDocuments, genRoute } from './genRouter'
import { IFrame, IVitxSiteConfig } from './types'

const docFileName = 'README.md'
const docLangFileName = (lang: string) => `README.${lang}.md`
const demoDirName = 'demo'
const demoEntryFileName = 'index'
const mainHtmlFileName = 'index.html'
const mobileHtmlFileName = 'mobile.html'
const commonDirName = 'common'
const templateDirName = 'template'

function markdownHighlight(code: string, lang: string) {
  if (lang && highlight.getLanguage(lang)) {
    return highlight.highlight(code, { language: lang, ignoreIllegals: true }).value
  }

  return ''
}

function getComponents({
  components,
  defaultLang,
  locales,
  entryPath
}: {
  defaultLang: IVitxSiteConfig['site']['defaultLang']
  locales: IVitxSiteConfig['site']['locales']
  components: string[]
  entryPath: string
}) {
  const documents: IDocuments = []

  if (locales) {
    const langs = Object.keys(locales)
    langs.forEach((lang) => {
      const fileName = lang === defaultLang ? docFileName : docLangFileName(lang)
      components.forEach((component) => {
        documents.push({
          name: component,
          path: path.join(entryPath, component, fileName)
        })
      })
    })
  } else {
    components.forEach((component) => {
      documents.push({
        name: component,
        path: path.join(entryPath, component, docFileName)
      })
    })
  }

  const getDemoEntryFile = (demoDirPath: string) => {
    let indexFilePath: string
    fs.readdirSync(demoDirPath).forEach((item) => {
      const filePath = path.join(demoDirPath, item)

      if (!fs.lstatSync(filePath).isDirectory() && item.split('.')[0] === demoEntryFileName) {
        indexFilePath = filePath
      }
    })

    return indexFilePath
  }

  const demos = components
    .map((component) => {
      const componentPath = path.join(entryPath, component, demoDirName)

      return (
        fs.existsSync(componentPath) && {
          component,
          name: component,
          path: getDemoEntryFile(componentPath)
        }
      )
    })
    .filter(Boolean)

  return { demos, documents }
}

export function createSiteServer(options: { cwd: string; frame: IFrame; config: IVitxSiteConfig }) {
  const { cwd, frame, config } = options
  const {
    entry,
    site: { title, description, logo, lazy, locales, defaultLang }
  } = config

  const root = path.join(cwd, templateDirName)
  const entryPath = path.join(cwd, entry)
  const rootFrame = path.join(root, frame)
  const vitxSiteCommon = path.join(root, commonDirName)
  const mainHtml = path.join(rootFrame, mainHtmlFileName)
  const mobileHtml = path.join(rootFrame, mobileHtmlFileName)

  const isVue = frame === IFrame.vue
  const isReact = frame === IFrame.react

  const components = fs
    .readdirSync(entryPath)
    .filter((item) => fs.lstatSync(path.join(entryPath, item)).isDirectory())

  const { documents, demos } = getComponents({ components, entryPath, defaultLang, locales })

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
        before(code) {
          return `<div class="markdown-body__content">\n\n${code}\n\n</div> \n\n\${toc}\n`
        }
      }
    }),
    genRoute({ documents, isVue, isReact, lazy, demos, config })
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
