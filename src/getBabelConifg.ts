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
    sourceMaps,
    react
  } = bundleOpts

  return {
    presets: [
      disableTypes && require.resolve('@babel/preset-typescript'),
      [
        require.resolve('@babel/preset-env'),
        {
          targets: isBrowser
            ? { browsers: ['last 2 versions', 'IE 10'] }
            : { node: nodeVersion ?? 6 },
          modules: isBrowser ? false : 'auto'
        }
      ],
      isBrowser && react && '@babel/preset-react',
      ...extraBabelPresets
    ].filter(Boolean) as (string | any[])[],
    plugins: [
      moduleType === 'cjs' &&
        !isBrowser && [
          require.resolve('@babel/plugin-transform-modules-commonjs'),
          { lazy: true }
        ],
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-do-expressions'),
      require.resolve('@babel/plugin-proposal-export-namespace-from'),
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        { loose: true }
      ],
      runtimeHelpers && [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          useESModules: isBrowser && moduleType === 'esm',
          version: require('@babel/runtime/package.json').version
        }
      ],
      ...extraBabelPlugins
    ].filter(Boolean) as (string | any[])[],
    sourceMaps
  }
}
