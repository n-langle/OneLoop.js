export default (element, context) => typeof element === 'string' ? 
	(context || document).querySelectorAll(element) 
	: 
	element.length >= 0 ? element : [element]
