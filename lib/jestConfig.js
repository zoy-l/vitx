"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultConfig;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultConfig(cwd, args) {
  const testMatchTypes = ['spec', 'test'];

  const isLerna = _fs().default.existsSync(_path().default.join(cwd, 'lerna.json'));

  const hasPackage = isLerna && args.package;
  const testMatchPrefix = hasPackage ? `**/packages/${args.package}/` : '';

  const hasSrc = _fs().default.existsSync(_path().default.join(cwd, 'src'));

  if (hasPackage) {
    (0, _assert().default)(_fs().default.existsSync(_path().default.join(cwd, 'packages', args.package)), `You specified --package, but packages/${args.package} does not exists.`);
  }

  return {
    collectCoverageFrom: ['index.{js,jsx,ts,tsx}', hasSrc && 'src/**/*.{js,jsx,ts,tsx}', isLerna && !args.package && 'packages/*/src/**/*.{js,jsx,ts,tsx}', isLerna && args.package && `packages/${args.package}/src/**/*.{js,jsx,ts,tsx}`, '!**/node_modules/**', '!**/typings/**', '!**/types/**', '!**/fixtures/**', '!**/__test__/**', '!**/examples/**', '!**/*.d.ts'].filter(Boolean),
    // resolver: require.resolve('jest-pnp-resolver'),
    // setupFilesAfterEnv: [require.resolve('./helpers/jasmine')],
    // setupFiles: [require.resolve('./helpers/shim')],
    testPathIgnorePatterns: ['/node_modules/', '/fixtures/'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    // moduleNameMapper: {
    //   '\\.(css|less|sass|scss|stylus)$': 'identity-obj-proxy'
    // },
    testMatch: [`${testMatchPrefix}**/?*.(${testMatchTypes.join('|')}).(j|t)s?(x)`],
    transform: {
      '^.+\\.(j|t)sx?$': require.resolve('./helpers/ecma')
    },
    verbose: true
  };
}