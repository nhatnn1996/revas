import * as React from "react";
import { RevasScrollEvent, AnimatedValue } from "../../revas";
import { MusicItemData } from "./data";
export default class MusicApp extends React.Component {
    state: {
        index: number;
        picking: boolean;
    };
    transaction: AnimatedValue;
    style: {
        opacity: AnimatedValue;
        flex: number;
        animated: boolean;
    };
    inner: {
        marginTop: number;
        marginBottom: number;
        height: number;
        flexDirection: string;
    };
    startScroll: () => void;
    checkIndex: (e: RevasScrollEvent) => void;
    renderMusic: (item: MusicItemData, index: number) => JSX.Element;
    render(): JSX.Element;
}
