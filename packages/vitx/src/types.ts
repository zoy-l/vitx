import through2 from '@vitx/bundles/model/through2'
import gulpIf from '@vitx/bundles/model/gulp-if'
import type { Config } from '@jest/types'
import { runCLI } from 'jest'

export interface IVitxConfig {
  /**
   * Whether to inject css when compiling a single `.vue` file
   */
  injectVueCss?: boolean

  /**
   * The directory name for multi-directory compilation is `packages` by default
   */
  packageDirName?: string

  /**
   * Compile target, all means compile `esm` and `cjs` at the same time
   */
  moduleType?: 'esm' | 'cjs' | 'all'

  /**
   * Additional babel plugins
   */
  extraBabelPlugins?: any[]

  /**
   * Additional babel Presets
   */
  extraBabelPresets?: any[]

  /**
   * Compile the target operating environment
   */
  target?: 'node' | 'browser'

  /**
   * Compile react file or vue file is not enabled by default
   */
  frame?: 'react' | 'vue'

  /**
   * File path of the target browser
   */
  browserFiles?: string[]

  /**
   * File path of the target node
   */
  nodeFiles?: string[]

  /**
   * node version 6 default
   */
  nodeVersion?: number

  /**
   * Whether to open runtimeHelpers
   */
  runtimeHelpers?: boolean

  /**
   * Whether to prohibit the generation of d.ts
   */
  disableTypes?: boolean

  /**
   * Life cycle hooks, run before compiling files
   */
  beforeReadWriteStream?: (options: {
    through: typeof through2
    gulpIf: typeof gulpIf
  }) => NodeJS.ReadWriteStream

  /**
   * Life cycle hooks, run after compiling files
   */
  afterReadWriteStream?: (options: {
    through: typeof through2
    gulpIf: typeof gulpIf
  }) => NodeJS.ReadWriteStream

  /**
   * Compilation is complete
   */
  afterHook?: () => void

  /**
   * Multi-directory compilation directory and order
   */
  packages?: string[]

  /**
   * Entry default src
   */
  entry: string

  /**
   * Output default lib
   */
  output: string

  /**
   * Path alias
   */
  alias?: Record<string, string>

  /**
   * Less plugin options
   */
  lessOptions?: {
    modifyVars?: Record<string, any>
    paths?: string[]
    plugins?: any[]
    relativeUrls?: boolean
  }

  /**
   * Whether to open sourcemap
   */
  sourcemap?: boolean
}

/**
 * The value of internal moduleType is always "esm" | "cjs"
 */
export type IModes = Exclude<Required<IVitxConfig>['moduleType'], 'all'>

/**
 * Jest run function Help type
 */
export type IArgsType<T extends (...args: any[]) => any> = T extends (...args: infer U) => any
  ? U
  : never

/**
 * Jest run function parameters
 */
export interface ITestArgs extends Partial<IArgsType<typeof runCLI>['0']> {
  version?: boolean
  cwd?: string
  debug?: boolean
  e2e?: boolean
  package?: string
}

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
