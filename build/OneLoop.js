/**
* @license
* Copyright 2022 OneLoop.js
* Author: Nicolas Langle
* Repository: https://github.com/n-langle/OneLoop.js
* Version: 5.2.0
* SPDX-License-Identifier: MIT
* 
* Credit for easing functions goes to : https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
* Credit for Emoji regexp goes to : https://medium.com/reactnative/emojis-in-javascript-f693d0eb79fb
*/
var easings = (function() {
    const
        c1 = 1.70158,
        c2 = c1 * 1.525,
        c3 = c1 + 1,
        c4 = (2 * Math.PI) / 3,
        c5 = (2 * Math.PI) / 4.5,
        bounceOut = x => {
            const
                n1 = 7.5625,
                d1 = 2.75;

            return x < 1 / d1
                ? n1 * x * x
                : x < 2 / d1
                    ? n1 * (x -= 1.5 / d1) * x + 0.75
                    : x < 2.5 / d1
                        ? n1 * (x -= 2.25 / d1) * x + 0.9375
                        : n1 * (x -= 2.625 / d1) * x + 0.984375
        };

    return {
        linear: x => x,

        easeInQuad: x => x * x,

        easeOutQuad: x => 1 - (1 - x) * (1 - x),

        easeInOutQuadx: x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,

        easeInCubic: x => x * x * x,

        easeOutCubic: x => 1 - Math.pow(1 - x, 3),

        easeInOutCubic: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,

        easeInQuart: x => x * x * x * x,

        easeOutQuart: x => 1 - Math.pow(1 - x, 4),

        easeInOutQuart: x => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,

        easeInQuint: x => x * x * x * x * x,

        easeOutQuint: x => 1 - Math.pow(1 - x, 5),

        easeInOutQuint: x => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2,

        easeInSine: x => 1 - Math.cos((x * Math.PI) / 2),

        easeOutSine: x => Math.sin((x * Math.PI) / 2),

        easeInOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,

        easeInExpo: x => x === 0 ? 0 : Math.pow(2, 10 * x - 10),

        easeOutExpo: x => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),

        easeInOutExpo: x => x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5
                    ? Math.pow(2, 20 * x - 10) / 2
                    : (2 - Math.pow(2, -20 * x + 10)) / 2,

        easeInCirc: x => 1 - Math.sqrt(1 - Math.pow(x, 2)),

        easeOutCirc: x => Math.sqrt(1 - Math.pow(x - 1, 2)),

        easeInOutCirc: x => x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,

        easeInBack: x => c3 * x * x * x - c1 * x * x,

        easeOutBack: x => 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2),

        easeInOutBack: x => x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2,

        easeInElastic: x => x === 0
            ? 0
            : x === 1
                ? 1
                : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4),

        easeOutElastic: x => x === 0
            ? 0
            : x === 1
                ? 1
                : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1,

        easeInOutElastic: x => x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5
                    ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                    : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1,

        easeInBounce: x => 1 - bounceOut(1 - x),

        easeOutBounce: bounceOut,

        easeInOutBounce: x => x < 0.5
            ? (1 - bounceOut(1 - 2 * x)) / 2
            : (1 + bounceOut(2 * x - 1)) / 2
    }

})();

var now = () => performance.now();

const 
    entries = [];
let raf = null,
    lastTime = null;

// ----
// the loop
// ----
function loop(timestamp) {
    const tick = (timestamp - lastTime) / 16.66;
        
    for (let i = 0; i < entries.length; i++) {					
        if (entries[i].needsUpdate(timestamp)) {
            entries[i].update(timestamp, tick);
        } else {
            entries.splice(i, 1)[0].complete(timestamp, tick);
            i--;
        }
    }

    if (entries.length) {
        lastTime = timestamp;
        raf = requestAnimationFrame(loop);
    } else {
        raf = null;
    }
}

var mainLoop = {
    add(entry) {
        if (entries.indexOf(entry) === -1) {
            entries.push(entry);
            
            if (raf === null) {
                this.start();
            }
        }

        return this
    },

    remove(entry) {
        const index = entries.indexOf(entry);

        if (index > -1) {
            entries.splice(index, 1);
        }

        return this
    },

    start() {
        if (raf === null) { 
            lastTime = now();
            raf = requestAnimationFrame(loop);
        }

        return this
    },

    stop() {
        cancelAnimationFrame(raf);
        raf = null;
        return this
    },

    destroy() {
        entries.length = 0;
        this.stop();
    }
};

