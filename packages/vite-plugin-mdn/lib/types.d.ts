import type MarkdownIt from 'markdown-it';
export interface IOptions {
    /**
     * Options passed to Markdown It
     */
    markdownItOptions?: MarkdownIt.Options;
    /**
     * Plugins for Markdown It
     */
    markdownItUses?: (MarkdownIt.PluginSimple | [MarkdownIt.PluginSimple | MarkdownIt.PluginWithOptions<any>, any] | any)[];
    /**
     * A function providing the Markdown It instance gets the ability to apply custom settings/plugins
     */
    markdownItSetup?: (MarkdownIt: MarkdownIt) => void;
    /**
     * Class names for wrapper div
     *
     * @default 'markdown-body'
     */
    wrapperClasses?: string | string[];
    /**
     * Custom tranformations apply before and after the markdown transformation.
     */
    transforms?: {
        before?: (code: string, id: string) => string;
        after?: (code: string, id: string) => string;
    };
    /**
     * Define the framework
     */
    frame: 'vue' | 'react';
    vueTransforms?: (code?: string) => string;
    reactTransforms?: {
        import?: string;
        content?: string;
    };
}
export declare type ResolvedOptions = Required<IOptions>;
