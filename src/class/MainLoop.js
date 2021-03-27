import assign from '../function/assign';

var mainLoopInstance = null;

function MainLoop() {
	if (mainLoopInstance) {
		return mainLoopInstance;
	}

	mainLoopInstance = this;

	this._entries = [];
	this._raf = null;
}

assign(MainLoop.prototype, {
	add: function(entry) {
		if (this._entries.indexOf(entry) === -1) {
			this._entries.push(entry);
			
			if (this._raf === null) {
				this.start();
			}
		}

		return this;
	},

	remove: function(entry) {
		var index = this._entries.indexOf(entry)
		if (index > -1) {
			this._entries.splice(index, 1)[0].stop()
		}

		return this;
	},

	start: function() {
		var that = this,
			entries = that._entries,
			lastTime;

		if (that._raf === null) { 

			lastTime = performance.now();
			
			function loop(timestamp) {
				var tick = (timestamp - lastTime) / (1000 / 60),
					i;
					
				for (i = 0; i < entries.length; i++) {					
					if (entries[i].needsUpdate(timestamp)) {
						entries[i].update(timestamp, tick);
					} else {
						entries.splice(i, 1)[0].complete(timestamp, tick);
						i--;
					}
				}

				if (entries.length) {
					lastTime = timestamp;
					that._raf = requestAnimationFrame(loop)
				} else {
					that._raf = null;
				}
			}

			that._raf = requestAnimationFrame(loop);
		}

		return this;
	},

	stop: function() {
		cancelAnimationFrame(this._raf);
		this._raf = null;
		return this;
	},

	destroy: function() {
		this._entries.length = 0;
		this.stop();
		mainLoopInstance = null; 
	}
});

export default MainLoop;
