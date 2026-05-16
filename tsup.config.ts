import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts', 'src/constants/**/*.ts'],
  format: ['esm', 'cjs'],
  banner: ({ format }) =>
    format === 'cjs'
      ? { js: `Object.defineProperty(exports, '__esModule', { value: true });` }
      : {},
  dts: true,
  sourcemap: true,
  clean: true,
  minify: !options.watch,
  keepNames: true,
  skipNodeModulesBundle: true,
  outExtension: ({ format }) => ({
    js: format === 'cjs' ? '.cjs' : '.mjs',
  }),
  target: 'esnext',
  treeshake: true,
  bundle: true,
}));
