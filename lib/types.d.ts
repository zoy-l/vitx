/// <reference types="node" />
import { options as CliOptions } from 'jest-cli/build/cli/args';
import gulpInsert from 'gulp-insert';
import through2 from 'through2';
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
    beforeReadWriteStream?: (options?: {
        through: typeof through2;
        insert: typeof gulpInsert;
    }) => NodeJS.ReadWriteStream;
    afterReadWriteStream?: (options?: {
        through: typeof through2;
        insert: typeof gulpInsert;
    }) => NodeJS.ReadWriteStream;
    pkgs?: string[];
    entry?: string;
    output?: string;
    paths?: Record<string, string>;
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
export declare type PickedJestCliOptions = {
    [T in keyof typeof CliOptions]?: T extends keyof ITestArgs[T] ? T : typeof CliOptions[T] extends {
        alias: string | undefined;
    } ? ITestArgs[T] : never;
};
