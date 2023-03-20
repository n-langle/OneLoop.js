import MainLoopEntry from './MainLoopEntry'

const instances = []

class ThrottledEvent extends MainLoopEntry {
    constructor(target, eventType, name) {
        super()
        
        const events = {}

        events[eventType + 'start'] = []
        events[eventType] = []
        events[eventType + 'end'] = []

        this._events = events
        this._needsUpdate = false
        this._timer = null
        this._target = target
        this._eventType = eventType
        this._event = null
        this._name = name || ''
        this._reset = () => { this._needsUpdate = false }
        this._onEvent = (e) => {
            this._event = e

            if (!this._needsUpdate) {
                this._needsUpdate = true
                this.start()
                dispatch(this._events[this._eventType + 'start'], e)
            }

            clearTimeout(this._timer)
            this._timer = setTimeout(this._reset, 128)
        }

        this._target.addEventListener(this._eventType, this._onEvent, {passive: true})
    }

    destroy() {
        const index = instances.indexOf(this)

        if (index > -1) {
            instances.splice(index, 1)
        }

        this._target.removeEventListener(this._eventType, this._onEvent)
    }

    add(when, callback) {
        if (this._events[when].indexOf(callback) === -1) {
            this._events[when].push(callback)
        }

        return this
    }

    remove(when, callback) {
        const index = this._events[when].indexOf(callback)

        if (index > -1) {
            this._events[when].splice(index, 1)
        }

        return this
    }

    hasEvent() {
        const
            events = this._events,
            eventType = this._eventType

        return events[eventType + 'start'].length + events[eventType].length + events[eventType + 'end'].length > 0
    }

    update(timestamp, tick) {
        dispatch(this._events[this._eventType], this._event)
        super.update(timestamp, tick)
        return this
    }

    complete(timestamp, tick) {
        dispatch(this._events[this._eventType + 'end'], this._event)
        super.complete(timestamp, tick)
        return this
    }

    needsUpdate() {
        return this._needsUpdate
    }

    // ----
    // statics
    // ----
    static getInstance(target, eventType, name) {
        let found

        name = name || ''

        for (let i = 0; i < instances.length; i++) {
            let instance = instances[i]
            if (instance._eventType === eventType && instance._target === target && instance._name === name) {
                found = instances[i]
                break
            }
        }

        if (!found) {
            found = new ThrottledEvent(target, eventType, name)
            instances.push(found)
        }

        return found
    }

    static destroy() {
        while (instances[0]) {
            instances[0].destroy()
        }
    }
}

// ----
// utils
// ----
function dispatch(array, e) {
    for (let i = 0; i < array.length; i++) {
        array[i](e)
    }
}

export default ThrottledEvent
