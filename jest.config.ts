export default {
  collectCoverageFrom(memo: string[]) {
    return memo.concat([
      '!src/test.ts',
      '!src/cli.ts',
      '!src/ecma.ts',
      '!src/jestConfig.ts',
      '!src/utils.ts'
    ])
  }
}
