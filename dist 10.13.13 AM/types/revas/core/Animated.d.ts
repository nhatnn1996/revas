export declare abstract class AnimatedNode {
    abstract getValue(observer?: Function): number;
    interpolate(inRange: number[], outRange: number[], ease?: (t: number) => number): AnimatedInterpolate;
}
export declare class AnimatedValue extends AnimatedNode {
    private _value;
    private _observer?;
    constructor(_value: number);
    setValue(value: number): void;
    getValue(observer?: Function): number;
}
export declare class AnimatedInterpolate extends AnimatedNode {
    private source;
    private inRange;
    private outRange;
    private ease;
    constructor(source: AnimatedNode, inRange: number[], outRange: number[], ease: (t: number) => number);
    getValue(observer?: Function): number;
}
export declare type TimingConfig = {
    to: number;
    duration: number;
    ease?: (t: number) => number;
};
export declare class AnimatedTiming {
    private value;
    private config;
    private _startTime;
    private _startValue;
    private _onEnd?;
    private _next;
    constructor(value: AnimatedValue, config: TimingConfig);
    private get _ease();
    start(onEnd?: Function): this;
    stop(): this;
    promise(): Promise<unknown>;
    private _loop;
}
export declare function timing(value: AnimatedValue, config: TimingConfig): AnimatedTiming;
export declare const Easing: {
    linear(t: number): number;
    ease(t: number): number;
    /**
     * Runs an easing function forwards.
     */
    in(easing?: (t: number) => number): (t: number) => number;
    /**
     * Runs an easing function backwards.
     */
    out(easing?: (t: number) => number): (t: number) => number;
    /**
     * Makes any easing function symmetrical. The easing function will run
     * forwards for half of the duration, then backwards for the rest of the
     * duration.
     */
    inOut(easing?: (t: number) => number): (t: number) => number;
    bounce(t: number): number;
    elastic(bounciness?: number): (t: number) => number;
};
