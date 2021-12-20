import compileSiteReact from './compile-site-react'
import compileSiteVue from './compile-site-vue'
import getVitxConfig from './get-vitx-config'

export async function compiler(options: { vue: boolean; react: boolean }) {
  const { vue, react } = options
  const cwd = process.cwd()

  const config = await getVitxConfig(cwd)

  console.log(config)

  vue && compileSiteVue(cwd)
  react && compileSiteReact(cwd)
}
