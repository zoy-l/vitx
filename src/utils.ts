import chalk from 'chalk'
import slash from 'slash'

import { AnyConfig, CalculatedConfig } from './types'
import getBabelConfig from './getBabelConifg'

const colors = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'gray',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright'
]

let index = 0
const cache = {}

export function colorLog(pkg: string) {
  if (!cache[pkg]) {
    const color = colors[index]
    const str = chalk[color].bold(pkg)
    cache[pkg] = str
    if (index === colors.length - 1) {
      index = 0
    } else {
      index += 1
    }
  }
  return cache[pkg]
}

export function eventColor(
  eventType: 'unlink' | 'add' | 'change' | 'addDir' | 'unlinkDir'
) {
  const { black } = chalk
  return {
    unlink: black.bgRed,
    add: black.bgGreen,
    change: black.bgYellow,
    unlinkDir: black.bgRed,
    addDir: black.bgGreen
  }[eventType](` ${eventType} `)
}

export function registerBabel(only: string) {
  const bebelConifg = getBabelConfig({ target: 'node', disableTypes: true })

  require('@babel/register')({
    ...bebelConifg,
    extensions: ['.js', '.ts'],
    only: [slash(only)],
    babelrc: false,
    cache: false
  })
}

export function isDefault(obj: any) {
  return obj.default ?? obj
}

export function mergeConfig<
  T extends Record<string, any>,
  U extends Record<string, any>
>(defaultConfig: T, ...configs: (AnyConfig<T, U> | null | undefined)[]) {
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
