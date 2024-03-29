export default {
    name: 'rollup-mangle-private-properties',
    renderChunk: function(code) {
        const 
            old = {}
        let i = 0

        return code.replace(/\._([a-zA-Z0-9]*)/g, function(match) {

            if (typeof old[match] === 'undefined') {
                old[match] = i % 26
                i++
            }

            return '._' + String.fromCharCode(97 + old[match])
        })
    }
}
