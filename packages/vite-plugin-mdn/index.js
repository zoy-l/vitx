import prism from 'markdown-it-prism'
import Vue from '@vitejs/plugin-vue'
import { createServer } from 'vite'

import Markdown from './lib'

const type = process.argv.slice(2)[0]

async function run() {
  const server = await createServer({
    root: `./example/${type}`,
    plugins: [
      Vue(),
      Markdown({
        markdownItUses: [prism]
      })
    ]
  })

  await server.listen()
  server.printUrls()
}

run()
