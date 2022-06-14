import { BuildConfig } from './src/types'

export default {
  moduleType: 'cjs',
  target: 'node',
  tsCompilerOptions: {
    allowSyntheticDefaultImports: true,
    declaration: true,
    skipLibCheck: true,
    moduleResolution: 'node'
  }
} as BuildConfig
