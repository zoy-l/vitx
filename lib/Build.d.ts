/// <reference types="node" />
import { Diagnostic } from 'typescript';
import type { IBundleOpt, IBundleOptions } from './types';
interface IBuild {
    cwd: string;
    watch?: boolean;
}
export default class Build {
    cwd: string;
    isLerna: boolean;
    watch: boolean;
    rootConfig: {};
    tsConifgError: Diagnostic | undefined;
    constructor(options: IBuild);
    logInfo({ pkg, msg }: {
        pkg?: string;
        msg: string;
    }): void;
    addDefaultConfigValue(config: IBundleOptions): IBundleOpt;
    getBundleOpts(cwd: string): IBundleOpt;
    transform(opts: {
        content: string;
        paths: string;
        bundleOpts: IBundleOpt;
        currentDir: string;
    }): string | null | undefined;
    isTransform(regExp: RegExp, filePath: string): boolean;
    createStream({ src, pkg, dir, bundleOpts }: {
        pkg?: string;
        dir: string;
        src: string[] | string;
        bundleOpts: IBundleOpt;
    }): NodeJS.ReadWriteStream;
    compileLerna(): Promise<void>;
    compile(dir: string, pkg?: string): Promise<void>;
    step(): Promise<void>;
}
export {};
