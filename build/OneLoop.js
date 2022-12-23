/**
* @license
* Copyright 2022 OneLoop.js
* Author: Nicolas Langle
* Repository: https://github.com/n-langle/OneLoop.js
* Version: 5.0.0
* SPDX-License-Identifier: MIT
* 
* Credit for easing functions goes to : https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
* Credit for Emoji regexp goes to : https://medium.com/reactnative/emojis-in-javascript-f693d0eb79fb
*/
var easings = (function() {
    const
        pow = Math.pow,
        sqrt = Math.sqrt,
        sin = Math.sin,
        cos = Math.cos,
        PI = Math.PI,
        c1 = 1.70158,
        c2 = c1 * 1.525,
        c3 = c1 + 1,
        c4 = (2 * PI) / 3,
        c5 = (2 * PI) / 4.5;

    function bounceOut(x) {
        const
            n1 = 7.5625,
            d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    }

    return {
        linear(x) {
            return x;
        },
        easeInQuad(x) {
            return x * x;
        },
        easeOutQuad(x) {
            return 1 - (1 - x) * (1 - x);
        },
        easeInOutQuad(x) {
            return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
        },
        easeInCubic(x) {
            return x * x * x;
        },
        easeOutCubic(x) {
            return 1 - pow(1 - x, 3);
        },
        easeInOutCubic(x) {
            return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
        },
        easeInQuart(x) {
            return x * x * x * x;
        },
        easeOutQuart(x) {
            return 1 - pow(1 - x, 4);
        },
        easeInOutQuart(x) {
            return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
        },
        easeInQuint(x) {
            return x * x * x * x * x;
        },
        easeOutQuint(x) {
            return 1 - pow(1 - x, 5);
        },
        easeInOutQuint(x) {
            return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
        },
        easeInSine(x) {
            return 1 - cos((x * PI) / 2);
        },
        easeOutSine(x) {
            return sin((x * PI) / 2);
        },
        easeInOutSine(x) {
            return -(cos(PI * x) - 1) / 2;
        },
        easeInExpo(x) {
            return x === 0 ? 0 : pow(2, 10 * x - 10);
        },
        easeOutExpo(x) {
            return x === 1 ? 1 : 1 - pow(2, -10 * x);
        },
        easeInOutExpo(x) {
            return x === 0
                ? 0
                : x === 1
                ? 1
                : x < 0.5
                ? pow(2, 20 * x - 10) / 2
                : (2 - pow(2, -20 * x + 10)) / 2;
        },
        easeInCirc(x) {
            return 1 - sqrt(1 - pow(x, 2));
        },
        easeOutCirc(x) {
            return sqrt(1 - pow(x - 1, 2));
        },
        easeInOutCirc(x) {
            return x < 0.5
                ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
                : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
        },
        easeInBack(x) {
            return c3 * x * x * x - c1 * x * x;
        },
        easeOutBack(x) {
            return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
        },
        easeInOutBack(x) {
            return x < 0.5
                ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
        },
        easeInElastic(x) {
            return x === 0
                ? 0
                : x === 1
                ? 1
                : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
        },
        easeOutElastic(x) {
            return x === 0
                ? 0
                : x === 1
                ? 1
                : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
        },
        easeInOutElastic(x) {
            return x === 0
                ? 0
                : x === 1
                ? 1
                : x < 0.5
                ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
                : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
        },
        easeInBounce(x) {
            return 1 - bounceOut(1 - x);
        },
        easeOutBounce: bounceOut,
        easeInOutBounce(x) {
            return x < 0.5
                ? (1 - bounceOut(1 - 2 * x)) / 2
                : (1 + bounceOut(2 * x - 1)) / 2;
        }
    };

})();

const entries = [];
let raf = null;

