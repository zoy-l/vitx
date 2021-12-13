import compileSiteReact from './compile-site-react'
import compileSiteVue from './compile-site-vue'

export function compiler(options: { vue: boolean; react: boolean }) {
  const { vue, react } = options
  const cwd = process.cwd()

  vue && compileSiteVue(cwd)
  react && compileSiteReact(cwd)
}
