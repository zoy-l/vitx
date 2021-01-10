import type { IBundleOptions } from './types'

export default function getBabelConfig(
  bundleOpts: Omit<IBundleOptions, 'entry' | 'output'>,
  isBrowser?: boolean
) {
  const {
    nodeVersion,
    moduleType,
    runtimeHelpers,
    extraBabelPlugins = [],
    extraBabelPresets = [],
    disableTypes,
    react
  } = bundleOpts

  return {
    presets: [
      disableTypes && '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          targets: isBrowser
            ? { browsers: ['last 2 versions', 'IE 10'] }
            : { node: nodeVersion ?? 6 },
          modules: moduleType === 'esm' ? false : 'auto'
        }
      ],
      isBrowser && react && '@babel/preset-react',
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
