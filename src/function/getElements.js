export default function (element, context) {
    return typeof element === 'string' ? (context || document).querySelectorAll(element) : element.length >= 0 ? element : [element];
}
