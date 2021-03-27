export default {
	name: 'rollup-mangle-private-properties',
	renderChunk: function(code) {
		var old = {},
			i = 0;

		return code.replace(/\._([a-zA-Z0-9]*)/g, function(match) {
			
			if (!old[match]) {
				old[match] = i;
				i++;
			}

			return '._' + String.fromCharCode(97 + old[match]);
		});
	}
};