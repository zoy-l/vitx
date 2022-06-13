module.exports = {
  collectCoverageFrom(memo) {
    return memo.concat(['!<rootDir>/src/cli.ts', '!<rootDir>/src/utils.ts'])
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
