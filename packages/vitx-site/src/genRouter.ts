import { PluginOption, ResolvedConfig } from 'vite'

export type IDocuments = { name: string; path: string }[]

export function modifyRoute(documents: IDocuments, isVue: boolean, isReact: boolean): PluginOption {
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
    configResolved(_config) {
      config = _config
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
        ${documents.reduce(
          (memo, current) => {
            if (config.isProduction) {
              memo += `import ${current.name} from "${current.path}";\n`
            } else {
              isVue && (memo += `const ${current.name} = () => import("${current.path}");\n`)
              isReact &&
                (memo += `const ${current.name} = lazy(() => import("${current.path}"));\n`)
            }
            return memo
          },
          isReact
            ? `
            import { Route, Routes, BrowserRouter } from 'react-router-dom'
            import React, { Suspense, lazy, Fragment } from 'react'
            `
            : ''
        )}
        const documents = {
          ${documents.map((item) => item.name).join(',')}
        }

        ${
          isReact
            ? `function BuiltRouter(props) {
          const { fallback = React.createElement('div', null), site: BuiltSite } = props
          const document = Object.keys(documents)
          return React.createElement(
            ${config.isProduction ? 'Fragment, null' : 'Suspense, { fallback }'},
            React.createElement(BrowserRouter, null, React.createElement(
                BuiltSite, null, React.createElement(
                  Routes, null,
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
            : `export default documents`
        }`
      }
    }
  }
}
