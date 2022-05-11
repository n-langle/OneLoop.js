import assign from '../function/assign';
import ThrottledEvent from './ThrottledEvent';

var instances = [],
    resize = null,
    specialCharRegExp = new RegExp('(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]|&([a-zA-Z]{2,6}|#[0-9]{2,5});|<|>)', 'g');

function SplittedText(element, options) {
    assign(this, SplittedText.defaults, options);

    this._originalInnerHTML = element.innerHTML;
    this._element = element;
    this._onResize = onResize.bind(this);

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
            lastOffsetTop, offsetTop, children, i;

        if (this.byWord || this.byLine) {
            element.innerHTML = preserveCode(element);
            element.innerHTML = split(element, ' ', this.wordWrapper);
        }

        if (this.byLine) {
            resize.add('resize', this._onResize);

            children = element.children;
            lastOffsetTop = children[0].offsetTop;

            for (i = 0; i < children.length; i++) {
                offsetTop = children[i].offsetTop;

                if (lastOffsetTop !== offsetTop) {
                    html += this.lineWrapper(line.substring(-1)) + ' ';
                    line = '';
                }

                lastOffsetTop = offsetTop;
                line += children[i].outerHTML + ' ';
            }

            element.innerHTML = html + this.lineWrapper(line);
        }
    
        if (this.byChar) {
            element.innerHTML = wrapSpecialChar(element, this.charWrapper);
            element.innerHTML = split(element, '', function(char) {
                return char !== ' ' ? that.charWrapper(char) : ' ';
            }, this.preserve);
        }

        return this;
    } 
});

// ----
// events
// ----
function onResize() {
    this.restore().split();
}
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
            return text.replace('<', '&lt;');
        },
        function(child) {
            return preserveCode(child);
        }
    );
}

function wrapSpecialChar(element, wrap) {
    return traverseNode(
        element,
        function(text) {
            return text.replace(specialCharRegExp, wrap);
        },
        function(child) {
            return getNewOuterHTML(child, wrapSpecialChar(child, wrap));
        }
    );
}

function split(element, separator, wrap, preserve) {
    return traverseNode(
        element,
        function(text) {
            return text.trim() !== '' ? 
                text.split(separator).map(wrap).join(separator) 
                : 
                text;
        },
        function(child) {
            return preserve && child.classList.contains(preserve) ?
                child.outerHTML
                :
                getNewOuterHTML(child, split(child, separator, wrap));
        }
    )
}

function getNewOuterHTML(node, strReplacement) {
    return node.outerHTML.replace('>' + node.innerHTML + '<', '>' + strReplacement + '<');
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
