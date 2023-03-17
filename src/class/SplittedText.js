/* eslint-disable no-empty-character-class */
import assign from '../function/assign'
import ThrottledEvent from './ThrottledEvent'

const 
    instances = [],
    specialCharRegExp = /(((?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])((\u200D(\u2640|\u2642)\uFE0F)|[]))|&([a-zA-Z]{2,6}|#[0-9]{2,5});|<|>)/g,
    whiteCharRegExp = /(\s)/
let resize = null
    
class SplittedText {
    constructor(element, options) {
        assign(this, SplittedText.defaults, options)

        this._originalInnerHTML = element.innerHTML
        this._element = element
        this._onResize = this.split.bind(this)

        if (!resize) {
            resize = new ThrottledEvent(window, 'resize')
        }

        if (this.autoSplit) {
            this.split()
        }

        instances.push(this)
    }

    destroy() {
        this.restore()

        instances.splice(instances.indexOf(this), 1)

        if (!instances.length) {
            resize.destroy()
            resize = null
        }
    }

    restore() {
        this._element.innerHTML = this._originalInnerHTML
        resize.remove('resize', this._onResize)

        return this
    }

    split() {
        const element = this._element

        element.innerHTML = this._originalInnerHTML

        if (this.byLine) {
            wrapByWord(element, word => '<span class="st-word-temp">' + word + '</span>')
            
            const
                children = element.children,
                lineWrapper = (line, suffix) => line ? this.lineWrapper(line) + suffix : ''
            let line = '',
                html = '',
                lastOffsetTop = children[0].offsetTop

            resize.add('resize', this._onResize)

            for (let i = 0; i < children.length; i++) {
                const
                    child = children[i],
                    offsetTop = child.offsetTop,
                    isBR = child.tagName === 'BR'

                if (lastOffsetTop !== offsetTop || isBR) {
                    html += lineWrapper(line.substring(-1), ' ')
                    line = ''
                }

                if (!isBR) {
                    line += child.outerHTML + ' '
                } else {
                    html += '<br />'
                }

                lastOffsetTop = offsetTop
            }

            element.innerHTML = html + lineWrapper(line, '')
            element.innerHTML = unwrap(element, 'st-word-temp')
        }

        if (this.byWord) {
            wrapByWord(element, this.wordWrapper)
        }
    
        if (this.byChar) {
            element.innerHTML = wrapSpecialChar(element, this.charWrapper)
            element.innerHTML = split(
                element,
                '',
                char => !whiteCharRegExp.test(char) ? this.charWrapper(char) : char,
                this.preserve
            )
        }

        return this
    }
}

// ----
// defaults
// ----
SplittedText.defaults = {
    autoSplit: true,
    byLine: false,
    byWord: false,
    byChar: false,
    preserve: 'st-char',
    lineWrapper(line) {
        return '<span class="st-line">' + line + '</span>'
    },
    wordWrapper(word) {
        return '<span class="st-word">' + word + '</span>'
    },
    charWrapper(char) {
        return '<span class="st-char">' + char + '</span>'
    },
}

// ----
// utils
// ----
function traverseNode(element, textCallback, nodeCallback) {
    const 
        childNodes = element.childNodes
    let html = ''

    for (let i = 0; i < childNodes.length; i++) {
        let child = childNodes[i]

        if (child.nodeType === 3) {
            html += textCallback(child.data)
        } else if (child.nodeType === 1) {
            html += nodeCallback(child)
        }
    }
    
    return html
}

function preserveCode(element) {
    return traverseNode(
        element,
        text => text.replace('<', '[<]'),
        child => getNewOuterHTML(child, preserveCode(child))
    )
}

function wrapSpecialChar(element, wrapper) {
    return traverseNode(
        element,
        text => text.replace(specialCharRegExp, wrapper),
        child => getNewOuterHTML(child, wrapSpecialChar(child, wrapper))
    )
}

function split(element, separator, wrapper, preserve) {
    return traverseNode(
        element,
        text => {
            const trimmedText = text.trim()

            return trimmedText !== '' ?
                (separator === '' ? text : trimmedText).split(separator).map(wrapper).join(separator) 
                : 
                text
        },
        child => {
            return preserve && child.classList.contains(preserve) ?
                child.outerHTML
                :
                getNewOuterHTML(child, split(child, separator, wrapper, preserve))
        }
    )
}

function unwrap(element, className) {
    return traverseNode(
        element,
        text => text,
        child => child.classList.contains(className) ?
            child.innerHTML
            :
            getNewOuterHTML(child, unwrap(child, className))
    )
}

function getNewOuterHTML(node, strReplacement) {
    return node.outerHTML.replace('>' + node.innerHTML + '<', '>' + strReplacement + '<')
}

function wrapByWord(element, wrapper) {
    element.innerHTML = preserveCode(element)
    element.innerHTML = split(element, ' ', wrapper).replace('[<]', '&lt;')
}

// ----
// static
// ----
SplittedText.destroy = function() {
    while (instances[0]) {
        instances[0].destroy()
    }
}

export default SplittedText
