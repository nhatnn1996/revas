export declare class RevasCanvas {
    readonly transform: Transform;
    constructor(context: CanvasRenderingContext2D);
    get context(): CanvasRenderingContext2D;
    get element(): HTMLCanvasElement;
}
export declare class Transform {
    readonly context: CanvasRenderingContext2D;
    _stack: DOMMatrix[];
    _canGetTransform: boolean;
    constructor(context: CanvasRenderingContext2D);
    save(): void;
    restore(): void;
    translate(x: number, y: number): void;
    rotate(rad: number): void;
    scale(sx: number, sy: number): void;
}
