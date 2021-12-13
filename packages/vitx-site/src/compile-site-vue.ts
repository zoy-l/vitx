import { createSiteServer } from './compile-site-server'
import { IFrame } from './types'

export default async function compileSiteVue(cwd: string) {
  const server = await createSiteServer({ cwd, frame: IFrame.vue })

  await server.listen()
  server.printUrls()
}
