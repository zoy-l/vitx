import type { Config } from '@jest/types'
import { runCLI } from 'jest'
import path from 'path'
import fs from 'fs'

export interface ITestArgs extends Partial<Parameters<typeof runCLI>['0']> {
  debug?: boolean
  e2e?: boolean
  package?: string
}

export default function defaultConfig(cwd: string): Config.ConfigGlobals {
  const testMatchTypes = ['spec', 'test']
  const hasSrc = fs.existsSync(path.join(cwd, 'src'))

  return {
    collectCoverageFrom: [
      hasSrc && 'src/**/*.{js,jsx,ts,tsx}',
      '!**/node_modules/**',
      '!**/fixtures/**',
      '!**/__test__/**',
      '!**/examples/**',
      '!**/typings/**',
      '!**/types/**',
      '!**/*.d.ts'
    ].filter(Boolean),
    testPathIgnorePatterns: ['/node_modules/'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    testMatch: [`**/?*.(${testMatchTypes.join('|')}).(j|t)s?(x)`],
    verbose: true
  }
}
