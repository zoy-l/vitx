import buildSchema from 'vitx/lib/configSchema'
import Joi from '@vitx/bundles/model/joi'

export default Joi.object({
  name: Joi.string(),
  entry: Joi.string(),
  site: Joi.object({
    title: Joi.string(),
    lazy: Joi.boolean()
  }),
  build: buildSchema
})
