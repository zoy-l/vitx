"use strict";

function _babelJest() {
  const data = _interopRequireDefault(require("babel-jest"));

  _babelJest = function _babelJest() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _babelJest().default.createTransformer({
  presets: [['@babel/preset-typescript', {
    allowNamespaces: true
  }], ['@babel/preset-env', {
    targets: {
      node: 'current'
    },
    modules: 'commonjs'
  }], '@babel/preset-react'],
  plugins: [['@babel/plugin-transform-modules-commonjs', {
    lazy: true
  }], '@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-export-namespace-from'],
  babelrc: false,
  configFile: false
});