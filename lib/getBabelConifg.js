"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getBabelConfig;

function getBabelConfig(bundleOpts, isBrowser) {
  const nodeVersion = bundleOpts.nodeVersion,
        moduleType = bundleOpts.moduleType,
        runtimeHelpers = bundleOpts.runtimeHelpers,
        _bundleOpts$extraBabe = bundleOpts.extraBabelPlugins,
        extraBabelPlugins = _bundleOpts$extraBabe === void 0 ? [] : _bundleOpts$extraBabe,
        _bundleOpts$extraBabe2 = bundleOpts.extraBabelPresets,
        extraBabelPresets = _bundleOpts$extraBabe2 === void 0 ? [] : _bundleOpts$extraBabe2,
        disableTypes = bundleOpts.disableTypes,
        react = bundleOpts.react;
  return {
    presets: [disableTypes && require.resolve('@babel/preset-typescript'), [require.resolve('@babel/preset-env'), {
      targets: isBrowser ? {
        browsers: ['last 2 versions', 'IE 10']
      } : {
        node: nodeVersion !== null && nodeVersion !== void 0 ? nodeVersion : 6
      },
      modules: isBrowser ? false : 'auto'
    }], isBrowser && react && '@babel/preset-react', ...extraBabelPresets].filter(Boolean),
    plugins: [moduleType === 'cjs' && !isBrowser && [require.resolve('@babel/plugin-transform-modules-commonjs'), {
      lazy: true
    }], require.resolve('@babel/plugin-proposal-export-default-from'), require.resolve('@babel/plugin-proposal-do-expressions'), require.resolve('@babel/plugin-proposal-export-namespace-from'), require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), require.resolve('@babel/plugin-proposal-optional-chaining'), require.resolve('@babel/plugin-syntax-dynamic-import'), [require.resolve('@babel/plugin-proposal-decorators'), {
      legacy: true
    }], [require.resolve('@babel/plugin-proposal-class-properties'), {
      loose: true
    }], runtimeHelpers && [require.resolve('@babel/plugin-transform-runtime'), {
      useESModules: isBrowser && moduleType === 'esm',
      version: require('@babel/runtime/package.json').version
    }], ...extraBabelPlugins].filter(Boolean)
  };
}