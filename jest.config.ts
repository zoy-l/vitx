import { jestConfig } from 'nerd/'

export default {
  collectCoverageFrom(memo) {
    return memo.concat([
      '!src/test.ts',
      '!src/cli.ts',
      '!src/ecma.ts',
      '!src/jestConfig.ts',
      '!src/utils.ts'
    ])
  }
} as jestConfig
