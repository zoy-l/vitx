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
import fs from 'fs'

import { mdBodyWrapper, vueAnchorsLink, reactAnchorsLink, markdownHighlight } from './transforms'
import { genRoute, type IDocuments } from './genRouter'
import { IFrame, type IVitxSiteConfig } from './types'
import { commonScript } from './commonScript'
import { formatName } from './utils'
import smoothFC from './smoothFC'

const docFileName = 'README.md'
const docLangFileName = (lang: string) => `README.${lang}.md`
const demoDirName = 'demo'
const demoEntryFileName = 'index'
const mainHtmlFileName = 'index.html'
const mobileHtmlFileName = 'mobile.html'
const commonDirName = 'common'
const templateDirName = 'template'

function getComponents({
  docs,
  docEntryPath,
  components,
  defaultLang,
  locales,
  componentEntryPath
}: {
  defaultLang: IVitxSiteConfig['site']['defaultLang']
  locales: IVitxSiteConfig['site']['locales']
  components: string[]
  componentEntryPath: string
  docs: string[]
  docEntryPath: string
}) {
  const documents: IDocuments = []

  if (locales) {
    const langs = Object.keys(locales)
    langs.forEach((lang) => {
      const fileName = lang === defaultLang ? docFileName : docLangFileName(lang)
      components.forEach((component) => {
        documents.push({
          name: formatName(component, lang),
          path: path.join(componentEntryPath, component, fileName),
          isComponent: true
        })
      })
    })
  } else {
    components.forEach((component) => {
      documents.push({
        name: formatName(component),
        path: path.join(componentEntryPath, component, docFileName),
        isComponent: true
      })
    })

    docs.forEach((doc) => {
      documents.push({
        name: formatName(path.basename(doc, path.extname(doc))),
        path: path.join(docEntryPath, doc)
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
      const componentPath = path.join(componentEntryPath, component, demoDirName)

      return (
        fs.existsSync(componentPath) && {
          component,
          name: formatName(component),
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
    componentEntry,
    docEntry,
    site: { title, description, logo, lazy, locales, defaultLang }
  } = config

  const root = path.join(__dirname, '..', templateDirName)
  const componentEntryPath = path.join(cwd, componentEntry)
  const docEntryPath = path.join(cwd, docEntry)
  const rootFrame = path.join(root, frame)
  const vitxSiteCommon = path.join(root, commonDirName)
  const mainHtml = path.join(rootFrame, mainHtmlFileName)
  const mobileHtml = path.join(rootFrame, mobileHtmlFileName)

  const isVue = frame === IFrame.vue
  const isReact = frame === IFrame.react

  let components: string[] = []
  let docs: string[] = []

  if (fs.existsSync(componentEntryPath)) {
    components = fs
      .readdirSync(componentEntryPath)
      .filter((item) => fs.lstatSync(path.join(componentEntryPath, item)).isDirectory())
  }

  if (fs.existsSync(docEntryPath)) {
    const Re = isVue ? /\.(jsx|vue)/ : /\.(jsx)/
    docs = fs.readdirSync(docEntryPath).filter((item) => {
      return Re.test(item)
    })
  }

  const { documents, demos } = getComponents({
    docs,
    docEntryPath,
    components,
    componentEntryPath,
    defaultLang,
    locales
  })

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
    genRoute({ documents, isVue, isReact, lazy, demos, config }),
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
