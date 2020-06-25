import * as React from 'react';
import { AnimatedValue } from '../../revas';
export interface SimpleRouterProps {
    width: number;
}
export default class SimpleRouter extends React.Component<SimpleRouterProps> {
    state: {
        animating: number;
    };
    pages: React.ReactNode[];
    animated: AnimatedValue;
    style: {
        first: {
            translateX: import("../../revas").AnimatedInterpolate;
            animated: boolean;
        };
        second: {
            opacity: import("../../revas").AnimatedInterpolate;
            scale: import("../../revas").AnimatedInterpolate;
            animated: boolean;
        };
        others: {
            opacity: number;
        };
    };
    push: (Component: any, params?: any) => void;
    _pushAnim: () => void;
    _pushAnimDone: () => void;
    pop: () => void;
    _popAnimDone: () => void;
    getStyle(index: number, pages: any[]): {
        translateX: import("../../revas").AnimatedInterpolate;
        animated: boolean;
    } | {
        opacity: import("../../revas").AnimatedInterpolate;
        scale: import("../../revas").AnimatedInterpolate;
        animated: boolean;
    } | {
        opacity: number;
    };
    id: number;
    renderPage: (page: React.ReactNode, index: number, pages: React.ReactNode[]) => JSX.Element;
    render(): JSX.Element[];
}
