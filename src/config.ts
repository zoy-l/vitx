import path from 'path'
import fs from 'fs'

import { registerBabel, isDefault } from './utils'
import { IBundleOptions } from './types'

import schema from './schema'

export const CONFIG_FILES = ['.nerdrc.ts', '.nerdrc.js']

export default function (cwd: string): IBundleOptions {
  const isTest = process.env.NODE_ENV !== 'test'
  const configFile = CONFIG_FILES.map((configName) =>
    path.join(cwd, configName)
  )

  const userConfig =
    configFile.find((configCwd) => {
      return fs.existsSync(configCwd)
    }) ?? ''

  let config = {}

  if (userConfig) {
    // https://github.com/facebook/jest/issues/7864
    isTest && registerBabel(userConfig)
    config = isDefault(require(userConfig))

    const { error } = schema.validate(config)

    if (error) {
      throw new Error(`Invalid options in ${error.message}`)
    }
  }
  return config
}
