"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorLog = colorLog;
exports.eventColor = eventColor;
exports.registerBabel = registerBabel;
exports.isDefault = isDefault;
exports.mergeConfig = mergeConfig;

function _chalk() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/chalk"));

  _chalk = function _chalk() {
    return data;
  };

  return data;
}

function _slash() {
  const data = _interopRequireDefault(require("@nerd/bundles/model/slash"));

  _slash = function _slash() {
    return data;
  };

  return data;
}

var _getBabelConifg = _interopRequireDefault(require("./getBabelConifg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'redBright', 'greenBright', 'yellowBright', 'blueBright', 'magentaBright', 'cyanBright'];
let index = 0;
const cache = {};

function colorLog(pkg) {
  if (!cache[pkg]) {
    const color = colors[index];

    const str = _chalk().default[color].bold(pkg);

    cache[pkg] = str;

    if (index === colors.length - 1) {
      index = 0;
    } else {
      index += 1;
    }
  }

  return cache[pkg];
}

function eventColor(eventType) {
  const black = _chalk().default.black;

  return {
    unlink: black.bgRed,
    add: black.bgGreen,
    change: black.bgYellow,
    unlinkDir: black.bgRed,
    addDir: black.bgGreen
  }[eventType](` ${eventType} `);
}

function registerBabel(only) {
  const bebelConifg = (0, _getBabelConifg.default)({
    target: 'node',
    disableTypes: true
  });

  require('@babel/register')(_extends({}, bebelConifg, {
    extensions: ['.js', '.ts'],
    only: [(0, _slash().default)(only)],
    babelrc: false,
    cache: false
  }));
}

function isDefault(obj) {
  var _obj$default;

  return (_obj$default = obj.default) != null ? _obj$default : obj;
}

function mergeConfig(defaultConfig, ...configs) {
  const ret = _extends({}, defaultConfig);

  configs.forEach(config => {
    if (!config) return;
    Object.keys(config).forEach(key => {
      const val = config[key];

      if (typeof val === 'function') {
        ret[key] = val(ret[key]);
      } else {
        ret[key] = val;
      }
    });
  });
  return ret;
}