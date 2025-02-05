import assign from '../function/assign'
import noop from '../function/noop'
import getElements from '../function/getElements'
import Vector2 from './Vector2'
import getDocumentScrollSize from '../function/getDocumentScrollSize'
import getWindowScroll from '../function/getWindowScroll'

class ScrollObserverEntry {
    constructor(element, options, scrollInfos) {
        assign(this, ScrollObserverEntry.defaults, options)

        this.element = element
        this._isInitialised = false
        this._isVisible = false
        this.children = this.children ? getElements(this.children, this.element) : []

        this.refresh(scrollInfos)

        this._isInitialised = true
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
            documentScrollSize = getDocumentScrollSize()
        
        // start and distance Relative To Window 
        this.distanceRTW = new Vector2(
            windowWidth + elementWidth,
            windowHeight + elementHeight
        )
        this.startRTW = new Vector2(
            elementRight - this.distanceRTW.x + scrollX,
            elementBottom - this.distanceRTW.y + scrollY
        )

        // start end distance Relative To Element
        this.startRTE = new Vector2(
            Math.max(bounding.left + scrollX - windowWidth, 0),
            Math.max(bounding.top + scrollY - windowHeight, 0)
        )
        this.distanceRTE = new Vector2(
            // Math.min( in header, in footer, without scroll )
            Math.min(elementRight + scrollX - this.startRTE.x, documentScrollSize.x - elementRight - scrollX + elementWidth, documentScrollSize.x - windowWidth),
            Math.min(elementBottom + scrollY - this.startRTE.y, documentScrollSize.y - elementBottom - scrollY + elementHeight, documentScrollSize.y - windowHeight)
        )

        this.control(scrollInfos)

        return this
    }

    control(scrollInfos) {
        const
            scroll = scrollInfos.scroll,
            p1 = scroll.clone().subtract(this.startRTW).divide(this.distanceRTW),
            p2 = scroll.clone().subtract(this.startRTE).divide(this.distanceRTE)

        // prevent NaN error
        // if scrollX or scrollY is equal to window width or height
        p2.set(p2.x || 0, p2.y || 0)

        if ((this.disableCheckOnAxis === 'x' || p1.x >= 0 && p1.x <= 1) && (!this.disableCheckOnAxis === 'y' || p1.y >= 0 && p1.y <= 1)) {
            if (!this._isVisible) {
                this._isVisible = true
                this.onVisibilityStart.call(this, scrollInfos, getMinOrMax(p1), getMinOrMax(p2))
                this.onVisible.call(this, scrollInfos, getMinOrMax(p1), getMinOrMax(p2))
            }

            this.onVisible.call(this, scrollInfos, p1, p2)

        } else if (this._isVisible || !this._isInitialised) {
            this._isVisible = false
            
            this.onVisible.call(this, scrollInfos, getMinOrMax(p1), getMinOrMax(p2))
            this.onVisibilityEnd.call(this, scrollInfos, getMinOrMax(p1), getMinOrMax(p2))
        }

        this.onAlways.call(this, scrollInfos, p1, p2)

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
}

// ----
// utils
// ----
function getMinOrMax(v) {
    return new Vector2(
        Math.min(Math.max(0, Math.round(v.x)), 1),
        Math.min(Math.max(0, Math.round(v.y)), 1)
    )
}

export default ScrollObserverEntry
