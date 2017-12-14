import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'demos/src/demo.js',
  dest: 'demos/local/demo.js',
  format: 'umd',
  moduleName: 'OLoad',
  plugins: [
    resolve(),
    commonjs({
			ignore: [
				'fs',
			],
      include: [
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/systemjs/dist/index.js',
      ],
    }),
  ],
};
