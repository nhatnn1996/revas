import * as React from 'react';
import { NodeProps, Node } from '../core/Node';
import { RevasCanvas } from '../core/Canvas';
export declare type LinearGradientProps = {
    start?: {
        x: number;
        y: number;
    };
    end?: {
        x: number;
        y: number;
    };
    colors: string[];
} & NodeProps;
export default class LinearGradient extends React.Component<LinearGradientProps> {
    render(): React.ReactElement<{
        style: any[];
        customDrawer: typeof drawGradient;
        start?: {
            x: number;
            y: number;
        } | undefined;
        end?: {
            x: number;
            y: number;
        } | undefined;
        colors: string[];
        onTouchStart?: import("../core/Node").RevasTouchEventListener | undefined;
        onTouchMove?: import("../core/Node").RevasTouchEventListener | undefined;
        onTouchEnd?: import("../core/Node").RevasTouchEventListener | undefined;
        onLayout?: ((frame: import("../core/Node").Frame) => any) | undefined;
        pointerEvents?: "auto" | "none" | "box-none" | undefined;
        $ready?: boolean | undefined;
        children?: React.ReactNode;
        cache?: string | boolean | undefined;
        forceCache?: boolean | undefined;
    }, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
}
declare function drawGradient(canvas: RevasCanvas, node: Node): void;
export {};
