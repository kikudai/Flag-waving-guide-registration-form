import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const base = '/flag-waving-guide-registration-form/';

export default defineConfig({
  base,
  plugins: [
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
        main: './public/index.html',
      }
    }
  },
  server: {
    host: true,
    port: 5173,
    open: true,
    fs: {
      strict: false,
    },
  }
});
