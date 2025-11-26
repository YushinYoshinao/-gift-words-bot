# TASK-0039: ImageSaveButton 要件定義書

## 📋 基本情報

- **タスクID**: TASK-0039
- **機能名**: ImageSaveButton (画像保存ボタンコンポーネント)
- **タスクタイプ**: TDD（テスト駆動開発）
- **優先度**: P0（最優先）
- **依存タスク**: TASK-0038 (useImageExport カスタムフック)
- **見積工数**: 2時間

## 1. 機能の概要

### 🔵 ユーザーストーリー
**As a** 贈る言葉BOTのユーザー
**I want to** 表示ページを画像として保存するボタンをクリックできる
**So that** 友達に共有するための画像ファイルを手元に保存できる

### 🔵 機能概要
- **何をする機能か**: 表示ページのDOM要素を画像化してPNG形式でダウンロードするボタンコンポーネント
- **どのような問題を解決するか**: ユーザーが贈る言葉を画像として保存し、SNS等で共有できるようにする
- **想定されるユーザー**: 贈る言葉BOTの全ユーザー
- **システム内での位置づけ**: DisplayPageコンポーネントに配置され、useImageExportフックを使用して画像エクスポート機能を提供

### 🔵 参照したEARS要件
- **REQ-301**: 画像保存ボタンを提供
- **REQ-302**: ボタンクリックで表示ページを画像化
- **NFR-205**: キーボードで操作可能（アクセシビリティ）

### 🔵 参照した設計文書
- タスクファイル: `docs/tasks/gift-words-phase4.md` (TASK-0039セクション)
- 依存フック: `src/hooks/useImageExport.ts` (TASK-0038)
- 既存Buttonコンポーネント: `src/components/common/Button/Button.tsx`

## 2. 入力・出力の仕様

### 🔵 コンポーネントProps（入力パラメータ）

```typescript
interface ImageSaveButtonProps {
  /** エクスポート対象の要素のCSSセレクタ */
  targetSelector: string;
  /** ファイル名（オプション、省略時はformatFilename()で日付付き名前生成） */
  filename?: string;
}
```

**Props詳細**:

1. **targetSelector** (必須)
   - **型**: `string`
   - **説明**: 画像化するDOM要素を指定するCSSセレクタ
   - **例**: `".display-container"`, `"#main-content"`
   - **制約**: document.querySelector()で取得可能なセレクタ文字列
   - **参照**: REQ-302（表示ページを画像化）

2. **filename** (オプション)
   - **型**: `string | undefined`
   - **説明**: ダウンロードファイル名（拡張子なし）
   - **例**: `"gift-words"` → ダウンロード時は `"gift-words-20251122.png"`
   - **デフォルト**: 省略時は `formatFilename()` で自動生成
   - **参照**: REQ-306（ファイル名に日付を含める）

### 🔵 コンポーネント出力（レンダリング内容）

**UIコンポーネント構成**:
```typescript
<div className={styles.container}>
  <Button
    onClick={handleClick}
    disabled={isExporting}
    variant="primary"
    aria-label="画像として保存"
  >
    {isExporting ? '保存中...' : '画像として保存'}
  </Button>
  {isExporting && (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className="sr-only">画像を生成しています...</span>
      <div className={styles.spinner} />
    </div>
  )}
</div>
```

**レンダリング要素**:
1. **保存ボタン**: Buttonコンポーネント（既存の共通コンポーネント）
2. **ローディング表示**: エクスポート中のみ表示されるスピナー
3. **スクリーンリーダー対応**: aria-label, role="status", aria-live="polite"

### 🔵 データフロー

```
[ユーザー]
  → クリック
  → handleClick()
  → document.querySelector(targetSelector)
  → exportAsImage(element, filename)
  → [useImageExportフック内部処理]
  → PNG画像ダウンロード
```

**状態管理**:
- `isExporting`: useImageExportフックから取得（エクスポート中フラグ）
- ボタンの無効化: `disabled={isExporting}`
- ボタンテキスト切り替え: `isExporting ? '保存中...' : '画像として保存'`

