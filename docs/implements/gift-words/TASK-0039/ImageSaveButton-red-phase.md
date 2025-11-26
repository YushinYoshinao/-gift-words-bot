# TDD Redフェーズ: ImageSaveButton コンポーネント

## 概要

- **タスクID**: TASK-0039
- **機能名**: 画像保存ボタンコンポーネント
- **実装日**: 2025-11-22
- **現在のフェーズ**: Red（失敗テスト作成完了）

## 関連ファイル

- **テストファイル**: `src/components/DisplayPage/__tests__/ImageSaveButton.test.tsx`
- **実装ファイル**: `src/components/DisplayPage/ImageSaveButton.tsx` (未作成)
- **スタイルファイル**: `src/components/DisplayPage/ImageSaveButton.module.css` (未作成)
- **要件定義**: `docs/implements/gift-words/TASK-0039/ImageSaveButton-requirements.md`
- **テストケース定義**: `docs/implements/gift-words/TASK-0039/ImageSaveButton-testcases.md`

## Redフェーズ（失敗するテスト作成）

### テスト作成日時

2025-11-22 20:40

### テストケース総数

**合計13テストケース**を実装:

| カテゴリ | テスト数 | 内容 |
|---------|---------|------|
| 正常系 | 3 | レンダリング、クリック、ファイル名省略 |
| 異常系 | 2 | 要素未検出、エラー処理責務 |
| 状態管理 | 3 | ボタン無効化、ローディング表示、テキスト変更 |
| アクセシビリティ | 2 | ARIAラベル、aria-live |
| Props検証 | 2 | targetSelector、filename |
| 統合テスト | 1 | Buttonコンポーネント使用 |

### テストコードの設計

#### モック戦略

1. **useImageExportフック**:
   ```typescript
   vi.mock('../../../hooks/useImageExport', () => ({
     useImageExport: vi.fn(),
   }));
   ```
   - `exportAsImage`: モック関数（Promise<boolean>を返す）
   - `isExporting`: 状態モック（falseまたはtrue）
   - `progress`: 進捗値モック
   - `error`: エラーメッセージモック

2. **document.querySelector**:
   ```typescript
   const mockElement = document.createElement('div');
   vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);
   ```
   - デフォルトでは要素が見つかる
   - エラーテストではnullを返す

3. **console.error**:
   ```typescript
   vi.spyOn(console, 'error').mockImplementation(() => {});
   ```
   - エラーログ出力の検証用

#### テスト構造

**Given-When-Then パターン**を採用:

```typescript
// === Given（準備フェーズ）===
// 【テストデータ準備】: モックとPropsの設定
const props = { targetSelector: '.test', filename: 'test-image' };

// === When（実行フェーズ）===
// 【実際の処理実行】: コンポーネントレンダリングとユーザー操作
render(<ImageSaveButton {...props} />);
await user.click(screen.getByRole('button'));

// === Then（検証フェーズ）===
// 【結果検証】: 期待される動作の確認
expect(mockExportAsImage).toHaveBeenCalledWith(mockElement, 'test-image');
```

#### 日本語コメント

各テストケースに以下のコメントを記載:

- **【テスト目的】**: 何を確認するか
- **【テスト内容】**: 具体的な処理内容
- **【期待される動作】**: 正常動作時の結果
- **信頼性レベル**: 🔵（高信頼）、🟡（中信頼）
- **【テストデータ準備】**: なぜこのデータを用意するか
- **【実際の処理実行】**: どの機能を呼び出すか
- **【結果検証】**: 何を検証するか
- **【確認内容】**: 各expectで確認している項目

### テスト実行結果

#### コマンド

```bash
npm test -- ImageSaveButton --run
```

#### 失敗メッセージ

```
FAIL  src/components/DisplayPage/__tests__/ImageSaveButton.test.tsx
Error: Failed to resolve import "../ImageSaveButton" from
"src/components/DisplayPage/__tests__/ImageSaveButton.test.tsx".
Does the file exist?
```

