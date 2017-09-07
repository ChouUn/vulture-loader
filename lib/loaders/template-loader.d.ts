export interface ICompileResult {
    errors: string[];
    code: string;
}
export declare function compileTemplate(template: string, options?: any): ICompileResult;
export declare function TemplateLoader(this: any, content: string): void;
