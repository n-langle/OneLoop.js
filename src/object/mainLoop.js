var entries = [],
    raf = null;

export default {
    add: function(entry) {
        if (entries.indexOf(entry) === -1) {
            entries.push(entry);
            
            if (raf === null) {
                this.start();
            }
        }

        return this;
    },

    remove: function(entry) {
        var index = entries.indexOf(entry)
        if (index > -1) {
            entries.splice(index, 1)[0].stop()
        }

        return this;
    },

    start: function() {
        var lastTime;

        if (raf === null) { 

            lastTime = performance.now();
            
            function loop(timestamp) {
                var tick = (timestamp - lastTime) / (1000 / 60),
                    i;
                    
                for (i = 0; i < entries.length; i++) {					
                    if (entries[i].needsUpdate(timestamp)) {
                        entries[i].update(timestamp, tick);
                    } else {
                        entries.splice(i, 1)[0].complete(timestamp, tick);
                        i--;
                    }
                }

                if (entries.length) {
                    lastTime = timestamp;
                    raf = requestAnimationFrame(loop)
                } else {
                    raf = null;
                }
            }

            raf = requestAnimationFrame(loop);
        }

        return this;
    },

    stop: function() {
        cancelAnimationFrame(raf);
        raf = null;
        return this;
    },

    destroy: function() {
        entries.length = 0;
        this.stop();
    }
}
