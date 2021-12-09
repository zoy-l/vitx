import type gulpTypescript from '@vitx/bundles/model/gulp-typescript'
import type typescript from 'typescript'
import path from 'path'
import fs from 'fs'

export default function getTSConfig(cwd: string) {
  try {
    // Typescript can be installed without
    const gulpTs = require('@vitx/bundles/model/gulp-typescript') as typeof gulpTypescript
    const ts = require('typescript') as typeof typescript
    const fileName = 'tsconfig.json'

    const readFile = (filePath: string) => fs.readFileSync(filePath, 'utf-8')

    const rootTsConfig = ts.readConfigFile(path.join(cwd, fileName), readFile)

    if (rootTsConfig.error || !Object.keys(rootTsConfig.config.compilerOptions).length) {
      rootTsConfig.config.compilerOptions = {
        allowSyntheticDefaultImports: true,
        declaration: true,
        skipLibCheck: true,
        module: 'ES2015',
        target: 'esnext',
        moduleResolution: 'node'
      }
    }

    return {
      tsConfig: rootTsConfig.config,
      error: rootTsConfig.error,
      gulpTs
    }
  } catch {
    return {}
  }
}
