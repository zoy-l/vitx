import transformer from 'babel-jest'
import getBabelConifg from './getBabelConifg'

module.exports = transformer.createTransformer({
  ...getBabelConifg({ target: 'node', disableTypes: true }),
  babelrc: false,
  configFile: false
})