function assign() {
    const
        args = arguments,
        rt = args[0];
        

    for (let i = 1; i < args.length; i++) {
        for (let prop in args[i]) {
            if (typeof args[i][prop] !== 'undefined') {
                rt[prop] = args[i][prop];
            }
        }
    }

    return rt
}

var noop = () => {};

class MainLoopEntry {
    constructor(options) {
        assign(this, MainLoopEntry.defaults, options);
    }

    start() {
        mainLoop.add(this);
        this.onStart.call(this, now(), 0);
        return this
    }

    stop() {
        mainLoop.remove(this);
        this.onStop.call(this, now(), 0);
        return this
    }

    update(timestamp, tick) {
        this.onUpdate.call(this, timestamp, tick);
        return this
    }

    complete(timestamp, tick) {
        this.onComplete.call(this, timestamp, tick);
        return this
    }

    needsUpdate() {
        return true
    }
}

// ----
// statics
// ----
MainLoopEntry.defaults = {
    onStart: noop,
    onUpdate: noop,
    onStop: noop,
    onComplete: noop,
};

class Tween extends MainLoopEntry {
    constructor(options) {
        super(assign({}, Tween.defaults, options));

        this._startTime = 0;
        this._range = 1;
        this._executed = 0;
        this._direction = this.reverse ? 1 : 0;
        this._pauseDuration = 0;
        this._pauseTime = null;

        if (this.autoStart) {
            this.start();
        }
    }

    reset() {
        this._pauseTime = null;
        this._range = 1;
        this._executed = 0;
        this._direction = this.reverse ? 1 : 0;

        mainLoop.remove(this);
        this.onUpdate(0, 0, 0);

        return this
    }

    pause() {
        this._pauseTime = now();
        mainLoop.remove(this);
        return this
    }

    start(delay) {

        if (delay !== 0 && !delay) {
            delay = this.delay;
        }

        if (delay === 0) {
            if (!this._pauseTime) {
                if (this.reverse) {
                    this._range = compute[this._direction](this._executed);
                    this._direction = (this._direction + 1) % 2;
                }

                this._pauseDuration = 0;
                this._startTime = now();
                this.onStart(this._startTime, 0, 1 - this._range);
            } else {
                this._pauseDuration += now() - this._pauseTime;
                this._pauseTime = null;
            }

            mainLoop.add(this);
        } else {
            setTimeout(this.start.bind(this, 0), delay);
        }

        return this
    }

    update(timestamp, tick) {
        const
            result = (easings[this.easing]((timestamp - (this._startTime + this._pauseDuration)) / (this.duration * this._range)) * this._range) + 1 - this._range,
            percent = compute[this._direction](result);

        this._executed = percent;

        this.onUpdate(timestamp, tick, percent);

        return this
    }

    complete(timestamp, tick) {
        const lastValue = (this._direction + 1) % 2;

        this._executed = lastValue;
        this._pauseTime = null;

        this.onUpdate(timestamp, tick, lastValue);
        this.onComplete(timestamp, tick, lastValue);

        if (this.loop > 0) {
            this.loop--;
            this.start();
        }

        return this
    }

    needsUpdate(timestamp) {
        return timestamp - (this._startTime + this._pauseDuration) < this.duration * this._range
    }
}

// ----
// statics
// ----
Tween.defaults = {
    delay: 0,
    duration: 1000,
    easing: 'linear',
    loop: 0,
    reverse: false,
    autoStart: true
};

// ----
// utils
// ----
const compute = [
    // forward
    value => value,
    // backward
    value => 1 - value
];

var getElements = (element, context) => typeof element === 'string' ? 
    (context || document).querySelectorAll(element) 
    : 
    element.length >= 0 ? element : [element];

const instances = [];

