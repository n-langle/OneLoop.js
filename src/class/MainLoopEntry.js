import mainLoop from '../object/mainLoop';
import assign from '../function/assign';
import noop from '../function/noop';

function MainLoopEntry(options) {
	assign(this, MainLoopEntry.defaults, options);

	this._startTime = 0;

	if (this.autoStart) {
		this.start();
	}
}

MainLoopEntry.defaults = {
	delay: 0,
	onStart: noop,
	onUpdate: noop,
	onStop: noop,
	onComplete: noop,
	autoStart: true
};

assign(MainLoopEntry.prototype, {
	start: function(delay, onStartAdditionalParameter) {
		if (delay !== 0 && !delay) {
			delay = this.delay;
		}

		if (delay === 0) {
			this._startTime = performance.now();
			mainLoop.add(this);
			this.onStart(this._startTime, 0, onStartAdditionalParameter);
		} else {
			setTimeout(this.start.bind(this, 0, onStartAdditionalParameter), delay);
		}

		return this;
	},

	stop: function() {
		mainLoop.remove(this);
		this.onStop();
		return this;
	},

	update: function(timestamp, tick) {
		this.onUpdate(timestamp, tick);
		return this;
	},

	complete: function(timestamp, tick) {
		this.onComplete(timestamp, tick);
		return this;
	},

	needsUpdate: function(timestamp) {
		return true;
	}
});

export default MainLoopEntry;