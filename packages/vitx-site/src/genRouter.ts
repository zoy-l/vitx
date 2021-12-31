import { PluginOption } from 'vite'

export type IDocuments = { name: string; path: string }[]

export function modifyRoute(options: {
  documents: IDocuments
  isReact: boolean
  isVue: boolean
  lazy: boolean
}): PluginOption {
  const { documents, isVue, isReact, lazy } = options
  const virtualModuleId = '@vitx-documents'
  const resolvedVirtualModuleId = `vitx:${virtualModuleId}`

  return {
    name: 'vite-plugin-vitx-route',
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
            if (lazy) {
              isVue && (memo += `const ${current.name} = () => import("${current.path}");\n`)
              isReact &&
                (memo += `const ${current.name} = lazy(() => import("${current.path}"));\n`)
            } else {
              memo += `import ${current.name} from "${current.path}";\n`
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
            ${lazy ? 'Suspense, { fallback }' : 'Fragment, null'},
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
