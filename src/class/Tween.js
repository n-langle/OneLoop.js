import MainLoopEntry from './MainLoopEntry';
import assign from '../function/assign';
import noop from '../function/noop';
import easings from '../object/easings';


function Tween(options) {
	MainLoopEntry.call(this, assign({}, Tween.defaults, options));
	this._lastValue = 0;
}

Tween.defaults = {
	duration: 1000,
	easing: 'linear',
	loop: Infinity,
	reverse: false
};

assign(Tween.prototype, 
	MainLoopEntry.prototype, {

	start: function() {
		this._startTime = performance.now();
		this._mainLoop.add(this);
		this.onStart(this._startTime, 0, this._lastValue);
		return this;
	},	

	update: function(timestamp, tick) {
		this.onUpdate(timestamp, tick, Math.abs(this._lastValue - easings[this.easing]((timestamp - this._startTime) / this.duration)));
		return this;
	},

	complete: function(timestamp, tick) {
		var value = Math.abs(this._lastValue - 1);

		if (this.reverse) {
			this._lastValue = value;
		}

		this.onUpdate(timestamp, tick, value);
		this.onComplete(timestamp, tick, value);

		if (this.loop > 0) {
			this.loop--;
			this.start();
		}

		return this;
	},

	needsUpdate: function(timestamp) {
		return timestamp - this._startTime < this.duration;
	}
});

export default Tween;