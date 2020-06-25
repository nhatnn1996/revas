import * as React from 'react';
import ScrollView, { ScrollViewProps } from './ScrollView';
export declare type ListViewProps<T = any> = {
    data: T[];
    renderItem: (item: T, index: number, data: T[]) => React.ReactNode;
    itemHeight: number;
} & ScrollViewProps;
export default class ListView extends React.Component<ListViewProps<any>> {
    state: {
        start: number;
        end: number;
    };
    private _height;
    componentDidMount(): void;
    private checkVisible;
    private _onScroll;
    private _onLayout;
    renderItem: (item: any, i: number) => React.FunctionComponentElement<{
        key: number;
    }>;
    render(): React.CElement<ScrollViewProps, ScrollView>;
}
