require('@babel/register')({
  extensions: ['.js', '.ts'],
  presets: ['@babel/preset-typescript', '@babel/preset-env'],
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime'
  ]
})
