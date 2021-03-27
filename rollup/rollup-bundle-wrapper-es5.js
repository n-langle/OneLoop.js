export default {
	name: 'rollup-bundle-wrapper-es5',
	renderChunk: function(code) {
		return '(function(window, document, undefined){' + code + '\n})(window, document)';
	}
};