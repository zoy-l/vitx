import type { IBundleOptions } from './types';
export default function getBabelConfig(bundleOpts: Omit<IBundleOptions, 'entry' | 'output'>, isBrowser?: boolean): {
    presets: (string | any[])[];
    plugins: (string | any[])[];
    sourceMaps: boolean | "inline" | "both";
};
