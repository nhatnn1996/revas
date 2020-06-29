import * as React from "react";
import { NodeProps, Frame } from "../core/Node";
import Scroller, { RevasScrollEvent } from "./common/Scroller";
import { AnimatedValue } from "../core/Animated";

export type ScrollViewOffset = { x?: number; y?: number };

export type ScrollViewProps = {
  horizontal?: boolean;
  onScroll?: (e: any) => any;
  onScrollStart?: (e: RevasScrollEvent) => any;
  onScrollEnd?: (e: any) => any;
  paging?: boolean | number;
  offset?: ScrollViewOffset;
} & NodeProps;

export default class ScrollView extends React.Component<ScrollViewProps> {
  private _height = -1;
  private _contentHeight = -1;
  private _width = -1;
  private _contentWidth = -1;
  private _innerStyle = {
    translateX: new AnimatedValue(0),
    translateY: new AnimatedValue(0),
    position: "absolute",
    animated: true,
  };
  private _offset: ScrollViewOffset = { x: 0, y: 0 };
  private _scroller = new Scroller((e) => {
    const { x = 0, y = 0 } = this._offset;
    this.props.horizontal ? this._innerStyle.translateX.setValue(x - e.x) : this._innerStyle.translateY.setValue(y - e.y);
    if (e.type === "end") {
      this._isDelay = false;
      if (this.props.onScrollEnd) this.props.onScrollEnd(e);
    }
  });
  private _isDelay: boolean = false;
  private _timeLast: number = 0;
  private _keycodeLast = 0;
  private _isPressDown: boolean = false;
  private _beginKeyPress: boolean = false;

  componentWillUnmount() {
    this._scroller.cancel();
  }

  handleKey = (e: KeyboardEvent) => {
    const keyCode = e.keyCode || e.which;

    this._isDelay = true;
    if (keyCode === 37) {
      this._scroller.keyPressBegin("left");
    }
    if (keyCode === 39) {
      this._scroller.keyPressBegin("right");
    }

    if (keyCode === 40) {
      this._isDelay = false;
    }
  };

  handleKeyUp = () => {
    this._scroller.keyPressEnd();
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKey);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private _onLayout = (frame: Frame) => {
    if (this._width !== frame.width || this._height !== frame.height) {
      this._height = frame.height;
      this._width = frame.width;
      this._checkLayout();
      if (this.props.paging) {
        if (this.props.horizontal) {
          this._scroller.pagingX = this.props.paging === true ? frame.width : this.props.paging;
        } else {
          this._scroller.pagingY = this.props.paging === true ? frame.height : this.props.paging;
        }
      }
    }
    this.props.onLayout && this.props.onLayout(frame);
  };

  private _onContentLayout = (frame: Frame) => {
    const { x = 0, y = 0 } = this._offset;
    const width = frame.width + x;
    const height = frame.height + y;
    if (this._contentWidth !== width || this._contentHeight !== height) {
      this._contentHeight = height;
      this._contentWidth = width;
      this._checkLayout();
    }
  };

  private _checkLayout = () => {
    const maxX = this._contentWidth - this._width;
    const maxY = this._contentHeight - this._height;
    if ((maxX > 0 && maxX !== this._scroller.maxX) || (maxY > 0 && maxY !== this._scroller.maxY)) {
      this._scroller.maxX = maxX;
      this._scroller.maxY = maxY;
      this._scroller.emit("none");
    }
  };

  render() {
    const { children, horizontal, offset, ...others } = this.props;

    this._scroller.horizontal = horizontal;

    if (offset) {
      this._offset = offset;
      this._scroller.emit("none");
    }

    return React.createElement(
      "Scrollable",
      { ...others, onLayout: this._onLayout },
      React.createElement("ScrollContent", {
        // onTouchStart: this._scroller.touchStart,
        // onTouchMove: this._scroller.touchMove,
        // onTouchEnd: this._scroller.touchEnd,
        onLayout: this._onContentLayout,
        style: [
          this._innerStyle,
          {
            flexDirection: horizontal ? "row" : "column",
            [horizontal ? "height" : "width"]: "100%",
          },
        ],
        children,
      })
    );
  }
}
