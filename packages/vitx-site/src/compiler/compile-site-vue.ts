// import vitePluginJsx from '@vitejs/plugin-vue-jsx'
import vitePluginVue from '@vitejs/plugin-vue'
import { createServer } from 'vite'
import * as path from 'path'

export async function compileSite() {
  const cwd = process.cwd()

  const server = await createServer({
    root: path.join(cwd, 'lib/template/vue'),

    plugins: [
      vitePluginVue({
        include: [/\.vue$/, /\.md$/]
      })
      // vitePluginJsx()
    ]
  })

  await server.listen()
  server.printUrls()
}

compileSite()
