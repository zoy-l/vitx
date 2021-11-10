import path from 'path'
import fs from 'fs'

import { registerBabel, isDefault } from './utils'
import { IVitxConfig } from './types'

import schema from './configSchema'

export const configFileNames = <const>['.vitxrc.ts', '.vitxrc.js']

/**
 *
 * @param cwd - config path
 * @param isMergeDefault - Whether to initialize the value
 * @returns {IVitxConfig}
 */
export default function (cwd: string, isMergeDefault = true): IVitxConfig {
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

  // for multiple packages, only the config of the root directory is merged
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
