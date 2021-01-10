import Joi from 'joi'

export default Joi.object({
  pkgs: Joi.array(),
  nodeVersion: Joi.number(),
  target: Joi.string().valid('node', 'browser'),
  moduleType: Joi.string().valid('esm', 'cjs'),
  runtimeHelpers: Joi.boolean(),
  extraBabelPlugins: Joi.array().items(Joi.any()),
  extraBabelPresets: Joi.array().items(Joi.any()),
  extraPostCSSPlugins: Joi.array().items(Joi.any()),
  nodeFiles: Joi.array().items(Joi.string()),
  browserFiles: Joi.array().items(Joi.string()),
  entry: Joi.string(),
  output: Joi.string(),
  lessOptions: Joi.object(),
  esBuild: Joi.boolean(),
  disableTypes: Joi.boolean()
})
