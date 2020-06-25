import { Node, RevasTouchEvent } from "./Node";
import { RevasCanvas } from "./Canvas";
import { AppContextType } from "../components/Context";
export declare class Container {
    private _ready;
    private _next;
    private _reflow;
    private _root?;
    get canvas(): RevasCanvas | void;
    get width(): number;
    get height(): number;
    get scale(): number;
    constructor();
    setRoot(root?: Node<AppContextType>): void;
    handleTouch: (evt: RevasTouchEvent) => void;
    draw: (reflow?: boolean) => void;
    private ready;
}
