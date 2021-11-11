import transformer from 'babel-jest'
import getBabelConifg from './getBabelConifg'

console.log(getBabelConifg({ target: 'node' }, false, 'cjs'))

module.exports = transformer.createTransformer!({
  ...getBabelConifg({ target: 'node' }, false, 'cjs'),
  babelrc: false,
  configFile: false
})
