declare type AliasMapType = Record<string, string>;
export default function replaceAll(options: {
    ext: string;
    contents: string;
    dirname: string;
    aliasMap: AliasMapType;
}): string;
export {};
