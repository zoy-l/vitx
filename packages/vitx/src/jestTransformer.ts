import transformer from 'babel-jest'
import getBabelConifg from './getBabelConifg'

module.exports = transformer.createTransformer!({
  ...getBabelConifg({ target: 'node' }, false, 'cjs'),
  babelrc: false,
  configFile: false
})