### 🔵 参照した設計文書
- 型定義: `src/types/index.ts` - ImageExportState インターフェース
- useImageExportフック: `src/hooks/useImageExport.ts` - exportAsImage関数シグネチャ

## 3. 制約条件

### 🔵 アクセシビリティ要件（NFR-205）
- **キーボード操作可能**: Tabキーでフォーカス、Enterキーで実行
- **ARIA属性**: `aria-label="画像として保存"` で明確なラベル提供
- **スクリーンリーダー対応**: ローディング状態を `aria-live="polite"` で通知
- **スクリーンリーダー専用テキスト**: `.sr-only` クラスで視覚的に隠しつつ読み上げ対応

### 🔵 UIデザイン制約
- **既存Buttonコンポーネント使用**: 統一感のため `Button` コンポーネントを再利用
- **variant="primary"**: 主要なアクションのため primary スタイル
- **レスポンシブデザイン**: モバイル（幅768px以下）では幅100%

### 🟡 エラーハンドリング制約
- **要素が見つからない場合**: console.errorでログ出力し、処理を中断
- **exportAsImage内部エラー**: useImageExportフックが処理（Toast通知）

### 🔵 依存関係制約
- **useImageExportフック**: TASK-0038で実装済み
- **Buttonコンポーネント**: 既存の共通コンポーネント
- **formatFilename関数**: `src/utils/dateFormatter.ts`で実装済み

### 🔵 参照したEARS要件
- NFR-205: キーボードで操作可能
- REQ-301: 画像保存ボタンを提供
- REQ-302: ボタンクリックで画像化

## 4. 想定される使用例

### 🔵 基本的な使用パターン

#### ケース1: DisplayPageでの標準的な使用
```typescript
<ImageSaveButton
  targetSelector=".display-container"
  filename="gift-words"
/>
```
**期待される動作**:
1. ユーザーがボタンをクリック
2. `.display-container` 要素を取得
3. useImageExportフックのexportAsImage関数を呼び出し
4. PNG画像として `gift-words-20251122.png` がダウンロードされる

#### ケース2: ファイル名を省略した場合
```typescript
<ImageSaveButton
  targetSelector="#main-content"
/>
```
**期待される動作**:
1. filename省略のため、formatFilename()で自動生成
2. デフォルトファイル名（例: `gift-words-20251122.png`）でダウンロード

### 🔵 エッジケース

#### 🟡 EDGE-001: 対象要素が見つからない場合
```typescript
<ImageSaveButton targetSelector=".non-existent-element" />
```
**期待される動作**:
1. document.querySelector()が`null`を返す
2. console.errorでエラーログ出力
3. 処理を中断（エラーtoastは表示しない）
4. ボタンは元の状態に戻る

**実装要件**:
```typescript
const element = document.querySelector(targetSelector) as HTMLElement;
if (!element) {
  console.error(`Element not found: ${targetSelector}`);
  return;
}
```

#### 🔵 EDGE-002: エクスポート中の連続クリック
**期待される動作**:
1. エクスポート中は `disabled={isExporting}` でボタンが無効化
2. 連続クリックしても再度exportAsImageは呼ばれない

#### 🟡 EDGE-003: 非常に大きな要素のエクスポート
**期待される動作**:
1. useImageExportフック内部で処理
2. 進捗表示（0→30→60→80→100%）でUX向上
3. エラー時はToast通知

### 🔵 キーボード操作ケース（NFR-205）

#### ケース: Tabキーでフォーカス、Enterキーで実行
```
1. Tabキーでボタンにフォーカス移動
2. フォーカスインジケーター表示（outline）
3. Enterキー押下で画像保存開始
4. 保存中はボタンが無効化され、ローディング表示
```

### 🔵 参照したEARS要件
- REQ-302: ボタンクリックで画像化（基本パターン）
- NFR-205: キーボード操作可能（キーボード操作ケース）
- EDGE-001: 要素が見つからない場合のエラー処理（エッジケース）

