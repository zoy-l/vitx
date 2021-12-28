import type { ObjectSchema } from '@vitx/bundles/model/joi'
import path from 'path'
import fs from 'fs'

import { registerBabel, isDefault } from './utils'

export interface IGetUserConfig {
  cwd: string
  schema: ObjectSchema
  configFileNames: string[]
}

export default function (options: IGetUserConfig): unknown {
  const { cwd, schema, configFileNames } = options
  const configFile = configFileNames.map((configName) => path.join(cwd, configName))
  const userConfig = configFile.find((configPath) => fs.existsSync(configPath))

  let config = {}

  if (userConfig) {
    // https://github.com/facebook/jest/issues/7864
    /* istanbul ignore next */
    process.env.NODE_ENV !== 'test' && registerBabel(userConfig)
    config = isDefault(require(userConfig))

    const { error } = schema.validate(config)

    if (error) {
      throw new Error(`Invalid options in ${error.message}`)
    }
  }

  return config
}
