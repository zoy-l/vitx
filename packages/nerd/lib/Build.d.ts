/// <reference types="node" />
import { Diagnostic } from 'typescript';
import type { IBundleOpt, IBundleOptions } from './types';
interface IBuild {
    cwd?: string;
    watch?: boolean;
    userConfig?: IBundleOptions;
    customPrefix?: string;
}
export default class Build {
    cwd: string;
    isLerna: boolean;
    watch: boolean;
    rootConfig: {};
    userConfig?: IBundleOptions;
    customPrefix?: string;
    tsConifgError?: Diagnostic;
    cache: Record<string, string>;
    constructor(options: IBuild);
    logInfo({ pkg, msg }: {
        pkg?: string;
        msg: string;
    }): void;
    applyHook(func: any, args: any): NodeJS.ReadWriteStream;
    addDefaultConfigValue(config: IBundleOptions): IBundleOpt;
    getBundleOpts(cwd: string): IBundleOpt;
    transform(opts: {
        content: string;
        paths: string;
        bundleOpts: IBundleOpt;
        currentDir: string;
    }): import("@nerd/bundles/@babel/core").BabelFileResult;
    isTransform(regExp: RegExp, filePath: string): boolean;
    createStream({ src, pkg, dir, bundleOpts }: {
        pkg?: string;
        dir: string;
        src: string[] | string;
        bundleOpts: IBundleOpt;
    }): any;
    compileLerna(): Promise<void>;
    compile(dir: string, pkg?: string): Promise<void>;
    step(): Promise<void>;
}
export {};
