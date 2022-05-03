import { version } from "../package.json";

export default {
	name: 'rollup-insert-informations',
	renderChunk: function(code) {
		return `/**
 * @license
 * Copyright 2022 OneLoop.js
 * Author: Nicolas Langle
 * Repository: https://github.com/n-langle/OneLoop.js
 * Version: ${ version }
 * SPDX-License-Identifier: MIT
 * 
 * Credit for easing functions goes to : https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 */
${ code }`;
	}
};