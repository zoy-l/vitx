import slash from '@vitx/bundles/model/slash'
import { isDefault } from 'vitx'
import { existsSync } from 'fs'
import { join } from 'path'

export const configFileNames = <const>['vitx.config.ts', 'vitx.config.js']

export async function registerBabel(only: string) {
  // @ts-expect-error test
  await import('@vitx/bundles/model/@babel/register')({
    presets: [
      require.resolve('@vitx/bundles/model/@babel/preset-typescript'),
      require.resolve('@vitx/bundles/model/@babel/preset-env')
    ],
    plugins: [
      '@vitx/bundles/model/@babel/plugin-proposal-export-default-from',
      '@vitx/bundles/model/@babel/plugin-transform-modules-commonjs',
      '@vitx/bundles/model/@babel/plugin-transform-runtime'
    ],
    extensions: ['.js', '.ts'],
    only: [slash(only)],
    babelrc: false,
    cache: false
  })
}

export default async function getConfig(cwd: string) {
  const configFile = configFileNames.map((configName) => join(cwd, configName))
  const userConfig = configFile.find((configPath) => existsSync(configPath))

  let config = {}

  if (userConfig) {
    // https://github.com/facebook/jest/issues/7864
    /* istanbul ignore next */
    process.env.NODE_ENV !== 'test' && (await registerBabel(userConfig))

    config = isDefault(require(userConfig))
  }

  return config
}
