import { jestConfig } from 'vitx'

export default <jestConfig>{
  collectCoverageFrom(memo) {
    return memo.concat([
      '!packages/vitx/src/jestConfig.ts',
      '!packages/vitx/src/cli.ts',
      '!packages/vitx/src/jestTransformer.ts',
      '!packages/vitx/src/jestRun.ts',
      '!packages/vitx/src/utils.ts'
    ])
  }
}
