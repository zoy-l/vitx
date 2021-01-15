import transformer from 'babel-jest'

module.exports = transformer.createTransformer!({
  presets: [
    [
      '@babel/preset-typescript',
      {
        allowNamespaces: true
      }
    ],
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
        modules: 'commonjs'
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    ['@babel/plugin-transform-modules-commonjs', { lazy: true }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from'
  ],
  babelrc: false,
  configFile: false
})
