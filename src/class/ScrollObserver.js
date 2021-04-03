import assign from '../function/assign';
import getElements from '../function/getElements';
import MainLoopEntry from '../class/MainLoopEntry';
import ThrottledEvent from '../class/ThrottledEvent';
import ScrollObserverEntry from '../class/ScrollObserverEntry';

var scrollObserverInstances = [],
	scrollObserverAutoRefreshTimer = null;

function ScrollObserver(options) {
	MainLoopEntry.call(this, assign({}, ScrollObserver.defaults, options, {autoStart: false}));

	this._elements = [];
	this._entries = [];
	this._onScroll = this.start.bind(this);
	this._onResize = this.refresh.bind(this);
	this._lastScrollY = 0;

	this._resize = new ThrottledEvent(window, 'resize');
	this._scroll = new ThrottledEvent(window, 'scroll');

	this._resize.add('resize', this._onResize);
	this._scroll.add('scrollstart', this._onScroll);

	scrollObserverInstances.push(this);
	ScrollObserver.startAutoRefresh()
}

ScrollObserver.defaults = {
	scrollDivider: 1
};

assign(ScrollObserver.prototype,
	MainLoopEntry.prototype, {

	destroy: function() {
		this._scroll.remove('scrollstart', this._onScroll);
		this._resize.remove('resize', this._onResize);
		scrollObserverInstances.splice(scrollObserverInstances.indexOf(this),  1);

		if (scrollObserverInstances.length === 0) {
			ScrollObserver.stopAutoRefresh()
		}
	},

	observe: function(element, options) {
		var els = getElements(element),
			scroll = this.getScrollInfos(),
			i;

		for (i = 0; i < els.length; i++) {
			if (this._elements.indexOf(element) === -1) {
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
			index = this._elements.indexOf(element) 
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
		return this._scroll.needsUpdate() || this.scrollDivider > 1 && Math.abs(window.pageXOffset - this._lastScrollY) > 1;
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
		var scroll = this.getScrollInfos(),
			i;
	
		for (i = 0; i < this._entries.length; i++) {
			this._entries[i].refresh(scroll);
		}

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
	if (scrollObserverAutoRefreshTimer === null && ScrollObserver.autoRefreshDelay !== null) {
		var lastDocumentHeight = getDocumentHeight();

		scrollObserverAutoRefreshTimer = setInterval(function() {
			var height = getDocumentHeight(),
				i;

			if ( height !== lastDocumentHeight) {
				for (i = 0; i < scrollObserverInstances.length; i++) {
					scrollObserverInstances[i].refresh();
				}
				lastDocumentHeight = height;
			}
		}, ScrollObserver.autoRefreshDelay)
	}
	return this;
}

ScrollObserver.stopAutoRefresh = function() {
	clearInterval(scrollObserverAutoRefreshTimer);
	scrollObserverAutoRefreshTimer = null;
	return this;
}

ScrollObserver.destroy = function() {
	while(scrollObserverInstances.length) {
		scrollObserverInstances[0].destroy();
	}
}

export default ScrollObserver;