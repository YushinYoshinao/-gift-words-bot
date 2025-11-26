# パフォーマンス最適化チェックリスト

**タスクID**: TASK-0043
**作成日**: 2025-11-23
**関連要件**: NFR-003（バンドルサイズ500KB以下）, NFR-004（Lighthouse 90点以上）

---

## 📦 バンドルサイズ最適化

### JavaScript最適化
- [x] **コード分割（React.lazy）** - TASK-0042で実装済み
  - HomePage, DisplayPage, NotFoundページを分割
  - React.lazy + Suspenseで遅延ロード
- [x] **Tree shaking** - Viteのデフォルト機能で有効
- [x] **不要なconsole.log削除** - terserOptions.compress.drop_console = true
- [x] **Minification（Terser）** - vite.config.tsで設定済み
  - drop_console: true
  - drop_debugger: true
  - dead_code: true
  - passes: 2
- [x] **Manual Chunks設定** - react-vendor, html2canvas-vendorを分離

### 目標値
- [ ] 総バンドルサイズ（gzip）: < 500KB
- [ ] react-vendor.js: < 150KB
- [ ] html2canvas-vendor.js: < 100KB
- [ ] その他チャンク: 各 < 50KB

---

## 🖼️ 画像最適化

### 画像設定
- [x] **loading属性** - BackgroundImage: loading="eager"（重要な背景画像）
- [x] **decoding属性** - BackgroundImage: decoding="async"
- [ ] **適切な画像フォーマット** - 現在PNG、WebP変換を検討
- [ ] **画像圧縮** - 武田鉄矢.pngの最適化を検討
- [ ] **レスポンシブ画像** - 必要に応じてsrcset追加

### 推奨作業
```bash
# WebP変換（オプション）
# npm install --save-dev @squoosh/lib
# または手動で変換ツールを使用
```

---

## 🎨 CSS最適化

### 現状
- [x] **CSS Modules使用** - スコープ化されたCSS
- [x] **未使用CSS削除** - CSS Modulesで自動除外
- [x] **Critical CSS** - Viteが自動インライン化

### 確認項目
- [ ] CSSファイルサイズが適切（各 < 10KB）
- [ ] 不要なスタイルがない
- [ ] グローバルCSSが最小限

---

## ⚡ フォント最適化

### 実装済み（TASK-0043）
- [x] **Preconnect** - fonts.googleapis.com, fonts.gstatic.com
- [x] **DNS-prefetch** - 早期DNS解決
- [x] **非同期読み込み** - media="print" onload="this.media='all'"
- [x] **フォールバック** - noscriptタグで保証
- [x] **display=swap** - Google Fontsのクエリパラメータに含まれる

### フォント設定
```
Noto Sans JP: 400, 600
Noto Serif JP: 400, 600
```

---

## 📄 HTML最適化

### 実装済み（TASK-0043）
- [x] **SEOメタタグ** - description, keywords, author
- [x] **OGPメタタグ** - og:title, og:description, og:type, og:locale
- [x] **lang属性** - lang="ja"
- [x] **viewport設定** - width=device-width, initial-scale=1.0
- [x] **文字コード** - UTF-8

---

## 🚀 Lighthouse最適化項目

### Performance（目標: 90+点）
- [x] First Contentful Paint（FCP）対策
  - フォントpreconnect
  - Critical CSS
- [x] Largest Contentful Paint（LCP）対策
  - 画像loading/decoding属性
  - コード分割
- [x] Total Blocking Time（TBT）対策
  - JavaScript minification
  - Tree shaking
- [x] Cumulative Layout Shift（CLS）対策
  - 画像サイズ指定（CSS）
  - フォントdisplay=swap

### Accessibility（目標: 90+点）
- [x] セマンティックHTML - 実装済み
- [x] ARIA属性 - 実装済み
- [x] キーボード操作 - 実装済み
- [x] 色コントラスト - デザイン確認済み

### Best Practices（目標: 90+点）
- [x] HTTPS使用 - GitHub Pages
- [x] 安全なJavaScript - Reactエスケープ
- [x] エラーハンドリング - ErrorBoundary実装済み

### SEO（目標: 90+点）
- [x] メタタグ設定 - 実装済み
- [x] title設定 - 実装済み
- [x] alt属性 - 画像に設定済み
- [x] 構造化データ - OGP設定済み

---

## 🔍 バンドル分析ツール

### rollup-plugin-visualizer設定
```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

plugins: [
  react(),
  visualizer({
    open: true,
    gzipSize: true,
    brotliSize: true,
    filename: 'dist/stats.html'
  })
]
```

### 使用方法
```bash
# バンドル分析実行
npm run analyze

# 生成されるファイル
# dist/stats.html - ビジュアル分析レポート
```

---

## 📊 Lighthouse測定

### 測定コマンド
```bash
# ビルド + プレビュー起動 + Lighthouse実行
npm run lighthouse

# 生成されるファイル
# lighthouse-report.html - Lighthouseレポート
```

### 確認項目
- [ ] Performance: 90+点
- [ ] Accessibility: 90+点
- [ ] Best Practices: 90+点
- [ ] SEO: 90+点

---

## 🎯 最終確認チェックリスト

### ビルド確認
```bash
# TypeScript型チェック
npm run type-check

# ESLint
npm run lint

# テスト実行
npm test

# ビルド実行
npm run build

# バンドルサイズ確認
npm run analyze
```

### パフォーマンス確認
```bash
# Lighthouse測定
npm run lighthouse

# プレビュー確認
npm run preview
```

### 目標達成確認
- [ ] バンドルサイズ（gzip）: < 500KB ✅
- [ ] Lighthouse Performance: 90+ 点
- [ ] Lighthouse Accessibility: 90+ 点
- [ ] Lighthouse Best Practices: 90+ 点
- [ ] Lighthouse SEO: 90+ 点
- [ ] ページ読み込み時間: < 3秒
- [ ] アニメーションフレームレート: 60fps

---

## 📝 次のステップ

1. **バンドル分析実行**
   ```bash
   npm run analyze
   ```

2. **Lighthouse測定**
   ```bash
   npm run lighthouse
   ```

3. **結果の確認と記録**
   - setup-report.mdに測定結果を記録
   - 改善が必要な項目を特定

4. **検証フェーズへ移行**
   ```bash
   /tsumiki:direct-verify
   ```

---

## 🔗 参考リソース

### 公式ドキュメント
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Web Vitals](https://web.dev/vitals/)

### 最適化ガイド
- [Image Optimization](https://web.dev/fast/#optimize-your-images)
- [JavaScript Performance](https://web.dev/fast/#optimize-your-javascript)
- [Font Optimization](https://web.dev/font-best-practices/)
