import { Component, createElement } from "react";
import renderer from "../core/reconciler";
import { noop } from "../core/utils";
import { Container } from "../core/Container";
import { RevasTouch, RevasTouchEvent } from "../core/Node";
import { RevasCanvas } from "../core/Canvas";
import { clearCache } from "../core/offscreen";
import { Root } from "../components/Context";

function getNodePosition(node: any): [number, number] {
  let top = 0;
  let left = 0;

  while (node) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent;
  }
  return [top, left];
}

function createRevasTouchEvent(e: TouchEvent): RevasTouchEvent {
  e.preventDefault();
  e.stopPropagation();
  const touches: { [key: number]: RevasTouch } = {};
  const type: any = e.type === "touchcancel" ? "touchend" : e.type;
  Object.keys(e.changedTouches).forEach((key: any) => {
    const touch = e.changedTouches[key];
    if (touch && touch.target) {
      const [offsetTop, offsetLeft] = getNodePosition(touch.target);
      touches[touch.identifier] = {
        identifier: touch.identifier,
        x: touch.clientX - offsetLeft,
        y: touch.clientY - offsetTop,
      };
    }
  });
  return { type, touches, timestamp: e.timeStamp || Date.now() };
}

function createCanvas(parent: HTMLElement, scale: number) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("style", "width: 100%; height: 100%;");
  parent.appendChild(canvas);
  canvas.width = canvas.clientWidth * scale;
  canvas.height = canvas.clientHeight * scale;
  return canvas;
}

function createRoot(app: React.ReactNode, dom: HTMLElement, canvas: RevasCanvas) {
  return createElement(
    Root,
    {
      clientWidth: dom.clientWidth,
      clientHeight: dom.clientHeight,
      deviceRatio: window.devicePixelRatio,
      canvas,
    },
    app
  );
}

function initTouch(dom: HTMLElement, handler: (e: any) => any) {
  dom.addEventListener("touchstart", handler, false);
  dom.addEventListener("touchmove", handler, false);
  dom.addEventListener("touchend", handler, false);
  dom.addEventListener("touchcancel", handler, false);
  dom.addEventListener("keypress", handler, false);
  dom.addEventListener("keyup", handler, false);
  dom.addEventListener("keydown", handler, false);
  return () => {
    dom.removeEventListener("touchstart", handler, false);
    dom.removeEventListener("touchmove", handler, false);
    dom.removeEventListener("touchend", handler, false);
    dom.removeEventListener("touchcancel", handler, false);
    dom.removeEventListener("keypress", handler, false);
    dom.removeEventListener("keyup", handler, false);
    dom.removeEventListener("keydown", handler, false);
  };
}

export function render(app: React.ReactNode, parent: HTMLElement, parentComponent?: Component<any>, callback = noop) {
  const scale = window.devicePixelRatio;
  const dom = createCanvas(parent, scale);
  const canvas = new RevasCanvas(dom.getContext("2d")!);
  const container = new Container();
  const destroyTouch = initTouch(dom, (e) => container.handleTouch(createRevasTouchEvent(e)));
  const fiber = renderer.createContainer(container, false, false);

  canvas.transform.scale(scale, scale);
  renderer.updateContainer(createRoot(app, dom, canvas), fiber, parentComponent, callback);

  return {
    get $() {
      return dom;
    },
    update(next = app, callback = noop) {
      dom.width = dom.clientWidth * scale;
      dom.height = dom.clientHeight * scale;
      clearCache();

      canvas.transform.scale(scale, scale);
      renderer.updateContainer(createRoot(next, dom, canvas), fiber, parentComponent, callback);
    },
    unmount(callback = noop) {
      renderer.updateContainer(null, fiber, null, callback);
      destroyTouch();
      clearCache();
      dom.remove();
    },
  };
}
