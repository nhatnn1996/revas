import * as React from 'react';
import drawImage from './common/drawImage';
import { NodeProps } from '../core/Node';
export declare type ImageViewProps = {
    src: string;
} & NodeProps;
export default class ImageView extends React.Component<ImageViewProps> {
    state: {
        ready: boolean;
    };
    componentDidMount(): void;
    componentDidUpdate(prev: any): void;
    componentWillUnmount(): void;
    onReady: () => void;
    render(): React.ReactElement<{
        style: any[];
        $ready: boolean;
        src: string;
        onTouchStart?: import("../core/Node").RevasTouchEventListener | undefined;
        onTouchMove?: import("../core/Node").RevasTouchEventListener | undefined;
        onTouchEnd?: import("../core/Node").RevasTouchEventListener | undefined;
        onLayout?: ((frame: import("../core/Node").Frame) => any) | undefined;
        pointerEvents?: "auto" | "none" | "box-none" | undefined;
        children?: React.ReactNode;
        cache?: string | boolean | undefined;
        forceCache?: boolean | undefined;
        customDrawer: typeof drawImage | undefined;
    }, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
}
