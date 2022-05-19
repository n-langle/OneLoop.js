import mainLoop from '../object/mainLoop';
import assign from '../function/assign';
import noop from '../function/noop';

function MainLoopEntry(options) {
    assign(this, MainLoopEntry.defaults, options);

    this._startTime = 0;
    this._pauseDuration = 0;
    this._pauseTime = null;

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
            if (!this._pauseTime) {
                this._pauseDuration = 0;
                this._startTime = now();
                this.onStart(this._startTime, 0, onStartAdditionalParameter);
            } else {
                this._pauseDuration += now() - this._pauseTime;
                this._pauseTime = null;
            }

            mainLoop.add(this);
        } else {
            setTimeout(this.start.bind(this, 0, onStartAdditionalParameter), delay);
        }

        return this;
    },

    pause: function() {
        this._pauseTime = now();
        mainLoop.remove(this);
        return this;
    },

    stop: function() {
        this._pauseTime = null;

        mainLoop.remove(this);
        this.onStop();

        return this;
    },

    update: function(timestamp, tick) {
        this.onUpdate(timestamp, tick);
        return this;
    },

    complete: function(timestamp, tick) {
        this._pauseTime = null;

        this.onComplete(timestamp, tick);

        return this;
    },

    needsUpdate: function(timestamp) {
        return true;
    }
});

function now() {
    return performance.now();
}

export default MainLoopEntry;