var mainLoop = {
    add(entry) {
        if (entries.indexOf(entry) === -1) {
            entries.push(entry);
            
            if (raf === null) {
                this.start();
            }
        }

        return this;
    },

    remove(entry) {
        const index = entries.indexOf(entry);

        if (index > -1) {
            entries.splice(index, 1);
        }

        return this;
    },

    start() {
        if (raf === null) { 

            let lastTime = performance.now();
            
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

            raf = requestAnimationFrame(loop);
        }

        return this;
    },

    stop() {
        cancelAnimationFrame(raf);
        raf = null;
        return this;
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

    return rt;
}

function noop(){}

function now() {
    return performance.now();
}

class MainLoopEntry {
    constructor(options) {
        assign(this, MainLoopEntry.defaults, options);
    }

    start() {
        mainLoop.add(this);
        this.onStart(now(), 0);
        return this;
    }

    stop() {
        mainLoop.remove(this);
        this.onStop(now(), 0);
        return this;
    }

    update(timestamp, tick) {
        this.onUpdate(timestamp, tick);
        return this;
    }

    complete(timestamp, tick) {
        this.onComplete(timestamp, tick);
        return this;
    }

    needsUpdate(timestamp) {
        return true;
    }
}

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

        return this;
    }

    pause() {
        this._pauseTime = now();
        mainLoop.remove(this);
        return this;
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

        return this;
    }

    update(timestamp, tick) {
        const
            result = (easings[this.easing]((timestamp - (this._startTime + this._pauseDuration)) / (this.duration * this._range)) * this._range) + 1 - this._range,
            percent = compute[this._direction](result);

        this._executed = percent;

        this.onUpdate(timestamp, tick, percent);

        return this;
    }

    complete(timestamp, tick) {
        const lastValue = (this._direction + 1) % 2;

        this._pauseTime = null;

        this.onUpdate(timestamp, tick, lastValue);
        this.onComplete(timestamp, tick, lastValue);

        if (this.loop > 0) {
            this.loop--;
            this.start();
        }

        return this;
    }

    needsUpdate(timestamp) {
        return timestamp - (this._startTime + this._pauseDuration) < this.duration * this._range;
    }
}

Tween.defaults = {
    delay: 0,
    duration: 1000,
    easing: 'linear',
    loop: 0,
    reverse: false,
    autoStart: true
};

const compute = [
    // forward
    function(value) {
        return value;
    },
    // backward
    function(value) {
        return 1 - value;
    }
];

function getElements (element, context) {
    return typeof element === 'string' ? (context || document).querySelectorAll(element) : element.length >= 0 ? element : [element];
}

var instances$2 = [];

class ThrottledEvent extends MainLoopEntry {
    constructor(target, eventType) {
        super();
        
        const events = {};

        events[eventType + 'start'] = [];
        events[eventType] = [];
        events[eventType + 'end'] = [];

        this._events = events;

        this._needsUpdate = false;
        this._reset = reset.bind(this);
        this._onEvent = onEvent.bind(this);
        this._timer = null;
        this._target = target;
        this._eventType = eventType;
        this._event = null;

        this._target.addEventListener(this._eventType, this._onEvent);
    }

    destroy() {
        const index = instances$2.indexOf(this);

        if (index > -1) {
            instances$2.splice(index,  1);
        }

        this._target.removeEventListener(this._eventType, this._onEvent);
    }

    add(when, callback) {
        if (this._events[when].indexOf(callback) === -1) {
            this._events[when].push(callback);
        }

        return this;
    }

    remove(when, callback) {
        const index = this._events[when].indexOf(callback);

        if (index > -1) {
            this._events[when].splice(index, 1);
        }

        return this;
    }

    hasEvent() {
        const
            events = this._events,
            eventType = this._eventType;

        return events[eventType + 'start'].length + events[eventType].length + events[eventType + 'end'].length > 0;
    }

    update(timestamp, tick) {
        dispatch(this._events[this._eventType], this._event);
        this.onUpdate(timestamp, tick);
        return this;
    }

    complete(timestamp, tick) {
        dispatch(this._events[this._eventType + 'end'], this._event);
        this.onComplete(timestamp, tick);
        return this;
    }

    needsUpdate(timestamp) {
        return this._needsUpdate;
    }
}

ThrottledEvent.getInstance = function(target, eventType) {
    let instance;

    for (let i = 0; i < instances$2.length; i++) {
        if (instances$2[i]._eventType === eventType && instances$2[i]._target === target) {
            instance = instances$2[i];
			break;
        }
    }

    if (!instance) {
        instance = new ThrottledEvent(target, eventType);
        
        instances$2.push(instance);
    }

    return instance;
};

ThrottledEvent.destroy = function() {
    while (instances$2[0]) {
        instances$2[0].destroy();
    }
};

// ----
// utils
// ----
function reset() {
    this._needsUpdate = false;
}

function dispatch(array, e) {
    for (let i = 0; i < array.length; i++) {
        array[i](e);
    }
}

// ----
// event
// ----
function onEvent(e) {
    this._event = e;

    if (!this._needsUpdate) {
        this._needsUpdate = true;
        this.start();
        dispatch(this._events[this._eventType + 'start'], e);
    }

    clearTimeout(this._timer);
    this._timer = setTimeout(this._reset, 128);
}

class ScrollObserverEntry {
    constructor(element, options, scrollInfos) {
        assign(this, ScrollObserverEntry.defaults, options);

        this.element = element;
        this._isVisible = false;
        this.children = this.children ? getElements(this.children, this.element) : [];

        this.refresh(scrollInfos);
    }

