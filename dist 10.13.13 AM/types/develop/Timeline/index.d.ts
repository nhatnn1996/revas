import * as React from 'react';
import { RevasScrollEvent, AnimatedValue } from '../../revas';
export default class TimelineApp extends React.Component<any> {
    WINDOW_HEIGHT: any;
    MAX_LINES: number;
    animated: AnimatedValue;
    onScroll: (e: RevasScrollEvent) => void;
    renderItem: (item: any, index: number) => JSX.Element;
    getItemHeight: () => any;
    render(): JSX.Element;
}
