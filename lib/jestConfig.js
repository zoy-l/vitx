"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultConfig;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultConfig(cwd, args) {
  const testMatchTypes = ['spec', 'test'];

  const hasSrc = _fs().default.existsSync(_path().default.join(cwd, 'src'));

  const isLerna = _fs().default.existsSync(_path().default.join(cwd, 'lerna.json'));

  const hasPackage = isLerna && args.package;
  const testMatchPrefix = hasPackage ? `**/packages/${args.package}/` : '';
  return {
    // preset: 'ts-jest',
    collectCoverageFrom: ['index.{js,jsx,ts,tsx}', hasSrc && 'src/**/*.{js,jsx,ts,tsx}', isLerna && !args.package && 'packages/*/src/**/*.{js,jsx,ts,tsx}', isLerna && args.package && `packages/${args.package}/src/**/*.{js,jsx,ts,tsx}`, '!**/node_modules/**', '!**/fixtures/**', '!**/__test__/**', '!**/examples/**', '!**/typings/**', '!**/types/**', '!**/*.d.ts'].filter(Boolean),
    testPathIgnorePatterns: ['/node_modules/'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    testMatch: [`${testMatchPrefix}**/?*.(${testMatchTypes.join('|')}).(j|t)s?(x)`],
    transform: {
      '^.+\\.(j|t)sx?$': require.resolve('./ecma')
    },
    verbose: true
  };
}