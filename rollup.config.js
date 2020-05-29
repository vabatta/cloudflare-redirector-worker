import { terser } from 'rollup-plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import sucrase from '@rollup/plugin-sucrase';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';
import json from '@rollup/plugin-json';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';

export default {
	input: 'src/index.ts',
	output: [
		{
			file: pkg.main,
			format: 'es',
			exports: 'named',
			sourcemap: false
		}
	],
	plugins: [
		del({ targets: 'dist/*' }),

		resolve({
			extensions: ['.mjs', '.js', '.ts', '.json']
		}),
		sucrase({
			transforms: ['typescript']
		}),

		// resolve(),
		// typescript(),

		commonjs(),
		json({
			preferConst: true
		}),

		analyze(),
		isProd && terser({ ecma: 2018 })
	]
};
