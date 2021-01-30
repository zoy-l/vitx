"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getEsBuildConfig;

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function getEsBuildConfig(bundleOpts, isBrowser, path) {
  const nodeVersion = bundleOpts.nodeVersion,
        sourceMaps = bundleOpts.sourceMaps;
  return {
    loader: (0, _path().extname)(path).slice(1),
    target: isBrowser ? 'chrome58' : `node${nodeVersion !== null && nodeVersion !== void 0 ? nodeVersion : 6}`,
    format: isBrowser ? 'esm' : 'cjs',
    treeShaking: true,
    sourcemap: sourceMaps
  };
}