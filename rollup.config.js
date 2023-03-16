import rollupInsertInformations from './rollup/rollup-insert-informations';
import rollupInsertConstants from './rollup/rollup-insert-constants';
import rollupManglePrivateProperties from './rollup/rollup-mangle-private-properties';
import { uglify } from "rollup-plugin-uglify";

const plugins = [];
let fileName = 'OneLoop';

if (process.env.BUILD === 'production') {
    fileName += '.min';
    plugins.push(rollupInsertConstants);
    plugins.push(rollupManglePrivateProperties);
    plugins.push(uglify({
        toplevel: true
    }));
}

plugins.push(rollupInsertInformations);

export default {
    input: 'src/main.js',
    plugins: plugins,
    output: {
        file: 'build/' + fileName + '.js',
        format: 'es'
    }
};