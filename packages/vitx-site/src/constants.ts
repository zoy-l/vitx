import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join, isAbsolute } from 'path'
import { existsSync } from 'fs-extra'

async function getConfig() {
  try {
    // https://github.com/nodejs/node/issues/31710
    // absolute file paths don't work on Windows
    return (await import(pathToFileURL(vitxConfigFile).href)).default
  } catch (err) {
    return {}
  }
}

function findRootDir(dir: string): string {
  if (existsSync(join(dir, 'vant.config.mjs'))) {
    return dir
  }

  const parentDir = dirname(dir)
  if (dir === parentDir) {
    return dir
  }

  return findRootDir(parentDir)
}

async function getEntryDir() {
  const config = await getConfig()
  const dir = config['build.entryDir']

  if (dir) {
    if (isAbsolute(dir)) {
      return dir
    }

    return join(root, dir)
  }

  return join(root, 'src')
}

const cwd = process.cwd()
const root = findRootDir(cwd)
const __dirname = dirname(fileURLToPath(import.meta.url))

const vitxConfigFile = join(root, 'vitx.config.js')

const siteTemplate = join(__dirname, '..', 'template')
const siteTemplateCommon = join(siteTemplate, 'common')
const siteEntryDir = await getEntryDir()

export { __dirname, siteTemplate, siteTemplateCommon, siteEntryDir }
