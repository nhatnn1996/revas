import * as React from "react";
import SimpleRouter from "./common/simple-router";
export default class App extends React.Component {
    router: React.RefObject<SimpleRouter>;
    push: (Comp: any) => () => void;
    componentDidMount(): void;
    open: () => void;
    render(): JSX.Element;
}
