"use strict";

function _yargsParser() {
  const data = _interopRequireDefault(require("yargs-parser"));

  _yargsParser = function _yargsParser() {
    return data;
  };

  return data;
}

var _jestRun = _interopRequireDefault(require("./jestRun"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const args = (0, _yargsParser().default)(process.argv.slice(2), {
  alias: {
    watch: ['w']
  }
});
(0, _jestRun.default)(args);