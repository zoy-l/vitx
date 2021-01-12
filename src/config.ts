import slash from 'slash'
import path from 'path'
import fs from 'fs'

import getBabelConfig from './getBabelConifg'
import { IBundleOptions } from './types'
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
    only: [slash(path.join(cwd, only))],
    babelrc: false,
    cache: false
  })
}

export default function (cwd: string): IBundleOptions {
  const configFile = CONFIG_FILES.find((file) =>
    fs.existsSync(path.join(cwd, file))
  )

  let config = {}

  if (configFile) {
    registerBabel({ cwd, only: configFile })
    config = isDefault(require(path.join(cwd, configFile)))
    const { error } = schema.validate(config)

    if (error) {
      throw new Error(`Invalid options in ${error.message}`)
    }
  }
  return config
}
