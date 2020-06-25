import * as React from 'react';
import { NodeProps } from '../core/Node';
export default function View(props: NodeProps): React.ReactElement<NodeProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