#### 失敗の理由

✅ **期待通りの失敗**:
- `ImageSaveButton.tsx` ファイルがまだ存在しない
- これはTDDのRedフェーズで期待される動作
- テストファイル自体は正常に作成されている

### テストケース詳細

#### 1. 正常系テストケース

##### 1-1: 正しくレンダリングされる
- **検証内容**: ボタンが存在し、初期テキストが「画像として保存」
- **信頼性**: 🔵（要件定義書のUI構成に基づく）
- **REQ対応**: REQ-301（画像保存ボタンを提供）

##### 1-2: ボタンクリックでexportAsImageが呼ばれる
- **検証内容**:
  - exportAsImageが1回呼ばれる
  - 第1引数: querySelector('.display-container')の戻り値
  - 第2引数: 'my-gift'
- **信頼性**: 🔵（タスクファイルの実装詳細に基づく）
- **REQ対応**: REQ-302（ボタンクリックで画像化）

##### 1-3: ファイル名省略時はundefinedが渡される
- **検証内容**: filename省略時、exportAsImageにundefinedが渡される
- **信頼性**: 🔵（要件定義書のProps仕様に基づく）
- **REQ対応**: REQ-306（ファイル名に日付を含める - フック側で処理）

#### 2. 異常系テストケース

##### 2-1: 対象要素が存在しない場合はエラーログが出る
- **検証内容**:
  - console.errorが呼ばれる
  - エラーメッセージ: `"Element not found: .non-existent-element"`
  - exportAsImageは呼ばれない
- **信頼性**: 🟡（要件定義書に記載あり、実装詳細は推測）
- **REQ対応**: EDGE-001（要素が見つからない場合のエラー処理）

##### 2-2: exportAsImage実行中のエラーはフック側で処理される
- **検証内容**: エラー処理の責務がuseImageExportフック側にあることを確認
- **信頼性**: 🔵（タスクファイル、TASK-0038仕様に基づく）
- **REQ対応**: REQ-311（画像生成失敗時にエラー通知 - フック側）

#### 3. 状態管理テストケース

##### 3-1: エクスポート中はボタンが無効化される
- **検証内容**: isExporting=trueの時、ボタンがdisabled状態
- **信頼性**: 🔵（タスクファイルの実装詳細に基づく）
- **REQ対応**: EDGE-002（エクスポート中の連続クリック防止）

##### 3-2: エクスポート中はローディング表示される
- **検証内容**:
  - role="status"の要素が存在
  - aria-live="polite"が設定
  - スクリーンリーダー用テキスト「画像を生成しています...」が存在
- **信頼性**: 🔵（タスクファイル、アクセシビリティ要件に基づく）
- **REQ対応**: NFR-205（アクセシビリティ）

##### 3-3: エクスポート中はボタンテキストが「保存中...」になる
- **検証内容**: isExporting=trueの時、ボタンテキストが「保存中...」
- **信頼性**: 🔵（タスクファイルの実装詳細に基づく）
- **REQ対応**: REQ-301（UI提供）

#### 4. アクセシビリティテストケース

##### 4-1: ARIAラベルが正しく設定される
- **検証内容**: ボタンに`aria-label="画像として保存"`が設定
- **信頼性**: 🔵（タスクファイル、アクセシビリティ要件に基づく）
- **REQ対応**: NFR-205（キーボード操作可能、スクリーンリーダー対応）

##### 4-2: ローディング表示にaria-live="polite"が設定される
- **検証内容**:
  - aria-live="polite"
  - role="status"
  - スクリーンリーダー専用テキスト
- **信頼性**: 🔵（タスクファイル、アクセシビリティ要件に基づく）
- **REQ対応**: NFR-205（アクセシビリティ）

#### 5. Props検証テストケース

##### 5-1: targetSelector propsがdocument.querySelectorに渡される
- **検証内容**:
  - document.querySelector('#test-id')が呼ばれる
  - 取得した要素がexportAsImageに渡される
