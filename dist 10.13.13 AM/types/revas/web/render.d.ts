import { Component } from "react";
import { noop } from "../core/utils";
export declare function render(app: React.ReactNode, parent: HTMLElement, parentComponent?: Component<any>, callback?: typeof noop): {
    readonly $: HTMLCanvasElement;
    update(next?: import("react").ReactNode, callback?: typeof noop): void;
    unmount(callback?: typeof noop): void;
};
