import getConfig from 'vitx/lib/getUserConfig'

import type { IVitxSiteConfig } from './types'
import schema from './config-schema'

const configFileNames = ['vitx.config.ts', 'vitx.config.js']

const defaultConfig: IVitxSiteConfig = {
  entry: 'src'
}

export function getUserSiteConfig(cwd: string) {
  return { ...defaultConfig, ...(getConfig({ cwd, schema, configFileNames }) as IVitxSiteConfig) }
}
