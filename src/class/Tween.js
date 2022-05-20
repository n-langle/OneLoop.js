import MainLoopEntry from './MainLoopEntry';
import assign from '../function/assign';
import now from '../function/now';
import easings from '../object/easings';
import mainLoop from '../object/mainLoop';


function Tween(options) {
    MainLoopEntry.call(this, assign({}, Tween.defaults, options));

    this._startTime = 0;
    this._range = 1;
    this._executed = 0;
    this._direction = this.reverse ? 1 : 0;
    this._pauseDuration = 0;
    this._pauseTime = null;

    if (this.autoStart) {
        this.start();
    }
}

Tween.defaults = {
    delay: 0,
    duration: 1000,
    easing: 'linear',
    loop: 0,
    reverse: false,
    autoStart: true
};

assign(Tween.prototype, 
    MainLoopEntry.prototype, {

    reset: function() {
        this._pauseTime = null;
        this._range = 1;
        this._executed = 0;
        this._direction = this.reverse ? 1 : 0;

        mainLoop.remove(this);
        this.onUpdate(0, 0, 0);

        return this;
    },

    pause: function() {
        this._pauseTime = now();
        mainLoop.remove(this);
        return this;
    },

    start: function(delay) {

        if (delay !== 0 && !delay) {
            delay = this.delay;
        }

        if (delay === 0) {
            if (!this._pauseTime) {
                if (this.reverse) {
                    this._range = compute[this._direction](this._executed);
                    this._direction = (this._direction + 1) % 2;
                }

                this._pauseDuration = 0;
                this._startTime = now();
                this.onStart(this._startTime, 0, 1 - this._range);
            } else {
                this._pauseDuration += now() - this._pauseTime;
                this._pauseTime = null;
            }

            mainLoop.add(this);
        } else {
            setTimeout(this.start.bind(this, 0), delay);
        }

        return this;
    },

    update: function(timestamp, tick) {
        var result = (easings[this.easing]((timestamp - (this._startTime + this._pauseDuration)) / (this.duration * this._range)) * this._range) + 1 - this._range,
            percent = compute[this._direction](result);

        this._executed = percent;

        this.onUpdate(timestamp, tick, percent);

        return this;
    },

    complete: function(timestamp, tick) {
        var lastValue = (this._direction + 1) % 2;

        this._pauseTime = null;

        this.onUpdate(timestamp, tick, lastValue);
        this.onComplete(timestamp, tick, lastValue);

        if (this.loop > 0) {
            this.loop--;
            this.start();
        }

        return this;
    },

    needsUpdate: function(timestamp) {
        return timestamp - (this._startTime + this._pauseDuration) < this.duration * this._range;
    }
});

var compute = [
    // forward
    function(value) {
        return value;
    },
    // backward
    function(value) {
        return 1 - value;
    }
];

export default Tween;
