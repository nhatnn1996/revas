'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var tslib = require('tslib');
var ReactReconciler = _interopDefault(require('react-reconciler'));
var bezier = _interopDefault(require('bezier-easing'));
var Yoga = _interopDefault(require('yoga-layout-wasm/asm'));

function View(props) {
    return React.createElement('View', props);
}

function noop() { }
var EMPTY_OBJECT = Object.freeze({});
var EMPTY_ARRAY = Object.freeze([]);
function flatten(array) {
    var flattend = [];
    (function flat(array) {
        array.forEach(function (el) {
            if (Array.isArray(el)) {
                flat(el);
            }
            else {
                flattend.push(el);
            }
        });
    })(array);
    return flattend;
}
var now = typeof performance === 'object' && typeof performance.now === 'function' ? function () { return performance.now(); } : function () { return Date.now(); };
function observeAnimatedValue(value, observer, defaultValue) {
    if (value === undefined) {
        return defaultValue;
    }
    if (value && value.getValue) {
        return value.getValue(observer);
    }
    return value;
}
function applyAnimated(style, callback) {
    if (style.animated) {
        // Animated Styles
        for (var key in style) {
            style[key] = observeAnimatedValue(style[key], callback);
        }
    }
    return style;
}
function getMergedStyleFromNode(node, callback) {
    var _a = node.props.style, style = _a === void 0 ? EMPTY_ARRAY : _a;
    return applyAnimated(Object.assign.apply(Object, tslib.__spreadArrays([{}], flatten([style]))), callback);
}
function getFrameFromNode(node) {
    var frame = node.frame;
    return frame;
}
function sortByZIndexAscending(a, b) {
    var styleA = getMergedStyleFromNode(a);
    var styleB = getMergedStyleFromNode(b);
    return (styleA.zIndex || 0) - (styleB.zIndex || 0);
}
function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}
var ASTRAL_RANGE = /\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]?|[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g;
var WORD_RANGE = /\w+|\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]?|[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g;
function getChars(str) {
    return str.match(ASTRAL_RANGE) || EMPTY_ARRAY;
}
function getWords(str) {
    return str.match(WORD_RANGE) || EMPTY_ARRAY;
}
function setShadow(canvas, color, x, y, blur) {
    if (color) {
        var ctx_1 = canvas.context;
        var shadowBlur_1 = ctx_1.shadowBlur, shadowColor_1 = ctx_1.shadowColor, shadowOffsetX_1 = ctx_1.shadowOffsetX, shadowOffsetY_1 = ctx_1.shadowOffsetY;
        ctx_1.shadowBlur = blur;
        ctx_1.shadowColor = color;
        ctx_1.shadowOffsetX = x;
        ctx_1.shadowOffsetY = y;
        return function resetShadow() {
            ctx_1.shadowBlur = shadowBlur_1;
            ctx_1.shadowColor = shadowColor_1;
            ctx_1.shadowOffsetX = shadowOffsetX_1;
            ctx_1.shadowOffsetY = shadowOffsetY_1;
        };
    }
    return noop;
}
function pushOpacity(canvas, opacity) {
    if (opacity !== null && opacity < 1 && opacity >= 0) {
        var cachedOpacity_1 = canvas.context.globalAlpha || 1;
        canvas.context.globalAlpha = cachedOpacity_1 * opacity;
        return function popOpacity() {
            canvas.context.globalAlpha = cachedOpacity_1;
        };
    }
    return noop;
}
var adapter = {
    createImage: function () { return new Image(); },
};

var DEFAULT_MEASURE = [[], 0];
function measureLines(canvas, chars, boxWidth, numberOfLines) {
    var lines = [];
    var width = 0;
    var text = '';
    var cursor = -1;
    function pushLine(charWidth, char, force) {
        if (charWidth === void 0) { charWidth = 0; }
        if (char === void 0) { char = ''; }
        if (force === void 0) { force = false; }
        if (force || text) {
            lines.push({ width: width, text: text });
        }
        if (cursor < chars.length && numberOfLines > 0 && lines.length >= numberOfLines) {
            var lastLine = lines[lines.length - 1];
            lastLine.text = lastLine.text.slice(0, -2) + "...";
            lastLine.width = canvas.context.measureText(lastLine.text).width;
            cursor = chars.length + 1;
        }
        else {
            width = charWidth;
            text = char.trim();
        }
    }
    while (cursor++ <= chars.length) {
        if (chars.length > cursor) {
            var char = chars[cursor];
            if (char === '\n') {
                pushLine(0, '', true);
            }
            else {
                var charWidth = canvas.context.measureText(char).width;
                if (charWidth + width > boxWidth) {
                    pushLine(charWidth, char);
                }
                else {
                    width += charWidth;
                    text += char;
                }
            }
        }
        else {
            pushLine();
        }
    }
    return lines;
}
function splitContent(content, wordBreak) {
    switch (wordBreak) {
        case 'break-all':
            return getChars(content);
        case 'keep-all':
            return [content];
        default:
            return getWords(content);
    }
}
function applyTextStyle(canvas, options) {
    var _a = options.textStyle, fontStyle = _a.fontStyle, fontWeight = _a.fontWeight, fontSize = _a.fontSize, fontFamily = _a.fontFamily, textBaseline = _a.textBaseline, color = _a.color;
    // Apply Styles
    canvas.context.font = fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;
    canvas.context.fillStyle = color;
    canvas.context.textBaseline = textBaseline;
}
function measureText(canvas, options) {
    var lines = measureLines(canvas, splitContent(options.content, options.textStyle.wordBreak), options.frame.width, options.numberOfLines);
    return [lines, options.textStyle.lineHeight * lines.length];
}
function drawText(canvas, options, lines) {
    var style = options.textStyle, frame = options.frame;
    // Shadow:
    var resetShadow = setShadow(canvas, style.textShadowColor, style.textShadowOffsetX, style.textShadowOffsetY, style.textShadowBlur);
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var x = frame.x;
        switch (style.textAlign) {
            case 'center':
                x = x + frame.width / 2 - line.width / 2;
                break;
            case 'right':
                x = x + frame.width - line.width;
                break;
        }
        canvas.context.fillText(line.text, x, style.lineHeight * (i + 0.5) + frame.y);
    }
    resetShadow();
}

