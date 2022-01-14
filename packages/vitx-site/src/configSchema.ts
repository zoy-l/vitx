import buildSchema from 'vitx/lib/configSchema'
import Joi from '@vitx/bundles/model/joi'

export default Joi.object({
  name: Joi.string(),
  componentEntry: Joi.string(),
  docEntry: Joi.string(),
  site: Joi.object({
    title: Joi.string(),
    lazy: Joi.boolean(),
    nav: Joi.array(),
    simulator: Joi.boolean(),
    defaultLang: Joi.string(),
    locales: Joi.object()
  }),
  build: buildSchema
})
