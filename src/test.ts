import { options as CliOptions } from 'jest-cli/build/cli/args'
import yargsParser from 'yargs-parser'
import { runCLI } from 'jest'
import { merge } from 'lodash'
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

  const config = merge(defaultConfig(cwd, args), userJestConfig)

  const argsConfig = Object.keys(CliOptions).reduce((prev, name) => {
    if (args[name]) prev[name] = args[name]
    // Convert alias args into real one
    const { alias } = CliOptions[name]
    if (alias && args[alias]) prev[name] = args[alias]
    return prev
  }, {} as PickedJestCliOptions)

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
