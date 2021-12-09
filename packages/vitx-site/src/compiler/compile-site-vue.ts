import vitePluginJsx from '@vitejs/plugin-vue-jsx'
import vitePluginVue from '@vitejs/plugin-vue'
import { createServer } from 'vite'
import path from 'path'

export default async function compileSiteVue(cwd: string) {
  const server = await createServer({
    root: path.join(cwd, 'template/vue'),

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