    refresh(scrollInfos) {
        const
            bounding = this.element.getBoundingClientRect(),
            scrollY = window.pageYOffset,
            height = window.innerHeight;
        
        // start and distance Relative To Window 
        this.distanceRTW = height + bounding.bottom - bounding.top;
        this.startRTW = bounding.bottom - this.distanceRTW + scrollY;

        // start end distance Relative To Element
        this.startRTE = Math.max(bounding.top + scrollY - height, 0);
        this.distanceRTE = Math.min(bounding.bottom + scrollY - this.startRTE, document.documentElement.scrollHeight - height);

        this.control(scrollInfos);

        return this;
    }

    control(scrollInfos) {
        const
            p1 = (scrollInfos.y - this.startRTW) / this.distanceRTW,
            p2 = (scrollInfos.y - this.startRTE) / this.distanceRTE;

        if (p1 >= 0 && p1 <= 1) {
            if (!this._isVisible) {
                this._isVisible = true;
                this.onVisibilityStart.call(this, scrollInfos, round(p1), round(p2));
                this.onVisible.call(this, scrollInfos, round(p1), round(p2));
            }

            this.onVisible.call(this, scrollInfos, p1, p2);

        } else if (this._isVisible) {
            this._isVisible = false;
            
            this.onVisible.call(this, scrollInfos, round(p1), round(p2));
            this.onVisibilityEnd.call(this, scrollInfos, round(p1), round(p2));
        }

        this.onAlways.call(this, scrollInfos, p1, p2);

        return this; 
    }
}

ScrollObserverEntry.defaults = {
    children: '',
    onVisible: noop,
    onVisibilityStart: noop,
    onVisibilityEnd: noop,
    onAlways: noop
};

function round(v) {
    return Math.abs(Math.round(v));
}

const instances$1 = [];
let autoRefreshTimer = null,
    resize$1 = null,
    scroll = null;

class ScrollObserver extends MainLoopEntry {
    constructor(options) {
        super(assign({}, ScrollObserver.defaults, options));

        this._elements = [];
        this._entries = [];
        this._onScroll = this.start.bind(this);
        this._onResize = this.refresh.bind(this);
        this._lastScrollY = 0;
        this._needsUpdate = true;

        if (instances$1.length === 0) {
            resize$1 = new ThrottledEvent(window, 'resize');
            scroll = new ThrottledEvent(window, 'scroll');
        }

        resize$1.add('resize', this._onResize);
        scroll.add('scrollstart', this._onScroll);

        instances$1.push(this);
        ScrollObserver.startAutoRefresh();
    }

    destroy() {
        if (this._needsUpdate) {
            this._needsUpdate = false;

            instances$1.splice(instances$1.indexOf(this), 1);

            if (instances$1.length === 0) {
                ScrollObserver.stopAutoRefresh();
                resize$1.destroy();
                scroll.destroy();
                resize$1 = scroll = null;
            } else {
                resize$1.remove('resize', this._onResize);
                scroll.remove('scrollstart', this._onScroll);
            }
        }
    }

    observe(element, options) {
        const
            els = getElements(element),
            scroll = this.getScrollInfos();

        for (let i = 0; i < els.length; i++) {
            if (this._elements.indexOf(els[i]) === -1) {
                this._entries.push(new ScrollObserverEntry(els[i], options, scroll));
                this._elements.push(els[i]);
            }
        }

        return this;	
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

        return this;
    }

    update(timestamp, tick) {
        this.onUpdate(timestamp, tick);

        const scroll = this.getScrollInfos();

        for (let i = 0; i < this._entries.length; i++) {
            this._entries[i].control(scroll);
        }

        this._lastScrollY = scroll.y;

        return this;
    }

    needsUpdate(timestamp) {
        return this._needsUpdate && scroll.needsUpdate() || this.scrollDivider > 1 && Math.abs(window.pageYOffset - this._lastScrollY) > 1;
    }

    hasEntry() {
        return this._entries.length > 0;
    }

    getScrollInfos() {
        const
            y = this._lastScrollY + (window.pageYOffset - this._lastScrollY) / this.scrollDivider,
            deltaY = y - this._lastScrollY;
        
        return {
            y: y,
            deltaY: deltaY,
            directionY: deltaY / Math.abs(deltaY) || 0
        }
    }

    refresh() {
        const scrollInfos = this.getScrollInfos();
    
        for (let i = 0; i < this._entries.length; i++) {
            this._entries[i].refresh(scrollInfos);
        }

        this.onRefresh(scrollInfos);

        return this;
    }
}

ScrollObserver.defaults = {
    scrollDivider: 1,
    onRefresh: noop
};

