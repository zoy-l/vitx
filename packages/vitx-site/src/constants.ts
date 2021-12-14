import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const siteTemplate = join(__dirname, '..', 'template')
const siteTemplateCommon = join(siteTemplate, 'common')

export { __dirname, siteTemplate, siteTemplateCommon }
