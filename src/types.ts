import type { Config } from '@jest/types'
import gulpInsert from 'gulp-insert'
import through2 from 'through2'
import { runCLI } from 'jest'
import gulpIf from 'gulp-if'

export interface IBundleOptions {
  esBuild?: boolean
  moduleType?: 'esm' | 'cjs'
  extraBabelPlugins?: any[]
  extraBabelPresets?: any[]
  target?: 'node' | 'browser'
  react?: boolean
  browserFiles?: string[]
  nodeFiles?: string[]
  nodeVersion?: number
  runtimeHelpers?: boolean
  disableTypes?: boolean
  beforeReadWriteStream?: (options?: {
    through: typeof through2
    insert: typeof gulpInsert
    gulpIf: typeof gulpIf
  }) => NodeJS.ReadWriteStream
  afterReadWriteStream?: (options?: {
    through: typeof through2
    insert: typeof gulpInsert
    gulpIf: typeof gulpIf
  }) => NodeJS.ReadWriteStream
  pkgs?: string[]
  entry?: string
  output?: string
  paths?: Record<string, string>
  lessOptions?: {
    modifyVars?: Record<string, any>
    paths?: string[]
    plugins?: any[]
    relativeUrls?: boolean
  }
}

export interface IBundleOpt extends IBundleOptions {
  entry: string
  output: string
}

export type ArgsType<T extends (...args: any[]) => any> = T extends (
  ...args: infer U
) => any
  ? U
  : never

export interface ITestArgs extends Partial<ArgsType<typeof runCLI>['0']> {
  version?: boolean
  cwd?: string
  debug?: boolean
  e2e?: boolean
  package?: string
}

export type AnyConfig<
  T extends Record<string, any>,
  U extends Record<string, any>
> = {
  [V in keyof U]: V extends keyof T
    ? U[V] extends (...args: any[]) => any
      ? (argv: T[V]) => T[V]
      : T[V]
    : U[V]
}

export type CalculatedConfig<
  T extends Record<string, any>,
  U extends Record<string, any>
> = T &
  {
    [V in keyof U]: V extends keyof T ? T[V] : U[V]
  }

export type handleConfig<T> = T extends Record<string, any>
  ? { [key in keyof T]: T[key] | ((value: T[key]) => T[key]) }
  : T

export type jestConfig = handleConfig<Config.InitialOptions>