// ----
// utils
// ----
function getDocumentHeight() {
    const
        html = document.documentElement,
        body = document.body;

    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

// ----
// statics
// ----
ScrollObserver.autoRefreshDelay = 1000;

ScrollObserver.startAutoRefresh = function() {
    if (autoRefreshTimer === null && ScrollObserver.autoRefreshDelay !== null) {
        let lastDocumentHeight = getDocumentHeight();

        autoRefreshTimer = setInterval(function() {
            const height = getDocumentHeight();

            if (height !== lastDocumentHeight) {
                for (let i = 0; i < instances$1.length; i++) {
                    instances$1[i].refresh();
                }
                lastDocumentHeight = height;
            }
        }, ScrollObserver.autoRefreshDelay);
    }
    return this;
};

ScrollObserver.stopAutoRefresh = function() {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
    return this;
};

ScrollObserver.destroy = function() {
    while(instances$1[0]) {
        instances$1[0].destroy();
    }
};

const 
    instances = [],
    specialCharRegExp = /(((?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])((\u200D(\u2640|\u2642)\uFE0F)|[]))|&([a-zA-Z]{2,6}|#[0-9]{2,5});|<|>)/g,
    whiteCharRegExp = /(\s)/;
let resize = null;
    

class SplittedText {
    constructor(element, options) {
        assign(this, SplittedText.defaults, options);

        this._originalInnerHTML = element.innerHTML;
        this._element = element;
        this._onResize = this.split.bind(this);

        if (!resize) {
            resize = new ThrottledEvent(window, 'resize');
        }

        if (this.autoSplit) {
            this.split();
        }

        instances.push(this);
    }

    destroy() {
        this.restore();

        instances.splice(instances.indexOf(this),  1);

        if (!instances.length) {
            resize.destroy();
            resize = null;
        }
    }

    restore() {
        this._element.innerHTML = this._originalInnerHTML;
        resize.remove('resize', this._onResize);

        return this;
    }

    split() {
        const element = this._element;

        element.innerHTML = this._originalInnerHTML;

        if (this.byLine) {
            wrapByWord(element, function(word) {
                return '<span class="st-word-temp">' + word + '</span>';
            });
            
            const
                children = element.children,
                lineWrapper = (line, suffix) => {
                    return line ? this.lineWrapper(line) + suffix : '';
                };
            let line = '',
                html = '',
                lastOffsetTop = children[0].offsetTop;

            resize.add('resize', this._onResize);

            for (let i = 0; i < children.length; i++) {
				let child = children[i],
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
            element.innerHTML = split(element, '', (char) => {
				return !whiteCharRegExp.test(char) ? this.charWrapper(char) : char;
			}, this.preserve);
        }

        return this;
    }
}

SplittedText.defaults = {
    autoSplit: true,
    byLine: false,
    byWord: false,
    byChar: false,
    preserve: 'st-char',
    lineWrapper(line) {
        return '<span class="st-line">' + line + '</span>';
    },
    wordWrapper(word) {
        return '<span class="st-word">' + word + '</span>';
    },
    charWrapper(char) {
        return '<span class="st-char">' + char + '</span>';
    },
};

// ----
// utils
// ----
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
    
    return html;
}

function preserveCode(element) {
    return traverseNode(
        element,
        function(text) {
            return text.replace('<', '[<]');
        },
        function(child) {
            return getNewOuterHTML(child, preserveCode(child));
        }
    );
}

function wrapSpecialChar(element, wrapper) {
    return traverseNode(
        element,
        function(text) {
            return text.replace(specialCharRegExp, wrapper);
        },
        function(child) {
            return getNewOuterHTML(child, wrapSpecialChar(child, wrapper));
        }
    );
}

function split(element, separator, wrapper, preserve) {
    return traverseNode(
        element,
        function(text) {
			var trimmedText = text.trim();

            return trimmedText !== '' ?
                (separator === '' ? text : trimmedText).split(separator).map(wrapper).join(separator) 
                : 
                text;
        },
        function(child) {
            return preserve && child.classList.contains(preserve) ?
                child.outerHTML
                :
                getNewOuterHTML(child, split(child, separator, wrapper, preserve));
        }
    );
}

function unwrap(element, className) {
    return traverseNode(
        element,
        function(text) {
            return text;
        },
        function(child) {
            return child.classList.contains(className) ?
                child.innerHTML
                :
                getNewOuterHTML(child, unwrap(child, className));
        }
    );
}

function getNewOuterHTML(node, strReplacement) {
    return node.outerHTML.replace('>' + node.innerHTML + '<', '>' + strReplacement + '<');
}

function wrapByWord(element, wrapper) {
    element.innerHTML = preserveCode(element);
    element.innerHTML = split(element, ' ', wrapper).replace('[<]', '&lt;');
}

// ----
// static
// ----
SplittedText.destroy = function() {
    while (instances[0]) {
        instances[0].destroy();
    }
};

export { MainLoopEntry, ScrollObserver, SplittedText, ThrottledEvent, Tween, easings };
