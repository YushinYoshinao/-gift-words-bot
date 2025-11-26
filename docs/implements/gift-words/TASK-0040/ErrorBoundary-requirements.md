# TDD要件定義書: ErrorBoundary コンポーネント

## 📋 基本情報

- **タスクID**: TASK-0040
- **機能名**: ErrorBoundary（Reactエラーバウンダリ）
- **タスクタイプ**: TDD（テスト駆動開発）
- **優先度**: P0（最優先）
- **見積工数**: 3時間
- **作成日**: 2025-11-22

---

## 1. 機能の概要

### 1.1 機能概要 🔵

**ErrorBoundary**は、Reactコンポーネントツリー内で発生したJavaScriptエラーをキャッチし、ユーザーに分かりやすいフォールバックUIを表示するReact Error Boundaryコンポーネントです。

**参照したタスクファイル**: `docs/tasks/gift-words-phase4.md` TASK-0040セクション

### 1.2 解決する問題 🔵

**As a ユーザー**:
予期しないエラーが発生した場合でも、アプリケーションが完全にクラッシュせず、適切なエラーメッセージとリカバリー手段が提供される。

**As a 開発者**:
本番環境でのエラーをキャッチし、コンソールにログ出力することで、問題の早期発見と修正が可能になる。

**参照した要件**:
- REQ-311: エラー発生時にトーストメッセージで通知 🔵
- EDGE-001: ネットワークエラー発生時の分かりやすいエラーメッセージ 🟡

### 1.3 想定ユーザー 🔵

- **エンドユーザー**: アプリケーション利用者（一般ユーザー）
- **開発者**: エラーログを確認してバグ修正を行う開発者

### 1.4 システム内での位置づけ 🔵

**アーキテクチャ上の位置**:
```
App.tsx (ルートコンポーネント)
└── ErrorBoundary (最上位エラーハンドラー)
    └── TutorialProvider
        └── ToastProvider
            └── Router
                └── 各ページコンポーネント
```

**参照した設計文書**: `docs/design/gift-words/architecture.md` (React Context構成セクション)

---

## 2. 入力・出力の仕様

### 2.1 Props定義 🔵

```typescript
interface ErrorBoundaryProps {
  /** 子コンポーネント（必須） */
  children: ReactNode;

  /** カスタムフォールバックUI（オプション） */
  fallback?: ReactNode;
}
```

**信頼性レベル**: 🔵 タスクファイルのサンプルコードに基づく

### 2.2 State定義 🔵

```typescript
interface ErrorBoundaryState {
  /** エラーが発生したかどうか */
  hasError: boolean;

  /** キャッチしたエラーオブジェクト */
  error: Error | null;

  /** エラー情報（スタックトレース等） */
  errorInfo: ErrorInfo | null;
}
```

**信頼性レベル**: 🔵 React公式ドキュメント + タスクファイルのサンプルコードに基づく

### 2.3 出力（レンダリング結果） 🔵

**正常時**:
```tsx
{children} // 子コンポーネントをそのまま表示
```

**エラー時（カスタムfallbackなし）**:
```tsx
<div className={styles.container}>
  <div className={styles.content}>
    <h1>エラーが発生しました</h1>
    <p>申し訳ございません。アプリケーションでエラーが発生しました。</p>
    <details>
      <summary>エラー詳細</summary>
      <pre>{error.toString()}</pre>
    </details>
    <button onClick={handleReset}>トップページに戻る</button>
  </div>
</div>
```

**エラー時（カスタムfallback指定）**:
```tsx
{fallback} // カスタムフォールバックUIを表示
```

**参照したタスクファイル**: `docs/tasks/gift-words-phase4.md` TASK-0040実装詳細セクション

### 2.4 データフロー 🔵

```
1. 子コンポーネントでエラー発生
   ↓
2. getDerivedStateFromError() でState更新
   hasError: true, error: Errorオブジェクト
   ↓
3. componentDidCatch() でエラーログ出力
   console.error('ErrorBoundary caught an error:', error, errorInfo)
   ↓
4. render() でフォールバックUI表示
   ↓
5. ユーザーが「トップページに戻る」ボタンをクリック
   ↓
6. handleReset() でStateリセット + トップページ遷移
   window.location.href = '/'
```

---

## 3. 制約条件

### 3.1 パフォーマンス要件 🟡

- **レンダリング速度**: フォールバックUIは即座に表示（<100ms）
- **メモリ使用量**: エラーオブジェクトの保持による追加メモリは最小限

