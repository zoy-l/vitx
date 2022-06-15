import through2 from '@build-easy/bundles/model/through2'
import gulpIf from '@build-easy/bundles/model/gulp-if'

export interface BuildConfig {
  /**
   * Search file mode
   */
  patterns?: (patterns: string[], cwd: string) => string[]
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
  tsCompilerOptions?: Record<string, any>

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
  entry?: string

  /**
   * Output default lib
   */
  output?: string

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
