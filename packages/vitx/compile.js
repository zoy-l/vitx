require('@vitx/bundles/model/@babel/register')({
  extensions: ['.js', '.ts'],
  presets: [
    '@vitx/bundles/model/@babel/preset-typescript',
    '@vitx/bundles/model/@babel/preset-env'
  ],
  plugins: [
    '@vitx/bundles/model/@babel/plugin-proposal-export-default-from',
    '@vitx/bundles/model/@babel/plugin-transform-modules-commonjs',
    '@vitx/bundles/model/@babel/plugin-transform-runtime'
  ]
})
