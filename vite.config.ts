import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3000,
    proxy: {
      '/predict': {
        target: 'https://5acc-160-20-123-9.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/predict-and-log': {
        target: 'https://5acc-160-20-123-9.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/predict-file': {
        target: 'https://5acc-160-20-123-9.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});
