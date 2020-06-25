import { Frame } from '../../core/Node';
import { RevasCanvas } from '../../core/Canvas';
export interface DrawTextOptions {
    textStyle: any;
    numberOfLines: number;
    frame: Frame;
    content: string;
}
export declare type MeasureLine = {
    width: number;
    text: string;
};
export declare type MeasureResult = [MeasureLine[], number];
export declare const DEFAULT_MEASURE: MeasureResult;
export declare function applyTextStyle(canvas: RevasCanvas, options: DrawTextOptions): void;
export declare function measureText(canvas: RevasCanvas, options: DrawTextOptions): MeasureResult;
export declare function drawText(canvas: RevasCanvas, options: DrawTextOptions, lines: MeasureLine[]): void;
