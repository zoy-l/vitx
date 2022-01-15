import { PluginOption } from 'vite'
import path from 'path'

import type { IVitxSiteConfig, IDocuments } from './types'
import { formatCode, parseName } from './utils'

export function genRoute(options: {
  documents: IDocuments
  demos: IDocuments
  isReact: boolean
  isVue: boolean
  lazy: boolean
  config: IVitxSiteConfig
}): PluginOption {
  const { documents, isVue, isReact, lazy, demos, config } = options
  const virtualDesktopModuleId = '@vitx-documents-desktop'
  const virtualMobileModuleId = '@vitx-documents-mobile'
  const resolvedMobileVirtualModuleId = `vitx:${virtualMobileModuleId}`
  const resolvedDesktopVirtualModuleId = `vitx:${virtualDesktopModuleId}`

  demos.push({
    name: 'BuiltMobileHome',
    path: path.join(__dirname, '..', 'template/common/element/BuiltMobileHome.jsx')
  })

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
        const documents = {
          ${files[id].map((item) => item.name).join(',')}
        }

        const documentsDetails = ${JSON.stringify(files[id])}
        const config = ${JSON.stringify(config)}
        const utils = { parseName:${parseName.toString()} }
        export { documents, utils, config, documentsDetails }`)
      }
    }
  }
}
