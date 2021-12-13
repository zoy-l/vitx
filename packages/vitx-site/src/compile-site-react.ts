import { createSiteServer } from './compile-site-server'
import { IFrame } from './types'

export default async function compileSiteReact(cwd: string) {
  const server = await createSiteServer({ cwd, frame: IFrame.react })

  await server.listen()
  server.printUrls()
}
