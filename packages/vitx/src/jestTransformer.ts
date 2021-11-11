import transformer from 'babel-jest'
import getBabelConifg from './getBabelConifg'

export default transformer.createTransformer!({
  ...getBabelConifg({ target: 'node' }, false, 'cjs'),
  babelrc: false,
  configFile: false
})
