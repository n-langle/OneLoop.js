import assign from '../function/assign'
import getElements from '../function/getElements'
import MainLoopEntry from '../class/MainLoopEntry'
import ThrottledEvent from '../class/ThrottledEvent'
import ScrollObserverEntry from '../class/ScrollObserverEntry'
import Vector2 from '../class/Vector2'
import noop from '../function/noop'

const
    instances = []
let autoRefreshTimer = null,
    resize = null,
    scroll = null

class ScrollObserver extends MainLoopEntry {
    constructor(options) {
        super(assign({}, ScrollObserver.defaults, options))

        this._elements = []
        this._entries = []
        this._onScroll = this.start.bind(this)
        this._onResize = this.refresh.bind(this)
        this._lastScroll = new Vector2(0, 0)
        this._needsUpdate = true
        this._lastSize = getDocumentScroll()

        resize = resize || new ThrottledEvent(window, 'resize')
        scroll = scroll || new ThrottledEvent(window, 'scroll')

        resize.add('resize', this._onResize)
        scroll.add('scrollstart', this._onScroll)

        instances.push(this)
        ScrollObserver.startAutoRefresh()
    }

    destroy() {
        if (this._needsUpdate) {
            this._needsUpdate = false

            instances.splice(instances.indexOf(this), 1)

            if (instances.length === 0) {
                ScrollObserver.stopAutoRefresh()
                resize.destroy()
                scroll.destroy()
                resize = scroll = null
            } else {
                resize.remove('resize', this._onResize)
                scroll.remove('scrollstart', this._onScroll)
            }
        }
    }

    observe(element, options) {
        const
            els = getElements(element),
            scrollInfos = this.getScrollInfos()

        for (let i = 0; i < els.length; i++) {
            if (this._elements.indexOf(els[i]) === -1) {
                this._entries.push(new ScrollObserverEntry(els[i], options, scrollInfos))
                this._elements.push(els[i])
            }
        }

        return this	
    }

    unobserve(element) {
        const els = getElements(element)

        for (let i = 0; i < els.length; i++) {
            let index = this._elements.indexOf(els[i])
            if (index > -1) {
                this._elements.splice(index, 1)
                this._entries.splice(index, 1)
            }
        }

        return this
    }

    update(timestamp, tick) {
        super.update(timestamp, tick)

        const infos = this.getScrollInfos()

        for (let i = 0; i < this._entries.length; i++) {
            this._entries[i].control(infos)
        }

        this._lastScroll.copy(infos.scroll)

        return this
    }

    needsUpdate() {
        return this._needsUpdate && 
            scroll.needsUpdate() || 
            this.scrollDivider > 1 && (
                Math.abs(window.pageXOffset - this._lastScroll.x) > 1 || 
                Math.abs(window.pageYOffset - this._lastScroll.y) > 1
            )
    }

    hasEntry() {
        return this._entries.length > 0
    }

    getScrollInfos() {
        const
            lastScroll = this._lastScroll,
            scroll = new Vector2(
                window.pageXOffset, 
                window.pageYOffset
            )
                .subtract(lastScroll)
                .divideScalar(this.scrollDivider)
                .add(lastScroll),
            delta = scroll
                .clone()
                .subtract(lastScroll)
        
        return {
            scroll: scroll,
            delta: delta,
            direction: new Vector2(delta.x / Math.abs(delta.x) || 0, delta.y / Math.abs(delta.y) || 0)
        }
    }

    refresh() {
        const scrollInfos = this.getScrollInfos()
    
        for (let i = 0; i < this._entries.length; i++) {
            this._entries[i].refresh(scrollInfos)
        }

        this.onRefresh.call(this, scrollInfos)

        return this
    }
}

ScrollObserver.defaults = {
    scrollDivider: 1,
    onRefresh: noop
}

// ----
// utils
// ----
function getDocumentScroll() {
    return new Vector2(document.documentElement.scrollWidth, document.documentElement.scrollHeight)
}
// ----
// statics
// ----
ScrollObserver.autoRefreshDelay = 1000

ScrollObserver.startAutoRefresh = function() {
    let lastSize = getDocumentScroll()

    if (autoRefreshTimer === null && ScrollObserver.autoRefreshDelay !== null) {
        autoRefreshTimer = setInterval(function() {
            const size = getDocumentScroll()

            if (lastSize.x !== size.x || lastSize.y !== size.y) {
                for (let i = 0; i < instances.length; i++) {
                    instances[i].refresh()
                }

                lastSize = size
            }
        }, ScrollObserver.autoRefreshDelay)
    }
    return this
}

ScrollObserver.stopAutoRefresh = function() {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
    return this
}

ScrollObserver.destroy = function() {
    while(instances[0]) {
        instances[0].destroy()
    }
}

export default ScrollObserver
