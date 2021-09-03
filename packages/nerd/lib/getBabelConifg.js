"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getBabelConfig;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
  const defaultEnvConfig = {
    loose: true,
    exclude: ['transform-member-expression-literals', 'transform-reserved-words', 'transform-template-literals', 'transform-typeof-symbol', 'transform-unicode-regex', 'transform-sticky-regex', 'transform-new-target', 'transform-modules-umd', 'transform-modules-systemjs', 'transform-modules-amd', 'transform-literals', !isBrowser && 'transform-regenerator'].filter(Boolean)
  };
  return {
    presets: [disableTypes && require.resolve('@nerd/bundles/model/@babel/preset-typescript'), [require.resolve('@nerd/bundles/model/@babel/preset-env'), _extends({
      targets: isBrowser ? {
        browsers: ['last 2 versions', 'IE 10']
      } : {
        node: nodeVersion != null ? nodeVersion : 6
      },
      modules: isBrowser ? false : 'auto'
    }, defaultEnvConfig)], isBrowser && react && '@nerd/bundles/model/@babel/preset-react', ...extraBabelPresets].filter(Boolean),
    plugins: [moduleType === 'cjs' && !isBrowser && [require.resolve('@nerd/bundles/model/@babel/plugin-transform-modules-commonjs'), {
      lazy: true
    }], require.resolve('@nerd/bundles/model/@babel/plugin-proposal-export-default-from'), require.resolve('@nerd/bundles/model/@babel/plugin-proposal-do-expressions'), runtimeHelpers && [require.resolve('@nerd/bundles/model/@babel/plugin-transform-runtime'), {
      useESModules: isBrowser && moduleType === 'esm',
      version: require('@babel/runtime/package.json').version
    }], ...extraBabelPlugins].filter(Boolean)
  };
}