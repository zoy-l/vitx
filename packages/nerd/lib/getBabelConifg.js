"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getBabelConfig;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    exclude: ['transform-member-expression-literals', 'transform-reserved-words', 'transform-template-literals', 'transform-typeof-symbol', 'transform-unicode-regex', 'transform-sticky-regex', 'transform-new-target', 'transform-modules-umd', 'transform-modules-systemjs', 'transform-modules-amd', 'transform-literals', !isBrowser && 'transform-regenerator'].filter(Boolean)
  };
  return {
    presets: [disableTypes && require.resolve('@babel/preset-typescript'), [require.resolve('@babel/preset-env'), _objectSpread({
      targets: isBrowser ? {
        browsers: ['last 2 versions', 'IE 10']
      } : {
        node: nodeVersion !== null && nodeVersion !== void 0 ? nodeVersion : 6
      },
      modules: isBrowser ? false : 'auto'
    }, defaultEnvConfig)], isBrowser && react && '@babel/preset-react', ...extraBabelPresets].filter(Boolean),
    plugins: [moduleType === 'cjs' && !isBrowser && [require.resolve('@babel/plugin-transform-modules-commonjs'), {
      lazy: true
    }], require.resolve('@babel/plugin-proposal-export-default-from'), require.resolve('@babel/plugin-proposal-do-expressions'), require.resolve('@babel/plugin-proposal-export-namespace-from'), require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), require.resolve('@babel/plugin-proposal-optional-chaining'), require.resolve('@babel/plugin-syntax-dynamic-import'), [require.resolve('@babel/plugin-proposal-class-properties'), {
      loose: true
    }], [require.resolve('@babel/plugin-proposal-private-methods'), {
      loose: true
    }], [require.resolve('@babel/plugin-proposal-private-property-in-object'), {
      loose: true
    }], runtimeHelpers && [require.resolve('@babel/plugin-transform-runtime'), {
      useESModules: isBrowser && moduleType === 'esm',
      version: require('@babel/runtime/package.json').version
    }], ...extraBabelPlugins].filter(Boolean)
  };
}