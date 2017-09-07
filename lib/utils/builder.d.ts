export default class Builder {
    private root;
    private blockDepth;
    constructor();
    readonly indent: number;
    enterBlock(start: string, end: string, fn: () => void): void;
    addLine(text: string, map?: string): void;
    generate(): {
        code: string;
        map: any;
    };
}
