import { transformSync } from '@vitx/bundles/model/@babel/core'
import { parseId } from 'vite-plugin-mds'
import { PluginOption } from 'vite'

export default function smoothFunctionComponent(): PluginOption {
  return {
    name: 'vite-plugin-smooth-function-component',
    transform(raw, id) {
      const path = parseId(id)

      if (!/vitx-site\/template/.test(path) || !path.endsWith('.jsx')) {
        return raw
      }

      const res = transformSync(raw, {
        plugins: [require.resolve('babel-plugin-vue-fc')],
        parserOpts: { plugins: ['jsx'] }
      })

      return res
    }
  }
}
