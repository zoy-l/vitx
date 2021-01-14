import assert from 'assert'
import path from 'path'
import fs from 'fs'

import { ITestArgs } from './types'

export default function defaultConfig(cwd: string, args: ITestArgs) {
  const testMatchTypes = ['spec', 'test']
  const isLerna = fs.existsSync(path.join(cwd, 'lerna.json'))
  const hasPackage = isLerna && args.package
  const testMatchPrefix = hasPackage ? `**/packages/${args.package}/` : ''
  const hasSrc = fs.existsSync(path.join(cwd, 'src'))

  if (hasPackage) {
    assert(
      fs.existsSync(path.join(cwd, 'packages', args.package!)),
      `You specified --package, but packages/${args.package} does not exists.`
    )
  }

  return {
    collectCoverageFrom: [
      'index.{js,jsx,ts,tsx}',
      hasSrc && 'src/**/*.{js,jsx,ts,tsx}',
      isLerna && !args.package && 'packages/*/src/**/*.{js,jsx,ts,tsx}',
      isLerna &&
        args.package &&
        `packages/${args.package}/src/**/*.{js,jsx,ts,tsx}`,
      '!**/node_modules/**',
      '!**/typings/**',
      '!**/types/**',
      '!**/fixtures/**',
      '!**/__test__/**',
      '!**/examples/**',
      '!**/*.d.ts'
    ].filter(Boolean),
    // resolver: require.resolve('jest-pnp-resolver'),
    // setupFilesAfterEnv: [require.resolve('./helpers/jasmine')],

    // setupFiles: [require.resolve('./helpers/shim')],

    testPathIgnorePatterns: ['/node_modules/', '/fixtures/'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

    // moduleNameMapper: {
    //   '\\.(css|less|sass|scss|stylus)$': 'identity-obj-proxy'
    // },
    testMatch: [
      `${testMatchPrefix}**/?*.(${testMatchTypes.join('|')}).(j|t)s?(x)`
    ],
    transform: {
      '^.+\\.(j|t)sx?$': require.resolve('./helpers/ecma')
    },
    verbose: true,
    // ...(process.env.MAX_WORKERS
    //   ? { maxWorkers: Number(process.env.MAX_WORKERS) }
    //   : {})
  }
}
