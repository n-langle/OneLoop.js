import rollupInsertInformations from './rollup/rollup-insert-informations.js'
import rollupInsertConstants from './rollup/rollup-insert-constants.js'
import rollupManglePrivateProperties from './rollup/rollup-mangle-private-properties.js'
import { minify } from 'rollup-plugin-esbuild-minify'

const plugins = []
let fileName = 'OneLoop'

/* eslint-disable-next-line no-undef */
if (process.env.BUILD === 'production') {
    fileName += '.min'
    plugins.push(rollupInsertConstants)
    plugins.push(rollupManglePrivateProperties)
    plugins.push(minify())
}

plugins.push(rollupInsertInformations)

export default {
    input: 'src/main.js',
    plugins: plugins,
    output: {
        file: 'build/' + fileName + '.js',
        format: 'es'
    }
}