class ThrottledEvent extends MainLoopEntry {
    constructor(target, eventType, name) {
        super();
        
        const events = {};

        events[eventType + 'start'] = [];
        events[eventType] = [];
        events[eventType + 'end'] = [];

        this._events = events;
        this._needsUpdate = false;
        this._timer = null;
        this._target = target;
        this._eventType = eventType;
        this._event = null;
        this._name = name || '';
        this._reset = () => { this._needsUpdate = false; };
        this._onEvent = (e) => {
            this._event = e;

            if (!this._needsUpdate) {
                this._needsUpdate = true;
                this.start();
                dispatch(this._events[this._eventType + 'start'], e);
            }

            clearTimeout(this._timer);
            this._timer = setTimeout(this._reset, 128);
        };

        this._target.addEventListener(this._eventType, this._onEvent, {passive: true});
    }

    destroy() {
        const index = instances.indexOf(this);

        if (index > -1) {
            instances.splice(index, 1);
        }

        this._target.removeEventListener(this._eventType, this._onEvent);
    }

    add(when, callback) {
        if (this._events[when].indexOf(callback) === -1) {
            this._events[when].push(callback);
        }

        return this
    }

    remove(when, callback) {
        const index = this._events[when].indexOf(callback);

        if (index > -1) {
            this._events[when].splice(index, 1);
        }

        return this
    }

    hasEvent() {
        const
            events = this._events,
            eventType = this._eventType;

        return events[eventType + 'start'].length + events[eventType].length + events[eventType + 'end'].length > 0
    }

    update(timestamp, tick) {
        dispatch(this._events[this._eventType], this._event);
        super.update(timestamp, tick);
        return this
    }

    complete(timestamp, tick) {
        dispatch(this._events[this._eventType + 'end'], this._event);
        super.complete(timestamp, tick);
        return this
    }

    needsUpdate() {
        return this._needsUpdate
    }

    // ----
    // statics
    // ----
    static getInstance(target, eventType, name) {
        let found;

        name = name || '';

        for (let i = 0; i < instances.length; i++) {
            let instance = instances[i];
            if (instance._eventType === eventType && instance._target === target && instance._name === name) {
                found = instances[i];
                break
            }
        }

        if (!found) {
            found = new ThrottledEvent(target, eventType, name);
            instances.push(found);
        }

        return found
    }

    static destroy() {
        while (instances[0]) {
            instances[0].destroy();
        }
    }
}

// ----
// utils
// ----
function dispatch(array, e) {
    for (let i = 0; i < array.length; i++) {
        array[i](e);
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = typeof y === 'number' ? y : this.x;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this
    }

    addScalar(s) {
        this.x += s;
        this.y += s;
        return this
    }

    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this
    }

    subtractScalar(s) {
        this.x -= s;
        this.y -= s;
        return this
    }

    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this
    }

    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        return this
    }

    divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this
    }

    divideScalar(s) {
        this.x /= s;
        this.y /= s;
        return this
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    normalize() {
        return this.divideScalar(this.magnitude())
    }

    reverse() {
        return this.multiplyScalar(-1)
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this
    }

    clone() {
        return new Vector2(this.x, this.y)
    }

    angle() {
        var angle = Math.atan2(this.y, this.x);

        if (angle < 0) angle += 2 * Math.PI;

        return angle
    }

    rotate(angle) {
        var x = this.x;
        this.x = x * Math.cos(angle) - this.y * Math.sin(angle);
        this.y = x * Math.sin(angle) + this.y * Math.cos(angle);
        return this
    }
}

var getDocumentScrollSize = () => new Vector2(document.documentElement.scrollWidth, document.documentElement.scrollHeight);

var getWindowScroll = () => new Vector2(window.pageXOffset, window.pageYOffset);

class ScrollObserverEntry {
    constructor(element, options, scrollInfos) {
        assign(this, ScrollObserverEntry.defaults, options);

        this.element = element;
        this._isInitialised = false;
        this._isVisible = false;
        this.children = this.children ? getElements(this.children, this.element) : [];

        this.refresh(scrollInfos);

        this._isInitialised = true;
    }

