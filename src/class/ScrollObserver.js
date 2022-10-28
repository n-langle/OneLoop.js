import assign from '../function/assign';
import getElements from '../function/getElements';
import MainLoopEntry from '../class/MainLoopEntry';
import ThrottledEvent from '../class/ThrottledEvent';
import ScrollObserverEntry from '../class/ScrollObserverEntry';
import noop from '../function/noop';

var instances = [],
    autoRefreshTimer = null,
    resize = null,
    scroll = null;

function ScrollObserver(options) {
    MainLoopEntry.call(this, assign({}, ScrollObserver.defaults, options));

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

ScrollObserver.defaults = {
    scrollDivider: 1,
    onRefresh: noop
};

assign(ScrollObserver.prototype,
    MainLoopEntry.prototype, {

    destroy: function() {
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
    },

    observe: function(element, options) {
        var els = getElements(element),
            scroll = this.getScrollInfos(),
            i;

        for (i = 0; i < els.length; i++) {
            if (this._elements.indexOf(els[i]) === -1) {
                this._entries.push(new ScrollObserverEntry(els[i], options, scroll));
                this._elements.push(els[i]);
            }
        }

        return this;	
    },

    unobserve: function(element) {
        var els = getElements(element),
            index, 
            i;

        for (i = 0; i < els.length; i++) {
            index = this._elements.indexOf(els[i]);
            if (index > -1) {
                this._elements.splice(index, 1);
                this._entries.splice(index, 1);
            }
        }

        return this;
    },

    update: function(timestamp, tick) {
        this.onUpdate(timestamp, tick);

        var scroll = this.getScrollInfos(),
            i; 

        for (i = 0; i < this._entries.length; i++) {
            this._entries[i].control(scroll);
        }

        this._lastScrollY = scroll.y;

        return this;
    },

    needsUpdate: function(timestamp) {
        return this._needsUpdate && scroll.needsUpdate() || this.scrollDivider > 1 && Math.abs(window.pageYOffset - this._lastScrollY) > 1;
    },

    hasEntry: function() {
        return this._entries.length > 0;
    },

    getScrollInfos: function() {
        var y = this._lastScrollY + (window.pageYOffset - this._lastScrollY) / this.scrollDivider,
            deltaY = y - this._lastScrollY;
        
        return {
            y: y,
            deltaY: deltaY,
            directionY: deltaY / Math.abs(deltaY) || 0
        }
    },

    refresh: function() {
        var scrollInfos = this.getScrollInfos(),
            i;
    
        for (i = 0; i < this._entries.length; i++) {
            this._entries[i].refresh(scrollInfos);
        }

        this.onRefresh(scrollInfos);

        return this;
    }
});

// ----
// utils
// ----
function getDocumentHeight() {
    var html = document.documentElement,
        body = document.body;

    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

// ----
// statics
// ----
ScrollObserver.autoRefreshDelay = 1000;

ScrollObserver.startAutoRefresh = function() {
    if (autoRefreshTimer === null && ScrollObserver.autoRefreshDelay !== null) {
        var lastDocumentHeight = getDocumentHeight();

        autoRefreshTimer = setInterval(function() {
            var height = getDocumentHeight(),
                i;

            if ( height !== lastDocumentHeight) {
                for (i = 0; i < instances.length; i++) {
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
