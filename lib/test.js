"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _args() {
  const data = require("jest-cli/build/cli/args");

  _args = function _args() {
    return data;
  };

  return data;
}

function _lodash() {
  const data = require("lodash");

  _lodash = function _lodash() {
    return data;
  };

  return data;
}

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

var _jestConfig = _interopRequireDefault(require("./jestConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(_x) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(function* (args) {
    var _args$cwd, _args$_, _args$$;

    process.env.NODE_ENV = 'test';
    const cwd = (_args$cwd = args.cwd) !== null && _args$cwd !== void 0 ? _args$cwd : process.cwd();

    const userJestConfigFile = _path().default.join(cwd, 'jest.config.js');

    const userJestConfig = _fs().default.existsSync(userJestConfigFile) && require(userJestConfigFile);

    const packageJSONPath = _path().default.join(cwd, 'package.json');

    const packageJestConfig = _fs().default.existsSync(packageJSONPath) && require(packageJSONPath).jest;

    const config = (0, _lodash().merge)((0, _jestConfig.default)(cwd, args), packageJestConfig, userJestConfig);
    const argsConfig = Object.keys(_args().options).reduce((prev, name) => {
      if (args[name]) prev[name] = args[name]; // Convert alias args into real one

      const alias = _args().options[name].alias;

      if (alias && args[alias]) prev[name] = args[alias];
      return prev;
    }, {}); // Must be a separate `config` configuration,
    // The value is `string`, otherwise it will not take effect
    // prettier-ignore
    // Run jest  

    const result = yield (0, _jest().runCLI)(_objectSpread({
      config: JSON.stringify(config),
      _: (_args$_ = args._) !== null && _args$_ !== void 0 ? _args$_ : [],
      $0: (_args$$ = args.$0) !== null && _args$$ !== void 0 ? _args$$ : ''
    }, argsConfig), [cwd]);
    (0, _assert().default)(result.results.success, `Test with jest failed`);
  });
  return _ref.apply(this, arguments);
}