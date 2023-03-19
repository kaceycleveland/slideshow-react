import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const isProd = process.env.NODE_ENV === 'production';
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'slideshowReact',
      formats: ['es', 'umd'],
      fileName: (format) => `slideshow-react.${format}.js`,
    },
    sourcemap: isProd ? false : true,
    rollupOptions: {
      external: ['react', 'react-dom', 'src/dev'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
