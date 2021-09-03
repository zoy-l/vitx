require('@nerd/bundles/model/@babel/register')({
  extensions: ['.js', '.ts'],
  presets: [
    '@nerd/bundles/model/@babel/preset-typescript',
    '@nerd/bundles/model/@babel/preset-env'
  ],
  plugins: [
    '@nerd/bundles/model/@babel/plugin-proposal-export-default-from',
    '@nerd/bundles/model/@babel/plugin-transform-modules-commonjs',
    '@nerd/bundles/model/@babel/plugin-transform-runtime'
  ]
})
