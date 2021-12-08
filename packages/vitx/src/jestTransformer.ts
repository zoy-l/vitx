import transformer from 'babel-jest'
import getBabelConifg from './getBabelConifg'

export default transformer.createTransformer!({
  ...getBabelConifg({ target: 'node', disableTypes: true }, false, 'cjs'),
  babelrc: false,
  configFile: false
}) as any
