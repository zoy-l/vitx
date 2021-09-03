"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTSConfig;

function _deepmerge() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/deepmerge"));

  _deepmerge = function _deepmerge() {
    return data;
  };

  return data;
}

function _typescript() {
  const data = _interopRequireDefault(require("typescript"));

  _typescript = function _typescript() {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTSConfig(cwd, pkgPath) {
  const fileName = 'tsconfig.json';

  const readFile = path => _fs().default.readFileSync(path, 'utf-8');

  const rootTsConfig = _typescript().default.readConfigFile(_path().default.join(cwd, fileName), readFile);

  const pkgsConifg = _typescript().default.readConfigFile(_path().default.join(pkgPath != null ? pkgPath : '', fileName), readFile);

  if (rootTsConfig.error) {
    rootTsConfig.config.compilerOptions = {
      allowSyntheticDefaultImports: true,
      declaration: true,
      skipLibCheck: true,
      module: 'esnext',
      target: 'esnext',
      moduleResolution: 'node'
    };
  }

  if (!pkgsConifg.error) {
    var _pkgsConifg$config$co;

    rootTsConfig.config.compilerOptions = (0, _deepmerge().default)(rootTsConfig.config.compilerOptions, (_pkgsConifg$config$co = pkgsConifg.config.compilerOptions) != null ? _pkgsConifg$config$co : {});
  }

  return {
    tsConfig: rootTsConfig.config,
    error: rootTsConfig.error
  };
}