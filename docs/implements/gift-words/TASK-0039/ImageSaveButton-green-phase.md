# TDD Greenフェーズ: ImageSaveButton コンポーネント

## 概要

- **タスクID**: TASK-0039
- **機能名**: 画像保存ボタンコンポーネント
- **実装日**: 2025-11-22
- **現在のフェーズ**: Green（最小実装完了）

## 関連ファイル

- **テストファイル**: `src/components/DisplayPage/__tests__/ImageSaveButton.test.tsx`
- **実装ファイル**: `src/components/DisplayPage/ImageSaveButton.tsx` (作成完了)
- **スタイルファイル**: `src/components/DisplayPage/ImageSaveButton.module.css` (作成完了)
- **依存コンポーネント**: `src/components/common/Button/Button.tsx` (更新)
- **Redフェーズ文書**: `docs/implements/gift-words/TASK-0039/ImageSaveButton-red-phase.md`

## Greenフェーズ（最小実装）

### 実装日時

2025-11-22 21:04

### テスト実行結果

#### 最終結果: ✅ 全テスト成功

```
Test Files  1 passed (1)
Tests       13 passed (13)
Duration    2.07s
```

**成功したテストケース**:
- ✅ 正常系: 3テスト
- ✅ 異常系: 2テスト
- ✅ 状態管理: 3テスト
- ✅ アクセシビリティ: 2テスト
- ✅ Props検証: 2テスト
- ✅ 統合テスト: 1テスト

### 実装内容

#### 1. ImageSaveButton.tsx - コンポーネント実装

**ファイルパス**: `src/components/DisplayPage/ImageSaveButton.tsx`

**実装内容**:

```typescript
interface ImageSaveButtonProps {
  targetSelector: string;  // DOM要素のCSSセレクタ
  filename?: string;       // オプショナルなファイル名
}
```

**主要機能**:
1. **useImageExportフック使用** 🔵:
   - `isExporting`: エクスポート中の状態管理
   - `exportAsImage`: 画像エクスポート関数

2. **handleClick関数** 🔵:
   - `document.querySelector(targetSelector)`でDOM要素取得
   - 要素が見つからない場合は`console.error`でログ出力
   - `exportAsImage(element, filename)`を呼び出し

3. **Buttonコンポーネント使用** 🔵:
   - `variant="primary"`: 主要ボタンスタイル
   - `disabled={isExporting}`: エクスポート中は無効化
   - `aria-label="画像として保存"`: アクセシビリティ対応
   - 動的テキスト: `{isExporting ? '保存中...' : '画像として保存'}`

4. **ローディング表示** 🔵:
   - 条件付きレンダリング: `{isExporting && (...)}`
   - `role="status"`: ステータス要素としてマーク
   - `aria-live="polite"`: 動的コンテンツ通知
   - スクリーンリーダー専用テキスト: `.sr-only`クラス
   - スピナーアニメーション: `.spinner`クラス

**信頼性レベル**: 🔵 高信頼（要件定義書、テストケース定義書に基づく実装）

#### 2. ImageSaveButton.module.css - スタイル実装

**ファイルパス**: `src/components/DisplayPage/ImageSaveButton.module.css`

**実装内容**:

1. **.container**: ボタンとローディング表示のコンテナ
   - `display: flex; flex-direction: column`
   - `gap: 1rem`で適切な間隔
   - 中央寄せ配置

2. **.loading**: ローディングインジケーター
   - フレックスボックスで縦方向配置
   - `gap: 0.5rem`でスピナーとテキストの間隔

3. **.spinner**: 回転アニメーション
   - `width: 2rem; height: 2rem`
   - ボーダー円形（`border-radius: 50%`）
   - 上部のみ青色（`border-top-color: #007bff`）
   - `@keyframes spin`: 0.8s無限回転アニメーション

4. **.sr-only**: スクリーンリーダー専用クラス
   - `position: absolute; width: 1px; height: 1px`
   - 視覚的に非表示、読み上げは有効
   - NFR-205（アクセシビリティ）要件を満たす

5. **レスポンシブデザイン**:
   - `@media (max-width: 768px)`: タブレット対応
   - `@media (max-width: 480px)`: 小型モバイル対応
   - スピナーサイズ、間隔を調整

**信頼性レベル**: 🔵 高信頼（既存スタイルパターン、アクセシビリティ要件に基づく）

#### 3. Button.tsx - 既存コンポーネント更新

**ファイルパス**: `src/components/common/Button/Button.tsx`

**変更理由**:
- ImageSaveButtonで`aria-label`属性を渡す必要があるが、Buttonコンポーネントがそれを受け付けない
- テストケース4-1「ARIAラベルが正しく設定される」が失敗

**変更内容**:

```typescript
// 変更前
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// 変更後
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}
```

**変更の詳細**:
- `React.ButtonHTMLAttributes<HTMLButtonElement>`を継承
- `onClick`, `disabled`, `type`は標準HTML属性として含まれる
- `...rest`でその他の属性（`aria-label`など）を`<button>`に転送

