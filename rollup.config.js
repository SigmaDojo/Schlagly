import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'src/main.ts',
  dest: './app/shlagly.js',

  moduleName: 'Shlagly',

  format: 'iife',

  plugins: [
    typescript()
  ]
};