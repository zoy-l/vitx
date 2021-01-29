import type { IBundleOptions } from './types';
export default function getEsBuildConfig(bundleOpts: IBundleOptions, isBrowser: boolean, path: string): {
    loader: 'ts' | 'js' | 'jsx' | 'tsx';
    target: string;
    format: 'esm' | 'cjs';
    treeShaking: true;
    sourceMaps: boolean | 'inline' | 'external' | 'both';
};
