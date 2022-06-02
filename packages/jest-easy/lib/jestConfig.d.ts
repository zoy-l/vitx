import type { Config } from '@jest/types';
import { runCLI } from 'jest';
export interface ITestArgs extends Partial<Parameters<typeof runCLI>['0']> {
    debug?: boolean;
    e2e?: boolean;
    package?: string;
}
export default function defaultConfig(cwd: string): Config.ConfigGlobals;
