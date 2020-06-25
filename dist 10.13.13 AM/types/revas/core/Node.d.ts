import { ReactNode } from 'react';
export declare class Frame {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x?: number, y?: number, width?: number, height?: number);
}
export declare class Node<T = any> {
    readonly type: string;
    props: NodeProps & T;
    readonly children: Node[];
    frame: Frame;
    parent?: Node;
    constructor(type: string, props: NodeProps & T);
    get $ready(): boolean;
}
export interface RevasTouch {
    identifier: number;
    x: number;
    y: number;
}
export declare type RevasTouchType = 'touchstart' | 'touchmove' | 'touchend';
export interface RevasTouchEvent {
    type: RevasTouchType;
    touches: {
        [key: string]: RevasTouch;
    };
    timestamp: number;
    [key: string]: any;
}
export declare type RevasTouchEventListener = (event: RevasTouchEvent) => any;
export interface BaseProps {
    children?: ReactNode;
    style?: any | any[];
    cache?: string | boolean;
    forceCache?: boolean;
}
export interface NodeProps extends BaseProps {
    onTouchStart?: RevasTouchEventListener;
    onTouchMove?: RevasTouchEventListener;
    onTouchEnd?: RevasTouchEventListener;
    onLayout?: (frame: Frame) => any;
    pointerEvents?: 'auto' | 'none' | 'box-none';
    $ready?: boolean;
}
