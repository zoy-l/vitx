require('@zno/bundles/model/@babel/register')({
  extensions: ['.js', '.ts'],
  presets: ['@zno/bundles/model/@babel/preset-typescript', '@zno/bundles/model/@babel/preset-env'],
  plugins: [
    '@zno/bundles/model/@babel/plugin-proposal-export-default-from',
    '@zno/bundles/model/@babel/plugin-transform-modules-commonjs',
    '@zno/bundles/model/@babel/plugin-transform-runtime'
  ]
})
