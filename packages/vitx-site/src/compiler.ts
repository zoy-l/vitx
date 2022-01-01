import { ViteDevServer } from 'vite'

import { createSiteServer } from './compileSiteServer'
import { getUserSiteConfig } from './getUserConfig'

import { IFrame } from './types'

export async function compiler(options: { vue: boolean; react: boolean }) {
  const { vue, react } = options
  const cwd = process.cwd()
  const config = getUserSiteConfig(cwd)

  let server: ViteDevServer

  vue && (server = await createSiteServer({ cwd, frame: IFrame.vue, config }))
  react && (server = await createSiteServer({ cwd, frame: IFrame.react, config }))

  await server.listen()
  server.printUrls()
}
