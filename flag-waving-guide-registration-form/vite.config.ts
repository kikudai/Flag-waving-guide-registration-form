import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from "path";
import dotenv from 'dotenv';

dotenv.config();

const base = '/flag-waving-guide-registration-form/';

export default defineConfig({
  base,
  root: 'src',
  publicDir: '../public',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, "public/*"),
          dest: resolve(__dirname, "../docs2"),
        }
      ]
    })
  ],
  build: {
    outDir: '../../docs2',
    rollupOptions: {
      input: {
        main: 'src/index.html',
      },
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
