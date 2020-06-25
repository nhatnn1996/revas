/// <reference types="react" />
import { RevasCanvas } from '../core/Canvas';
export interface AppContextType {
    clientWidth: number;
    clientHeight: number;
    deviceRatio: number;
    canvas?: RevasCanvas;
    RTL?: boolean;
}
export declare const AppContext: import("react").Context<AppContextType>;
export declare function withContext<T>(comp: T): T;
export declare function Root(props: AppContextType): import("react").FunctionComponentElement<import("react").ProviderProps<AppContextType>>;
