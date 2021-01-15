import { AnyConfig, CalculatedConfig } from './types';
export declare function colorLog(pkg: string): any;
export declare function eventColor(eventType: 'unlink' | 'add' | 'change' | 'addDir' | 'unlinkDir'): string;
export declare function registerBabel(only: string): void;
export declare function isDefault(obj: any): any;
export declare function mergeConfig<T extends Record<string, any>, U extends Record<string, any>>(defaultConfig: T, ...configs: (AnyConfig<T, U> | null | undefined)[]): CalculatedConfig<T, U>;
