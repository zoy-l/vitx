"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _joi() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/joi"));

  _joi = function _joi() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _joi().default.object({
  pkgs: _joi().default.array(),
  nodeVersion: _joi().default.number(),
  target: _joi().default.string().valid('node', 'browser'),
  moduleType: _joi().default.string().valid('esm', 'cjs'),
  runtimeHelpers: _joi().default.boolean(),
  extraBabelPlugins: _joi().default.array().items(_joi().default.any()),
  extraBabelPresets: _joi().default.array().items(_joi().default.any()),
  extraPostCSSPlugins: _joi().default.array().items(_joi().default.any()),
  nodeFiles: _joi().default.array().items(_joi().default.string()),
  browserFiles: _joi().default.array().items(_joi().default.string()),
  entry: _joi().default.string(),
  output: _joi().default.string(),
  lessOptions: _joi().default.object(),
  esBuild: _joi().default.boolean(),
  disableTypes: _joi().default.boolean(),
  beforeReadWriteStream: _joi().default.func(),
  afterReadWriteStream: _joi().default.func(),
  mountedReadWriteStream: _joi().default.func(),
  react: _joi().default.boolean(),
  paths: _joi().default.object(),
  mapSources: _joi().default.func(),
  afterHook: _joi().default.func(),
  sourcemap: _joi().default.boolean()
});

exports.default = _default;