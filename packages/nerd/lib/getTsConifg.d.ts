import ts from 'typescript';
export default function getTSConfig(cwd: string, pkgPath: string | undefined): {
    tsConfig: any;
    error: ts.Diagnostic;
};
