"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.CONFIG_FILES = void 0;

function _slash() {
  const data = _interopRequireDefault(require("slash"));

  _slash = function _slash() {
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

var _getBabelConifg = _interopRequireDefault(require("./getBabelConifg"));

var _schema = _interopRequireDefault(require("./schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const CONFIG_FILES = ['.nerdrc.ts', '.nerdrc.js'];
exports.CONFIG_FILES = CONFIG_FILES;

function isDefault(obj) {
  var _obj$default;

  return (_obj$default = obj.default) !== null && _obj$default !== void 0 ? _obj$default : obj;
}

function registerBabel({
  cwd,
  only
}) {
  const bebelConifg = (0, _getBabelConifg.default)({
    target: 'node',
    disableTypes: true
  });
  console.log(bebelConifg);

  require('@babel/register')(_objectSpread(_objectSpread({}, bebelConifg), {}, {
    extensions: ['.js', '.ts'],
    only: [(0, _slash().default)(_path().default.join(cwd, only))],
    babelrc: false,
    cache: false
  }));
}

function _default(cwd) {
  const configFile = CONFIG_FILES.find(file => _fs().default.existsSync(_path().default.join(cwd, file)));
  let config = {};

  if (configFile) {
    registerBabel({
      cwd,
      only: configFile
    });
    config = isDefault(require(_path().default.join(cwd, configFile)));

    const _schema$validate = _schema.default.validate(config),
          error = _schema$validate.error;

    if (error) {
      throw new Error(`Invalid options in ${error.message}`);
    }
  }

  return config;
}