import path from 'path'
import fs from 'fs'

export default function getTSConfig(cwd: string) {
  try {
    const glupTs = require('@vitx/bundles/model/gulp-typescript')
    const ts = require('typescript')
    const fileName = 'tsconfig.json'

    const readFile = (filePath: string) => fs.readFileSync(filePath, 'utf-8')
    const rootTsConfig = ts.readConfigFile(path.join(cwd, fileName), readFile)

    if (rootTsConfig.error) {
      rootTsConfig.config.compilerOptions = {
        allowSyntheticDefaultImports: true,
        declaration: true,
        skipLibCheck: true,
        module: 'esnext',
        target: 'esnext',
        moduleResolution: 'node'
      }
    }

    return {
      tsConfig: rootTsConfig.config,
      error: rootTsConfig.error,
      glupTs
    }
  } catch {
    return {}
  }
}
