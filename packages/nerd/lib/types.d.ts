/// <reference types="node" />
import gulpInsert from '@nerd/bundles/model/gulp-insert';
import through2 from '@nerd/bundles/model/through2';
import gulpIf from '@nerd/bundles/model/gulp-if';
import type { Config } from '@jest/types';
import { runCLI } from 'jest';
export interface IBundleOptions {
    esBuild?: boolean;
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
    beforeReadWriteStream?: (options: {
        through: typeof through2;
        insert: typeof gulpInsert;
        gulpIf: typeof gulpIf;
    }) => NodeJS.ReadWriteStream;
    afterReadWriteStream?: (options: {
        through: typeof through2;
        insert: typeof gulpInsert;
        gulpIf: typeof gulpIf;
    }) => NodeJS.ReadWriteStream;
    afterHook?: () => void;
    pkgs?: string[];
    entry?: string;
    output?: string;
    paths?: Record<string, string>;
    lessOptions?: {
        modifyVars?: Record<string, any>;
        paths?: string[];
        plugins?: any[];
        relativeUrls?: boolean;
    };
    sourcemap?: boolean;
}
export interface IBundleOpt extends IBundleOptions {
    entry: string;
    output: string;
}
export declare type ArgsType<T extends (...args: any[]) => any> = T extends (...args: infer U) => any ? U : never;
export interface ITestArgs extends Partial<ArgsType<typeof runCLI>['0']> {
    version?: boolean;
    cwd?: string;
    debug?: boolean;
    e2e?: boolean;
    package?: string;
}
export declare type AnyConfig<T extends Record<string, any>, U extends Record<string, any>> = {
    [V in keyof U]: V extends keyof T ? U[V] extends (...args: any[]) => any ? (argv: T[V]) => T[V] : T[V] : U[V];
};
export declare type CalculatedConfig<T extends Record<string, any>, U extends Record<string, any>> = T & {
    [V in keyof U]: V extends keyof T ? T[V] : U[V];
};
export declare type handleConfig<T> = T extends Record<string, any> ? {
    [key in keyof T]: T[key] | ((value: T[key]) => T[key]);
} : T;
export declare type jestConfig = handleConfig<Config.InitialOptions>;