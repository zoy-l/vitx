const vitePluginReact = require('@vitejs/plugin-react')
const vitePluginVue = require('@vitejs/plugin-vue')

const { createServer } = require('vite')

const Markdown = require('./lib').default

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
        markdownItUses: [],
        frame: type
      })
    ]
  })

  await server.listen()
  server.printUrls()
}

run()
