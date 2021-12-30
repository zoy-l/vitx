import { PluginOption, ResolvedConfig } from 'vite'

export type IDocuments = { name: string; path: string }[]

export function modifyVueRoute(documents: IDocuments): PluginOption {
  const virtualModuleId = '@vitx-documents'
  const resolvedVirtualModuleId = `vitx:${virtualModuleId}-vue`
  let config: ResolvedConfig | undefined
  return {
    name: 'vite-plugin-vitx-vue-route',
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

export function modifyReactRoute(documents: IDocuments): PluginOption {
  const virtualModuleId = '@vitx-documents'
  const resolvedVirtualModuleId = `vitx:${virtualModuleId}-react`
  let config: ResolvedConfig | undefined
  return {
    name: 'vite-plugin-vitx-react-route',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
        ${documents.reduce(
          (memo, current) => {
            if (config.isProduction) {
              memo += `import ${current.name} from "${current.path}";\n`
            } else {
              memo += `const ${current.name} = lazy(() => import("${current.path}"));\n`
            }
            return memo
          },
          `
          import { Route, Routes, BrowserRouter } from 'react-router-dom'
          import React, { Suspense, lazy } from 'react'
          `
        )}
        const documents = {
          ${documents.reduce((memo, current) => {
            memo += current.name
            return memo
          }, ``)}
        }
        function BuiltRouter(props) {
          const { fallback = React.createElement('div', null), site: BuiltSite } = props
          const document = Object.keys(documents)
          return React.createElement(
            Suspense,
            {
              fallback
            },
            React.createElement(
              BrowserRouter,
              null,
              React.createElement(
                BuiltSite,
                null,
                React.createElement(
                  Routes,
                  null,
                  document.map((routeName) => {
                    const Element = documents[routeName]
                    return React.createElement(Route, {
                      key: routeName,
                      path: \`/\${routeName}\`,
                      element: React.createElement(Element, null)
                    })
                  })
                )
              )
            )
          )
        }
        export default BuiltRouter`
      }
    },
    configResolved(_config) {
      config = _config
    }
  }
}
