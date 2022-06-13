module.exports = {
  collectCoverageFrom(memo) {
    return memo.concat([
      '!packages/vitx/src/cli.ts',
      '!packages/vitx/src/utils.ts',
      '!packages/bundles'
    ])
  },
  transform: {
    '^.+\\.(j|t)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2021'
        },
        sourceMaps: 'inline'
      }
    ]
  }
}
