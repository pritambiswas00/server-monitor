import path from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: './',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./vitest.setup.ts'],
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
     alias: {
      "@": path.resolve(__dirname, 'src')
     }
  }
});
