import rollupBundleWrapper from './rollup/rollup-bundle-wrapper-es5';
import rollupManglePrivateProperties from './rollup/rollup-mangle-private-properties';

export default {
  input: 'src/main.js',
  plugins: [rollupBundleWrapper],//, rollupManglePrivateProperties],
  output: {
    file: 'build/bundle.js',
    format: 'cjs'
  }
};