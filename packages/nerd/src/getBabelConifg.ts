import type { INerdConfig } from './types'

export default function getBabelConfig(
  bundleOpts: Omit<INerdConfig, 'entry' | 'output'>,
  isBrowser: boolean,
  moduleType: 'cjs' | 'esm'
) {
  const {
    nodeVersion,
    runtimeHelpers,
    extraBabelPlugins = [],
    extraBabelPresets = [],
    disableTypes,
    react
  } = bundleOpts

  const defaultEnvConfig = {
    loose: true,
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
      disableTypes && require.resolve('@nerd/bundles/model/@babel/preset-typescript'),
      [
        require.resolve('@nerd/bundles/model/@babel/preset-env'),
        {
          targets: isBrowser
            ? { browsers: ['last 2 versions', 'IE 10'] }
            : { node: nodeVersion ?? 6 },
          modules: isBrowser ? false : 'auto',
          ...defaultEnvConfig
        }
      ],
      isBrowser && react && '@nerd/bundles/model/@babel/preset-react',
      ...extraBabelPresets
    ].filter(Boolean) as (string | any[])[],
    plugins: [
      moduleType === 'cjs' &&
        !isBrowser && [
          require.resolve('@nerd/bundles/model/@babel/plugin-transform-modules-commonjs'),
          { lazy: true }
        ],

      require.resolve('@nerd/bundles/model/@babel/plugin-proposal-export-default-from'),
      require.resolve('@nerd/bundles/model/@babel/plugin-proposal-do-expressions'),

      runtimeHelpers && [
        require.resolve('@nerd/bundles/model/@babel/plugin-transform-runtime'),
        {
          useESModules: isBrowser && moduleType === 'esm',
          version: require('@babel/runtime/package.json').version
        }
      ],
      ...extraBabelPlugins
    ].filter(Boolean) as (string | any[])[]
  }
}
