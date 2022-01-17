import { PluginOption } from 'vite'
import path from 'path'
import fs from 'fs'

import { formatCode, formatName, parseName } from './utils'
import type { IVitxSiteConfig, IDocuments } from './types'

const docFileName = 'README.md'
const docLangFileName = (lang: string) => `README.${lang}.md`
const demoEntryFileName = 'index'
const demoDirName = 'demo'

export function genRoute(options: {
  isReact: boolean
  isVue: boolean
  cwd: string
  config: IVitxSiteConfig
}): PluginOption {
  const { isVue, isReact, config, cwd } = options
  const {
    componentEntry,
    docEntry,
    site: { defaultLang, lazy },
    components: { nav }
  } = config

  const virtualDesktopModuleId = '@vitx-documents-desktop'
  const virtualMobileModuleId = '@vitx-documents-mobile'
  const resolvedMobileVirtualModuleId = `vitx:${virtualMobileModuleId}`
  const resolvedDesktopVirtualModuleId = `vitx:${virtualDesktopModuleId}`

  const componentEntryPath = path.join(cwd, componentEntry)
  const docEntryPath = path.join(cwd, docEntry)

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

  const documents: IDocuments = []
  const isSingleNav = Array.isArray(nav)
  const langs = isSingleNav ? [null] : Object.keys(nav)

  langs.forEach((lang) => {
    let fileName = docFileName

    if (!isSingleNav) {
      fileName = lang === defaultLang ? docFileName : docLangFileName(lang)
    }

    components.forEach((component) => {
      documents.push({
        name: formatName(component, lang),
        path: path.join(componentEntryPath, component, fileName),
        isComponent: true
      })
    })
  })

  docs.forEach((doc) => {
    const pairs = path.parse(doc).name.split('.')
    documents.push({
      name: formatName(pairs[0], pairs[1] ?? defaultLang),
      path: path.join(docEntryPath, doc)
    })
  })

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
          // component,
          name: formatName(component),
          path: getDemoEntryFile(componentPath)
        }
      )
    })
    .filter(Boolean)

  const files = {
    [resolvedMobileVirtualModuleId]: demos,
    [resolvedDesktopVirtualModuleId]: documents
  }

  return {
    name: 'vite-plugin-vitx-route',
    resolveId(id) {
      if (id === virtualDesktopModuleId) {
        return resolvedDesktopVirtualModuleId
      }

      if (id === virtualMobileModuleId) {
        return resolvedMobileVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedDesktopVirtualModuleId || id === resolvedMobileVirtualModuleId) {
        return formatCode(`
        ${files[id].reduce(
          (memo, current) => {
            if (lazy) {
              isVue && (memo += `const ${current.name} = () => import("${current.path}");\n`)
              isReact &&
                (memo += `const ${current.name} = lazy(() => import("${current.path}"));\n`)
            } else {
              memo += `import ${current.name} from "${current.path}";\n`
            }
            return memo
          },
          isReact ? `import { lazy } from 'react';` : ''
        )}

        ${parseName.toString()}

        const documents = {
          ${files[id].map((item) => item.name).join(',')}
        }
        const documentsDetails = ${JSON.stringify(files[id])}

        const routes = [
          {
            name: 'notFound',
            path: '/:path(.*)+',
            redirect: {
              name: 'home'
            }
          }
        ]
        const componentsRouteRoot = {
          path: '/components',
          component: 'BuiltSite',
          children: []
        }

        documentsDetails.forEach(({ name, isComponent }) => {
          const { component, lang } = parseName(name)

          if (isComponent) {
            componentsRouteRoot.children.push({
              name,
              path: \`\${lang}/\${component}\`,
              component: name,
              meta: { lang, name: component },
            })
          } else {
            routes.push({
              name,
              path: \`/\${lang}/\${component}\`,
              component: name,
              meta: { lang, name: component }
            })
          }
        })

        routes.push(componentsRouteRoot)

        const config = ${JSON.stringify(config)}
        const utils = { parseName }
        export { documents, utils, config, documentsDetails, routes }`)
      }
    }
  }
}
