"use strict";

function _yargsParser() {
  const data = _interopRequireDefault(require("yargs-parser"));

  _yargsParser = function _yargsParser() {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function _chalk() {
    return data;
  };

  return data;
}

var _Build = _interopRequireDefault(require("./Build"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const args = (0, _yargsParser().default)(process.argv.slice(2));

if (!args._[0] || args.w || args.watch) {
  var _args$w;

  const watch = (_args$w = args.w) !== null && _args$w !== void 0 ? _args$w : args.watch;
  const cwd = process.cwd();
  const build = new _Build.default({
    cwd,
    watch
  });
  build.step().then(() => null);
} else {
  throw new Error(_chalk().default.red(`Unknown command '${args._}'`));
}