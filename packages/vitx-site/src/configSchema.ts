import buildSchema from 'vitx/lib/configSchema'
import Joi from '@vitx/bundles/model/joi'

export default Joi.object({
  name: Joi.string(),
  site: Joi.object({
    title: Joi.string()
  }),
  build: buildSchema
})
