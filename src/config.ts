import path from 'path'
import fs from 'fs'

import getBabelConfig from './getBabelConifg'
import { IBundleOptions } from './types'
import { conversion } from './utils'
import schema from './schema'

export const CONFIG_FILES = ['.nerdrc.ts', '.nerdrc.js']

function isDefault(obj: any) {
  return obj.default ?? obj
}

function registerBabel({ cwd, only }: { cwd: string; only: string }) {
  const bebelConifg = getBabelConfig({ target: 'node' })
  bebelConifg.presets.unshift('@babel/preset-typescript')

  require('@babel/register')({
    ...bebelConifg,
    extensions: ['.js', '.ts'],
    only: [conversion(path.join(cwd, only))],
    babelrc: false,
    cache: false
  })
}

export default function (cwd: string): IBundleOptions {
  const configFile = CONFIG_FILES.find((file) =>
    fs.existsSync(path.join(cwd, file))
  )

  if (configFile) {
    registerBabel({ cwd, only: configFile })
    const userConfig = isDefault(
      require(path.join(cwd, configFile))
    ) as IBundleOptions
    const { error } = schema.validate(userConfig)

    if (error) {
      throw new Error(`Invalid options in ${error.message}`)
    }

    if (!userConfig.entry) {
      userConfig.entry = 'src'
    }

    if (!userConfig.output) {
      userConfig.output = 'lib'
    }

    return userConfig
  }
  return { entry: 'src', output: 'lib' }
}
