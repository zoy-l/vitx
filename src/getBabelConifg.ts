import type { IBundleOptions } from './types'

export default function getBabelConfig(
  bundleOpts: Omit<IBundleOptions, 'entry' | 'output'>,
  path?: string
) {
  const {
    target,
    nodeVersion,
    moduleType,
    runtimeHelpers,
    nodeFiles,
    browserFiles,
    extraBabelPlugins = [],
    extraBabelPresets = [],
    disableTypes
  } = bundleOpts

  let isBrowser = target === 'browser'

  if (path) {
    if (isBrowser) {
      if (nodeFiles && nodeFiles.includes(path)) isBrowser = false
    } else if (browserFiles && browserFiles.includes(path)) isBrowser = true
  }

  return {
    presets: [
      disableTypes && '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          targets: isBrowser
            ? { browsers: ['>0.2%', 'not ie 11', 'not op_mini all'] }
            : { node: nodeVersion ?? 6 },
          modules: moduleType === 'esm' ? false : 'auto'
        }
      ],
      ...extraBabelPresets
    ].filter(Boolean) as (string | any[])[],
    plugins: [
      moduleType === 'cjs' &&
        !isBrowser && [
          '@babel/plugin-transform-modules-commonjs',
          { lazy: true }
        ],
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-syntax-dynamic-import',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      runtimeHelpers && [
        '@babel/plugin-transform-runtime',
        {
          useESModules: isBrowser && moduleType === 'esm',
          version: require('@babel/runtime/package.json').version
        }
      ],
      ...extraBabelPlugins
    ].filter(Boolean) as (string | any[])[]
  }
}
