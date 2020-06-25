import * as React from 'react';
import { DrawTextOptions } from './common/drawText';
import { NodeProps, Node } from '../core/Node';
import { RevasCanvas } from '../core/Canvas';
export declare type TextProps = {
    numberOfLines?: number;
} & NodeProps;
export default class Text extends React.Component<TextProps> {
    state: {
        height: number;
    };
    _measured: import("./common/drawText").MeasureResult;
    _drawed?: DrawTextOptions;
    drawText: (canvas: RevasCanvas, node: Node<any>) => void;
    render(): React.DOMElement<any, Element>;
}
