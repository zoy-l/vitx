import { PluginOption } from 'vite'

export type IDocuments = { name: string; path: string }[]

function createVueRoute() {
  return `export default documents`
}

function createReactRoute(lazy: boolean) {
  return `function BuiltRouter(props) {
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
}

export function genRoute(options: {
  documents: IDocuments
  demos: IDocuments
  isReact: boolean
  isVue: boolean
  lazy: boolean
}): PluginOption {
  const { documents, isVue, isReact, lazy, demos } = options
  const virtualDesktopModuleId = '@vitx-documents-desktop'
  const virtualMobileModuleId = '@vitx-documents-mobile'
  const resolvedMobileVirtualModuleId = `vitx:${virtualMobileModuleId}`
  const resolvedDesktopVirtualModuleId = `vitx:${virtualDesktopModuleId}`

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
        // const isDemos = id === resolvedMobileVirtualModuleId
        return `
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
          isReact
            ? `
            import { Route, Routes, BrowserRouter } from 'react-router-dom'
            import React, { Suspense, lazy, Fragment } from 'react'
            `
            : ''
        )}
        const documents = {
          ${files[id].map((item) => item.name).join(',')}
        }

        ${isReact ? createReactRoute(lazy) : createVueRoute()}`
      }
    }
  }
}