var Text = /** @class */ (function (_super) {
    tslib.__extends(Text, _super);
    function Text() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { height: 0 };
        _this._measured = DEFAULT_MEASURE;
        _this.drawText = function (canvas, node) {
            var content = getTextFromNode(node);
            if (content) {
                var options = {
                    numberOfLines: node.props.numberOfLines || 0,
                    textStyle: getTextStyleFromNode(node),
                    frame: getFrameFromNode(node),
                    content: content,
                };
                applyTextStyle(canvas, options);
                if (textPropsChanged(options, _this._drawed)) {
                    _this._measured = measureText(canvas, options);
                    _this._drawed = options;
                }
                var _a = _this._measured, lines = _a[0], height = _a[1];
                if (height !== _this.state.height) {
                    _this.setState({ height: height });
                }
                else {
                    drawText(canvas, options, lines);
                }
            }
        };
        return _this;
    }
    Text.prototype.render = function () {
        var _a = this.props, children = _a.children, numberOfLines = _a.numberOfLines, others = tslib.__rest(_a, ["children", "numberOfLines"]);
        return React.createElement('View', others, React.createElement('Text', {
            content: children,
            customDrawer: this.drawText,
            textStyle: others.style,
            style: this.state,
            numberOfLines: numberOfLines,
            $ready: Boolean(this._drawed),
        }));
    };
    return Text;
}(React.Component));
var TEXT_STYLES_LIST = [
    'fontStyle',
    'fontWeight',
    'fontSize',
    'fontFamily',
    'textBaseline',
    'wordBreak',
    'lineHeight',
];
var DEFAULT_TEXTSTYLE = {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
    fontWeight: 'normal',
    fontSize: 14,
    color: '#000',
    fontStyle: 'normal',
    textBaseline: 'middle',
};
function textStyleChanged(left, right) {
    for (var i = 0; i < TEXT_STYLES_LIST.length; i++) {
        var item = TEXT_STYLES_LIST[i];
        if (left[item] !== right[item]) {
            return true;
        }
    }
    return false;
}
function textPropsChanged(left, right) {
    if (!right) {
        return true;
    }
    if (left.content !== right.content) {
        return true;
    }
    if (left.numberOfLines !== right.numberOfLines) {
        return true;
    }
    if (left.frame.width !== right.frame.width) {
        return true;
    }
    return textStyleChanged(left.textStyle, right.textStyle);
}
function getTextFromNode(node) {
    var frame = getFrameFromNode(node);
    if (frame.width > 0) {
        var content = node.props.content;
        if (typeof content === 'string') {
            return content;
        }
        else if (Array.isArray(content)) {
            return content.join('');
        }
    }
    return '';
}
function getTextStyleFromNode(node) {
    var style = Object.assign.apply(Object, tslib.__spreadArrays([{}, DEFAULT_TEXTSTYLE], flatten([node.props.textStyle])));
    style.lineHeight = style.lineHeight || style.fontSize * 1.1;
    return applyAnimated(style);
}
// TODO: nested text support

