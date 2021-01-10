/// <reference types="node" />
import through2 from 'through2';
export interface IBundleOptions {
    esBuild?: true;
    moduleType?: 'esm' | 'cjs';
    extraBabelPlugins?: any[];
    extraBabelPresets?: any[];
    target?: 'node' | 'browser';
    react?: boolean;
    browserFiles?: string[];
    nodeFiles?: string[];
    nodeVersion?: number;
    runtimeHelpers?: boolean;
    disableTypes?: boolean;
    beforeReadWriteStream?: (through?: typeof through2) => NodeJS.ReadWriteStream;
    afterReadWriteStream?: (through?: typeof through2) => NodeJS.ReadWriteStream;
    pkgs?: string[];
    entry?: string;
    output?: string;
}
export interface IBundleOpt extends IBundleOptions {
    entry: string;
    output: string;
}