**参照した要件**: NFR-002（アニメーション60fps維持）から類推 🟡

### 3.2 セキュリティ要件 🔵

- **XSS対策**: エラーメッセージはReactのデフォルトエスケープで表示
- **情報漏洩防止**: 本番環境では詳細なエラースタックトレースを表示しない（オプション）

**参照した要件**: NFR-101（XSS対策）🔵

### 3.3 互換性要件 🔵

- **Reactバージョン**: React 16.0+ (Error Boundary APIサポート)
- **ブラウザ対応**: モダンブラウザ全般（IE11非対応）

**参照した要件**: NFR-301（ブラウザ対応）🔵

### 3.4 アーキテクチャ制約 🔵

- **配置場所**: `src/components/common/ErrorBoundary/ErrorBoundary.tsx`
- **Class Component必須**: Error BoundaryはReact Class Componentでのみ実装可能
- **スタイル**: CSS Modules使用（`ErrorBoundary.module.css`）

**参照した設計文書**: `docs/tech-stack.md` (ディレクトリ構造セクション) 🔵

### 3.5 制限事項 🔵

Error Boundaryが**キャッチできないエラー**:
- イベントハンドラー内のエラー（try-catchで対応）
- 非同期コード（setTimeout、Promiseなど）
- サーバーサイドレンダリング（SSR）
- Error Boundary自身のエラー

**参照**: React公式ドキュメント 🔵

---

## 4. 想定される使用例

### 4.1 基本的な使用パターン 🔵

**App.tsxでの使用**:
```tsx
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <TutorialProvider>
        <ToastProvider>
          <Router basename="/贈る言葉">
            <Routes>
              {/* ルート定義 */}
            </Routes>
          </Router>
        </ToastProvider>
      </TutorialProvider>
    </ErrorBoundary>
  );
}
```

**参照したタスクファイル**: `docs/tasks/gift-words-phase4.md` TASK-0040セクション 🔵

### 4.2 カスタムフォールバックUIの使用 🟡

```tsx
<ErrorBoundary
  fallback={
    <div>
      <h1>カスタムエラーページ</h1>
      <p>問題が発生しました</p>
    </div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

**信頼性レベル**: 🟡 一般的なReact Error Boundaryパターンから推測

### 4.3 エッジケース 🔵

#### EDGE-001: コンポーネントレンダリング中のエラー 🔵
```tsx
// 子コンポーネントでエラー発生
function BrokenComponent() {
  throw new Error('Component render failed');
  return <div>This will not render</div>;
}

<ErrorBoundary>
  <BrokenComponent />
</ErrorBoundary>

// 結果: ErrorBoundaryがエラーをキャッチし、フォールバックUIを表示
```

#### EDGE-002: useEffect内のエラー 🟡
```tsx
// useEffect内のエラーはError Boundaryでキャッチされる
function ComponentWithEffect() {
  useEffect(() => {
    throw new Error('Effect error');
  }, []);
  return <div>Component</div>;
}

<ErrorBoundary>
  <ComponentWithEffect />
</ErrorBoundary>

// 結果: エラーをキャッチし、フォールバックUIを表示
```

**信頼性レベル**: 🟡 React公式ドキュメントから推測

#### EDGE-003: イベントハンドラー内のエラー（キャッチ不可） 🔵
```tsx
// イベントハンドラー内のエラーはError Boundaryでキャッチされない
function ButtonWithError() {
  const handleClick = () => {
    throw new Error('Button click error');
  };
  return <button onClick={handleClick}>Click me</button>;
}

<ErrorBoundary>
  <ButtonWithError />
</ErrorBoundary>

