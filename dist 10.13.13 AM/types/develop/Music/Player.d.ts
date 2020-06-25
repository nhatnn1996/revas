import * as React from 'react';
import { AnimatedValue, AnimatedTiming } from '../../revas';
export interface PlayerProps {
    music: any;
    disabled: boolean;
    transaction: AnimatedValue;
}
declare enum PlayerMode {
    Mini = 0,
    Toggle = 1,
    Full = 2,
    Switch = 3
}
export default class Player extends React.Component<PlayerProps> {
    state: {
        mode: PlayerMode;
        current: any;
        playing: boolean;
    };
    WINDOW_WIDTH: any;
    WINDOW_HEIGHT: any;
    SIZE: number;
    RADIO: number;
    IMAGE_SIZE: number;
    IMAGE_RADIO: number;
    STYLES: {
        cover: {
            justifyContent: string;
            alignItems: string;
            position: string;
            top: number;
            left: number;
            width: number;
            height: number;
            borderRadius: number;
            shadowColor: string;
            shadowOffsetX: number;
            shadowOffsetY: number;
            shadowBlur: number;
            backgroundColor: string;
        };
        coverImage: {
            width: number;
            height: number;
            borderRadius: number;
        };
        main: {
            position: string;
            left: number;
            right: number;
            bottom: number;
            height: number;
            justifyContent: string;
        };
    };
    get transaction(): AnimatedValue;
    audio: HTMLAudioElement;
    rotateHandler?: AnimatedTiming;
    switchHandler?: AnimatedTiming;
    _coverStyle: {
        translateX: import("../../revas").AnimatedInterpolate;
        translateY: import("../../revas").AnimatedInterpolate;
        rotate: AnimatedValue;
        animated: boolean;
    };
    _opacity: {
        opacity: import("../../revas").AnimatedInterpolate;
        animated: boolean;
    };
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    onPlay: () => void;
    _play: () => void;
    next: () => Promise<void>;
    toggle: () => Promise<void>;
    renderMain(): JSX.Element | undefined;
    render(): JSX.Element;
}
export {};
