"use strict";

function _babelJest() {
  const data = _interopRequireDefault(require("babel-jest"));

  _babelJest = function _babelJest() {
    return data;
  };

  return data;
}

var _getBabelConifg = _interopRequireDefault(require("./getBabelConifg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

module.exports = _babelJest().default.createTransformer(_extends({}, (0, _getBabelConifg.default)({
  target: 'node',
  disableTypes: true
}), {
  babelrc: false,
  configFile: false
}));