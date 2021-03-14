import type { IBundleOptions } from './types'
import { extname } from 'path'

export default function getEsBuildConfig(
  bundleOpts: IBundleOptions,
  isBrowser: boolean,
  path: string
): {
  loader: 'ts' | 'js' | 'jsx' | 'tsx'
  target: string
  format: 'esm' | 'cjs'
  treeShaking: true
  sourcemap?: boolean
} {
  const { nodeVersion, sourcemap } = bundleOpts

  return {
    loader: extname(path).slice(1) as 'ts' | 'js' | 'jsx' | 'tsx',
    target: isBrowser ? 'chrome58' : `node${nodeVersion ?? 6}`,
    format: isBrowser ? 'esm' : 'cjs',
    treeShaking: true,
    sourcemap
  }
}
