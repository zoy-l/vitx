"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.isDefault = isDefault;

function _jest() {
  const data = require("jest");

  _jest = function _jest() {
    return data;
  };

  return data;
}

function _findUp() {
  const data = _interopRequireDefault(require("find-up"));

  _findUp = function _findUp() {
    return data;
  };

  return data;
}

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
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

var _jestConfig = _interopRequireDefault(require("./jestConfig"));

var _jestArgs = _interopRequireDefault(require("../jestArgs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const jestConfig = ['jest.config.js'];

function isDefault(obj) {
  var _obj$default;

  return (_obj$default = obj.default) != null ? _obj$default : obj;
}

function mergeConfig(defaultConfig, config, args) {
  const ret = _extends({}, defaultConfig);

  if (!config) return;
  Object.keys(config).forEach(key => {
    const val = config[key];
    ret[key] = typeof val === 'function' ? val(ret[key], args) : val;
  });
  return ret;
}

function formatArgs(args) {
  // Generate jest options
  const argsConfig = Object.keys(_jestArgs.default).reduce((prev, name) => {
    if (args[name]) prev[name] = args[name]; // Convert alias args into real one

    const alias = _jestArgs.default[name].alias;
    if (alias && args[alias]) prev[name] = args[alias];
    return prev;
  }, {});
  return argsConfig;
}

function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (args) {
    var _args$cwd, _userJestConfigFiles$;

    process.env.NODE_ENV = 'test';
    const cwd = (_args$cwd = args.cwd) != null ? _args$cwd : process.cwd();
    const userJestConfigFiles = jestConfig.map(configName => _path().default.join(cwd, configName));
    const userJestConfig = (_userJestConfigFiles$ = userJestConfigFiles.find(configCwd => _fs().default.existsSync(configCwd))) != null ? _userJestConfigFiles$ : yield (0, _findUp().default)(jestConfig[0]);
    const config = mergeConfig((0, _jestConfig.default)(cwd), isDefault(userJestConfig ? require(userJestConfig) : {}), args);
    const argsConfig = formatArgs(args); // prettier-ignore
    // Run jest

    const result = yield (0, _jest().runCLI)(_extends({
      _: args._ || [],
      $0: args.$0 || '',
      config: JSON.stringify(config)
    }, argsConfig), [cwd]);
    (0, _assert().default)(result.results.success, `Test with jest failed`);
  });
  return _ref.apply(this, arguments);
}