import type { IBundleOptions } from './types';
export default function getBabelConfig(bundleOpts: Omit<IBundleOptions, 'entry' | 'output'>, path?: string): {
    presets: (string | any[])[];
    plugins: (string | any[])[];
};
