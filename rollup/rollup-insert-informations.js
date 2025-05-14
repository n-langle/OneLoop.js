import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

export default {
    name: 'rollup-insert-informations',
    renderChunk: function(code) {
        return `/**
* @license
* Copyright 2022 OneLoop.js
* Author: ${ pkg.author }
* Repository: ${ pkg.repository.url }
* Version: ${ pkg.version }
* SPDX-License-Identifier: ${ pkg.license }
* 
* Credit for easing functions goes to : https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
* Credit for Emoji regexp goes to : https://medium.com/reactnative/emojis-in-javascript-f693d0eb79fb
*/
${ code }`
    }
}