- **信頼性**: 🔵（タスクファイルの実装詳細に基づく）
- **REQ対応**: REQ-302（表示ページを画像化）

##### 5-2: filename propsがexportAsImageの第2引数に渡される
- **検証内容**: exportAsImage(element, 'custom-name')が呼ばれる
- **信頼性**: 🔵（タスクファイルの実装詳細に基づく）
- **REQ対応**: REQ-306（ファイル名に日付を含める - フック側で処理）

#### 6. 統合テストケース

##### 6-1: 共通Buttonコンポーネントが正しく使用されている
- **検証内容**:
  - Buttonコンポーネントがレンダリングされる
  - variant="primary"が設定（classNameに"primary"が含まれる）
- **信頼性**: 🔵（要件定義書の設計制約に基づく）
- **REQ対応**: UIデザイン制約（既存Buttonコンポーネント使用）

### コード品質

#### TypeScript型安全性

- **Props型**: `ImageSaveButtonProps` インターフェース（実装時に定義）
- **モック型**: `ReturnType<typeof vi.fn>` で型推論
- **ユーザーイベント**: `@testing-library/user-event` で型安全な操作

#### テストカバレッジ目標

- **ステートメントカバレッジ**: 90%以上
- **ブランチカバレッジ**: 85%以上
- **関数カバレッジ**: 100%
- **ラインカバレッジ**: 90%以上

#### コメント品質

- **日本語コメント**: 全テストケースに詳細なコメント
- **信頼性レベル**: 🔵（高信頼90%）、🟡（中信頼10%）
- **REQ番号参照**: 各テストに関連要件番号を記載

### 次のフェーズへの要件

#### Greenフェーズで実装すべき内容

1. **コンポーネントファイル作成**:
   - `src/components/DisplayPage/ImageSaveButton.tsx`

2. **Props型定義**:
   ```typescript
   interface ImageSaveButtonProps {
     targetSelector: string;
     filename?: string;
   }
   ```

3. **主要実装内容**:
   - useImageExportフックの使用
   - document.querySelector()でDOM要素取得
   - 要素未検出時のconsole.error
   - Buttonコンポーネントの使用（variant="primary"）
   - handleClick関数（async）
   - ボタンテキストの動的変更
   - ローディング表示の条件付きレンダリング
   - ARIA属性の設定

4. **スタイルファイル作成**:
   - `src/components/DisplayPage/ImageSaveButton.module.css`
   - containerスタイル
   - loadingスタイル
   - spinnerアニメーション
   - レスポンシブデザイン
   - .sr-onlyクラス

### 品質判定

#### 判定結果: ✅ 高品質

**評価基準**:
- ✅ テスト実行: 失敗することを確認済み（期待通り）
- ✅ 期待値: 明確で具体的（13テストケース全て）
- ✅ アサーション: 適切（Given-When-Then形式）
- ✅ 実装方針: 明確（要件定義書、テストケース定義書に基づく）
- ✅ 日本語コメント: 完備（全テストケースに詳細コメント）
- ✅ 信頼性レベル: 明示（🔵90%、🟡10%）
- ✅ 要件網羅性: 高（REQ-301, REQ-302, REQ-306, NFR-205, EDGE-001, EDGE-002）

**信頼性レベル分布**:
- 🔵 高信頼: 90% (タスクファイル、要件定義書、テストケース定義書に基づく)
- 🟡 中信頼: 10% (妥当な推測、エラーハンドリング詳細)
- 🔴 低信頼: 0%

### 次のステップ

**次のお勧めステップ**: `/tsumiki:tdd-green` でGreenフェーズ（最小実装）を開始します。

Greenフェーズでは、上記のテストケースが全て通るように、ImageSaveButtonコンポーネントとスタイルファイルを実装します。

---

**作成日**: 2025-11-22
**作成者**: Claude Code (TDD Red Phase)
