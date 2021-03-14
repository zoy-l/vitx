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

  const defaultEnvConfig = {
    exclude: [
      'transform-member-expression-literals',
      'transform-reserved-words',
      'transform-template-literals',
      'transform-typeof-symbol',
      'transform-unicode-regex',
      'transform-sticky-regex',
      'transform-new-target',
      'transform-modules-umd',
      'transform-modules-systemjs',
      'transform-modules-amd',
      'transform-literals',
      !isBrowser && 'transform-regenerator'
    ].filter(Boolean)
  }

  return {
    presets: [
      disableTypes && require.resolve('@babel/preset-typescript'),
      [
        require.resolve('@babel/preset-env'),
        {
          targets: isBrowser
            ? { browsers: ['last 2 versions', 'IE 10'] }
            : { node: nodeVersion ?? 6 },
          modules: isBrowser ? false : 'auto',
          ...defaultEnvConfig
        }
      ],
      isBrowser && react && '@babel/preset-react',
      ...extraBabelPresets
    ].filter(Boolean) as (string | any[])[],
    plugins: [
      moduleType === 'cjs' &&
        !isBrowser && [
          require.resolve('@babel/plugin-transform-modules-commonjs'), // @babel/preset-env
          { lazy: true }
        ],
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-do-expressions'),
      require.resolve('@babel/plugin-proposal-export-namespace-from'), // @babel/preset-env
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), // @babel/preset-env
      require.resolve('@babel/plugin-proposal-optional-chaining'), // @babel/preset-env
      require.resolve('@babel/plugin-syntax-dynamic-import'), // @babel/preset-env

      [
        require.resolve('@babel/plugin-proposal-class-properties'), // @babel/preset-env
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
    ].filter(Boolean) as (string | any[])[]
  }
}
