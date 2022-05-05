import MainLoopEntry from './MainLoopEntry';
import assign from '../function/assign';

var instances = [];

function ThrottledEvent(target, eventType) {
    MainLoopEntry.call(this, {autoStart: false});
    
    var events = {}

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

assign(ThrottledEvent.prototype, 
    MainLoopEntry.prototype, {

    destroy: function() {
        var i;

        for (i = 0; i < instances.length; i++) {
            if (instances[i].instance === this) {
                instances.splice(i, 1);
            }
        }

        this._target.removeEventListener(this._eventType, this._onEvent);
    },

    add: function(when, callback) {
        if (this._events[when].indexOf(callback) === -1) {
            this._events[when].push(callback);
        }

        return this;
    },

    remove: function(when, callback) {
        var index = this._events[when].indexOf(callback)
        if (index > -1) {
            this._events[when].splice(index, 1);
        }
        return this;
    },

    update: function(timestamp, tick) {
        callCallbacks(this._events[this._eventType], this._event);
        return this;
    },

    complete: function(timestamp, tick) {
        callCallbacks(this._events[this._eventType + 'end'], this._event);
        return this;
    },

    needsUpdate: function(timestamp) {
        return this._needsUpdate;
    }
});

ThrottledEvent.getInstance = function(target, eventType) {
    var instance, i;

    for (i = 0; i < instances.length; i++) {
        if (instances[i].eventType === eventType && instances[i].target === target) {
            instance = instances[i].instance;
        }
    }

    if (!instance) {
        instance = new ThrottledEvent(target, eventType);
        
        instances.push({
            instance: instance,
            target: target,
            eventType: eventType
        });
    }

    return instance;
}

ThrottledEvent.destroy = function() {
    while (instances.length) {
        instances[0].instance.destroy()
    }
}

// ----
// utils
// ----
function reset() {
    this._needsUpdate = false;
}

function callCallbacks(array, e) {
    var i = 0;

    for (; i < array.length; i++) {
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
        callCallbacks(this._events[this._eventType + 'start'], e);
    }

    clearTimeout(this._timer);
    this._timer = setTimeout(this._reset, 128);
}

export default ThrottledEvent;
