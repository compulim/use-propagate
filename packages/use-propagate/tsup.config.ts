import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'use-propagate': './src/index.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true
  }
]);
