import { jestConfig } from 'vitx'

export default {
  collectCoverageFrom(memo) {
    return memo.concat([
      '!src/jestConfig.ts',
      '!src/cli.ts',
      '!src/jestTransformer.ts',
      '!src/jestRun.ts',
      '!src/utils.ts'
    ])
  }
} as jestConfig
