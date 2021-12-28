import { ObjectSchema } from '@vitx/bundles/model/joi'
import getConfig from 'vitx/lib/getUserConfig'

import schema from './config-schema'

const configFileNames = ['vitx.config.ts', 'vitx.config.js']

const getPublicConfig = (cwd: string, configSchema: ObjectSchema) =>
  getConfig({ cwd, schema: configSchema, configFileNames })

export function getUserSiteConfig(cwd: string) {
  const userConfig = getPublicConfig(cwd, schema)

  return userConfig
}
