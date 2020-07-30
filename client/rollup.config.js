import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    dir: 'public/assets/js',
    format: 'iife',
  },
  plugins: [typescript({ lib: ['es5', 'es6', 'dom'], target: 'es6' })],
};
