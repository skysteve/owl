import typescript from '@rollup/plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: 'src/main.ts',
    output: {
      dir: 'public/assets/js',
      format: 'esm',
    },
    plugins: [
      resolve(),
      typescript({ lib: ['es5', 'es6', 'dom'], target: 'es6', include: ['src/**'], exclude: ['workers/**'] }),
    ],
  },
  {
    input: 'workers/api/index.ts',
    output: {
      file: 'public/assets/js/workers/apiWorker.js',
      format: 'esm',
    },
    plugins: [resolve(), typescript({ lib: ['es5', 'es6', 'webworker'], target: 'es6', include: ['workers/**'] })],
  },
];
