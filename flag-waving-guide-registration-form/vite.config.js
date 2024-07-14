import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/flag-waving-guide-registration-form/',  // ここにプロジェクト名を設定
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/*',
          dest: ''
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      }
    }
  }
});