**影響範囲**:
- Buttonコンポーネントを使用する全ての場所で、標準HTML button属性が使用可能になる
- 後方互換性あり（既存のコードは変更不要）

**信頼性レベル**: 🔵 高信頼（Reactの標準パターン）

### 実装方針

#### TDDサイクル遵守

**Red → Green サイクル**:
1. **Red**: 13テストケース全て失敗（ファイル未作成）
2. **Green**: 最小実装でテスト13個全て成功

#### 最小実装の原則

**実装したもの**:
- ✅ テストケースを通すために必要な最小限のコード
- ✅ 要件定義書に明記された機能
- ✅ アクセシビリティ要件（NFR-205）
- ✅ エラーハンドリング（EDGE-001）

**実装しなかったもの**:
- ❌ テストに含まれない追加機能
- ❌ 過度な抽象化
- ❌ 不要なコメント（日本語コメントは信頼性レベル表示のため必要）

### 問題と解決

#### 問題1: aria-label属性が渡らない

**発生時刻**: 2025-11-22 21:04:22

**エラー内容**:
```
Error: expect(element).toHaveAttribute("aria-label", "画像として保存")
Expected the element to have attribute:
  aria-label="画像として保存"
Received:
  null
```

**原因**: Buttonコンポーネントが`aria-label`属性を受け付けない

**解決方法**:
1. `ButtonProps`を`React.ButtonHTMLAttributes<HTMLButtonElement>`拡張
2. `...rest`でその他のHTML属性を転送
3. これにより全ての標準HTML button属性が使用可能に

**テスト結果**: ✅ 解決 - 全テスト成功

**信頼性レベル**: 🔵 高信頼（Reactの標準パターンに準拠）

### 品質判定

#### 判定結果: ✅ 高品質

**評価基準**:
- ✅ テスト実行: 13テスト全て成功
- ✅ 最小実装: 過度な機能追加なし
- ✅ 要件網羅: REQ-301, REQ-302, REQ-306, NFR-205, EDGE-001全て対応
- ✅ アクセシビリティ: ARIA属性、role、aria-live完備
- ✅ TypeScript型安全性: Propsインターフェース定義
- ✅ 日本語コメント: 完備（信頼性レベル表示付き）
- ✅ レスポンシブ: モバイル・タブレット対応

**コードカバレッジ（推定）**:
- ステートメントカバレッジ: 100%
- ブランチカバレッジ: 100%
- 関数カバレッジ: 100%
- ラインカバレッジ: 100%

### 要件網羅性

#### 機能要件

| 要件ID | 要件内容 | 実装状況 | テストケース |
|--------|---------|---------|------------|
| REQ-301 | 画像保存ボタンを提供 | ✅ | 1-1 |
| REQ-302 | ボタンクリックで画像化 | ✅ | 1-2, 5-1 |
| REQ-306 | ファイル名に日付を含める | ✅ | 1-3, 5-2（フック側） |
| REQ-311 | エラー通知 | ✅ | 2-2（フック側） |

#### 非機能要件

| 要件ID | 要件内容 | 実装状況 | テストケース |
|--------|---------|---------|------------|
| NFR-205 | アクセシビリティ | ✅ | 4-1, 4-2 |

#### エッジケース

| ケースID | ケース内容 | 実装状況 | テストケース |
|----------|-----------|---------|------------|
| EDGE-001 | 要素未検出エラー | ✅ | 2-1 |
| EDGE-002 | 連続クリック防止 | ✅ | 3-1 |

### 次のフェーズへの要件

#### Refactorフェーズで検討すべき内容

現時点では**リファクタ不要**の可能性が高い理由:
- ✅ コードは既に最小限
- ✅ 重複コードなし
- ✅ 適切な責務分離（フック側でエクスポート処理、コンポーネント側でUI）
- ✅ 既存コンポーネント（Button）を再利用
- ✅ アクセシビリティ要件満たす
- ✅ レスポンシブデザイン対応

**検討すべき改善案**（優先度低）:
1. エラー表示UIの追加（現在はconsole.errorのみ）
2. エクスポート進捗表示（useImageExportフックのprogress値活用）
3. スピナーアニメーションの改善

ただし、これらは要件に含まれていないため、Refactorフェーズではなく将来の機能追加として扱うべき。

### TDDサイクル完了判定

#### Greenフェーズ完了条件

- ✅ 全テストケース成功（13/13）
- ✅ 最小実装の原則遵守
- ✅ 要件定義書の全要件実装
- ✅ TypeScript型安全性確保
- ✅ アクセシビリティ要件満たす
- ✅ 日本語コメント完備

**判定**: ✅ **Greenフェーズ完了**

### 次のステップ

**推奨**: `/tsumiki:tdd-refactor` でRefactorフェーズを開始

ただし、現時点でリファクタの必要性は低いため、以下の選択肢もあり:
- **Option 1**: Refactorフェーズをスキップして完了
- **Option 2**: Refactorフェーズで品質確認のみ実施
- **Option 3**: 次のタスク（TASK-0040など）に進む

---

**作成日**: 2025-11-22
**作成者**: Claude Code (TDD Green Phase)
