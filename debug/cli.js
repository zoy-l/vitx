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

var _test = _interopRequireDefault(require("./test"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const args = (0, _yargsParser().default)(process.argv.slice(2));
const commands = ['build', 'test'];

function logError(err) {
  console.error(_chalk().default.red(err));
  process.exit(1);
}

if (commands.includes(args._[0])) {
  const command = args._[0];

  if (command === 'build') {
    var _args$w;

    const watch = (_args$w = args.w) !== null && _args$w !== void 0 ? _args$w : args.watch;
    const cwd = process.cwd();
    const build = new _Build.default({
      cwd,
      watch
    });
    build.step().catch(err => {
      logError(err);
    });
  } else if (command === 'test') {
    (0, _test.default)(args).catch(err => {
      logError(err);
    });
  } else {
    throw new Error(_chalk().default.red(`Unknown command '${args._}'`));
  }
}
//# sourceMappingURL=cli.js.map
