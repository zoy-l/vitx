import vitePluginReact from '@vitejs/plugin-react'
import vitePluginVue from '@vitejs/plugin-vue'
import prism from 'markdown-it-prism'
import { createServer } from 'vite'

import Markdown from './lib'

const type = process.argv.slice(2)[0]

async function run() {
  const plugin = {
    vue: vitePluginVue,
    react: vitePluginReact
  }

  const server = await createServer({
    root: `./example/${type}`,
    plugins: [
      plugin[type](),
      Markdown({
        markdownItUses: [prism],
        frame: type
      })
    ]
  })

  await server.listen()
  server.printUrls()
}

run()
