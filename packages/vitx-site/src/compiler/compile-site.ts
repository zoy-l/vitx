// import vitePluginJsx from '@vitejs/plugin-vue-jsx'
import vitePluginVue from '@vitejs/plugin-vue'
import { createServer } from 'vite'
import * as path from 'path'

export async function compileSite() {
  const server = await createServer({
    root: path.join(path.resolve(), '../template/vue'),
    // /\.md$/
    plugins: [
      vitePluginVue({
        include: [/\.vue$/]
      })
      // vitePluginJsx()
    ]
  })

  await server.listen()
  server.printUrls()
}

compileSite()
