"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.CONFIG_FILES = void 0;

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

var _utils = require("./utils");

var _schema = _interopRequireDefault(require("./schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CONFIG_FILES = ['.nerdrc.ts', '.nerdrc.js'];
exports.CONFIG_FILES = CONFIG_FILES;

function _default(cwd) {
  var _configFile$find;

  const isTest = process.env.NODE_ENV !== 'test';
  const configFile = CONFIG_FILES.map(configName => _path().default.join(cwd, configName));
  const userConfig = (_configFile$find = configFile.find(configCwd => _fs().default.existsSync(configCwd))) !== null && _configFile$find !== void 0 ? _configFile$find : '';
  let config = {};

  if (userConfig) {
    // https://github.com/facebook/jest/issues/7864

    /* istanbul ignore next */
    isTest && (0, _utils.registerBabel)(userConfig);
    config = (0, _utils.isDefault)(require(userConfig));

    const _schema$validate = _schema.default.validate(config),
          error = _schema$validate.error;

    if (error) {
      throw new Error(`Invalid options in ${error.message}`);
    }
  }

  return config;
}