import { Node } from '../Node';
import { AppContextType } from '../../components/Context';
export interface YogaNode {
    node: Node;
    style: any;
    layout: any;
    children: YogaNode[];
}
export declare function updateLayout(root: Node<AppContextType>): () => void;
