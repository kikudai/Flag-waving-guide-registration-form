import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import dotenv from 'dotenv';

dotenv.config();

const base = '/flag-waving-guide-registration-form/';

export default defineConfig({
  base,
  root: 'src',
  publicDir: '../public', // 公開ディレクトリの設定
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/*', // 公開ディレクトリ内のファイルをコピー
          dest: '../docs' // ルートにコピー
        }
      ]
    })
  ],
  build: {
    outDir: '../../docs', // ビルド出力先
    rollupOptions: {
      input: {
        main: 'src/index.html', // エントリーポイント
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
