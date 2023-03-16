export default {
	name: 'rollup-insert-constants',
	renderChunk: function(code) {
			const constants = {
				'__window__': 'window',
				'__html__': 'document.documentElement',
				'__Math__': 'Math',
			};

			let str = 'const ';

			for (let name in constants) {
				str += name + '=' + constants[name] + ',';
				code = code.replace(new RegExp(constants[name].replace('.', '\.'), 'g'), name);
			}

			str = str.substring(0, str.length - 1);
			str += ';';

			return str + code;
	}
};