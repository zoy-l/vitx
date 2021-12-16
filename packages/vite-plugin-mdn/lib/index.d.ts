import type { PluginOption } from 'vite';
import { Options } from './types';
export declare function parseId(id: string): string;
declare function VitePluginMarkdown(options?: Options): PluginOption;
export default VitePluginMarkdown;
