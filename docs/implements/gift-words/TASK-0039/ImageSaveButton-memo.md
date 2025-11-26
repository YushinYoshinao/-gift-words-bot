# TDD開発メモ: ImageSaveButton

## 概要

- **機能名**: ImageSaveButton (画像保存ボタンコンポーネント)
- **開発開始**: 2025-11-22
- **現在のフェーズ**: Red（失敗テスト作成完了）

## 関連ファイル

- **元タスクファイル**: `docs/tasks/gift-words-phase4.md`
- **要件定義**: `docs/implements/gift-words/TASK-0039/ImageSaveButton-requirements.md`
- **テストケース定義**: `docs/implements/gift-words/TASK-0039/ImageSaveButton-testcases.md`
- **実装ファイル**: `src/components/DisplayPage/ImageSaveButton.tsx` (未作成)
- **スタイルファイル**: `src/components/DisplayPage/ImageSaveButton.module.css` (未作成)
- **テストファイル**: `src/components/DisplayPage/__tests__/ImageSaveButton.test.tsx` (作成済み)

## Redフェーズ（失敗するテスト作成）

### 作成日時

2025-11-22 20:40

### テストケース

テストケース定義書に基づき、13個のテストケースを実装しました：

#### 1. 正常系テストケース（3個）
1. **正しくレンダリングされる**: コンポーネントの基本的なレンダリングを確認
2. **ボタンクリックでexportAsImageが呼ばれる**: クリックイベントハンドラーの動作確認
3. **ファイル名省略時はundefinedが渡される**: オプショナルなpropsのデフォルト動作確認

#### 2. 異常系テストケース（2個）
1. **対象要素が存在しない場合はエラーログが出る**: エラーハンドリングの確認
2. **exportAsImage実行中のエラーはフック側で処理される**: 責務分離の確認

#### 3. 状態管理テストケース（3個）
1. **エクスポート中はボタンが無効化される**: disabled属性の制御確認
2. **エクスポート中はローディング表示される**: 条件付きレンダリング確認
3. **エクスポート中はボタンテキストが「保存中...」になる**: テキストの動的変更確認

#### 4. アクセシビリティテストケース（2個）
1. **ARIAラベルが正しく設定される**: aria-label属性の確認
2. **ローディング表示にaria-live="polite"が設定される**: 動的コンテンツのアクセシビリティ確認

#### 5. Props検証テストケース（2個）
1. **targetSelector propsがdocument.querySelectorに渡される**: Props伝播の確認
2. **filename propsがexportAsImageの第2引数に渡される**: オプショナルPropsの伝播確認

#### 6. 統合テストケース（1個）
1. **共通Buttonコンポーネントが正しく使用されている**: 既存コンポーネント再利用の確認

### テストコード

ファイル: `src/components/DisplayPage/__tests__/ImageSaveButton.test.tsx`

**主な特徴**:
- **日本語コメント**: 全テストケースに詳細な日本語コメントを記載
- **Given-When-Then形式**: わかりやすいテスト構造
- **信頼性レベル表示**: 🔵（高信頼）、🟡（中信頼）マーカーで情報源を明示
- **モック戦略**: useImageExportフック、document.querySelector、console.errorをモック化
- **アクセシビリティ対応**: ARIA属性、role、aria-liveのテストを含む

### 期待される失敗

#### テスト実行結果

```bash
npm test -- ImageSaveButton --run
```

**エラーメッセージ**:
```
Error: Failed to resolve import "../ImageSaveButton" from "src/components/DisplayPage/__tests__/ImageSaveButton.test.tsx". Does the file exist?
```

**失敗の理由**:
- `src/components/DisplayPage/ImageSaveButton.tsx` ファイルがまだ存在しない
- これはRedフェーズの期待される動作

### 次のフェーズへの要求事項

Greenフェーズで実装すべき内容:

1. **コンポーネント実装** (`ImageSaveButton.tsx`):
   - Props型定義: `ImageSaveButtonProps` (targetSelector, filename?)
   - useImageExportフックの使用
   - document.querySelector()でDOM要素取得
   - 要素未検出時のエラーログ
   - Buttonコンポーネントの使用（variant="primary"）
   - ボタンテキストの動的変更: `{isExporting ? '保存中...' : '画像として保存'}`
   - ローディング表示の条件付きレンダリング
   - ARIA属性の設定: aria-label, role="status", aria-live="polite"

2. **スタイル実装** (`ImageSaveButton.module.css`):
   - containerスタイル
   - loadingスタイル
   - spinnerアニメーション
   - レスポンシブデザイン（@media (max-width: 768px)）
   - スクリーンリーダー専用クラス (.sr-only)

3. **依存関係**:
   - `useImageExport` フック（TASK-0038で実装済み）
   - `Button` コンポーネント（既存の共通コンポーネント）
   - React hooks: useState, useCallback（必要に応じて）

## Greenフェーズ（最小実装）

### 実装日時

2025-11-22 21:04

### 実装方針

最小実装の原則に従い、13個のテストケースを通すために必要な最小限のコードを実装しました。

### 実装内容

1. **ImageSaveButton.tsx**:
   - Props型定義: `ImageSaveButtonProps` (targetSelector, filename?)
   - useImageExportフック使用
   - handleClick関数（async）でDOM要素取得と画像エクスポート
   - 要素未検出時のエラーログ
   - Buttonコンポーネント使用（variant="primary"）
   - 動的ボタンテキスト: "画像として保存" / "保存中..."
   - ローディング表示（role="status", aria-live="polite"）
   - ARIA属性設定

2. **ImageSaveButton.module.css**:
   - containerスタイル（flex, column）
   - loadingスタイル
   - spinnerアニメーション（@keyframes spin）
   - .sr-onlyクラス（スクリーンリーダー専用）
   - レスポンシブデザイン（768px, 480px）

3. **Button.tsx更新**:
   - `ButtonProps`を`React.ButtonHTMLAttributes<HTMLButtonElement>`拡張
   - `...rest`でaria-labelなどのHTML属性を転送

### テスト結果

✅ **全テスト成功**: 13/13テストケース合格

### 問題と解決

**問題**: aria-label属性が渡らない
**解決**: Buttonコンポーネントを拡張してHTML属性を受け付けるように修正

## Refactorフェーズ（品質改善）

### リファクタ日時

（スキップ）

### スキップ理由

現時点でリファクタリングの必要性は低いため、Refactorフェーズをスキップしました：
- コードは既に最小限で高品質
- 重複コードなし
- 適切な責務分離が実現されている
- 全ての要件を満たしている

## 完了

**完了日**: 2025-11-22
**ステータス**: ✅ 完了

TDD開発サイクル（Red → Green → Refactor）を完了し、全13テストケースが合格しました。

---

**作成日**: 2025-11-22
**完了日**: 2025-11-22
**作成者**: Claude Code (TDD Development)
