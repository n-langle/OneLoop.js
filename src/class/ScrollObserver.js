import assign from '../function/assign'
import getElements from '../function/getElements'
import MainLoopEntry from '../class/MainLoopEntry'
import ThrottledEvent from '../class/ThrottledEvent'
import ScrollObserverEntry from '../class/ScrollObserverEntry'
import Vector2 from '../class/Vector2'
import getWindowScroll from '../function/getWindowScroll'
import getDocumentScrollSize from '../function/getDocumentScrollSize'
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
        this._onScroll = () => this.start()
        this._onResize = () => this.refresh()
        this._lastScroll = new Vector2(0, 0)
        this._needsUpdate = true
        this._lastSize = getDocumentScrollSize()

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

	// ----
	// statics
	// ----
	static defaults = {
		scrollDivider: 1,
		onRefresh: noop
	}

	static autoRefreshDelay = 1000
	
	static startAutoRefresh() {
		let lastSize = getDocumentScrollSize()

		if (autoRefreshTimer === null && ScrollObserver.autoRefreshDelay !== null) {
			autoRefreshTimer = setInterval(() => {
				const size = getDocumentScrollSize()

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

	static stopAutoRefresh() {
		clearInterval(autoRefreshTimer)
		autoRefreshTimer = null
		return this
	}

	static destroy() {
		while(instances[0]) {
			instances[0].destroy()
		}
	}
}

export default ScrollObserver
