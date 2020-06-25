/// <reference types="react" />
export interface PanelItemProps {
    label: string;
    children?: any;
    style?: any;
}
export declare function PanelItem(props: PanelItemProps): JSX.Element;
export interface PanelProps {
    label: string;
    children?: any;
    style?: any;
    cache?: boolean;
}
export default function Panel(props: PanelProps): JSX.Element;
