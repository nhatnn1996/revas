import { RevasTouchEvent } from "../../core/Node";
import { clamp, noop } from "../../core/utils";
import { Easing } from "../../core/Animated";

export type RevasScrollEventType = "start" | "scroll" | "end" | "none";

export interface RevasScrollEvent {
  type: RevasScrollEventType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  timestamp: number;
  tid: string;
}

export default class Scroller {
  private _timestamp = 0;
  private _x = new Handler();
  private _y = new Handler();
  private _tid = "";
  private _timer: any;
  private _offset = 0;
  private _count = 0;
  private _current = 0;

  horizontal?: boolean = false;

  constructor(private listener: (e: any) => any) {}

  set maxX(value: number) {
    this._x.max = value;
  }

  get maxX() {
    return this._x.max;
  }

  set maxY(value: number) {
    this._y.max = value;
  }

  get maxY() {
    return this._y.max;
  }

  set pagingX(value: number) {
    this._x.paging = value;
  }

  set pagingY(value: number) {
    this._y.paging = value;
  }

  private _sign(e: RevasTouchEvent) {
    e.scroll = { ...e.scroll, x: true, y: true };
    const stopPropagation = e.scroll.stopPropagation || noop;
    if (this.horizontal) {
      if (this._x.velocity > 0) {
        e.scroll.y = false;
        stopPropagation();
      }
      if (this._x.offset > 0 && this._x.offset < this._x.max) {
        e.scroll.x = false;
      }
    } else {
      if (this._y.velocity > 0) {
        e.scroll.x = false;
        stopPropagation();
      }
      if (this._y.offset > 0 && this._y.offset < this._y.max) {
        e.scroll.y = false;
      }
    }
    e.stopPropagation = () => {
      this.touchEnd();
      stopPropagation();
    };
  }

  private _check(e: RevasTouchEvent) {
    if (this.horizontal && e.scroll && e.scroll.x === false) {
      return this.touchEnd();
    }
    if (!this.horizontal && e.scroll && e.scroll.y === false) {
      return this.touchEnd();
    }
    return true;
  }

  scrollAnimate = (keyEvent: string) => {
    return () => {
      const width = 440;
      const move = 15;
      this._count += move;
      if (this._count <= width) {
        this._timer = requestAnimationFrame(this.scrollAnimate(keyEvent));
        this._x.onMove(move, 1);
        this.emit("scroll");
      } else {
        const surplus = width - (this._count - move);
        if (surplus < move) this._x.onMove(surplus, 1);
        this._count = 0;
        this.emit("end");
      }

      const condition = 15 * 440;
      if (this._x.offset > condition) {
        this._x.setOffset(move);
      }
    };
  };

  keydown = (keyEvent: string) => {
    this._timer = requestAnimationFrame(this.scrollAnimate(keyEvent));
  };

  touchMove = (e: RevasTouchEvent) => {
    if (this._tid && e.touches[this._tid] && this._check(e)) {
      const { x, y } = e.touches[this._tid];
      const duration = e.timestamp - this._timestamp;
      this._timestamp = e.timestamp;
      this.horizontal ? this._x.onMove(x, duration) : this._y.onMove(y, duration);
      this.emit("scroll");
      this._sign(e);
    }
  };

  touchEnd = () => {
    if (this._tid) {
      this._tid = "";
      this._timestamp = Date.now();
      this._x.onEnd();
      this._y.onEnd();
      this._timer = requestAnimationFrame(this.afterEnd);
    }
  };

  afterEnd = () => {
    const timestamp = Date.now();
    const duration = timestamp - this._timestamp;
    this._timestamp = timestamp;
    if (this.horizontal ? this._x.afterEnd(duration) : this._y.afterEnd(duration)) {
      this.emit("scroll");
      this._timer = requestAnimationFrame(this.afterEnd);
    } else {
      this.emit("end");
    }
  };

  emit(type: RevasScrollEventType) {
    this.listener({
      type,
      x: this._x.offset,
      vx: this._x.velocity,
      y: this._y.offset,
      vy: this._y.velocity,
      timestamp: this._timestamp,
      tid: this._tid,
    });
  }

  cancel() {
    cancelAnimationFrame(this._timer);
    this._tid = "";
    this._timestamp = Date.now();
    this._x.onEnd();
    this._y.onEnd();
  }
}

class Handler {
  offset = 0;
  velocity = 20;
  max = -1;
  paging = 0;

  private _last = -1;

  //

  capture(value: number) {
    if (this._last < 0) {
      this._last = value;
    }
  }

  onMove(value: number, duration: number) {
    if (duration > 0) {
      const move = value;
      this.velocity = move / duration; // quảng đường / thời gian = vận tốc
      this.change(move);
    }
  }
  onEnd() {
    if (this._last >= 0) {
      this._last = -1;
    }
  }
  setOffset(value: number) {
    this.offset = value;
  }

  afterEnd(duration: number) {
    if (this._last < 0) {
      const absv = Math.abs(this.velocity);
      if (this.paging > 0 && absv <= 0.5 && this.offset < this.max) {
        // start reset to paging
        const distance = Math.round(this.offset / this.paging + this.velocity) * this.paging - this.offset;
        this.velocity = clamp(distance / 2000 + friction(this.velocity, duration, 0.01), -0.5, 0.5);
        if (Math.abs(distance) > 0.5 || absv > 0.05) {
          const move = this.velocity * duration;
          this.change(move);
          return true;
        } else {
          // end to paging
          this.change(distance);
        }
      } else if (absv > 0.05) {
        // scroll for free
        this.velocity = friction(this.velocity, duration, 0.002);
        const move = this.velocity * duration;
        this.change(move);
        return true;
      } else {
        this.velocity = 0;
      }
    }
    return false;
  }

  change(move: number) {
    const _offset = clamp(this.offset + move, 0, this.max > 0 ? this.max : 0);
    if (_offset !== this.offset) {
      this.offset = _offset;
    } else {
      this.velocity = 0;
    }
  }
}

function friction(v: number, duration: number, factor: number) {
  return v - Math.min(duration * factor, 1) * v;
}
