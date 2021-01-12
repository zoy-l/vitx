"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorLog = colorLog;
exports.eventColor = eventColor;
exports.clearConsole = clearConsole;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function _chalk() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'gray', 'redBright', 'greenBright', 'yellowBright', 'blueBright', 'magentaBright', 'cyanBright'];
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

function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}