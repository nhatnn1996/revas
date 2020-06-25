import { Node } from './Node';
import { RevasCanvas } from './Canvas';
export interface CachedCanvas {
    id: string;
    canvas: RevasCanvas;
    style: any;
}
export declare function getCache(id: string): CachedCanvas | undefined;
export declare function createCache(style: any, w: number, h: number, id: string): CachedCanvas;
export declare function autoCacheId(node: Node): string | undefined;
export declare function clearCache(): void;
