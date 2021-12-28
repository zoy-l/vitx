import path from 'path'

const packageJson = require(path.join(process.cwd(), './package.json'))

export { compiler } from './compiler'
export const vitxSiteVersion: string = packageJson.version
