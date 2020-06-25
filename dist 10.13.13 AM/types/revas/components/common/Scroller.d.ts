import { RevasTouchEvent } from "../../core/Node";
export declare type RevasScrollEventType = "start" | "scroll" | "end" | "none";
export interface RevasScrollEvent {
    type: RevasScrollEventType;
    x: number;
    y: number;
    vx: number;
    vy: number;
    timestamp: number;
    tid: string;
}
export default class Scroller {
    private listener;
    private _timestamp;
    private _x;
    private _y;
    private _tid;
    private _timer;
    private _offset;
    horizontal?: boolean;
    constructor(listener: (e: any) => any);
    set maxX(value: number);
    get maxX(): number;
    set maxY(value: number);
    get maxY(): number;
    set pagingX(value: number);
    set pagingY(value: number);
    private _sign;
    private _check;
    scrollAnimate: () => void;
    touchStart: (e: any) => void;
    touchMove: (e: RevasTouchEvent) => void;
    touchEnd: () => void;
    afterEnd: () => void;
    emit(type: RevasScrollEventType): void;
    cancel(): void;
}
