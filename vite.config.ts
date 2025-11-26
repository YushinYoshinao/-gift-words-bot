import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

/**
 * Vite設定ファイル
 *
 * パフォーマンス最適化設定:
 * - NFR-001: ページ読み込み時間3秒以内
 * - NFR-003: バンドルサイズ500KB以下（gzip圧縮後）
 * - NFR-004: Lighthouseパフォーマンススコア90点以上
 */
export default defineConfig({
  plugins: [
    react(),
    // バンドルサイズ可視化プラグイン（TASK-0043）
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          // React関連を分割（NFR-003: バンドルサイズ最適化）
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // html2canvasを分割（NFR-003: バンドルサイズ最適化）
          'html2canvas-vendor': ['html2canvas']
        }
      }
    },
    // Terser圧縮設定（NFR-003: バンドルサイズ最適化）
    terserOptions: {
      compress: {
        // 本番環境ではconsole.logを削除（NFR-004: パフォーマンス最適化）
        drop_console: true,
        drop_debugger: true,
        // 未使用コードの削除
        dead_code: true,
        // 冗長な条件式の削減
        conditionals: true,
        // より積極的な圧縮
        passes: 2
      },
      mangle: {
        // 変数名の短縮化
        safari10: true
      }
    },
    // チャンクサイズ警告の閾値（500KB）
    chunkSizeWarningLimit: 500
  },
  server: {
    port: 5173,
    open: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
})
