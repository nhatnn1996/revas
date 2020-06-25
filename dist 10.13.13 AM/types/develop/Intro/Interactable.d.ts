import React from 'react';
import { RevasTouchEvent } from '../../revas';
export default class Interactable extends React.Component<any, any> {
    private _start;
    private _tid;
    private _style;
    touchStart: (e: RevasTouchEvent) => void;
    touchMove: (e: RevasTouchEvent) => void;
    render(): JSX.Element;
}
