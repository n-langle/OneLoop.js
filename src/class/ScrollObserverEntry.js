import assign from '../function/assign';
import noop from '../function/noop';
import getElements from '../function/getElements';
import Vector2 from './Vector2';

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
            height = window.innerHeight,
            scrollX = window.pageXOffset,
            width = window.innerWidth;
        
        // start and distance Relative To Window 
        this.distanceRTW = new Vector2(
            width + bounding.right - bounding.left,
            height + bounding.bottom - bounding.top
        );
        this.startRTW = new Vector2(
            bounding.right - this.distanceRTW.x + scrollX,
            bounding.bottom - this.distanceRTW.y + scrollY
        );

        // start end distance Relative To Element
        this.startRTE = new Vector2(
            Math.max(bounding.left + scrollX - width, 0),
            Math.max(bounding.top + scrollY - height, 0)
        );
        this.distanceRTE = new Vector2(
            Math.min(bounding.right + scrollX - this.startRTE.x, document.documentElement.scrollWidth - width),
            Math.min(bounding.bottom + scrollY - this.startRTE.y, document.documentElement.scrollHeight - height)
        );

        this.control(scrollInfos);

        return this;
    }

    control(scrollInfos) {
        const
            scroll = scrollInfos.scroll,
            p1 = scroll.clone().subtract(this.startRTW).divide(this.distanceRTW),
            p2 = scroll.clone().subtract(this.startRTE).divide(this.distanceRTE);

        if (p1.x >= 0 && p1.x <= 1 && p1.y >= 0 && p1.y <= 1) {
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
    return v.clone().set(Math.abs(Math.round(v.x)), Math.abs(Math.round(v.y)));
}

export default ScrollObserverEntry;
