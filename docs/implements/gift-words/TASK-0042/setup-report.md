# TASK-0042 設定作業実行

## 作業概要

- **タスクID**: TASK-0042
- **タスク名**: コード分割とLazy Loading実装
- **作業内容**: React.lazy + Suspenseによるコード分割と、vite.config.tsのパフォーマンス最適化設定
- **実行日時**: 2025-01-23
- **実行者**: Claude Code
- **タスクタイプ**: DIRECT（パフォーマンス最適化）

## 設計文書参照

- **参照文書**:
  - `docs/tasks/gift-words-phase4.md` (TASK-0042セクション)
  - `docs/tech-stack.md` (技術スタック定義)
  - `docs/design/gift-words/architecture.md` (アーキテクチャ設計)
- **関連要件**:
  - NFR-001: ページ読み込み時間3秒以内
  - NFR-003: バンドルサイズ500KB以下（gzip圧縮後）
  - NFR-004: Lighthouseパフォーマンススコア90点以上

## 実行した作業

### 1. LoadingSpinnerコンポーネントの作成

**作成ファイル**: `src/components/common/LoadingSpinner/`

#### LoadingSpinner.tsx
```typescript
import React from 'react';
import styles from './LoadingSpinner.module.css';

/**
 * LoadingSpinnerコンポーネント
 *
 * ページ読み込み中に表示されるローディングスピナー。
 * React.lazyによるコード分割時のSuspenseフォールバックとして使用。
 *
 * @requirements
 * - NFR-001: ページ読み込み時間3秒以内（コード分割によるパフォーマンス最適化）
 * - NFR-205: キーボード操作可能（スクリーンリーダー対応）
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <p className={styles.text}>読み込み中...</p>
      <span className="sr-only">ページを読み込んでいます</span>
    </div>
  );
};

export default LoadingSpinner;
```

**実装内容**:
- ローディングスピナーのアニメーション（CSS Animations使用）
- アクセシビリティ対応（role="status", aria-live="polite"）
- スクリーンリーダー対応（.sr-only クラス）

#### LoadingSpinner.module.css
```css
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(74, 144, 226, 0.2);
  border-top-color: var(--color-primary, #4a90e2);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.text {
  margin-top: var(--spacing-lg, 24px);
  font-size: var(--font-size-lg, 18px);
  color: #666;
}
```

**設定内容**:
- スピナーアニメーション: 0.8秒で1回転
- レスポンシブ対応: min-height: 100vh
- CSS変数使用: カラーとスペーシングの一貫性

#### index.ts
```typescript
export { default } from './LoadingSpinner';
```

**設定内容**:
- デフォルトエクスポートによるインポート簡略化

---

### 2. App.tsxの更新（React.lazy + Suspense導入）

**更新ファイル**: `src/App.tsx`

#### 変更前
```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DisplayPage from './pages/DisplayPage';
import ErrorPage from './pages/ErrorPage';
import './styles/global.css';

function App() {
  return (
    <Router basename="/贈る言葉">
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/display" element={<DisplayPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}
```

#### 変更後
```typescript
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';
import './styles/global.css';

// コード分割によるページの遅延読み込み
const HomePage = lazy(() => import('./pages/HomePage'));
const DisplayPage = lazy(() => import('./pages/DisplayPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

function App() {
  return (
    <Router basename="/贈る言葉">
      <div className="app">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/display" element={<DisplayPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}
```

**変更内容**:
- `React.lazy()`によるページコンポーネントの遅延読み込み
- `Suspense`でラップしてローディング表示
- `LoadingSpinner`をフォールバックに設定

**期待効果**:
- 初回ロード時のバンドルサイズを削減（NFR-003）
- ページ遷移時のみ必要なコードをロード
- 初期表示速度の向上（NFR-001）

---

### 3. vite.config.tsの最適化

**更新ファイル**: `vite.config.ts`

#### 追加設定: terserOptions

```typescript
build: {
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
}
```

**設定内容**:

1. **compress設定**:
   - `drop_console: true`: 本番ビルドでconsole.logを削除
   - `drop_debugger: true`: debuggerステートメントを削除
   - `dead_code: true`: 到達不可能なコードを削除
   - `conditionals: true`: 条件式を最適化
   - `passes: 2`: 圧縮を2回実行（より積極的な最適化）

2. **mangle設定**:
   - `safari10: true`: Safari 10互換性を保ちつつ変数名を短縮

3. **chunkSizeWarningLimit**:
   - 500KB: NFR-003のバンドルサイズ目標に合わせた閾値設定

**既存設定の確認**:
```typescript
rollupOptions: {
  output: {
    manualChunks: {
      'react-vendor': ['react', 'react-dom', 'react-router-dom'],
      'html2canvas-vendor': ['html2canvas']
    }
  }
}
```

**期待効果**:
- バンドルサイズの大幅削減（20-30%削減見込み）
- console.log削除によるパフォーマンス向上
- ライブラリの適切な分割によるキャッシュ効率向上

---

## 作業結果

- [x] LoadingSpinnerコンポーネントの作成完了
  - LoadingSpinner.tsx作成
  - LoadingSpinner.module.css作成
  - index.ts作成
- [x] App.tsxの更新完了
  - React.lazy導入
  - Suspense導入
  - LoadingSpinnerをフォールバックに設定
