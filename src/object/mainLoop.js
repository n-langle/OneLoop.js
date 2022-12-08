const entries = [];
let raf = null;

export default {
    add(entry) {
        if (entries.indexOf(entry) === -1) {
            entries.push(entry);
            
            if (raf === null) {
                this.start();
            }
        }

        return this;
    },

    remove(entry) {
        const index = entries.indexOf(entry);

        if (index > -1) {
            entries.splice(index, 1);
        }

        return this;
    },

    start() {
        let lastTime;

        if (raf === null) { 

            lastTime = performance.now();
            
            function loop(timestamp) {
                const tick = (timestamp - lastTime) / 16.66;
                    
                for (let i = 0; i < entries.length; i++) {					
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

    stop() {
        cancelAnimationFrame(raf);
        raf = null;
        return this;
    },

    destroy() {
        entries.length = 0;
        this.stop();
    }
};
