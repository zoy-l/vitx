import { options as CliOptions } from 'jest-cli/build/cli/args'
import yargsParser from 'yargs-parser'
import merge from 'lodash.merge'
import { runCLI } from 'jest'
import assert from 'assert'
import path from 'path'
import fs from 'fs'

import { PickedJestCliOptions } from './types'
import defaultConfig from './jestConfig'

export default async function (args: yargsParser.Arguments) {
  process.env.NODE_ENV = 'test'

  const cwd = args.cwd ?? process.cwd()

  const userJestConfigFile = path.join(cwd, 'jest.config.js')

  const userJestConfig =
    fs.existsSync(userJestConfigFile) && require(userJestConfigFile)

  const packageJSONPath = path.join(cwd, 'package.json')
  const packageJestConfig =
    fs.existsSync(packageJSONPath) && require(packageJSONPath).jest

  const config = merge(
    defaultConfig(cwd, args),
    packageJestConfig,
    userJestConfig
  )

  const argsConfig = Object.keys(CliOptions).reduce((prev, name) => {
    if (args[name]) prev[name] = args[name]

    // Convert alias args into real one
    const { alias } = CliOptions[name]
    if (alias && args[alias]) prev[name] = args[alias]
    return prev
  }, {} as PickedJestCliOptions)

  // Must be a separate `config` configuration,
  // The value is `string`, otherwise it will not take effect
  // prettier-ignore
  // Run jest
  const result = await runCLI({
    config: JSON.stringify(config),
    _: args._ ?? [],
    $0: args.$0 ?? '',
    ...argsConfig
  },[cwd])

  assert(result.results.success, `Test with jest failed`)
}