var Frame = /** @class */ (function () {
    function Frame(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Frame;
}());
var Node = /** @class */ (function () {
    function Node(type, props) {
        this.type = type;
        this.props = props;
        this.children = [];
        this.frame = new Frame();
    }
    Object.defineProperty(Node.prototype, "$ready", {
        get: function () {
            if (this.props.$ready === false) {
                return false;
            }
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                if (child.$ready === false) {
                    return false;
                }
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return Node;
}());

function checkAndRemove(parent, child) {
    var index = parent.children.indexOf(child);
    if (index >= 0) {
        parent.children.splice(index, 1);
    }
}
function appendChild(parent, child) {
    checkAndRemove(parent, child);
    parent.children.push(child);
    child.parent = parent;
}
var renderer = ReactReconciler({
    supportsHydration: false,
    supportsPersistence: false,
    supportsMutation: true,
    isPrimaryRenderer: false,
    createInstance: function (type, props) {
        return new Node(type, props);
    },
    createTextInstance: function () {
        throw new Error('Revas: string cannot be child out of <Text/>');
    },
    appendChild: appendChild,
    appendInitialChild: appendChild,
    appendChildToContainer: function (container, instance) {
        if (instance.type !== 'Root') {
            throw new Error("wrong root instance type: " + instance.type);
        }
        container.setRoot(instance);
    },
    removeChild: function (parent, child) {
        checkAndRemove(parent, child);
        child.parent = void 0;
    },
    removeChildFromContainer: function (container) {
        container.setRoot();
    },
    insertBefore: function (parent, child, before) {
        checkAndRemove(parent, child);
        var beforeIndex = parent.children.indexOf(before);
        parent.children.splice(beforeIndex, 0, child);
        child.parent = parent;
    },
    insertInContainerBefore: function () {
        throw new Error("shouldn't be here: insertInContainerBefore");
    },
    finalizeInitialChildren: function () {
        return false;
    },
    getPublicInstance: function (instance) {
        return instance;
    },
    prepareUpdate: function () {
        return true;
    },
    commitUpdate: function (instance, updatePayload, type, oldProps, newProps) {
        instance.props = newProps;
    },
    prepareForCommit: noop,
    resetAfterCommit: function (container) {
        container.draw(true);
    },
    resetTextContent: noop,
    getRootHostContext: function () {
        return {};
    },
    getChildHostContext: function (parentHostContext) {
        return parentHostContext;
    },
    shouldSetTextContent: function () {
        return false;
    },
    shouldDeprioritizeSubtree: function () { return false; },
    scheduleDeferredCallback: noop,
    cancelDeferredCallback: noop,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    noTimeout: -1,
    now: now,
});

var CachedImage = /** @class */ (function () {
    function CachedImage(src) {
        var _this = this;
        this.src = src;
        this.image = adapter.createImage();
        this.targets = [];
        this._ready = false;
        this.onload = function () {
            _this._ready = true;
            renderer.batchedUpdates(function () {
                _this.targets.forEach(function (target) { return target(_this.image); });
            });
        };
        this.onerror = function () { };
        if (!this.image) {
            throw new Error('Revas: createImage must be initialized');
        }
        this.image.onload = this.onload;
        this.image.onerror = this.onerror;
        this.image.src = src;
    }
    Object.defineProperty(CachedImage.prototype, "empty", {
        get: function () {
            return this.targets.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    CachedImage.prototype.add = function (target) {
        if (this.targets.indexOf(target) < 0) {
            this.targets.push(target);
            if (this._ready) {
                target(this.image);
            }
        }
    };
    CachedImage.prototype.remove = function (target) {
        var index = this.targets.indexOf(target);
        this.targets.splice(index, 1);
    };
    return CachedImage;
}());
var cache = new Map();
function get(src, target) {
    if (!cache.has(src)) {
        cache.set(src, new CachedImage(src));
    }
    var cached = cache.get(src);
    target && cached.add(target);
    return cached.image;
}
function remove(src, target) {
    if (cache.has(src)) {
        var cached = cache.get(src);
        cached.remove(target);
        if (cached.empty) {
            cache.delete(src);
        }
    }
}

function drawImage(canvas, node, flags) {
    var image = get(node.props.src);
    if (image.height <= 0) {
        return;
    }
    var frame = getFrameFromNode(node);
    var width = frame.width, height = frame.height, x = frame.x, y = frame.y;
    if (width <= 0 || height <= 0) {
        return;
    }
    var style = getMergedStyleFromNode(node);
    var actualSize = {
        width: image.width,
        height: image.height,
    };
    var focusPoint = style.focusPoint || {
        x: actualSize.width * 0.5,
        y: actualSize.height * 0.5,
    };
    var hasClip = flags.hasRadius && !flags.hasClip;
    if (hasClip) {
        canvas.context.save();
        canvas.context.clip();
    }
    if (style.resizeMode === 'contain') {
        var scale = Math.min(width / actualSize.width, height / actualSize.height) || 1;
        var scaledSize = {
            width: actualSize.width * scale,
            height: actualSize.height * scale,
        };
        // Clip the image to rectangle (sx, sy, sw, sh).
        var sw = Math.round(actualSize.width);
        var sh = Math.round(actualSize.height);
        // Scale the image to dimensions (dw, dh).
        var dw = Math.round(scaledSize.width);
        var dh = Math.round(scaledSize.height);
        // Draw the image on the canvas at coordinates (dx, dy).
        var dx = Math.round((width - scaledSize.width) / 2 + x);
        var dy = Math.round((height - scaledSize.height) / 2 + y);
        canvas.context.drawImage(image, 0, 0, sw, sh, dx, dy, dw, dh);
    }
    else {
        var scale = Math.max(width / actualSize.width, height / actualSize.height) || 1;
        var scaledSize = {
            width: actualSize.width * scale,
            height: actualSize.height * scale,
        };
        // Clip the image to rectangle (sx, sy, sw, sh).
        var sx = Math.round(clamp(width * 0.5 - focusPoint.x * scale, width - scaledSize.width, 0)) * (-1 / scale);
        var sy = Math.round(clamp(height * 0.5 - focusPoint.y * scale, height - scaledSize.height, 0)) * (-1 / scale);
        var sw = Math.round(actualSize.width - sx * 2);
        var sh = Math.round(actualSize.height - sy * 2);
        // Scale the image to dimensions (dw, dh).
        var dw = Math.round(width);
        var dh = Math.round(height);
        // Draw the image on the canvas at coordinates (dx, dy).
        var dx = Math.round(x);
        var dy = Math.round(y);
        canvas.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
    if (hasClip) {
        canvas.context.restore();
    }
}

var DEFAULT_STYLE = { path: true };
var ImageView = /** @class */ (function (_super) {
    tslib.__extends(ImageView, _super);
    function ImageView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            ready: false,
        };
        _this.onReady = function () {
            _this.setState({ ready: true });
        };
        return _this;
    }
    ImageView.prototype.componentDidMount = function () {
        if (this.props.src) {
            get(this.props.src, this.onReady);
        }
    };
    ImageView.prototype.componentDidUpdate = function (prev) {
        if (prev.src !== this.props.src) {
            this.setState({ ready: false });
            if (prev.src) {
                remove(prev.src, this.onReady);
            }
            if (this.props.src) {
                get(this.props.src, this.onReady);
            }
        }
    };
    ImageView.prototype.componentWillUnmount = function () {
        if (this.props.src) {
            remove(this.props.src, this.onReady);
        }
    };
    ImageView.prototype.render = function () {
        return React.createElement('Image', tslib.__assign(tslib.__assign({ customDrawer: this.state.ready ? drawImage : void 0 }, this.props), { style: [DEFAULT_STYLE, this.props.style], $ready: this.state.ready }));
    };
    return ImageView;
}(React.Component));

var AnimatedNode = /** @class */ (function () {
    function AnimatedNode() {
    }
    AnimatedNode.prototype.interpolate = function (inRange, outRange, ease) {
        if (ease === void 0) { ease = Easing.linear; }
        return new AnimatedInterpolate(this, inRange, outRange, ease);
    };
    return AnimatedNode;
}());
var AnimatedValue = /** @class */ (function (_super) {
    tslib.__extends(AnimatedValue, _super);
    function AnimatedValue(_value) {
        var _this = _super.call(this) || this;
        _this._value = _value;
        return _this;
    }
    AnimatedValue.prototype.setValue = function (value) {
        this._value = value;
        if (this._observer) {
            var observer = this._observer;
            this._observer = void 0;
            observer();
        }
    };
    AnimatedValue.prototype.getValue = function (observer) {
        if (observer) {
            this._observer = observer;
        }
        return this._value;
    };
    return AnimatedValue;
}(AnimatedNode));
var AnimatedInterpolate = /** @class */ (function (_super) {
    tslib.__extends(AnimatedInterpolate, _super);
    function AnimatedInterpolate(source, inRange, outRange, ease) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.inRange = inRange;
        _this.outRange = outRange;
        _this.ease = ease;
        return _this;
    }
    // TODO: Check inRange is asc
    AnimatedInterpolate.prototype.getValue = function (observer) {
        var value = this.source.getValue(observer);
        var len = this.inRange.length;
        var i = 1;
        for (; i < len; i++) {
            var x1 = this.inRange[i];
            if (value < x1 || i === len - 1) {
                var x0 = this.inRange[i - 1];
                var y0 = this.outRange[i - 1];
                var y1 = this.outRange[i];
                var percent = (value - x0) / (x1 - x0);
                var result = (y1 - y0) * this.ease(percent) + y0;
                return result;
            }
        }
        return 0;
    };
    return AnimatedInterpolate;
}(AnimatedNode));
var AnimatedTiming = /** @class */ (function () {
    function AnimatedTiming(value, config) {
        var _this = this;
        this.value = value;
        this.config = config;
        this._startTime = 0;
        this._startValue = 0;
        this._next = 0;
        this._loop = function () {
            var duration = Date.now() - _this._startTime;
            if (duration < _this.config.duration) {
                var percent = duration / _this.config.duration;
                var inc = _this._ease(percent) * (_this.config.to - _this._startValue);
                _this.value.setValue(_this._startValue + inc);
                _this._next = requestAnimationFrame(_this._loop);
            }
            else {
                _this.value.setValue(_this.config.to);
                _this._onEnd && requestAnimationFrame(_this._onEnd);
            }
        };
    }
    Object.defineProperty(AnimatedTiming.prototype, "_ease", {
        get: function () {
            return this.config.ease || Easing.linear;
        },
        enumerable: true,
        configurable: true
    });
    AnimatedTiming.prototype.start = function (onEnd) {
        this._startTime = Date.now();
        this._startValue = this.value.getValue();
        this._onEnd = onEnd;
        this._next = requestAnimationFrame(this._loop);
        return this;
    };
    AnimatedTiming.prototype.stop = function () {
        cancelAnimationFrame(this._next);
        return this;
    };
    AnimatedTiming.prototype.promise = function () {
        var _this = this;
        return new Promise(function (resolve) { return (_this._onEnd = resolve); });
    };
    return AnimatedTiming;
}());
function timing(value, config) {
    return new AnimatedTiming(value, config);
}
var ease;
function getEase() {
    if (!ease) {
        ease = bezier(0.42, 0, 1, 1);
    }
    return ease;
}
var Easing = {
    linear: function (t) {
        return t;
    },
    ease: function (t) {
        return getEase()(t);
    },
    /**
     * Runs an easing function forwards.
     */
    in: function (easing) {
        if (easing === void 0) { easing = getEase(); }
        return easing;
    },
    /**
     * Runs an easing function backwards.
     */
    out: function (easing) {
        if (easing === void 0) { easing = getEase(); }
        return function (t) { return 1 - easing(1 - t); };
    },
    /**
     * Makes any easing function symmetrical. The easing function will run
     * forwards for half of the duration, then backwards for the rest of the
     * duration.
     */
    inOut: function (easing) {
        if (easing === void 0) { easing = getEase(); }
        return function (t) {
            if (t < 0.5) {
                return easing(t * 2) / 2;
            }
            return 1 - easing((1 - t) * 2) / 2;
        };
    },
    bounce: function (t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        }
        if (t < 2 / 2.75) {
            var t2_1 = t - 1.5 / 2.75;
            return 7.5625 * t2_1 * t2_1 + 0.75;
        }
        if (t < 2.5 / 2.75) {
            var t2_2 = t - 2.25 / 2.75;
            return 7.5625 * t2_2 * t2_2 + 0.9375;
        }
        var t2 = t - 2.625 / 2.75;
        return 7.5625 * t2 * t2 + 0.984375;
    },
    elastic: function (bounciness) {
        if (bounciness === void 0) { bounciness = 1; }
        var p = bounciness * Math.PI;
        return function (t) { return 1 - Math.pow(Math.cos((t * Math.PI) / 2), 3) * Math.cos(t * p); };
    },
};

var Touchable = /** @class */ (function (_super) {
    tslib.__extends(Touchable, _super);
    function Touchable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._style = {
            opacity: new AnimatedValue(1),
            animated: true
        };
        _this._tid = '';
        _this._onTouchStart = function (e) {
            _this._tid = Object.keys(e.touches)[0];
            _this._start = e.touches[_this._tid];
            _this._style.opacity.setValue(_this.props.activeOpacity);
            _this.props.onPressIn && _this.props.onPressIn();
        };
        _this._onTouchEnd = function (e) {
            if (_this._start && e.touches[_this._tid]) {
                if (Math.abs(_this._start.x - e.touches[_this._tid].x) < 3 &&
                    Math.abs(_this._start.y - e.touches[_this._tid].y) < 3) {
                    _this.props.onPress && _this.props.onPress();
                }
            }
            _this._style.opacity.setValue(1);
            _this.props.onPressOut && _this.props.onPressOut();
        };
        return _this;
    }
    Touchable.prototype.render = function () {
        return React.createElement('Touchable', tslib.__assign(tslib.__assign({ onTouchStart: this._onTouchStart, onTouchEnd: this._onTouchEnd }, this.props), { style: [
                this.props.style,
                this._style
            ] }));
    };
    Touchable.defaultProps = {
        activeOpacity: 0.7
    };
    return Touchable;
}(React.Component));

var Scroller = /** @class */ (function () {
    function Scroller(listener) {
        var _this = this;
        this.listener = listener;
        this._timestamp = 0;
        this._x = new Handler();
        this._y = new Handler();
        this._tid = "";
        this._offset = 0;
        this.horizontal = false;
        this.scrollAnimate = function () {
            var condition = 16 * 420 - 160;
            if (_this._x.offset > condition) {
                _this._x.setOffset(0);
            }
            _this._x.onMove(30, 1000);
            _this.emit("start");
            _this._timer = requestAnimationFrame(_this.scrollAnimate);
        };
        this.touchStart = function (e) {
            _this._timer = requestAnimationFrame(_this.scrollAnimate);
        };
        this.touchMove = function (e) {
            if (_this._tid && e.touches[_this._tid] && _this._check(e)) {
                var _a = e.touches[_this._tid], x = _a.x, y = _a.y;
                var duration = e.timestamp - _this._timestamp;
                _this._timestamp = e.timestamp;
                _this.horizontal ? _this._x.onMove(x, duration) : _this._y.onMove(y, duration);
                _this.emit("scroll");
                _this._sign(e);
            }
        };
        this.touchEnd = function () {
            if (_this._tid) {
                _this._tid = "";
                _this._timestamp = Date.now();
                _this._x.onEnd();
                _this._y.onEnd();
                _this._timer = requestAnimationFrame(_this.afterEnd);
            }
        };
        this.afterEnd = function () {
            var timestamp = Date.now();
            var duration = timestamp - _this._timestamp;
            _this._timestamp = timestamp;
            if (_this.horizontal ? _this._x.afterEnd(duration) : _this._y.afterEnd(duration)) {
                _this.emit("scroll");
                _this._timer = requestAnimationFrame(_this.afterEnd);
            }
            else {
                _this.emit("end");
            }
        };
    }
    Object.defineProperty(Scroller.prototype, "maxX", {
        get: function () {
            return this._x.max;
        },
        set: function (value) {
            this._x.max = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scroller.prototype, "maxY", {
        get: function () {
            return this._y.max;
        },
        set: function (value) {
            this._y.max = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scroller.prototype, "pagingX", {
        set: function (value) {
            this._x.paging = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scroller.prototype, "pagingY", {
        set: function (value) {
            this._y.paging = value;
        },
        enumerable: true,
        configurable: true
    });
    Scroller.prototype._sign = function (e) {
        var _this = this;
        e.scroll = tslib.__assign(tslib.__assign({}, e.scroll), { x: true, y: true });
        var stopPropagation = e.scroll.stopPropagation || noop;
        if (this.horizontal) {
            if (this._x.velocity > 0) {
                e.scroll.y = false;
                stopPropagation();
            }
            if (this._x.offset > 0 && this._x.offset < this._x.max) {
                e.scroll.x = false;
            }
        }
        else {
            if (this._y.velocity > 0) {
                e.scroll.x = false;
                stopPropagation();
            }
            if (this._y.offset > 0 && this._y.offset < this._y.max) {
                e.scroll.y = false;
            }
        }
        e.stopPropagation = function () {
            _this.touchEnd();
            stopPropagation();
        };
    };
    Scroller.prototype._check = function (e) {
        if (this.horizontal && e.scroll && e.scroll.x === false) {
            return this.touchEnd();
        }
        if (!this.horizontal && e.scroll && e.scroll.y === false) {
            return this.touchEnd();
        }
        return true;
    };
    Scroller.prototype.emit = function (type) {
        this.listener({
            type: type,
            x: this._x.offset,
            vx: this._x.velocity,
            y: this._y.offset,
            vy: this._y.velocity,
            timestamp: this._timestamp,
            tid: this._tid,
        });
    };
    Scroller.prototype.cancel = function () {
        cancelAnimationFrame(this._timer);
        this._tid = "";
        this._timestamp = Date.now();
        this._x.onEnd();
        this._y.onEnd();
    };
    return Scroller;
}());
var Handler = /** @class */ (function () {
    function Handler() {
        this.offset = 0;
        this.velocity = 20;
        this.max = -1;
        this.paging = 0;
        this._last = -1;
    }
    //
    Handler.prototype.capture = function (value) {
        if (this._last < 0) {
            this._last = value;
        }
    };
    Handler.prototype.onMove = function (value, duration) {
        if (duration > 0) {
            var move = value;
            this.velocity = move / duration; // quảng đường / thời gian = vận tốc
            this.change(move);
        }
    };
    Handler.prototype.onEnd = function () {
        if (this._last >= 0) {
            this._last = -1;
        }
    };
    Handler.prototype.setOffset = function (value) {
        this.offset = value;
    };
    Handler.prototype.afterEnd = function (duration) {
        if (this._last < 0) {
            var absv = Math.abs(this.velocity);
            if (this.paging > 0 && absv <= 0.5 && this.offset < this.max) {
                // start reset to paging
                var distance = Math.round(this.offset / this.paging + this.velocity) * this.paging - this.offset;
                this.velocity = clamp(distance / 2000 + friction(this.velocity, duration, 0.01), -0.5, 0.5);
                if (Math.abs(distance) > 0.5 || absv > 0.05) {
                    var move = this.velocity * duration;
                    this.change(move);
                    return true;
                }
                else {
                    // end to paging
                    this.change(distance);
                }
            }
            else if (absv > 0.05) {
                // scroll for free
                this.velocity = friction(this.velocity, duration, 0.002);
                var move = this.velocity * duration;
                this.change(move);
                return true;
            }
            else {
                this.velocity = 0;
            }
        }
        return false;
    };
    Handler.prototype.change = function (move) {
        var _offset = clamp(this.offset + move, 0, this.max > 0 ? this.max : 0);
        if (_offset !== this.offset) {
            this.offset = _offset;
        }
        else {
            this.velocity = 0;
        }
    };
    return Handler;
}());
function friction(v, duration, factor) {
    return v - Math.min(duration * factor, 1) * v;
}

var ScrollView = /** @class */ (function (_super) {
    tslib.__extends(ScrollView, _super);
    function ScrollView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._height = -1;
        _this._contentHeight = -1;
        _this._width = -1;
        _this._contentWidth = -1;
        _this._innerStyle = {
            translateX: new AnimatedValue(0),
            translateY: new AnimatedValue(0),
            position: "absolute",
            animated: true,
        };
        _this._offset = { x: 0, y: 0 };
        _this._scroller = new Scroller(function (e) {
            var _a = _this._offset, _b = _a.x, x = _b === void 0 ? 0 : _b, _c = _a.y, y = _c === void 0 ? 0 : _c;
            _this.props.horizontal ? _this._innerStyle.translateX.setValue(x - e.x) : _this._innerStyle.translateY.setValue(y - e.y);
        });
        _this.handleKey = function (e) {
            _this._scroller.touchStart(e);
        };
        _this._onLayout = function (frame) {
            if (_this._width !== frame.width || _this._height !== frame.height) {
                _this._height = frame.height;
                _this._width = frame.width;
                _this._checkLayout();
                if (_this.props.paging) {
                    if (_this.props.horizontal) {
                        _this._scroller.pagingX = _this.props.paging === true ? frame.width : _this.props.paging;
                    }
                    else {
                        _this._scroller.pagingY = _this.props.paging === true ? frame.height : _this.props.paging;
                    }
                }
            }
            _this.props.onLayout && _this.props.onLayout(frame);
        };
        _this._onContentLayout = function (frame) {
            var _a = _this._offset, _b = _a.x, x = _b === void 0 ? 0 : _b, _c = _a.y, y = _c === void 0 ? 0 : _c;
            var width = frame.width + x;
            var height = frame.height + y;
            if (_this._contentWidth !== width || _this._contentHeight !== height) {
                _this._contentHeight = height;
                _this._contentWidth = width;
                _this._checkLayout();
            }
        };
        _this._checkLayout = function () {
            var maxX = _this._contentWidth - _this._width;
            var maxY = _this._contentHeight - _this._height;
            if ((maxX > 0 && maxX !== _this._scroller.maxX) || (maxY > 0 && maxY !== _this._scroller.maxY)) {
                _this._scroller.maxX = maxX;
                _this._scroller.maxY = maxY;
                _this._scroller.emit("none");
            }
        };
        return _this;
    }
    ScrollView.prototype.componentWillUnmount = function () {
        this._scroller.cancel();
    };
    ScrollView.prototype.componentDidMount = function () {
        window.addEventListener("keydown", this.handleKey);
        // window.addEventListener("keyup", this.handleKey);
    };
    ScrollView.prototype.render = function () {
        var _a;
        var _b = this.props, children = _b.children, horizontal = _b.horizontal, offset = _b.offset, others = tslib.__rest(_b, ["children", "horizontal", "offset"]);
        this._scroller.horizontal = horizontal;
        if (offset) {
            this._offset = offset;
            this._scroller.emit("none");
        }
        return React.createElement("Scrollable", tslib.__assign(tslib.__assign({}, others), { onLayout: this._onLayout }), React.createElement("ScrollContent", {
            onTouchStart: this._scroller.touchStart,
            onTouchMove: this._scroller.touchMove,
            onTouchEnd: this._scroller.touchEnd,
            onLayout: this._onContentLayout,
            style: [
                this._innerStyle,
                (_a = {
                        flexDirection: horizontal ? "row" : "column"
                    },
                    _a[horizontal ? "height" : "width"] = "100%",
                    _a),
            ],
            children: children,
        }));
    };
    return ScrollView;
}(React.Component));

var ListView = /** @class */ (function (_super) {
    tslib.__extends(ListView, _super);
    function ListView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            start: 0,
            end: 1,
        };
        _this._height = 0;
        _this.checkVisible = function (y) {
            if (_this._height > 0) {
                var itemHeight = _this.props.itemHeight;
                var _a = _this.state, _start = _a.start, _end = _a.end;
                var start = Math.max(0, Math.floor((y - 10) / itemHeight));
                var end = Math.floor((y + _this._height + 10) / itemHeight);
                if (start !== _start || end !== _end) {
                    _this.setState({ start: start, end: end });
                }
            }
        };
        _this._onScroll = function (e) {
            _this.checkVisible(e.y);
            _this.props.onScroll && _this.props.onScroll(e);
        };
        _this._onLayout = function (frame) {
            if (_this._height !== frame.height) {
                _this._height = frame.height;
            }
            // this._width = frame.width
        };
        _this.renderItem = function (item, i) {
            var _a = _this.props, data = _a.data, renderItem = _a.renderItem;
            var index = i + _this.state.start;
            return React.createElement(React.Fragment, { key: index }, renderItem(item, index, data));
        };
        return _this;
    }
    ListView.prototype.componentDidMount = function () {
        this.checkVisible(0);
    };
    ListView.prototype.render = function () {
        var _a = this.props, data = _a.data, itemHeight = _a.itemHeight;
        var _b = this.state, start = _b.start, end = _b.end;
        // console.log(start, end, this._height);
        return React.createElement(ScrollView, tslib.__assign(tslib.__assign({}, this.props), { onScroll: this._onScroll, onLayout: this._onLayout, offset: { y: start * itemHeight } }), data.slice(start, end + 1).map(this.renderItem));
    };
    return ListView;
}(React.Component));

var DEFAULT_STYLE$1 = { path: true };
var LinearGradient = /** @class */ (function (_super) {
    tslib.__extends(LinearGradient, _super);
    function LinearGradient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinearGradient.prototype.render = function () {
        return React.createElement('LinearGradient', tslib.__assign(tslib.__assign({}, this.props), { style: [DEFAULT_STYLE$1, this.props.style], customDrawer: drawGradient }));
    };
    return LinearGradient;
}(React.Component));
function drawGradient(canvas, node) {
    var colors = node.props.colors;
    if (colors && colors.length > 0) {
        var _a = node.props, _b = _a.start, start = _b === void 0 ? { x: 0, y: 0 } : _b, _c = _a.end, end = _c === void 0 ? { x: 1, y: 0 } : _c;
        var frame = getFrameFromNode(node);
        var grad = canvas.context.createLinearGradient(start.x * frame.width + frame.x, start.y * frame.height + frame.y, end.x * frame.width + frame.x, end.y * frame.height + frame.y);
        for (var i = 0; i < colors.length; i++) {
            grad.addColorStop(i / (colors.length - 1), colors[i]);
        }
        canvas.context.fillStyle = grad;
        canvas.context.fill();
    }
}

var AppContext = React.createContext({
    clientWidth: 0,
    clientHeight: 0,
    deviceRatio: 1,
});
function withContext(comp) {
    comp.contextType = AppContext;
    return comp;
}
function Root(props) {
    return React.createElement(AppContext.Provider, { value: props }, React.createElement('Root', props));
}

var yoga = {};
var promise = Yoga.init().then(function (y) {
    Object.assign(yoga, y);
});

function funcName(key) {
    return "set" + key[0].toUpperCase() + key.substr(1);
}
function checkAndRun(yoga, key) {
    var values = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        values[_i - 2] = arguments[_i];
    }
    if (yoga[key]) {
        yoga[key].apply(yoga, values);
    }
    else {
        throw new Error("ReCanvas: No Such Style Func - " + key);
    }
}
function parseValue(func, value) {
    if (typeof value === 'number') {
        return [func, value];
    }
    else if (value === 'auto') {
        return [func + "Auto"];
    }
    else if (value.endsWith('%')) {
        return [func + "Percent", Number(value.slice(0, -1))];
    }
    else {
        throw new Error("ReCanvas: No Such Style Value - " + value);
    }
}
function parseEnum(func, enums, value) {
    if (enums[value] !== undefined) {
        return [func, enums[value]];
    }
    else {
        throw new Error("ReCanvas: No Such Style Value - " + value);
    }
}
function parseEdge(func, edge, value) {
    if (typeof value === 'number') {
        return [func, edge, value];
    }
    else if (value === 'auto') {
        return [func + "Auto", edge];
    }
    else if (value.endsWith('%')) {
        return [func + "Percent", edge, Number(value.slice(0, -1))];
    }
    else {
        throw new Error("ReCanvas: No Such Style Value - " + value);
    }
}
var STYLE_MAP = {};
function init() {
    var ALIGN_ENUM = {
        auto: yoga.ALIGN_AUTO,
        baseline: yoga.ALIGN_BASELINE,
        center: yoga.ALIGN_CENTER,
        'flex-end': yoga.ALIGN_FLEX_END,
        'flex-start': yoga.ALIGN_FLEX_START,
        'space-around': yoga.ALIGN_SPACE_AROUND,
        'space-between': yoga.ALIGN_SPACE_BETWEEN,
        stretch: yoga.ALIGN_STRETCH,
    };
    var AVAILABLE = {
        VALUE: [
            'flex',
            'width',
            'height',
            'minWidth',
            'maxWidth',
            'minHeight',
            'maxHeight',
            'flexGrow',
            'flexShrink',
            'aspectRatio',
        ],
        ENUM: [
            {
                key: 'justifyContent',
                enum: {
                    center: yoga.JUSTIFY_CENTER,
                    'flex-end': yoga.JUSTIFY_FLEX_END,
                    'flex-start': yoga.JUSTIFY_FLEX_START,
                    'space-around': yoga.JUSTIFY_SPACE_AROUND,
                    'space-between': yoga.JUSTIFY_SPACE_BETWEEN,
                    'space-evenly': yoga.JUSTIFY_SPACE_EVENLY,
                },
            },
            { key: 'alignItems', enum: ALIGN_ENUM },
            { key: 'alignSelf', enum: ALIGN_ENUM },
            { key: 'alignContent', enum: ALIGN_ENUM },
            {
                key: 'flexWrap',
                enum: {
                    'no-wrap': yoga.WRAP_NO_WRAP,
                    wrap: yoga.WRAP_WRAP,
                    'wrap-reverse': yoga.WRAP_WRAP_REVERSE,
                },
            },
            {
                key: 'flexDirection',
                enum: {
                    column: yoga.FLEX_DIRECTION_COLUMN,
                    'column-reverse': yoga.FLEX_DIRECTION_COLUMN_REVERSE,
                    count: yoga.FLEX_DIRECTION_COUNT,
                    row: yoga.FLEX_DIRECTION_ROW,
                    'row-reverse': yoga.FLEX_DIRECTION_ROW_REVERSE,
                },
            },
            {
                key: 'position',
                remap: 'positionType',
                enum: {
                    relative: yoga.POSITION_TYPE_RELATIVE,
                    absolute: yoga.POSITION_TYPE_ABSOLUTE,
                    count: yoga.POSITION_TYPE_COUNT,
                },
            },
        ],
        EDGE: [
            { key: 'padding', remap: 'padding', edge: yoga.EDGE_ALL },
            { key: 'paddingLeft', remap: 'padding', edge: yoga.EDGE_LEFT },
            { key: 'paddingRight', remap: 'padding', edge: yoga.EDGE_RIGHT },
            { key: 'paddingTop', remap: 'padding', edge: yoga.EDGE_TOP },
            { key: 'paddingBottom', remap: 'padding', edge: yoga.EDGE_BOTTOM },
            { key: 'left', remap: 'position', edge: yoga.EDGE_LEFT },
            { key: 'right', remap: 'position', edge: yoga.EDGE_RIGHT },
            { key: 'top', remap: 'position', edge: yoga.EDGE_TOP },
            { key: 'bottom', remap: 'position', edge: yoga.EDGE_BOTTOM },
            { key: 'margin', remap: 'margin', edge: yoga.EDGE_ALL },
            { key: 'marginLeft', remap: 'margin', edge: yoga.EDGE_LEFT },
            { key: 'marginRight', remap: 'margin', edge: yoga.EDGE_RIGHT },
            { key: 'marginTop', remap: 'margin', edge: yoga.EDGE_TOP },
            { key: 'marginBottom', remap: 'margin', edge: yoga.EDGE_BOTTOM },
            { key: 'borderWidth', remap: 'border', edge: yoga.EDGE_ALL },
            { key: 'borderLeftWidth', remap: 'border', edge: yoga.EDGE_LEFT },
            { key: 'borderRightWidth', remap: 'border', edge: yoga.EDGE_RIGHT },
            { key: 'borderTopWidth', remap: 'border', edge: yoga.EDGE_TOP },
            { key: 'borderBottomWidth', remap: 'border', edge: yoga.EDGE_BOTTOM },
        ],
    };
    AVAILABLE.VALUE.forEach(function (key) {
        var func = funcName(key);
        STYLE_MAP[key] = function (value) { return parseValue(func, value); };
    });
    AVAILABLE.ENUM.forEach(function (item) {
        var func = funcName(item.remap || item.key);
        var enums = item.enum;
        STYLE_MAP[item.key] = function (value) { return parseEnum(func, enums, value); };
    });
    AVAILABLE.EDGE.forEach(function (item) {
        var func = funcName(item.remap);
        var edge = item.edge;
        STYLE_MAP[item.key] = function (value) { return parseEdge(func, edge, value); };
    });
}
promise.then(init);
// function _apply(yoga: Yoga.YogaNode, style: any) {
//   for (const key in style) {
//     const func = STYLE_MAP[key]
//     func && checkAndRun(yoga, ...func(style[key]))
//   }
// }
var cache$1 = new WeakMap();
function _apply(yoga, style) {
    if (style) {
        if (!cache$1.has(style)) {
            var _styles = [];
            for (var key in style) {
                var func = STYLE_MAP[key];
                func && _styles.push(func(style[key]));
            }
            cache$1.set(style, _styles);
        }
        var styles = cache$1.get(style);
        for (var i = 0; i < styles.length; i++) {
            checkAndRun.apply(void 0, tslib.__spreadArrays([yoga], styles[i]));
        }
    }
}
function apply(yoga, style) {
    if (style) {
        flatten([style]).forEach(function (s) { return _apply(yoga, s); });
    }
}

function _updateLayout(node) {
    var yoga$1 = yoga.Node.create();
    var children = [];
    apply(yoga$1, node.props.style);
    for (var i = 0; i < node.children.length; i++) {
        var child = node.children[i];
        var _a = _updateLayout(child), f = _a[0], y = _a[1];
        var index = children.push(f);
        yoga$1.insertChild(y, index - 1);
    }
    function process(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _a = yoga$1.getComputedLayout(), left = _a.left, top = _a.top, width = _a.width, height = _a.height;
        node.frame = new Frame(x + left, y + top, width, height);
        node.props.onLayout && node.props.onLayout(node.frame);
        for (var i = 0; i < children.length; i++) {
            children[i](node.frame.x, node.frame.y);
        }
        yoga$1.free();
    }
    return [process, yoga$1];
}
function updateLayout(root) {
    var _a = _updateLayout(root), process = _a[0], yoga$1 = _a[1];
    var _b = root.props, clientWidth = _b.clientWidth, clientHeight = _b.clientHeight, RTL = _b.RTL;
    yoga$1.calculateLayout(clientWidth, clientHeight, RTL ? yoga.DIRECTION_RTL : yoga.DIRECTION_LTR);
    return process;
}

var MAX_SIZE = 30;
var cache$2 = new Map();
var ids = [];
function getCache(id) {
    return cache$2.get(id);
}
function createCache(style, w, h, id) {
    if (ids.length >= MAX_SIZE) {
        var expiredId = ids.shift();
        var canvas = cache$2.get(expiredId).canvas;
        var cached = {
            canvas: adapter.resetOffscreenCanvas(canvas, w, h),
            id: id,
            style: style,
        };
        cache$2.delete(expiredId);
        cache$2.set(cached.id, cached);
        ids.push(cached.id);
        return cached;
    }
    else {
        var cached = {
            canvas: adapter.createOffscreenCanvas(w, h),
            id: id,
            style: style,
        };
        cache$2.set(cached.id, cached);
        ids.push(cached.id);
        return cached;
    }
}
var idCache = new WeakMap();
var __ID = 0;
function autoCacheId(node) {
    if (idCache.has(node)) {
        return idCache.get(node);
    }
    else {
        var id = "$$auto_id-" + __ID++;
        idCache.set(node, id);
        return id;
    }
}

function getRadius(style) {
    return {
        tl: style.borderTopLeftRadius || style.borderRadius || 0,
        tr: style.borderTopRightRadius || style.borderRadius || 0,
        bl: style.borderBottomLeftRadius || style.borderRadius || 0,
        br: style.borderBottomRightRadius || style.borderRadius || 0,
    };
}
function drawNode(canvas, node, container) {
    var style = getMergedStyleFromNode(node, container.draw);
    var frame = getFrameFromNode(node);
    if (style.opacity <= 0) {
        return;
    }
    // flags
    var hasTransform = style.translateX || style.translateY || style.rotate || style.scaleX || style.scaleY || style.scale;
    var hasClip = style.overflow === 'hidden';
    if (hasClip) {
        canvas.context.save();
    }
    else if (hasTransform) {
        canvas.transform.save();
    }
    // Area Range
    // Opacity:
    var popOpacity = pushOpacity(canvas, style.opacity);
    // Translation:
    if (style.translateX || style.translateY) {
        canvas.transform.translate(style.translateX || 0, style.translateY || 0);
    }
    // Rotate && Scale
    if (style.rotate || style.scaleX || style.scaleY || style.scale) {
        // Origin Center
        var originX = frame.x + frame.width / 2;
        var originY = frame.y + frame.height / 2;
        canvas.transform.translate(originX, originY);
        if (style.rotate) {
            canvas.transform.rotate(style.rotate);
        }
        if (style.scaleX || style.scaleY || style.scale) {
            canvas.transform.scale(style.scaleX || style.scale, style.scaleY || style.scale);
        }
        canvas.transform.translate(-originX, -originY);
    }
    if (node.props.cache && adapter.createOffscreenCanvas && frame.height > 0 && frame.width > 0) {
        drawCache(canvas, node, container, style, frame, hasClip);
    }
    else {
        drawContent(canvas, node, container, style, frame, hasClip);
    }
    popOpacity();
    if (hasClip) {
        canvas.context.restore();
    }
    else if (hasTransform) {
        canvas.transform.restore();
    }
}
function drawCache(canvas, node, container, style, frame, hasClip) {
    var cachedId = node.props.cache === true ? autoCacheId(node) : node.props.cache;
    var cached = getCache(cachedId);
    var _a = cached ? cached.style : style, _b = _a.shadowBlur, shadowBlur = _b === void 0 ? 0 : _b, _c = _a.shadowOffsetX, shadowOffsetX = _c === void 0 ? 0 : _c, _d = _a.shadowOffsetY, shadowOffsetY = _d === void 0 ? 0 : _d;
    var spread = shadowBlur * 2;
    var x = frame.x + shadowOffsetX - shadowBlur;
    var y = frame.y + shadowOffsetY - shadowBlur;
    var w = frame.width + spread;
    var h = frame.height + spread;
    if (!cached) {
        if (!node.$ready && !node.props.forceCache) {
            return drawContent(canvas, node, container, style, frame, hasClip);
        }
        cached = createCache(style, w, h, cachedId);
        cached.canvas.transform.translate(-x, -y);
        drawContent(cached.canvas, node, container, style, frame, hasClip);
        cached.canvas.transform.translate(x, y);
    }
    canvas.context.drawImage(cached.canvas.element, x, y, w, h);
}
function drawContent(canvas, node, container, style, frame, hasClip) {
    var hasBG = style.backgroundColor && style.backgroundColor !== 'transparent';
    var hasBorder = style.borderColor && style.borderWidth > 0;
    var hasRadius = style.borderRadius ||
        style.borderTopLeftRadius ||
        style.borderTopRightRadius ||
        style.borderBottomLeftRadius ||
        style.borderBottomRightRadius;
    // consts
    var useFrame = hasBG || hasBorder || hasClip || style.path;
    var usePath = hasRadius || hasClip || style.path;
    if (useFrame) {
        var ctx = canvas.context;
        if (usePath) {
            // Draw Path
            ctx.beginPath();
            if (hasRadius) {
                var radius = getRadius(style);
                ctx.moveTo(frame.x + radius.tl, frame.y);
                ctx.arcTo(frame.x + frame.width, frame.y, frame.x + frame.width, frame.y + frame.height, radius.tr);
                ctx.arcTo(frame.x + frame.width, frame.y + frame.height, frame.x, frame.y + frame.height, radius.br);
                ctx.arcTo(frame.x, frame.y + frame.height, frame.x, frame.y, radius.bl);
                ctx.arcTo(frame.x, frame.y, frame.x + frame.width, frame.y, radius.tl);
            }
            else {
                ctx.rect(frame.x, frame.y, frame.width, frame.height);
            }
            ctx.closePath();
            if (hasClip) {
                ctx.clip();
            }
        }
        if (hasBG || hasBorder) {
            // Shadow:
            var resetShadow = setShadow(canvas, style.shadowColor, style.shadowOffsetX, style.shadowOffsetY, style.shadowBlur);
            // Background color & Shadow
            if (hasBG) {
                ctx.fillStyle = style.backgroundColor;
                if (usePath) {
                    ctx.fill();
                }
                else {
                    ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
                }
            }
            // Border with border radius:
            if (hasBorder) {
                ctx.lineWidth = style.borderWidth;
                ctx.strokeStyle = style.borderColor;
                if (usePath) {
                    ctx.stroke();
                }
                else {
                    ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);
                }
            }
            resetShadow();
        }
    }
    if (node.props.customDrawer) {
        node.props.customDrawer(canvas, node, { hasRadius: hasRadius, hasClip: hasClip });
    }
    // Draw child layers, sorted by their z-index.
    node.children
        .slice()
        .sort(sortByZIndexAscending)
        .forEach(function drawChild(child) {
        drawNode(canvas, child, container);
    });
}

function scaled(x, c, s) {
    if (s === void 0) { s = 1; }
    if (!s && s === 1)
        return x;
    return ((s - 1) * c + x) / s;
}
function findNodeByPoint(node, x, y) {
    if (node.props.pointerEvents === 'none')
        return;
    var children = node.children.slice().sort(sortByZIndexAscending).reverse();
    var style = getMergedStyleFromNode(node);
    var frame = getFrameFromNode(node);
    // tranlate
    var scaleX = style.scaleX || style.scale;
    var scaleY = style.scaleY || style.scale;
    var originX = frame.width / 2 + frame.x;
    var originY = frame.height / 2 + frame.y;
    x -= style.translateX || 0;
    y -= style.translateY || 0;
    x = scaled(x, originX, scaleX);
    y = scaled(y, originY, scaleY);
    if (frame.x < x && frame.y < y
        && x <= frame.x + frame.width
        && y <= frame.y + frame.height) {
        for (var i = 0; i < children.length; i++) {
            var target = findNodeByPoint(children[i], x, y);
            if (target)
                return target;
        }
        if (node.props.pointerEvents === 'box-none')
            return;
        return node;
    }
}
var eventNodeHolder = {};
function getNodeByTouch(root, type, touch) {
    if (type === 'touchstart') {
        var target = findNodeByPoint(root, touch.x, touch.y);
        eventNodeHolder[touch.identifier] = target || root;
        return eventNodeHolder[touch.identifier];
    }
    else if (type === 'touchmove') {
        return eventNodeHolder[touch.identifier] || root;
    }
    else if (type === 'touchend') {
        var target = eventNodeHolder[touch.identifier];
        delete eventNodeHolder[touch.identifier];
        return target || root;
    }
    return root;
}
var LISTENER_MAP = {
    touchstart: 'onTouchStart',
    touchmove: 'onTouchMove',
    touchend: 'onTouchEnd'
};
function emitTouch(node, e) {
    var funcName = LISTENER_MAP[e.type];
    if (funcName) {
        while (node) {
            if (node.props[funcName]
                && node.props.pointerEvents !== 'box-none'
                && node.props[funcName](e) === false)
                return;
            node = node.parent;
        }
    }
}

// import { updateLayout } from './css-layout'
var Container = /** @class */ (function () {
    function Container() {
        var _this = this;
        this._ready = false;
        this._next = false;
        this._reflow = false;
        this.handleTouch = function (evt) {
            var _root = _this._root;
            if (_root) {
                var emitted_1 = new WeakSet();
                Object.values(evt.touches).forEach(function (touch) {
                    var node = getNodeByTouch(_root, evt.type, touch);
                    // check if node is unmounted
                    if (node.parent && !emitted_1.has(node)) {
                        emitted_1.add(node);
                        emitTouch(node, evt);
                    }
                });
            }
        };
        this.draw = function (reflow) {
            if (reflow === void 0) { reflow = false; }
            _this._reflow = _this._reflow || reflow;
            if (!_this._ready) {
                _this._next = true;
                return;
            }
            _this._ready = false;
            var _a = _this, _root = _a._root, canvas = _a.canvas;
            if (canvas) {
                // if not unmounted
                if (_this._reflow) {
                    updateLayout(_root)();
                    _this._reflow = false;
                }
                canvas.context.clearRect(0, 0, _this.width, _this.height);
                drawNode(canvas, _root, _this);
                requestAnimationFrame(_this.ready);
            }
        };
        this.ready = function () {
            _this._ready = true;
            if (_this._next) {
                _this._next = false;
                _this.draw();
            }
        };
        promise.then(this.ready);
    }
    Object.defineProperty(Container.prototype, "canvas", {
        get: function () {
            var _a;
            return (_a = this._root) === null || _a === void 0 ? void 0 : _a.props.canvas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "width", {
        get: function () {
            var _a;
            return ((_a = this._root) === null || _a === void 0 ? void 0 : _a.props.clientWidth) || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "height", {
        get: function () {
            var _a;
            return ((_a = this._root) === null || _a === void 0 ? void 0 : _a.props.clientHeight) || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "scale", {
        get: function () {
            var _a;
            return ((_a = this._root) === null || _a === void 0 ? void 0 : _a.props.deviceRatio) || 1;
        },
        enumerable: true,
        configurable: true
    });
    Container.prototype.setRoot = function (root) {
        this._root = root;
    };
    return Container;
}());

var RevasCanvas = /** @class */ (function () {
    function RevasCanvas(context) {
        this.transform = new Transform(context);
    }
    Object.defineProperty(RevasCanvas.prototype, "context", {
        get: function () {
            return this.transform.context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RevasCanvas.prototype, "element", {
        get: function () {
            return this.context.canvas;
        },
        enumerable: true,
        configurable: true
    });
    return RevasCanvas;
}());
var Transform = /** @class */ (function () {
    function Transform(context) {
        this.context = context;
        this._stack = [];
        this._canGetTransform = false;
        this._canGetTransform = Boolean(context.getTransform);
    }
    Transform.prototype.save = function () {
        if (this._canGetTransform) {
            this._stack.push(this.context.getTransform());
        }
        else {
            this.context.save();
        }
    };
    Transform.prototype.restore = function () {
        if (this._canGetTransform) {
            if (this._stack.length > 0) {
                this.context.setTransform(this._stack.pop());
            }
        }
        else {
            this.context.restore();
        }
    };
    Transform.prototype.translate = function (x, y) {
        this.context.translate(x, y);
    };
    Transform.prototype.rotate = function (rad) {
        this.context.rotate(rad);
    };
    Transform.prototype.scale = function (sx, sy) {
        this.context.scale(sx, sy);
    };
    return Transform;
}());

exports.AnimatedInterpolate = AnimatedInterpolate;
exports.AnimatedNode = AnimatedNode;
exports.AnimatedTiming = AnimatedTiming;
exports.AnimatedValue = AnimatedValue;
exports.AppContext = AppContext;
exports.Container = Container;
exports.EMPTY_ARRAY = EMPTY_ARRAY;
exports.EMPTY_OBJECT = EMPTY_OBJECT;
exports.Easing = Easing;
exports.Frame = Frame;
exports.Image = ImageView;
exports.LinearGradient = LinearGradient;
exports.ListView = ListView;
exports.Node = Node;
exports.RevasCanvas = RevasCanvas;
exports.Root = Root;
exports.ScrollView = ScrollView;
exports.Text = Text;
exports.Touchable = Touchable;
exports.Transform = Transform;
exports.View = View;
exports.adapter = adapter;
exports.applyAnimated = applyAnimated;
exports.clamp = clamp;
exports.flatten = flatten;
exports.getChars = getChars;
exports.getFrameFromNode = getFrameFromNode;
exports.getMergedStyleFromNode = getMergedStyleFromNode;
exports.getWords = getWords;
exports.noop = noop;
exports.now = now;
exports.pushOpacity = pushOpacity;
exports.renderer = renderer;
exports.setShadow = setShadow;
exports.sortByZIndexAscending = sortByZIndexAscending;
exports.timing = timing;
exports.withContext = withContext;
//# sourceMappingURL=revas.common.js.map
