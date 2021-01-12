import through2 from 'through2'
import gulpInsert from 'gulp-insert'

export interface IBundleOptions {
  esBuild?: true
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
  beforeReadWriteStream?: (
    through?: typeof through2,
    insert?: typeof gulpInsert
  ) => NodeJS.ReadWriteStream
  afterReadWriteStream?: (
    through?: typeof through2,
    insert?: typeof gulpInsert
  ) => NodeJS.ReadWriteStream
  pkgs?: string[]
  entry?: string
  output?: string
  paths?: Record<string, string>
}

export interface IBundleOpt extends IBundleOptions {
  entry: string
  output: string
}
