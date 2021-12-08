import type { IVitxConfig, IModes } from './types'

export default function getBabelConfig(
  vitxConfig: Omit<IVitxConfig, 'entry' | 'output'>,
  isBrowser: boolean,
  moduleType: IModes
): { plugins: string[]; presets: string[] } {
  const {
    nodeVersion,
    runtimeHelpers,
    extraBabelPlugins = [],
    extraBabelPresets = [],
    disableTypes,
    frame
  } = vitxConfig

  const vue = frame === 'vue'
  const react = frame === 'react'

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
      'transform-regenerator'
    ].filter(Boolean)
  }

  return {
    presets: [
      disableTypes && require.resolve('@vitx/bundles/model/@babel/preset-typescript'),
      [
        require.resolve('@vitx/bundles/model/@babel/preset-env'),
        {
          targets: isBrowser
            ? { browsers: ['last 2 versions', 'IE 10'] }
            : { node: nodeVersion ?? 6 },
          modules: isBrowser ? (moduleType === 'esm' ? false : 'cjs') : 'auto',
          ...defaultEnvConfig
        }
      ],

      /**
       * @desc Supports react
       */
      isBrowser && react && require.resolve('@vitx/bundles/model/@babel/preset-react'),
      ...extraBabelPresets
    ].filter(Boolean),
    plugins: [
      /**
       * @in
       * export default 1
       * @out
       * Object.defineProperty(exports, "__esModule", {
       *  value: true,
       *  });
       *
       * exports.default = 1;
       */
      moduleType === 'cjs' &&
        !isBrowser && [
          require.resolve('@vitx/bundles/model/@babel/plugin-transform-modules-commonjs'),
          { lazy: true }
        ],

      /**
       * @in
       * export * as v from "mod"
       * @out
       * export v from "mod"
       */
      require.resolve('@vitx/bundles/model/@babel/plugin-proposal-export-default-from'),

      /**
       * @desc
       * let a = do {
       *  if (x > 10) {
       *   ("big");
       *  } else {
       *   ("small");
       *  }
       * };
       *  // is equivalent to:
       * let a = x > 10 ? "big" : "small";
       */
      require.resolve('@vitx/bundles/model/@babel/plugin-proposal-do-expressions'),

      /**
       * @desc Supports vue jsx
       */
      isBrowser && vue && require('@vitx/bundles/model/@vue/babel-plugin-jsx'),

      runtimeHelpers && [
        require.resolve('@vitx/bundles/model/@babel/plugin-transform-runtime'),
        {
          useESModules: isBrowser && moduleType === 'esm',
          version: require('@babel/runtime/package.json').version
        }
      ],
      ...extraBabelPlugins
    ].filter(Boolean)
  }
}
