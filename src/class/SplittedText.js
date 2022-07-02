import assign from '../function/assign';
import ThrottledEvent from './ThrottledEvent';

var instances = [],
    resize = null,
    specialCharRegExp = /(((?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])((\u200D(\u2640|\u2642)\uFE0F)|[]))|&([a-zA-Z]{2,6}|#[0-9]{2,5});|<|>)/g,
    whiteCharRegExp = /(\s)/;

function SplittedText(element, options) {
    assign(this, SplittedText.defaults, options);

    this._originalInnerHTML = element.innerHTML;
    this._element = element;
    this._onResize = this.split.bind(this);

    if (!resize) {
        resize = new ThrottledEvent(window, 'resize');
    }

    if (this.autoSplit) {
        this.split();
    }

    instances.push(this);
}

SplittedText.defaults = {
    autoSplit: true,
    byLine: false,
    byWord: false,
    byChar: false,
    preserve: 'st-char',
    lineWrapper: function(line) {
        return '<span class="st-line">' + line + '</span>';
    },
    wordWrapper: function(word) {
        return '<span class="st-word">' + word + '</span>';
    },
    charWrapper: function(char) {
        return '<span class="st-char">' + char + '</span>';
    },
}

assign(SplittedText.prototype, {
    destroy: function() {
        this.restore();

        instances.splice(instances.indexOf(this),  1);

        if (!instances.length) {
            resize.destroy();
            resize = null;
        }
    },

    restore: function() {
        this._element.innerHTML = this._originalInnerHTML;
        resize.remove('resize', this._onResize);

        return this;
    },

    split: function() {
        var element = this._element,
            that = this,
            line = '',
            html = '',
			lineWrapper = function(line, suffix) {
				return line ? that.lineWrapper(line) + suffix : '';
			},
            lastOffsetTop, offsetTop, children, child, i;

        element.innerHTML = this._originalInnerHTML;

        if (this.byLine) {
            resize.add('resize', this._onResize);

            wrapByWord(element, function(word) {
                return '<span class="st-word-temp">' + word + '</span>';
            });

            children = element.children;
            lastOffsetTop = children[0].offsetTop;

            for (i = 0; i < children.length; i++) {
				child = children[i];
				offsetTop = child.offsetTop;

				if (lastOffsetTop !== offsetTop) {
					html += lineWrapper(line.substring(-1), ' ');
					line = '';
				}

				if (child.tagName !== 'BR') {
					line += child.outerHTML + ' ';
				} else {
					html += '<br />';
				}

				lastOffsetTop = offsetTop;
            }

            element.innerHTML = html + lineWrapper(line, '');
            element.innerHTML = unwrap(element, 'st-word-temp');
        }

        if (this.byWord) {
            wrapByWord(element, this.wordWrapper);
        }
    
        if (this.byChar) {
            element.innerHTML = wrapSpecialChar(element, this.charWrapper);
            element.innerHTML = split(element, '', function(char) {
				return !whiteCharRegExp.test(char) ? that.charWrapper(char) : char;
			}, this.preserve);
        }

        return this;
    } 
});

// ----
// utils
// ----
function traverseNode(element, textCallback, nodeCallback) {
    var childNodes = element.childNodes,
        html = '',
        child,
        i;

    for (i = 0; i < childNodes.length; i++) {
        child = childNodes[i];

        if (child.nodeType === 3) {
            html += textCallback(child.data);
        } else if (child.nodeType === 1) {
            html += nodeCallback(child);
        }
    }
    
    return html;
}

function preserveCode(element) {
    return traverseNode(
        element,
        function(text) {
            return text.replace('<', '[<]');
        },
        function(child) {
            return getNewOuterHTML(child, preserveCode(child));
        }
    );
}

function wrapSpecialChar(element, wrapper) {
    return traverseNode(
        element,
        function(text) {
            return text.replace(specialCharRegExp, wrapper);
        },
        function(child) {
            return getNewOuterHTML(child, wrapSpecialChar(child, wrapper));
        }
    );
}

function split(element, separator, wrapper, preserve) {
    return traverseNode(
        element,
        function(text) {
			var trimmedText = text.trim();

            return trimmedText !== '' ?
                (separator === '' ? text : trimmedText).split(separator).map(wrapper).join(separator) 
                : 
                text;
        },
        function(child) {
            return preserve && child.classList.contains(preserve) ?
                child.outerHTML
                :
                getNewOuterHTML(child, split(child, separator, wrapper, preserve));
        }
    );
}

function unwrap(element, className) {
    return traverseNode(
        element,
        function(text) {
            return text;
        },
        function(child) {
            return child.classList.contains(className) ?
                child.innerHTML
                :
                getNewOuterHTML(child, unwrap(child, className));
        }
    );
}

function getNewOuterHTML(node, strReplacement) {
    return node.outerHTML.replace('>' + node.innerHTML + '<', '>' + strReplacement + '<');
}

function wrapByWord(element, wrapper) {
    element.innerHTML = preserveCode(element);
    element.innerHTML = split(element, ' ', wrapper).replace('[<]', '&lt;');
}

// ----
// static
// ----
SplittedText.destroy = function() {
    while (instances[0]) {
        instances[0].destroy();
    }
}

export default SplittedText;
