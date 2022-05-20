import mainLoop from '../object/mainLoop';
import assign from '../function/assign';
import noop from '../function/noop';
import now from '../function/now';

function MainLoopEntry(options) {
    assign(this, MainLoopEntry.defaults, options);
}

MainLoopEntry.defaults = {
    onStart: noop,
    onUpdate: noop,
    onStop: noop,
    onComplete: noop,
};

assign(MainLoopEntry.prototype, {
    start: function() {
        mainLoop.add(this);
        this.onStart(now(), 0);
        return this;
    },

    stop: function() {
        mainLoop.remove(this);
        this.onStop(now(), 0);
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
