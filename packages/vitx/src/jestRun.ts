import yargsParser from '@vitx/bundles/model/yargs-parser'
import { runCLI } from 'jest'
import assert from 'assert'
import path from 'path'
import fs from 'fs'

import { AnyConfig, CalculatedConfig } from './types'
import { registerBabel, isDefault } from './utils'
import defaultConfig from './jestConfig'

const jestConfig = ['jest.config.js', 'jest.config.ts']

function mergeConfig<T extends Record<string, any>, U extends Record<string, any>>(
  defaultConfig: T,
  ...configs: (AnyConfig<T, U> | null | undefined)[]
) {
  const ret = { ...defaultConfig } as Partial<CalculatedConfig<T, U>>
  configs.forEach((config) => {
    if (!config) return
    ;(Object.keys(config) as (keyof typeof config)[]).forEach((key) => {
      const val = config[key]
      if (typeof val === 'function') {
        ret[key] = val(ret[key])
      } else {
        ret[key] = val as CalculatedConfig<T, U>[typeof key]
      }
    })
  })
  return ret as CalculatedConfig<T, U>
}

export default async function (args: yargsParser.Arguments) {
  try {
    require('babel-jest')
  } catch (err) {
    throw new Error('The corresponding version of `babel-jest` needs to be installed')
  }

  process.env.NODE_ENV = 'test'
  const cwd = args.cwd ?? process.cwd()

  const userJestConfigFiles = jestConfig.map((configName) => path.join(cwd, configName))
  const userJestConfig = userJestConfigFiles.find((configCwd) => fs.existsSync(configCwd))

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
