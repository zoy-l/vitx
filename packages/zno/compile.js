require('@znos/bundles/model/@babel/register')({
  extensions: ['.js', '.ts'],
  presets: [
    '@znos/bundles/model/@babel/preset-typescript',
    '@znos/bundles/model/@babel/preset-env'
  ],
  plugins: [
    '@znos/bundles/model/@babel/plugin-proposal-export-default-from',
    '@znos/bundles/model/@babel/plugin-transform-modules-commonjs',
    '@znos/bundles/model/@babel/plugin-transform-runtime'
  ]
})