    refresh(scrollInfos) {
        const
            bounding = this.element.getBoundingClientRect(),
            elementHeight = bounding.height,
            elementWidth = bounding.width,
            elementRight = bounding.right,
            elementBottom = bounding.bottom,
            windowHeight = window.innerHeight,
            windowWidth = window.innerWidth,
            windowScroll = getWindowScroll(),
            scrollX = windowScroll.x,
            scrollY = windowScroll.y,
            documentScrollSize = getDocumentScrollSize();
        
        // start and distance Relative To Window 
        this.distanceRTW = new Vector2(
            windowWidth + elementWidth,
            windowHeight + elementHeight
        );
        this.startRTW = new Vector2(
            elementRight - this.distanceRTW.x + scrollX,
            elementBottom - this.distanceRTW.y + scrollY
        );

        // start end distance Relative To Element
        this.startRTE = new Vector2(
            Math.max(bounding.left + scrollX - windowWidth, 0),
            Math.max(bounding.top + scrollY - windowHeight, 0)
        );
        this.distanceRTE = new Vector2(
            // Math.min( in header, in footer, without scroll )
            Math.min(elementRight + scrollX - this.startRTE.x, documentScrollSize.x - elementRight - scrollX + elementWidth, documentScrollSize.x - windowWidth),
            Math.min(elementBottom + scrollY - this.startRTE.y, documentScrollSize.y - elementBottom - scrollY + elementHeight, documentScrollSize.y - windowHeight)
        );

        this.control(scrollInfos);

        return this
    }

    control(scrollInfos) {
        const
            scroll = scrollInfos.scroll,
            p1 = scroll.clone().subtract(this.startRTW).divide(this.distanceRTW),
            p2 = scroll.clone().subtract(this.startRTE).divide(this.distanceRTE);

        // prevent NaN error
        // if scrollX or scrollY is equal to window width or height
        p2.set(p2.x || 0, p2.y || 0);

        if ((this.disableCheckOnAxis === 'x' || p1.x >= 0 && p1.x <= 1) && (!this.disableCheckOnAxis === 'y' || p1.y >= 0 && p1.y <= 1)) {
            if (!this._isVisible) {
                this._isVisible = true;
                this.onVisibilityStart.call(this, scrollInfos, getMinOrMax(p1), getMinOrMax(p2));
                this.onVisible.call(this, scrollInfos, getMinOrMax(p1), getMinOrMax(p2));
            }

            this.onVisible.call(this, scrollInfos, p1, p2);

        } else if (this._isVisible || !this._isInitialised) {
            this._isVisible = false;
            
            this.onVisible.call(this, scrollInfos, getMinOrMax(p1), getMinOrMax(p2));
            this.onVisibilityEnd.call(this, scrollInfos, getMinOrMax(p1), getMinOrMax(p2));
        }

        this.onAlways.call(this, scrollInfos, p1, p2);

        return this 
    }
}

// ----
// statics
// ----
ScrollObserverEntry.defaults = {
    children: '',
    disableCheckOnAxis: '',
    onVisible: noop,
    onVisibilityStart: noop,
    onVisibilityEnd: noop,
    onAlways: noop
};

// ----
// utils
// ----
function getMinOrMax(v) {
    return new Vector2(
        Math.min(Math.max(0, Math.round(v.x)), 1),
        Math.min(Math.max(0, Math.round(v.y)), 1)
    )
}

const
    instances$1 = [];
let autoRefreshTimer = null,
    resize = null,
    scroll = null;

class ScrollObserver extends MainLoopEntry {
    constructor(options) {
        super(assign({}, ScrollObserver.defaults, options));

        this._elements = [];
        this._entries = [];
        this._onScroll = () => this.start();
        this._onResize = () => this.refresh();
        this._lastScroll = getWindowScroll();
        this._needsUpdate = true;
        this._lastSize = getDocumentScrollSize();

        resize = resize || new ThrottledEvent(window, 'resize');
        scroll = scroll || new ThrottledEvent(window, 'scroll');

        resize.add('resize', this._onResize);
        scroll.add('scrollstart', this._onScroll);

        instances$1.push(this);
        ScrollObserver.startAutoRefresh();
    }

    destroy() {
        if (this._needsUpdate) {
            this._needsUpdate = false;

            // no need to control the index
            // the flag needsUpdate does the job
            instances$1.splice(instances$1.indexOf(this), 1);

            if (instances$1.length === 0) {
                ScrollObserver.stopAutoRefresh();
                resize.destroy();
                scroll.destroy();
                resize = scroll = null;
            } else {
                resize.remove('resize', this._onResize);
                scroll.remove('scrollstart', this._onScroll);
            }
        }
    }

