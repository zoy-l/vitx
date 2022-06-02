import type { Config } from '@jest/types'
import yargsParser from 'yargs-parser'
import { runCLI } from 'jest'
import findUp from 'find-up'
import assert from 'assert'
import path from 'path'
import fs from 'fs'

import defaultConfig from './jestConfig'
import jestArgs from '../jestArgs'

const jestConfig = ['jest.config.js']

/**
 * Jest config Help type
 */
export type IHandleConfig<T> = T extends Record<string, any>
  ? { [key in keyof T]: T[key] | ((value: T[key]) => T[key]) }
  : T

/**
 * Jest config
 */
export type IJestConfig = IHandleConfig<Config.InitialOptions>

export function isDefault(obj: any) {
  return obj.default ?? obj
}

function mergeConfig(
  defaultConfig: Config.InitialOptions,
  config: IJestConfig,
  args: yargsParser.Arguments
) {
  const ret = { ...defaultConfig }
  if (!config) return

  Object.keys(config).forEach((key) => {
    const val = config[key]
    ret[key] = typeof val === 'function' ? val(ret[key], args) : val
  })

  return ret
}

function formatArgs(args: yargsParser.Arguments) {
  // Generate jest options
  const argsConfig = Object.keys(jestArgs).reduce((prev, name) => {
    if (args[name]) prev[name] = args[name]
    // Convert alias args into real one
    const { alias } = jestArgs[name]
    if (alias && args[alias]) prev[name] = args[alias]
    return prev
  }, {})

  return argsConfig
}

export default async function (args: yargsParser.Arguments) {
  process.env.NODE_ENV = 'test'
  const cwd = args.cwd ?? process.cwd()

  const userJestConfigFiles = jestConfig.map((configName) => path.join(cwd, configName))
  const userJestConfig =
    userJestConfigFiles.find((configCwd) => fs.existsSync(configCwd)) ??
    (await findUp(jestConfig[0]))

  const config = mergeConfig(
    defaultConfig(cwd),
    isDefault(userJestConfig ? require(userJestConfig) : {}),
    args
  )!

  const argsConfig = formatArgs(args)

  // prettier-ignore
  // Run jest
  const result = await runCLI({
    _: args._ || [],
    $0: args.$0 || '',
    config: JSON.stringify(config),
    ...argsConfig,
  },[cwd])

  assert(result.results.success, `Test with jest failed`)
}
