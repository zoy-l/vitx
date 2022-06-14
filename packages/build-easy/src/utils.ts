import slash from '@build-easy/bundles/model/slash'
import getBabelConfig from './getBabelConifg'

export function registerBabel(only: string) {
  const bebelConifg = getBabelConfig({ target: 'node' }, false, 'cjs')

  require('@build-easy/bundles/model/@babel/register')({
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
