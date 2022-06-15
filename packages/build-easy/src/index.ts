import { build } from './compile'
import { BuildConfig } from './types'

export * from './types'
export * from './utils'

export function defineConfig(config: BuildConfig) {
  return config
}

export default build
