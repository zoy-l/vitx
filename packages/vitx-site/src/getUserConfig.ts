import getConfig from 'vitx/lib/getUserConfig'

import type { IVitxSiteConfig } from './types'
import schema from './configSchema'

const configFileNames = ['vitx.config.ts', 'vitx.config.js']

const defaultConfig: IVitxSiteConfig = {
  componentEntry: 'src',
  docEntry: 'docs',
  site: {
    defaultLang: 'en_US'
  }
}

export function getUserSiteConfig(cwd: string) {
  return { ...defaultConfig, ...(getConfig({ cwd, schema, configFileNames }) as IVitxSiteConfig) }
}
