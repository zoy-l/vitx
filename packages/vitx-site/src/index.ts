import { URL, fileURLToPath } from 'url'
import fs from 'fs'

const packagePath = fileURLToPath(new URL('../package.json', import.meta.url))
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))

export { compiler } from './compiler'
export const vitxSiteVersion: string = packageJson.version
