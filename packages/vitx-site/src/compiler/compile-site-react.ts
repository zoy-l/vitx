import vitePluginReact from '@vitejs/plugin-react'

import { createServer } from 'vite'
import path from 'path'

export async function compileSite() {
  const cwd = process.cwd()

  const server = await createServer({
    root: path.join(cwd, 'template/react'),

    plugins: [vitePluginReact({})]
  })

  await server.listen()
  server.printUrls()
}

compileSite()
