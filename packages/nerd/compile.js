require('@nerd/bundles/@babel/register')({
  extensions: ['.js', '.ts'],
  presets: [
    '@nerd/bundles/@babel/preset-typescript',
    '@nerd/bundles/@babel/preset-env'
  ],
  plugins: [
    '@nerd/bundles/@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-class-properties',
    '@nerd/bundles/@babel/plugin-transform-runtime'
  ]
})