    observe(element, options) {
        const
            els = getElements(element),
            scrollInfos = this.getScrollInfos();

        for (let i = 0; i < els.length; i++) {
            if (this._elements.indexOf(els[i]) === -1) {
                this._entries.push(new ScrollObserverEntry(els[i], options, scrollInfos));
                this._elements.push(els[i]);
            }
        }

        return this	
    }

    unobserve(element) {
        const els = getElements(element);

        for (let i = 0; i < els.length; i++) {
            let index = this._elements.indexOf(els[i]);
            if (index > -1) {
                this._elements.splice(index, 1);
                this._entries.splice(index, 1);
            }
        }

        return this
    }

    update(timestamp, tick) {
        super.update(timestamp, tick);

        const infos = this.getScrollInfos();

        for (let i = 0; i < this._entries.length; i++) {
            this._entries[i].control(infos);
        }

        this._lastScroll.copy(infos.scroll);

        return this
    }

    needsUpdate() {
        return this._needsUpdate && 
            scroll.needsUpdate() || 
            this.scrollDivider > 1 && 
			getWindowScroll().subtract(this._lastScroll).magnitude() > 1
    }

    hasEntry() {
        return this._entries.length > 0
    }

    getScrollInfos() {
        const
            lastScroll = this._lastScroll,
            scroll = getWindowScroll()
                .subtract(lastScroll)
                .divideScalar(this.scrollDivider)
                .add(lastScroll),
            delta = scroll
                .clone()
                .subtract(lastScroll);
        
        return {
            scroll: scroll,
            delta: delta,
            direction: new Vector2(delta.x / Math.abs(delta.x) || 0, delta.y / Math.abs(delta.y) || 0)
        }
    }

    refresh() {
        const scrollInfos = this.getScrollInfos();
    
        for (let i = 0; i < this._entries.length; i++) {
            this._entries[i].refresh(scrollInfos);
        }

        this.onRefresh.call(this, scrollInfos);

        return this
    }

    synchronise() {
        this._lastScroll = getWindowScroll();
        return this
    }

    // ----
    // statics
    // ----
    static startAutoRefresh() {
        let lastSize = getDocumentScrollSize();

        if (autoRefreshTimer === null && ScrollObserver.autoRefreshDelay !== null) {
            autoRefreshTimer = setInterval(() => {
                const size = getDocumentScrollSize();

                if (lastSize.x !== size.x || lastSize.y !== size.y) {
                    for (let i = 0; i < instances$1.length; i++) {
                        instances$1[i].refresh();
                    }

                    lastSize = size;
                }
            }, ScrollObserver.autoRefreshDelay);
        }
        return this
    }

    static stopAutoRefresh() {
        clearInterval(autoRefreshTimer);
        autoRefreshTimer = null;
        return this
    }

    static destroy() {
        while(instances$1[0]) {
            instances$1[0].destroy();
        }
    }
}

// ----
// statics
// ----
ScrollObserver.defaults = {
    scrollDivider: 1,
    onRefresh: noop
};

ScrollObserver.autoRefreshDelay = 1000;

/* eslint-disable no-empty-character-class */

