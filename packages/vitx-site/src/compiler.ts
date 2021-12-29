import { existsSync, readdirSync } from 'fs'
import { join } from 'path'

import { getUserSiteConfig } from './get-user-config'
import compileSiteReact from './compile-site-react'
import compileSiteVue from './compile-site-vue'

export async function compiler(options: { vue: boolean; react: boolean }) {
  const { vue, react } = options
  const cwd = process.cwd()
  const { site, entry } = getUserSiteConfig(cwd)
  const { locales, defaultLang } = site
  const entryPath = join(cwd, entry)
  const components = readdirSync(entryPath)
  const docs: { name: string; path: string }[] = []

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

  console.log(documents)

  vue && compileSiteVue(cwd)
  react && compileSiteReact(cwd)
}