## 5. EARS要件・設計文書との対応関係

### 参照したユーザストーリー
- **US-004**: 画像ダウンロード機能（F-004）

### 参照した機能要件
- **REQ-301**: 画像保存ボタンを提供 🔵
- **REQ-302**: ボタンクリックで表示ページを画像化 🔵
- **REQ-306**: ファイル名に日付を含める 🔵（formatFilename使用）

### 参照した非機能要件
- **NFR-205**: 全機能をキーボードで操作可能 🔵

### 参照したEdgeケース
- **EDGE-001**: 要素が見つからない場合のエラー処理 🟡

### 参照した受け入れ基準
1. ボタンクリックで画像がダウンロードされる
2. エクスポート中はボタンが無効化される
3. ローディング表示が正しく動作する
4. ARIAラベルが適切に設定される
5. キーボード操作可能

### 参照した設計文書

#### アーキテクチャ
- **コンポーネント構成**: DisplayPageに配置される子コンポーネント
- **依存関係**: useImageExportフック（TASK-0038）、Buttonコンポーネント（既存）

#### データフロー
```
[ImageSaveButton]
  → handleClick()
  → document.querySelector(targetSelector)
  → useImageExport.exportAsImage(element, filename)
  → [html2canvas処理]
  → PNG画像ダウンロード
```

#### 型定義
- **Props型**: `ImageSaveButtonProps` (新規定義)
- **依存型**: `ImageExportState` (TASK-0037で定義済み)

#### 実装ファイル
- **コンポーネント**: `src/components/DisplayPage/ImageSaveButton.tsx`
- **スタイル**: `src/components/DisplayPage/ImageSaveButton.module.css`
- **テスト**: `src/components/DisplayPage/__tests__/ImageSaveButton.test.tsx`

## 6. 実装の注意点

### 🔵 useRefの使用
- **buttonRef**: ボタン要素への参照（将来的なフォーカス制御等に使用可能）
- 現状は宣言のみで使用していないが、アクセシビリティ拡張時に活用

### 🔵 CSS Modules
- `ImageSaveButton.module.css`でスコープ化されたスタイル
- レスポンシブデザイン対応（@media (max-width: 768px)）

### 🔵 スピナーアニメーション
```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```
- シンプルな回転アニメーション（0.8s linear infinite）

### 🟡 非同期処理
- `handleClick`は`async`関数
- `await exportAsImage(element, filename)`で完了を待つ
- エラー処理はuseImageExportフック内部で実施

## 7. テストケース概要

1. 正しくレンダリングされる
2. ボタンクリックでexportAsImageが呼ばれる
3. エクスポート中はボタンが無効化される
4. エクスポート中はローディング表示される
5. 対象要素が存在しない場合はエラーログが出る
6. ARIAラベルが正しく設定される

詳細は `ImageSaveButton-testcases.md` で定義します。

## 8. 完了基準

- [ ] すべてのテストケースが成功する
- [ ] ボタンクリックで画像がダウンロードされる
- [ ] エクスポート中はボタンが無効化される
- [ ] ローディング表示が正しく動作する
- [ ] ARIAラベルが適切に設定される
- [ ] キーボード操作可能
- [ ] TypeScript型エラーがない

## 9. 品質判定

### 判定結果: ✅ 高品質

**評価**:
- ✅ 要件の曖昧さ: なし（タスクファイルに詳細仕様あり）
- ✅ 入出力定義: 完全（Props型、レンダリング内容が明確）
- ✅ 制約条件: 明確（アクセシビリティ、依存関係が明確）
- ✅ 実装可能性: 確実（依存するuseImageExportフックが実装済み）

**信頼性レベル分布**:
- 🔵 高信頼: 90% (タスクファイル、既存コード、EARS要件に基づく)
- 🟡 中信頼: 10% (妥当な推測、エラー処理詳細)
- 🔴 低信頼: 0%

---

**作成日**: 2025-11-22
**作成者**: Claude Code (TDD Requirements Phase)
