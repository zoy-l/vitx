require('@build-easy/bundles/model/@babel/register')({
  extensions: ['.js', '.ts'],
  presets: [
    '@build-easy/bundles/model/@babel/preset-typescript',
    '@build-easy/bundles/model/@babel/preset-env'
  ],
  plugins: [
    '@build-easy/bundles/model/@babel/plugin-proposal-export-default-from',
    '@build-easy/bundles/model/@babel/plugin-transform-modules-commonjs',
    '@build-easy/bundles/model/@babel/plugin-transform-runtime'
  ]
})
