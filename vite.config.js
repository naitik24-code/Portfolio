import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        hud: resolve(__dirname, 'hud/index.html'),
        classic: resolve(__dirname, 'classic/index.html'),
      },
    },
  },
});
