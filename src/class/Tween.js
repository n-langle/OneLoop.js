import MainLoopEntry from './MainLoopEntry';
import assign from '../function/assign';
import noop from '../function/noop';
import easings from '../object/easings';


function Tween(options) {
	this._startValue = 0;
	MainLoopEntry.call(this, assign({}, Tween.defaults, options));
}

Tween.defaults = {
	duration: 1000,
	easing: 'linear',
	loop: 0,
	yoyo: false
};

assign(Tween.prototype, 
	MainLoopEntry.prototype, {

	start: function(delay) {
		return MainLoopEntry.prototype.start.call(this, delay, this._startValue);
	},

	update: function(timestamp, tick) {
		var e = easings[this.easing]((timestamp - this._startTime) / this.duration),
			p = this._startValue === 0 ? e : 1 - e;

		this.onUpdate(timestamp, tick, p);
		return this;
	},

	complete: function(timestamp, tick) {
		var lastValue = this._startValue === 0 ? 1 : 0;

		this.onUpdate(timestamp, tick, lastValue);
		this.onComplete(timestamp, tick, lastValue);

		if (this.yoyo) {
			this._startValue = lastValue;
		}

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