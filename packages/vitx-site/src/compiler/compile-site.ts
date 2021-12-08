import vitePluginJsx from '@vitejs/plugin-vue-jsx'
import vitePluginVue from '@vitejs/plugin-vue'
import { createServer } from 'vite'
import path from 'path'

export async function compileSite() {
  const server = await createServer({
    root: path.join(path.resolve(), '../template/vue'),

    plugins: [
      vitePluginVue({
        include: [/\.vue$/, /\.md$/]
      }),
      vitePluginJsx()
    ]
  })

  await server.listen()
  server.printUrls()
}

compileSite()
