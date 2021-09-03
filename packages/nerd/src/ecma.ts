import transformer from '@nerd/bundles/model/babel-jest'
import getBabelConifg from './getBabelConifg'

module.exports = transformer.createTransformer({
  ...getBabelConifg({ target: 'node', disableTypes: true }),
  babelrc: false,
  configFile: false
})
