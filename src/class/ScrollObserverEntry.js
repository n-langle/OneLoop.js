import assign from '../function/assign';
import noop from '../function/noop';
import getElements from '../function/getElements';

function ScrollObserverEntry(element, options, scroll) {
    assign(this, ScrollObserverEntry.defaults, options);

    this.element = element;
    this._isVisible = false;
    this.children = this.children ? getElements(this.children, this.element) : [];

    this.refresh(scroll);
}

ScrollObserverEntry.defaults = {
    children: '',
    onVisible: noop,
    onVisibilityStart: noop,
    onVisibilityEnd: noop,
    onAlways: noop
};

assign(ScrollObserverEntry.prototype, {
    refresh: function(scroll) {
        var bounding = this.element.getBoundingClientRect(),
            scrollY = window.pageYOffset,
            height = window.innerHeight;
        
        // start and distance Relative To Window 
        this.distanceRTW = height + bounding.bottom - bounding.top;
        this.startRTW = bounding.bottom - this.distanceRTW + scrollY;

        // start end distance Relative To Element
        this.startRTE = Math.max(bounding.top + scrollY - height, 0);
        this.distanceRTE = Math.min(bounding.bottom + scrollY - this.startRTE, document.documentElement.scrollHeight - height);

        this.control(scroll);

        return this;
    },

    control: function(scroll) {
        var p1 = (scroll.y - this.startRTW) / this.distanceRTW,
            p2 = (scroll.y - this.startRTE) / this.distanceRTE;

        if (p1 >= 0 && p1 <= 1) {
            if (!this._isVisible) {
                this._isVisible = true;
                this.onVisibilityStart.call(this, scroll, round(p1), round(p2));
                this.onVisible.call(this, scroll, round(p1), round(p2));
            }

            this.onVisible.call(this, scroll, p1, p2);

        } else if (this._isVisible) {
            this._isVisible = false;
            
            this.onVisible.call(this, scroll, round(p1), round(p2));
            this.onVisibilityEnd.call(this, scroll, round(p1), round(p2));
        }

        this.onAlways.call(this, scroll, p1, p2);

        return this; 
    }
});

function round(v) {
    return Math.abs(Math.round(v));
}

export default ScrollObserverEntry;
