import type { PluginOption } from 'vite';
import { IOptions } from './types';
export declare function parseId(id: string): string;
declare function vitePluginMarkdown(options: IOptions): PluginOption;
export declare function vitePluginMarkdownReact(options: Omit<IOptions, 'frame'>): PluginOption;
export declare function vitePluginMarkdownVue(options: Omit<IOptions, 'frame'>): PluginOption;
export default vitePluginMarkdown;
