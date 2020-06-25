import * as React from 'react';
import { BaseProps, RevasTouchEvent } from '../core/Node';
import { AnimatedValue } from '../core/Animated';
export declare type TouchableProps = {
    onPress: Function;
    onPressIn?: Function;
    onPressOut?: Function;
    activeOpacity?: number;
} & BaseProps;
export default class Touchable extends React.Component<TouchableProps> {
    static defaultProps: {
        activeOpacity: number;
    };
    _style: {
        opacity: AnimatedValue;
        animated: boolean;
    };
    private _start?;
    private _tid;
    private _onTouchStart;
    private _onTouchEnd;
    render(): React.ReactElement<{
        style: any[];
        onPress: Function;
        onPressIn?: Function | undefined;
        onPressOut?: Function | undefined;
        activeOpacity?: number | undefined;
        children?: React.ReactNode;
        cache?: string | boolean | undefined;
        forceCache?: boolean | undefined;
        onTouchStart: (e: RevasTouchEvent) => void;
        onTouchEnd: (e: RevasTouchEvent) => void;
    }, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
}
