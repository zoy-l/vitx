"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _jest() {
  const data = require("jest");

  _jest = function _jest() {
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

var _utils = require("./utils");

var _jestConfig = _interopRequireDefault(require("./jestConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const jestConfig = ['jest.config.js', 'jest.config.ts'];

function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (args) {
    var _args$cwd;

    process.env.NODE_ENV = 'test';
    const cwd = (_args$cwd = args.cwd) !== null && _args$cwd !== void 0 ? _args$cwd : process.cwd();
    const userJestConfigFiles = jestConfig.map(configName => _path().default.join(cwd, configName));
    const userJestConfig = userJestConfigFiles.find(configCwd => _fs().default.existsSync(configCwd));

    if (userJestConfig) {
      (0, _utils.registerBabel)(userJestConfig);
    }

    const config = (0, _utils.mergeConfig)((0, _jestConfig.default)(cwd, args), (0, _utils.isDefault)(userJestConfig ? require(userJestConfig) : {})); // prettier-ignore
    // Run jest

    const result = yield (0, _jest().runCLI)(_objectSpread({
      config: JSON.stringify(config)
    }, args), [cwd]);
    (0, _assert().default)(result.results.success, `Test with jest failed`);
  });
  return _ref.apply(this, arguments);
}
//# sourceMappingURL=test.js.map