- [x] vite.config.tsの最適化完了
  - terserOptions設定追加
  - 圧縮オプション最適化
  - chunkSizeWarningLimit設定

## 作成ファイル一覧

1. `src/components/common/LoadingSpinner/LoadingSpinner.tsx` - ローディングスピナーコンポーネント
2. `src/components/common/LoadingSpinner/LoadingSpinner.module.css` - スタイルシート
3. `src/components/common/LoadingSpinner/index.ts` - エクスポートファイル
4. `src/App.tsx` - React.lazy + Suspense追加（更新）
5. `vite.config.ts` - terserOptions設定追加（更新）

## 遭遇した問題と解決方法

### 問題なし

本タスクは設定作業のため、特に問題は発生しませんでした。

## パフォーマンス最適化の仕組み

### 1. コード分割（Code Splitting）

**実装前**:
```
app.js (全ページのコードを含む) → 大きな初期バンドルサイズ
```

**実装後**:
```
app.js (Appコンポーネントのみ)
├── HomePage.lazy.js (初回アクセス時のみロード)
├── DisplayPage.lazy.js (/displayアクセス時のみロード)
└── ErrorPage.lazy.js (404時のみロード)
```

**期待効果**:
- 初期バンドルサイズ: 50-60%削減
- 初回ロード時間: 1-1.5秒短縮
- Time to Interactive (TTI): 改善

### 2. Terser圧縮最適化

**圧縮前のコード例**:
```javascript
function calculateTotal(items) {
  console.log('Calculating total...', items);
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}
```

**圧縮後のコード（drop_console + mangle + passes:2）**:
```javascript
function a(b){let c=0;for(let d=0;d<b.length;d++)c+=b[d].price;return c}
```

**期待効果**:
- ファイルサイズ: 60-70%削減
- 変数名短縮によるさらなるサイズ削減
- console.log削除によるランタイムパフォーマンス向上

### 3. ライブラリの適切な分割（manualChunks）

**分割戦略**:
```
react-vendor.js (React, ReactDOM, React Router)
  ↓ ほぼ変更されない → 長期キャッシュ可能

html2canvas-vendor.js (html2canvas)
  ↓ 独立したライブラリ → 必要時のみロード

HomePage.lazy.js
DisplayPage.lazy.js
ErrorPage.lazy.js
  ↓ 頻繁に更新される → 個別キャッシュ管理
```

**期待効果**:
- キャッシュヒット率: 80%以上
- リピーターのロード時間: 90%削減

## 次のステップ

1. **動作確認**:
   ```bash
   npm run dev
   ```
   - ページ遷移時にLoadingSpinnerが表示されることを確認
   - 各ページが正常に読み込まれることを確認

2. **ビルド確認**:
   ```bash
   npm run build
   ```
   - エラーなくビルドできることを確認
   - dist/フォルダにチャンクが分割されていることを確認
   - チャンクサイズが500KB以下であることを確認

3. **検証実行**:
   ```bash
   /tsumiki:direct-verify
   ```
   - Lighthouseスコア測定
   - バンドルサイズ測定
   - パフォーマンス指標確認

## 実装後の確認項目

- [ ] `npm run dev` でエラーが出ない
- [ ] `npm run build` でエラーが出ない
- [ ] ページ遷移時にLoadingSpinnerが表示される
- [ ] 各ページが正常に読み込まれる
- [ ] TypeScript型エラーがない
- [ ] dist/assets/ にチャンクファイルが生成される
- [ ] react-vendor.js, html2canvas-vendor.js が分離される
- [ ] バンドルサイズが500KB以下（gzip圧縮後）
- [ ] Lighthouse Performance 90+点
- [ ] console.logが本番ビルドで削除されている

## 技術的補足

### React.lazyの仕組み

```typescript
const HomePage = lazy(() => import('./pages/HomePage'));
```

1. `lazy()`関数が動的import()を受け取る
2. コンポーネントが初めて必要になった時点でimport実行
3. ロード中はSuspenseのfallbackを表示
4. ロード完了後、コンポーネントをレンダリング

### Suspenseの役割

```typescript
<Suspense fallback={<LoadingSpinner />}>
  <Routes>...</Routes>
</Suspense>
```

- 子コンポーネントの非同期ロードを検知
- ロード中はfallback（LoadingSpinner）を表示
- ロード完了後、実際のコンポーネントに置き換え

### Terserの動作

1. **AST解析**: コードをASTに変換
2. **最適化**: 不要なコード削除、条件式最適化
3. **Mangle**: 変数名・関数名を短縮
4. **圧縮**: 空白・改行削除、式の簡略化
5. **出力**: 最適化されたコードを生成

## まとめ

TASK-0042の設定作業を完了しました。

**実装内容**:
1. LoadingSpinnerコンポーネント作成（3ファイル）
2. App.tsxにReact.lazy + Suspense導入
3. vite.config.tsにterserOptions設定追加

**期待効果**:
- 初期バンドルサイズ: 50-60%削減
- ページ読み込み時間: 1-1.5秒短縮
- Lighthouseスコア: 10-15点向上
- ユーザー体験: ローディング表示による待機時間の明示化

次は `/tsumiki:direct-verify` を実行して、実装が正しく動作することを確認してください。
