"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getBabelConfig;

function getBabelConfig(bundleOpts, path) {
  const target = bundleOpts.target,
        nodeVersion = bundleOpts.nodeVersion,
        moduleType = bundleOpts.moduleType,
        runtimeHelpers = bundleOpts.runtimeHelpers,
        nodeFiles = bundleOpts.nodeFiles,
        browserFiles = bundleOpts.browserFiles,
        _bundleOpts$extraBabe = bundleOpts.extraBabelPlugins,
        extraBabelPlugins = _bundleOpts$extraBabe === void 0 ? [] : _bundleOpts$extraBabe,
        _bundleOpts$extraBabe2 = bundleOpts.extraBabelPresets,
        extraBabelPresets = _bundleOpts$extraBabe2 === void 0 ? [] : _bundleOpts$extraBabe2,
        disableTypes = bundleOpts.disableTypes;
  let isBrowser = target === 'browser';

  if (path) {
    if (isBrowser) {
      if (nodeFiles && nodeFiles.includes(path)) isBrowser = false;
    } else if (browserFiles && browserFiles.includes(path)) isBrowser = true;
  }

  return {
    presets: [disableTypes && '@babel/preset-typescript', ['@babel/preset-env', {
      targets: isBrowser ? {
        browsers: ['>0.2%', 'not ie 11', 'not op_mini all']
      } : {
        node: nodeVersion !== null && nodeVersion !== void 0 ? nodeVersion : 6
      },
      modules: moduleType === 'esm' ? false : 'auto'
    }], ...extraBabelPresets].filter(Boolean),
    plugins: [moduleType === 'cjs' && !isBrowser && ['@babel/plugin-transform-modules-commonjs', {
      lazy: true
    }], '@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-do-expressions', '@babel/plugin-proposal-export-namespace-from', '@babel/plugin-proposal-nullish-coalescing-operator', '@babel/plugin-proposal-optional-chaining', '@babel/plugin-syntax-dynamic-import', ['@babel/plugin-proposal-decorators', {
      legacy: true
    }], ['@babel/plugin-proposal-class-properties', {
      loose: true
    }], runtimeHelpers && ['@babel/plugin-transform-runtime', {
      useESModules: isBrowser && moduleType === 'esm',
      version: require('@babel/runtime/package.json').version
    }], ...extraBabelPlugins].filter(Boolean)
  };
}