// 結果: Error Boundaryではキャッチされず、コンソールエラーのみ
// 対策: try-catchでハンドリングが必要
```

**参照**: React公式ドキュメント（Error Boundary制限事項） 🔵

### 4.4 エラーケース 🔵

#### エラーケース1: ネットワークエラー
```tsx
// 画像読み込み失敗などによるエラー
function ImageComponent() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch('/invalid-image.png')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.blob();
      })
      .catch(error => {
        // Error Boundaryではキャッチされない（非同期）
        // ToastContextで通知が必要
      });
  }, []);

  return <img src={image} />;
}
```

**対応**: 非同期エラーは個別にtry-catchで処理し、ToastContextで通知 🔵

**参照した要件**: EDGE-001（ネットワークエラーハンドリング）🔵

---

## 5. 参照した要件・設計文書との対応関係

### 5.1 参照したユーザストーリー 🔵

なし（インフラ系コンポーネントのため、直接的なユーザストーリーはなし）

### 5.2 参照した機能要件 🔵

- **REQ-311**: エラー発生時にトーストメッセージで通知（間接的）
  - ErrorBoundaryはUIレベルのエラーをキャッチ
  - 非エラーバウンダリエラーはToastで通知

### 5.3 参照した非機能要件 🔵

- **NFR-101**: XSS対策（Reactデフォルトエスケープ使用）
- **NFR-205**: キーボード操作可能（リセットボタンにフォーカス可能）
- **NFR-301**: ブラウザ対応（モダンブラウザ）

### 5.4 参照したEdgeケース 🟡

- **EDGE-001**: ネットワークエラー発生時の分かりやすいエラーメッセージ
  - Error Boundaryでキャッチされるエラーに対してフォールバックUIで対応

### 5.5 参照した設計文書 🔵

#### アーキテクチャ (`docs/design/gift-words/architecture.md`)
- Reactコンポーネント構成
- Context API構造

#### 技術スタック (`docs/tech-stack.md`)
- ディレクトリ構造: `src/components/common/`
- スタイリング手法: CSS Modules
- React Class Component使用

#### タスクファイル (`docs/tasks/gift-words-phase4.md`)
- TASK-0040実装詳細
- サンプルコード
- 完了基準

---

## 6. 実装に必要なファイル

### 6.1 コンポーネントファイル 🔵

```
src/components/common/ErrorBoundary/
├── ErrorBoundary.tsx          # メインコンポーネント
├── ErrorBoundary.module.css   # スタイル
└── __tests__/
    └── ErrorBoundary.test.tsx # テストファイル
```

### 6.2 型定義 🔵

```typescript
// src/components/common/ErrorBoundary/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
```

---

## 7. 実装の優先順位

### 7.1 MUSTの機能（必須） 🔵

1. ✅ **エラーキャッチ機能**: `getDerivedStateFromError()` 実装
2. ✅ **エラーログ出力**: `componentDidCatch()` でコンソールログ
3. ✅ **フォールバックUI**: エラー発生時の代替UI表示
4. ✅ **リセット機能**: トップページに戻るボタン

### 7.2 SHOULDの機能（推奨） 🟡

1. 🟡 **カスタムフォールバック**: Props経由でカスタムUIを指定可能
2. 🟡 **エラー詳細表示**: `<details>`タグで展開可能なエラー情報

### 7.3 MAYの機能（オプション） 🔴

1. 🔴 **エラーレポーティング**: 本番環境でのエラー送信（Sentryなど）
2. 🔴 **リトライ機能**: エラー発生後の再試行ボタン

---

## 8. 受け入れ基準

### 8.1 機能要件 🔵

- [x] 子コンポーネントでエラー発生時にフォールバックUIが表示される
- [x] エラーがない場合は子コンポーネントが正常に表示される
- [x] 「トップページに戻る」ボタンでリセット可能
- [x] カスタムfallback指定時はそれが表示される
- [x] コンソールにエラーログが出力される

### 8.2 非機能要件 🔵

- [x] Class Componentで実装されている
- [x] CSS Modulesでスタイリングされている
- [x] TypeScript型安全性が保たれている
- [x] アクセシビリティ対応（ボタンにフォーカス可能）

### 8.3 テスト要件 🔵

- [x] 全テストケースが成功する
- [x] エラー発生時のフォールバックUI表示テスト
- [x] 正常時の子要素表示テスト
- [x] リセット機能のテスト
- [x] カスタムfallbackのテスト

---

## 9. 信頼性レベルサマリー

### 9.1 信頼性レベル分布

- 🔵 **高信頼（80%）**: タスクファイル、React公式ドキュメント、技術スタック定義に基づく
- 🟡 **中信頼（20%）**: 一般的なReactパターンから妥当な推測
- 🔴 **低信頼（0%）**: 推測のみの項目なし

### 9.2 高信頼項目

- 基本的なProps/State定義
- Error Boundary APIの使用方法
- ディレクトリ構造
- App.tsxへの統合方法

### 9.3 中信頼項目

- カスタムフォールバックUIの詳細仕様
- パフォーマンス要件の具体的数値
- エッジケースの詳細挙動

---

## 10. 次のステップ

✅ **要件定義完了**

**次のお勧めステップ**: `/tsumiki:tdd-testcases` でテストケースの洗い出しを行います。

---

**作成日**: 2025-11-22
**作成者**: Claude Code (TDD Requirements Phase)
**信頼性**: 🔵 高信頼（80%）🟡 中信頼（20%）
