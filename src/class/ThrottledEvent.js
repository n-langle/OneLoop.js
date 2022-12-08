import MainLoopEntry from './MainLoopEntry';
import assign from '../function/assign';
import mainLoop from '../object/mainLoop';

var instances = [];

class ThrottledEvent extends MainLoopEntry {
    constructor(target, eventType) {
        super();
        
        const events = {}

        events[eventType + 'start'] = [];
        events[eventType] = [];
        events[eventType + 'end'] = [];

        this._events = events;

        this._needsUpdate = false;
        this._reset = reset.bind(this);
        this._onEvent = onEvent.bind(this);
        this._timer = null;
        this._target = target;
        this._eventType = eventType;
        this._event = null;

        this._target.addEventListener(this._eventType, this._onEvent);
    }

    destroy() {
        const index = instances.indexOf(this);

        if (index > -1) {
            instances.splice(index,  1);
        }

        this._target.removeEventListener(this._eventType, this._onEvent);
    }

    add(when, callback) {
        if (this._events[when].indexOf(callback) === -1) {
            this._events[when].push(callback);
        }

        return this;
    }

    remove(when, callback) {
        const index = this._events[when].indexOf(callback);

        if (index > -1) {
            this._events[when].splice(index, 1);
        }

        return this;
    }

    hasEvent() {
        const
            events = this._events,
            eventType = this._eventType;

        return events[eventType + 'start'].length + events[eventType].length + events[eventType + 'end'].length > 0;
    }

    update(timestamp, tick) {
        dispatch(this._events[this._eventType], this._event);
        this.onUpdate(timestamp, tick);
        return this;
    }

    complete(timestamp, tick) {
        dispatch(this._events[this._eventType + 'end'], this._event);
        this.onComplete(timestamp, tick);
        return this;
    }

    needsUpdate(timestamp) {
        return this._needsUpdate;
    }
}

ThrottledEvent.getInstance = function(target, eventType) {
    let instance;

    for (let i = 0; i < instances.length; i++) {
        if (instances[i]._eventType === eventType && instances[i]._target === target) {
            instance = instances[i];
			break;
        }
    }

    if (!instance) {
        instance = new ThrottledEvent(target, eventType);
        
        instances.push(instance);
    }

    return instance;
}

ThrottledEvent.destroy = function() {
    while (instances[0]) {
        instances[0].destroy();
    }
}

// ----
// utils
// ----
function reset() {
    this._needsUpdate = false;
}

function dispatch(array, e) {
    for (let i = 0; i < array.length; i++) {
        array[i](e);
    }
}

// ----
// event
// ----
function onEvent(e) {
    this._event = e;

    if (!this._needsUpdate) {
        this._needsUpdate = true;
        this.start();
        dispatch(this._events[this._eventType + 'start'], e);
    }

    clearTimeout(this._timer);
    this._timer = setTimeout(this._reset, 128);
}

export default ThrottledEvent;
