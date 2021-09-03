import yargsParser from '@nerd/bundles/model/yargs-parser'
import { runCLI } from 'jest'
import assert from 'assert'
import path from 'path'
import fs from 'fs'

import { registerBabel, isDefault, mergeConfig } from './utils'
import defaultConfig from './jestConfig'

const jestConfig = ['jest.config.js', 'jest.config.ts']

export default async function (args: yargsParser.Arguments) {
  process.env.NODE_ENV = 'test'
  const cwd = args.cwd ?? process.cwd()

  const userJestConfigFiles = jestConfig.map((configName) =>
    path.join(cwd, configName)
  )

  const userJestConfig = userJestConfigFiles.find((configCwd) =>
    fs.existsSync(configCwd)
  )

  if (userJestConfig) {
    registerBabel(userJestConfig)
  }

  const config = mergeConfig(
    defaultConfig(cwd, args),
    isDefault(userJestConfig ? require(userJestConfig) : {})
  )

  // prettier-ignore
  // Run jest
  const result = await runCLI({
    config: JSON.stringify(config),
    ...args
  },[cwd])

  assert(result.results.success, `Test with jest failed`)
}
