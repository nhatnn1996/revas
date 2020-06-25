import * as React from "react";
import { NodeProps, Frame } from "../core/Node";
import { RevasScrollEvent } from "./common/Scroller";
export declare type ScrollViewOffset = {
    x?: number;
    y?: number;
};
export declare type ScrollViewProps = {
    horizontal?: boolean;
    onScroll?: (e: RevasScrollEvent) => any;
    onScrollStart?: (e: RevasScrollEvent) => any;
    onScrollEnd?: (e: RevasScrollEvent) => any;
    paging?: boolean | number;
    offset?: ScrollViewOffset;
} & NodeProps;
export default class ScrollView extends React.Component<ScrollViewProps> {
    private _height;
    private _contentHeight;
    private _width;
    private _contentWidth;
    private _innerStyle;
    private _offset;
    private _scroller;
    componentWillUnmount(): void;
    handleKey: (e: KeyboardEvent) => void;
    componentDidMount(): void;
    private _onLayout;
    private _onContentLayout;
    private _checkLayout;
    render(): React.ReactElement<{
        onLayout: (frame: Frame) => void;
        onScroll?: ((e: RevasScrollEvent) => any) | undefined;
        onScrollStart?: ((e: RevasScrollEvent) => any) | undefined;
        onScrollEnd?: ((e: RevasScrollEvent) => any) | undefined;
        paging?: number | boolean | undefined;
        onTouchStart?: import("../core/Node").RevasTouchEventListener | undefined;
        onTouchMove?: import("../core/Node").RevasTouchEventListener | undefined;
        onTouchEnd?: import("../core/Node").RevasTouchEventListener | undefined;
        pointerEvents?: "auto" | "none" | "box-none" | undefined;
        $ready?: boolean | undefined;
        style?: any;
        cache?: string | boolean | undefined;
        forceCache?: boolean | undefined;
    }, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
}
