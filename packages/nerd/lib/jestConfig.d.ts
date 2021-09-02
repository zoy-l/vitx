import { ITestArgs } from './types';
export default function defaultConfig(cwd: string, args: ITestArgs): {
    collectCoverageFrom: string[];
    testPathIgnorePatterns: string[];
    moduleFileExtensions: string[];
    testMatch: string[];
    transform: {
        '^.+\\.(j|t)sx?$': string;
    };
    verbose: boolean;
};