const 
    instances$2 = [],
    specialCharRegExp = /(((?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])((\u200D(\u2640|\u2642)\uFE0F)|[]))|&([a-zA-Z]{2,6}|#[0-9]{2,5});|<|>)/g,
    whiteCharRegExp = /(\s)/;
let resize$1 = null;
    
class SplittedText {
    constructor(element, options) {
        assign(this, SplittedText.defaults, options);

        this._originalInnerHTML = element.innerHTML;
        this._element = element;
        this._onResize = this.split.bind(this);

        if (!resize$1) {
            resize$1 = new ThrottledEvent(window, 'resize');
        }

        if (this.autoSplit) {
            this.split();
        }

        instances$2.push(this);
    }

    destroy() {
        const index = instances$2.indexOf(this);

        if (index > -1) {
            this.restore();

            instances$2.splice(index, 1);

            if (!instances$2.length) {
                resize$1.destroy();
                resize$1 = null;
            }
        }
    }

    restore() {
        this._element.innerHTML = this._originalInnerHTML;
        resize$1.remove('resize', this._onResize);

        return this
    }

    split() {
        const 
            element = this._element,
            innerHTML = this._originalInnerHTML;

        if (!innerHTML) {
            return this
        }

        if (element.innerHTML !== innerHTML) {
            this.restore();
        }

        if (this.byLine) {
            wrapByWord(element, getStringWrapper('st-word-temp'));
            
            const
                children = element.children,
                lineWrapper = (line, suffix) => line ? this.lineWrapper(line) + suffix : '';
            let line = '',
                html = '',
                lastOffsetTop = children[0].offsetTop;

            resize$1.add('resize', this._onResize);

            for (let i = 0; i < children.length; i++) {
                const
                    child = children[i],
                    offsetTop = child.offsetTop,
                    isBR = child.tagName === 'BR';

                if (lastOffsetTop !== offsetTop || isBR) {
                    html += lineWrapper(line.substring(-1), ' ');
                    line = '';
                }

                if (!isBR) {
                    line += child.outerHTML + ' ';
                } else {
                    html += '<br />';
                }

                lastOffsetTop = offsetTop;
            }

            element.innerHTML = html + lineWrapper(line, '');
            element.innerHTML = unwrap(element, 'st-word-temp');
        }

        if (this.byWord) {
            wrapByWord(element, this.wordWrapper);
        }
    
        if (this.byChar) {
            element.innerHTML = wrapSpecialChar(element, this.charWrapper);
            element.innerHTML = split(
                element,
                '',
                char => !whiteCharRegExp.test(char) ? this.charWrapper(char) : char,
                this.preserve
            );
        }

        return this
    }
}

// ----
// statics
// ----
SplittedText.defaults = {
    autoSplit: true,
    byLine: false,
    byWord: false,
    byChar: false,
    preserve: 'st-char',
    lineWrapper: getStringWrapper('st-line'),
    wordWrapper: getStringWrapper('st-word'),
    charWrapper: getStringWrapper('st-char'),
};

// ----
// utils
// ----
function getStringWrapper(className) {
    return (str) => '<span class="' + className + '">' + str + '</span>'
}

function traverseNode(element, textCallback, nodeCallback) {
    const 
        childNodes = element.childNodes;
    let html = '';

    for (let i = 0; i < childNodes.length; i++) {
        let child = childNodes[i];

        if (child.nodeType === 3) {
            html += textCallback(child.data);
        } else if (child.nodeType === 1) {
            html += nodeCallback(child);
        }
    }
    
    return html
}

function preserveCode(element) {
    return traverseNode(
        element,
        text => text.replace('<', '[<]'),
        child => getNewOuterHTML(child, preserveCode(child))
    )
}

function wrapSpecialChar(element, wrapper) {
    return traverseNode(
        element,
        text => text.replace(specialCharRegExp, wrapper),
        child => getNewOuterHTML(child, wrapSpecialChar(child, wrapper))
    )
}

function split(element, separator, wrapper, preserve) {
    return traverseNode(
        element,
        text => {
            const trimmedText = text.trim();
            const spaceAfter = text.charAt(text.length - 1) === ' ' ? ' ' : '';

            return trimmedText !== '' ?
                (separator === '' ? text : trimmedText).split(separator).map(wrapper).join(separator) + spaceAfter
                : 
                text
        },
        child => {
            return preserve && child.classList.contains(preserve) ?
                child.outerHTML
                :
                getNewOuterHTML(child, split(child, separator, wrapper, preserve))
        }
    )
}

function unwrap(element, className) {
    return traverseNode(
        element,
        text => text,
        child => child.classList.contains(className) ?
            child.innerHTML
            :
            getNewOuterHTML(child, unwrap(child, className))
    )
}

function getNewOuterHTML(node, strReplacement) {
    return node.outerHTML.replace('>' + node.innerHTML + '<', '>' + strReplacement + '<')
}

function wrapByWord(element, wrapper) {
    element.innerHTML = preserveCode(element);
    element.innerHTML = split(element, ' ', wrapper).replace('[<]', '&lt;');
}

// ----
// static
// ----
SplittedText.destroy = function() {
    while (instances$2[0]) {
        instances$2[0].destroy();
    }
};

export { MainLoopEntry, ScrollObserver, SplittedText, ThrottledEvent, Tween, Vector2, easings };
