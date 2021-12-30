import { existsSync, readdirSync } from 'fs'
import { ViteDevServer } from 'vite'
import { join } from 'path'

import { createSiteServer } from './compile-site-server'
import { getUserSiteConfig } from './get-user-config'
import type { IDocuments } from './gen-router'
import { IFrame } from './types'

export async function compiler(options: { vue: boolean; react: boolean }) {
  const { vue, react } = options
  const cwd = process.cwd()
  const { site, entry } = getUserSiteConfig(cwd)
  const { locales, defaultLang } = site
  const entryPath = join(cwd, entry)
  const components = readdirSync(entryPath)
  const docs: IDocuments = []

  if (locales) {
    const langs = Object.keys(locales)
    langs.forEach((lang) => {
      const fileName = lang === defaultLang ? 'README.md' : `README.${lang}.md`
      components.forEach((component) => {
        docs.push({
          name: component,
          path: join(entryPath, component, fileName)
        })
      })
    })
  } else {
    components.forEach((component) => {
      docs.push({
        name: component,
        path: join(entryPath, component, 'README.md')
      })
    })
  }

  const documents = docs.filter((item) => existsSync(item.path))

  let server: ViteDevServer

  vue && (server = await createSiteServer({ cwd, frame: IFrame.vue, documents, site }))
  react && (server = await createSiteServer({ cwd, frame: IFrame.react, documents, site }))

  await server.listen()
  server.printUrls()
}
