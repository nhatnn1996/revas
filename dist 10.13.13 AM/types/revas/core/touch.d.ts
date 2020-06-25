import { Node, RevasTouchEvent, RevasTouchType, RevasTouch } from "./Node";
export declare function getNodeByTouch(root: Node, type: RevasTouchType, touch: RevasTouch): Node<any>;
export declare function emitTouch(node: Node | void, e: RevasTouchEvent): void;
