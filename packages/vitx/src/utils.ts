import slash from '@vitx/bundles/model/slash'
import getBabelConfig from './getBabelConifg'

export function registerBabel(only: string) {
  const bebelConifg = getBabelConfig({ target: 'node', disableTypes: true }, false, 'cjs')

  require('@vitx/bundles/model/@babel/register')({
    ...bebelConifg,
    extensions: ['.js', '.ts'],
    only: [slash(only)],
    babelrc: false,
    cache: false
  })
}

export function isDefault(obj: any) {
  return obj.default ?? obj
}
