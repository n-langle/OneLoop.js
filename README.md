OneLoop.js
==========

[npm]: https://img.shields.io/npm/v/oneloop.js
[npm-url]: https://www.npmjs.com/package/oneloop.js
[build-size]: https://badgen.net/bundlephobia/minzip/oneloop.js
[build-size-url]: https://bundlephobia.com/result?p=oneloop.js

[![NPM Package][npm]][npm-url]
[![Build Size][build-size]][build-size-url]

The aim of the project is to create an easy to use, lightweight, cross-browser, animation library. The following documentation is not exhaustive, but provide the basic informations to use the library. Take a look at the code if you want to know more.

Check out some examples on [codepen](https://codepen.io/collection/zxWBGm)

## ScrollObserver

This code will create a scroll observer :

```javascript
import { ScrollObserver } from 'oneloop.js';

const scrollObserver = new ScrollObserver();

scrollObserver.observe('.css-selector', {
    onVisible: function(scrollInformations, percentRTW, percentRTE) {
        // do something when element is visible
    }
});
```

### Options
```javascript
/**
 * constructor
 * @param options
 * @return this 
 */
const scrollObserver = new ScrollObserver({
    scrollDivider: 2, // default: 1, smooth the scroll value
    onRefresh: function() {}, // triggered when the height of the document change or when the window is resized
});
```

### Methods
```javascript
/**
 * observe
 * @param element = selector, NodeList, NodeElement
 * @param options = ScrollObserverEntry options
 * @return this 
 */
scrollObserver.observe(element, {
    children: '.css-selector', // selector, NodeList, NodeElement
    disableCheckOnAxis: 'y', // default: '', disable check on specific axis
    onVisibilityStart: function(scrollInformations, percentRTW, percentRTE) {
        // your code ...
    },
    onVisible: function(scrollInformations, percentRTW, percentRTE) {
        /**
         * Available for all callbacks :
         * 
         * this.element = current observed node element
         * this.children = NodeList selected by the css selector inside the element
         * 
         * scrollInformations = { 
         *      scroll: <Vector2>
         *      delta: <Vector2>
         *      direction: <Vector2>
         * }
         * percentRTW = vector2 of percent of distance covered by the element inside the window (Relative To Window)
         * percentRTE = vector2 of percent of distance covered by the element from his start and end position (Relative To Element, usefull for elements at the document top and bottom)
         */
    },
    onVisibilityEnd: function(scrollInformations, percentRTW, percentRTE) {
        // your code ...
    },
    onAlways: function(scrollInformations, percentRTW, percentRTE) {
        // your code ...
    }
});

/**
 * unobserve
 * @param element = selector, NodeList, NodeElement
 * @return this 
 */
scrollObserver.unobserve(element);

/**
 * hasEntry
 * @return bool
 */
scrollObserver.hasEntry();

/**
 * synchronise
 *      Force scrollObserver with scrollDivider > 1 to be equal to the current window scroll value
 * @return bool
 */
scrollObserver.synchronise();

/**
 * destroy
* @return undefined
 */
scrollObserver.destroy();
```

## Tween

This code will create a tween :

```javascript
import { Tween } from 'oneloop.js';

new Tween({
    onUpdate: function(timestamp, tick, percent) {
        // your code ...
    }
});
```

### Options
```javascript
/**
 * constructor
 * @param options
 * @return this 
 */
const tween = new Tween({
    delay: 500,             // default: 0,
    duration: 500,          // default: 1000,
    easing: 'easeInCubic',  // default: 'linear', see easings below for available functions
    loop: 1000,             // default: 0,
    reverse: true,          // default: false, reverse the animation at each loop
    autoStart: false,       // default: true
    onStart: function(timestamp, tick, percent) {
        // your code ...
    },
    onUpdate: function(timestamp, tick, percent) {
        // your code ...
    },
    onComplete: function(timestamp, tick, percent) {
        // your code ...
    },
    onStop: function() {
        // your code ...
    }
});
```

### Methods
```javascript
/**
 * start 
 *      reverse at each call if option reverse is set to true
 *      continue if the tween has been previously paused
 * 
 * @param delay = override the option delay if needed
 * @return this 
 */
tween.start(delay);

/**
 * pause
 * @return this 
 */
tween.pause();

/**
 * reset
 * 		reset the tween to its intial state, call onUpdate with timestamp, tick and percent equal to 0
 * 
 * @return this 
 */
tween.reset();

/**
 * stop
 * @return this 
 */
tween.stop();
```

## ThrottledEvent

This code will create a throttled/debounced event :

```javascript
import { ThrottledEvent } from 'oneloop.js';

const resize = new ThrottledEvent(window, 'resize');

resize.add('resizestart', function(event) {
    // your code when window resize start
});

resize.add('resize', function(event) {
    // your code when window is resized
});

resize.add('resizeend', function(event) {
    // your code when window resize end
});
```

If you want create only one event for all your script, you can use it as a singleton by calling the static method get instance :
```javascript
import { ThrottledEvent } from 'oneloop.js';

const resize1 = ThrottledEvent.getInstance(window, 'scroll');

// later in your script
const resize2 = ThrottledEvent.getInstance(window, 'scroll'); // this will return the instance resize1
```

### Options
```javascript
/**
 * constructor
 * @param element = NodeElement
 * @param eventType
 * @return this 
 */
const throttledEvent = new ThrottledEvent(element, eventType);
```

### Methods
```javascript
/**
 * add
 * @param eventPhase = event, eventstart, eventend
 * @param callback
 * @return this 
 */
throttledEvent.add(eventPhase, callback);

/**
 * remove
 * @param eventPhase = event, eventstart, eventend
 * @param callback
 * @return this 
 */
throttledEvent.remove(eventPhase, callback);

/**
 * hasEvent - test if an event phase has been added
 * @return bool 
 */
throttledEvent.hasEvent();

/**
 * destroy
 * @return undefined
 */
throttledEvent.destroy();
```

## SplittedText

SplittedText support emoji, credit for the emoji regexp goes to [Kevin Scott](https://medium.com/reactnative/emojis-in-javascript-f693d0eb79fb).
This will split a text into line, word or/and char :

```javascript
import { SplittedText } from 'oneloop.js';

const splittedText = new SplittedText(element, { byWord: true });
```

### Options
```javascript
/**
 * constructor
 * @param options
 * @return this 
 */
const splittedText = new SplittedText({
    autoSplit: false,       // default: true, split the text in the constructor
    byLine: false,          // default: false, split the content by line
    byWord: false,          // default: false, split the content by word
    byChar: false,          // default: false, split the text by char
    preserve: 'st-char',    // default: st-char, must be equal to the class used in charWrapper function
    lineWrapper: function(line) {
        return '<span class="st-line">' + line + '</span>';
    },
    wordWrapper: function(word) {
        return '<span class="st-word">' + word + '</span>';
    },
    charWrapper: function(char) {
        return '<span class="st-char">' + char + '</span>';
    },
});
```

### Methods
```javascript
/**
 * restore
 * @return this 
 */
splittedText.restore();

/**
 * split
 * @return this 
 */
splittedText.split();

/**
 * destroy
 * @return undefined
 */
splittedText.destroy();
```

## Vector2

OneLoop use internally Vector2 class and expose it for your convenience :

```javascript
import { Vector2 } from 'oneloop.js';

const v1 = new Vector2();     // {x: 0, y: 0}
const v2 = new Vector2(5);    // {x: 5, y: 5}
const v2 = new Vector2(3, 5); // {x: 3, y: 5}
```

### Options
```javascript
/**
 * constructor
 * @param Number x
 * @param Number y
 * @return this 
 */
const vector2 = new Vector2();
```

### Methods
```javascript
vector2.set(x, y)

vector2.add(vector2)

vector2.addScalar(scalar)

vector2.subtract(vector2)

vector2.subtractScalar(scalar)

vector2.multiply(vector2)

vector2.multiplyScalar(scalar)

vector2.divide(vector2)

vector2.divideScalar(scalar)

vector2.magnitude()

vector2.normalize()

vector2.reverse()

vector2.copy(vector2)

vector2.clone()

vector2.angle()

vector2.rotate(angle)
```

## easings

Set of easings functions, credit goes to [ai/easings.net](https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts)

```javascript
import { Tween, easings } from 'oneloop.js';

const tween = new Tween({
    easing: 'linear',
    onUpdate: function(timestamp, tick, percent) {
        const value1 = easings.easeInCubic(percent);
        const value2 = easings.easeOutExpo(percent);

        // your code ...
    }
});
```

### list of available easings functions :
- linear
- easeInQuad
- easeOutQuad
- easeInOutQuad
- easeInCubic
- easeOutCubic
- easeInOutCubic
- easeInQuart
- easeOutQuart
- easeInOutQuart
- easeInQuint
- easeOutQuint
- easeInOutQuint
- easeInSine
- easeOutSine
- easeInOutSine
- easeInExpo
- easeOutExpo
- easeInOutExpo
- easeInCirc
- easeOutCirc
- easeInOutCirc
- easeInBack
- easeOutBack
- easeInOutBack
- easeInElastic
- easeOutElastic
- easeInOutElastic
- easeInBounce
- easeOutBounce
- easeInOutBounce