/* eslint-disable no-useless-escape */
export default {
    name: 'rollup-insert-constants',
    renderChunk: function(code) {
        const constants = {
            '__window__': 'window',
            '__html__': 'document.documentElement',
            '__Math__': 'Math',
			'__pow__': '__Math__.pow',
			'__sqrt__': '__Math__.sqrt',
			'__sin__': '__Math__.sin',
			'__cos__': '__Math__.cos',
			'__PI__': '__Math__.PI',
			'__max__': '__Math__.max',
			'__min__': '__Math__.min',
			'__abs__': '__Math__.abs',
			'__round__': '__Math__.round'
        }

        let str = 'const '

        for (let name in constants) {
            str += name + '=' + constants[name] + ','
            code = code.replace(new RegExp(constants[name].replace('.', '\.'), 'g'), name)
        }

        str = str.substring(0, str.length - 1)
        str += ';'

        return str + code
    }
}
