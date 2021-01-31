import { IBundleOptions } from './src/types'

const isDebug = process.env.NODE_ENV === 'debug'

export default {
  moduleType: 'cjs',
  target: 'node',
  output: isDebug ? 'debug' : 'lib',
  sourceMaps: isDebug
} as IBundleOptions
