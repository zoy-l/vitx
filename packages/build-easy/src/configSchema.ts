import Joi from '@build-easy/bundles/model/joi'

export default Joi.object({
  patterns: Joi.func(),
  injectVueCss: Joi.boolean(),
  packageDirName: Joi.string(),
  packages: Joi.array().items(Joi.string()),
  nodeVersion: Joi.number(),
  target: Joi.string().valid('node', 'browser'),
  moduleType: Joi.string().valid('esm', 'cjs', 'all'),
  runtimeHelpers: Joi.boolean(),
  extraBabelPlugins: Joi.array().items(Joi.any()),
  extraBabelPresets: Joi.array().items(Joi.any()),
  extraPostCSSPlugins: Joi.array().items(Joi.any()),
  nodeFiles: Joi.array().items(Joi.string()),
  browserFiles: Joi.array().items(Joi.string()),
  entry: Joi.string(),
  output: Joi.string(),
  lessOptions: Joi.object(),
  tsCompilerOptions: Joi.object(),
  beforeReadWriteStream: Joi.func(),
  afterReadWriteStream: Joi.func(),
  mountedReadWriteStream: Joi.func(),
  alias: Joi.object(),
  mapSources: Joi.func(),
  afterHook: Joi.func(),
  sourcemap: Joi.boolean(),
  frame: Joi.string().valid('react', 'vue')
})
