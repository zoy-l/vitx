import { PluginOption } from 'vite'
import path from 'path'
import fs from 'fs'

import { IFrame, type IVitxSiteConfig, type IDocuments } from './types'
import { formatCode, formatName, parseName } from './utils'

const docFileName = 'README.md'
const docLangFileName = (lang: string) => `README.${lang}.md`
const demoEntryFileName = 'index'
const demoDirName = 'demo'

const reactDesktopApp = `
   function Routes(){ return useRoutes(routes) };
   function DesktopApp(){
    const {
      site: { lazy: isLazy }
    } = config

    const RootElement = isLazy ? Suspense : Fragment
    const RootElementProps = isLazy ? { fallback: React.createElement(Fragment, null) } : {}

    return React.createElement(RootElement, RootElementProps,
      React.createElement(BrowserRouter, null,
        React.createElement(Routes, null)
      )
    )
   }
   render(React.createElement(DesktopApp, null), document.getElementById('vitx-app'))
  `

const vueApp = `
const routers = createRouter({
  history: createWebHistory(),
  routes: routes
})

createApp(RouterView).use(routers).mount('#vitx-app')
`

export function genRoute(options: {
  isReact: boolean
  isVue: boolean
  cwd: string
  config: IVitxSiteConfig
  frame: IFrame
}): PluginOption {
  const { isVue, isReact, config, cwd, frame } = options
  const {
    componentEntry,
    docEntry,
    site: { defaultLang: dl, lazy },
    components: { nav }
  } = config

  const virtualDesktopModuleId = '/@vitx-documents-desktop'
  const virtualMobileModuleId = '/@vitx-documents-mobile'
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
  const defaultLang = isSingleNav ? '' : dl
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

      if (
        !fs.lstatSync(filePath).isDirectory() &&
        path.basename(item, path.extname(item)) === demoEntryFileName
      ) {
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
        const frameImports = {
          vue: `
        import { createRouter, createWebHistory, RouterView } from 'vue-router';
        import { createApp, h } from 'vue';`,
          react: `
        import React, { lazy, Fragment } from 'react';
        import { render } from 'react-dom';
        import { Navigate, useRoutes, BrowserRouter } from 'react-router-dom';`
        }

        const nodeName = { vue: 'component', react: 'element' }
        const routeApp = { vue: vueApp, react: reactDesktopApp }
        const commonContent = `
        const meta = {}
        const routes = []
        const config = ${JSON.stringify(config)}
        const documents = { ${files[id].map((item) => item.name).join(',')} }
        const documentsDetails = ${JSON.stringify(files[id])}
        `

        const baseImports = files[id].reduce((memo, current) => {
          if (lazy) {
            isVue && (memo += `const ${current.name} = () => import("${current.path}");\n`)
            isReact && (memo += `const ${current.name} = lazy(() => import("${current.path}"));\n`)
          } else {
            memo += `import ${current.name} from "${current.path}";\n`
          }
          return memo
        }, frameImports[frame])

        if (id === resolvedMobileVirtualModuleId) {
          return formatCode(`
          import BuiltMobileHome from 'vitx-site-common/element/BuiltMobileHome'
          import 'vitx-site-common/styles/mobile'

          ${baseImports}
          ${commonContent}

          routes.push({
            name: 'notFound',
            path: '/:path(.*)+',
            redirect: { name: 'BuiltMobileHome' }
          },{
            name:'BuiltMobileHome',
            path:'/mobile-home',
            component:BuiltMobileHome,
          })

          ${routeApp[frame]}
          `)
        }

        if (id === resolvedDesktopVirtualModuleId) {
          const nodeValue = { vue: 'Element', react: 'React.createElement(Element, null)' }

          const notMatch = {
            vue: `
          path: '/:path(.*)+',
          redirect: homePath`,
            react: `
          path: '*',
          element: React.createElement(Navigate, { to:homePath, replace:true})`
          }

          const nodeSiteComponent = {
            vue: `{ render(){ return h(BuiltSite, { config }, { default: ()=> h(RouterView)}) } }`,
            react: `React.createElement(BuiltSite, { config, meta })`
          }

          return formatCode(
            `
          import BuiltSite from 'vitx-site-common/element';
          import 'vitx-site-common/styles';

        ${baseImports}

        ${parseName.toString()}

        ${commonContent}

        let homePath = '/home'

        const componentsRouteRoot = {
          path: '/components',
          ${nodeName[frame]}: ${nodeSiteComponent[frame]},
          children: []
        }

        documentsDetails.forEach(({ name, isComponent }) => {
          ${
            isSingleNav
              ? 'const component = name;const lang = null'
              : `
              const { component, lang } = parseName(name);
              if('${defaultLang}' === lang) homePath = \`/${defaultLang}/home\``
          }
          const Element = documents[name]

          ${
            isSingleNav
              ? `const basePath = \`\${component}\``
              : `const basePath = \`\${lang}/\${component}\``
          }

          if (isComponent) {
            meta[\`/components/\${basePath}\`] = lang
            componentsRouteRoot.children.push({
              name,
              path:basePath,
              ${nodeName[frame]}: ${nodeValue[frame]},
              meta: { lang, name: component },
            })
          } else {
            const path = \`/\${basePath}\`
            meta[path] = lang
            routes.push({
              name,
              path,
              ${nodeName[frame]}: ${nodeValue[frame]},
              meta: { lang, name: component }
            })
          }
        })

        routes.push(componentsRouteRoot)
        routes.push({
          name: 'notFound',
          ${notMatch[frame]}
        })
        ${routeApp[frame]}
        `
          )
        }
      }
    }
  }
}
