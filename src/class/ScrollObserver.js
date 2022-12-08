import assign from '../function/assign';
import getElements from '../function/getElements';
import MainLoopEntry from '../class/MainLoopEntry';
import ThrottledEvent from '../class/ThrottledEvent';
import ScrollObserverEntry from '../class/ScrollObserverEntry';
import noop from '../function/noop';

const instances = [];
let autoRefreshTimer = null,
    resize = null,
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

        if (instances.length === 0) {
            resize = new ThrottledEvent(window, 'resize');
            scroll = new ThrottledEvent(window, 'scroll');
        }

        resize.add('resize', this._onResize);
        scroll.add('scrollstart', this._onScroll);

        instances.push(this);
        ScrollObserver.startAutoRefresh();
    }

    destroy() {
        if (this._needsUpdate) {
            this._needsUpdate = false;

            instances.splice(instances.indexOf(this), 1);

            if (instances.length === 0) {
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
                for (let i = 0; i < instances.length; i++) {
                    instances[i].refresh();
                }
                lastDocumentHeight = height;
            }
        }, ScrollObserver.autoRefreshDelay)
    }
    return this;
}

ScrollObserver.stopAutoRefresh = function() {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
    return this;
}

ScrollObserver.destroy = function() {
    while(instances[0]) {
        instances[0].destroy();
    }
}

export default ScrollObserver;
