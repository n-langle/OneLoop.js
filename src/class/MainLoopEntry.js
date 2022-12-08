import mainLoop from '../object/mainLoop';
import assign from '../function/assign';
import noop from '../function/noop';
import now from '../function/now';

class MainLoopEntry {
    constructor(options) {
        assign(this, MainLoopEntry.defaults, options);
    }

    start() {
        mainLoop.add(this);
        this.onStart(now(), 0);
        return this;
    }

    stop() {
        mainLoop.remove(this);
        this.onStop(now(), 0);
        return this;
    }

    update(timestamp, tick) {
        this.onUpdate(timestamp, tick);
        return this;
    }

    complete(timestamp, tick) {
        this.onComplete(timestamp, tick);
        return this;
    }

    needsUpdate(timestamp) {
        return true;
    }
}

MainLoopEntry.defaults = {
    onStart: noop,
    onUpdate: noop,
    onStop: noop,
    onComplete: noop,
};

export default MainLoopEntry;
