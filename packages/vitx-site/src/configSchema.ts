import buildSchema from 'vitx/lib/configSchema'
import Joi from '@vitx/bundles/model/joi'

export default Joi.object({
  name: Joi.string(),
  componentEntry: Joi.string(),
  docEntry: Joi.string(),
  site: Joi.object({
    title: Joi.string(),
    lazy: Joi.boolean(),
    defaultLang: Joi.string()
  }),
  components: Joi.object({
    nav: Joi.any().allow(Joi.object(), Joi.array()),
    simulator: Joi.boolean()
  }),
  build: buildSchema
})
