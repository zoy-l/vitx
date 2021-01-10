import { merge } from 'lodash'
import ts from 'typescript'
import path from 'path'
import fs from 'fs'

export default function getTSConfig(cwd: string, pkgPath: string | undefined) {
  const fileName = 'tsconfig.json'

  const readFile = (path: string) => fs.readFileSync(path, 'utf-8')

  const rootTsConfig = ts.readConfigFile(path.join(cwd, fileName), readFile)
  const pkgsConifg = ts.readConfigFile(
    path.join(pkgPath ?? '', fileName),
    readFile
  )

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

  if (!pkgsConifg.error) {
    rootTsConfig.config.compilerOptions = merge(
      rootTsConfig.config.compilerOptions,
      pkgsConifg.config.compilerOptions
    )
  }

  return {
    tsConfig: rootTsConfig.config.compilerOptions,
    error: rootTsConfig.error
  }
}
