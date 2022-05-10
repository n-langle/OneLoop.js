OneLoop.js
==========

[npm]: https://img.shields.io/npm/v/oneloop.js
[npm-url]: https://www.npmjs.com/package/oneloop.js
[build-size]: https://badgen.net/bundlephobia/minzip/oneloop.js
[build-size-url]: https://bundlephobia.com/result?p=oneloop.js

[![NPM Package][npm]][npm-url]
[![Build Size][build-size]][build-size-url]

The aim of the project is to create an easy to use, lightweight, cross-browser, animation library. The following documentation is not exhaustive, but provide the basic informations to use the library. Take a look at the code if you want to know more.

## ScrollObserver

This code will create a scroll observer :

```javascript
import { ScrollObserver } from './build/OneLoop.min.js';

const scrollObserver = new ScrollObserver();

scrollObserver.observe('.css-selector', {
    onVisible: function(scrollInformations, percentRTW, percentRTE) {
        // do something when element is visible
    }
});
```

### Options
```javascript
const scrollObserver = new ScrollObserver({
    scrollDivider: 2, // default: 1, smooth the scroll value
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
         *      y
         *      deltaY
         *      directionY
         * }
         * percentRTW = percent of distance covered by the element inside the window (Relative To Window)
         * percentRTE = percent of distance covered by the element from his start and end position (Relative To Element, usefull for elements at the document top and bottom)
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
 * destroy
* @return undefined
 */
scrollObserver.destroy();
```

## Tween

This code will create a tween :

```javascript
import { Tween } from './build/OneLoop.min.js';

new Tween({
    onUpdate: function(timestamp, tick, percent) {
        // your code ...
    }
});
```

### Options
```javascript
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
 * start (reverse at each call if option reverse is set to true)
 * @param delay = override the option delay if needed
 * @return this 
 */
tween.start(delay);

/**
 * stop
 * @return this 
 */
tween.stop();
```

## ThrottledEvent

This code will create a throttled/debounced event :

```javascript
import { ThrottledEvent } from './build/OneLoop.min.js';

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
import { ThrottledEvent } from './build/OneLoop.min.js';

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
import { SplittedText } from './build/OneLoop.min.js';

const splittedText = new SplittedText(element, { byWord: true });
```

### Options
```javascript
const splittedText = new SplittedText({
    autoSplit: false,       // default: true, split the text in the constructor
    byLine: false,          // default: false, split the content by line
    byWord: false,          // default: false, split the content by word (the text will be splitted by word if byLine is set to true, even if byWord is set to false)
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

## easings

Set of easings functions, credit goes to [ai/easings.net](https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts)

```javascript
import { Tween, easings } from './build/OneLoop.min.js';

const tween = new Tween({
    easing: 'linear',
    onUpdate: function(timestamp, tick, percent) {
        const value1 = easings.easeInCubic(percent);
        const value2 = easings.easeOutExpo(percent);

        // your code ...
    }
});

// list of available easings functions :
easings.linear();
easings.easeInQuad();
easings.easeOutQuad();
easings.easeInOutQuad();
easings.easeInCubic();
easings.easeOutCubic();
easings.easeInOutCubic();
easings.easeInQuart();
easings.easeOutQuart();
easings.easeInOutQuart();
easings.easeInQuint();
easings.easeOutQuint();
easings.easeInOutQuint();
easings.easeInSine();
easings.easeOutSine();
easings.easeInOutSine();
easings.easeInExpo();
easings.easeOutExpo();
easings.easeInOutExpo();
easings.easeInCirc();
easings.easeOutCirc();
easings.easeInOutCirc();
easings.easeInBack();
easings.easeOutBack();
easings.easeInOutBack();
easings.easeInElastic();
easings.easeOutElastic();
easings.easeInOutElastic();
easings.easeInBounce();
easings.easeOutBounce();
easings.easeInOutBounce();
```