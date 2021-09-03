import ts from 'typescript'
import path from 'path'
import fs from 'fs'

export default function getTSConfig(cwd: string) {
  const fileName = 'tsconfig.json'

  const readFile = (path: string) => fs.readFileSync(path, 'utf-8')

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
    error: rootTsConfig.error
  }
}
