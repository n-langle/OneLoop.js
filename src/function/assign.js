export default function() {
	var args = arguments,
		rt = args[0],
		i, prop;
		

	for (i = 1; i < args.length; i++) {
		for(prop in args[i]) {
			if (typeof args[i][prop] !== 'undefined') {
				rt[prop] = args[i][prop];
			}
		}
	}

	return rt
}