import { version, author, license, repository } from "../package.json";

export default {
    name: 'rollup-insert-informations',
    renderChunk: function(code) {
        return `/**
* @license
* Copyright 2022 OneLoop.js
* Author: ${ author }
* Repository: ${ repository.url }
* Version: ${ version }
* SPDX-License-Identifier: ${ license }
* 
* Credit for easing functions goes to : https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
*/
${ code }`;
    }
};
