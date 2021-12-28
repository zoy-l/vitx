import { getUserSiteConfig } from './get-user-config'
import compileSiteReact from './compile-site-react'
import compileSiteVue from './compile-site-vue'

export async function compiler(options: { vue: boolean; react: boolean }) {
  const { vue, react } = options
  const cwd = process.cwd()

  const siteConfig = getUserSiteConfig(cwd)

  const compileOptions = {
    siteConfig,
    cwd
  }

  console.log(compileOptions)

  vue && compileSiteVue(cwd)
  react && compileSiteReact(cwd)
}
