import path from 'path'
import fs from 'fs'

import { registerBabel, isDefault } from './utils'
import { IVitxConfig } from './types'

import schema from './schema'

export const CONFIG_FILES = <const>['.vitxrc.ts', '.vitxrc.js']

export default function (cwd: string, isMergeDefault = true): IVitxConfig {
  const isTest = process.env.NODE_ENV === 'test'
  const configFile = CONFIG_FILES.map((configName) => path.join(cwd, configName))

  const userConfig = configFile.find((configCwd) => fs.existsSync(configCwd)) ?? ''

  let config = {}

  if (userConfig) {
    // https://github.com/facebook/jest/issues/7864
    /* istanbul ignore next */
    !isTest && registerBabel(userConfig)
    config = isDefault(require(userConfig))

    const { error } = schema.validate(config)

    if (error) {
      throw new Error(`Invalid options in ${error.message}`)
    }
  }

  return isMergeDefault
    ? {
        entry: 'src',
        output: 'lib',
        target: 'browser',
        moduleType: 'esm',
        sourcemap: false,
        packageDirName: 'packages',
        ...config
      }
    : (config as IVitxConfig)
}
