# TDD Redフェーズ: useImageExport カスタムフック

## 概要

- **タスクID**: TASK-0038
- **機能名**: 画像エクスポート用カスタムフック
- **開発開始**: 2025-11-22
- **現在のフェーズ**: Red（失敗するテスト作成）

## 関連ファイル

- **元タスクファイル**: `docs/tasks/gift-words-phase4.md`
- **実装ファイル**: `src/hooks/useImageExport.ts` (未作成)
- **テストファイル**: `src/hooks/__tests__/useImageExport.test.tsx` (作成済み)
- **型定義**: `src/types/index.ts` (TASK-0037で作成済み)
- **定数定義**: `src/utils/constants.ts` (TASK-0037で作成済み)

## Redフェーズ（失敗するテスト作成）

### 作成日時

2025-11-22 14:12

### テストケース概要

TASK-0038では以下の12個のテストケースを作成しました：

#### 基本機能テスト（タスク定義書に基づく） 🔵

1. **初期状態が正しく設定される**
   - isExporting=false, progress=0, error=null の初期状態を確認
   - exportAsImage, resetError 関数の存在を確認

2. **exportAsImage実行中はisExportingがtrueになる**
   - エクスポート処理実行中に状態が正しく更新されることを確認
   - 完了後にisExportingがfalseに戻ることを確認

3. **画像生成成功時に成功トーストが表示される**
   - 画像生成成功時にshowToast関数が適切に呼ばれることを確認
   - progress=100, error=null になることを確認

4. **画像生成失敗時にエラートーストが表示される**
   - html2canvasエラー時にエラーメッセージが設定されることを確認
   - progress=0にリセットされることを確認

5. **ファイル名が指定されない場合はデフォルト名が使用される**
   - formatFilename関数が呼ばれることを確認

6. **ファイル名が指定された場合はその名前が使用される**
   - カスタムファイル名がダウンロードリンクに設定されることを確認

7. **html2canvasのオプションが正しく設定される**
   - backgroundColor=null (REQ-305)
   - scale=2 (REQ-305)
   - useCORS=true
   - logging=false
   - 上記オプションがhtml2canvasに渡されることを確認

8. **resetErrorでエラーがクリアされる**
   - resetError関数実行後、error=null になることを確認

#### 追加の詳細テスト（妥当な推測に基づく） 🟡

9. **PNG形式で画像が生成される**
   - canvas.toDataURLが'image/png'とquality=1.0で呼ばれることを確認 (REQ-304)

10. **進捗状態が正しく更新される**
    - エクスポート処理中に進捗が0→100と更新されることを確認

11. **エラー発生時にreturnがfalseになる**
    - エラー時にexportAsImageがfalseを返すことを確認

12. **成功時にreturnがtrueになる**
    - 成功時にexportAsImageがtrueを返すことを確認

### テストコード

テストファイル: `src/hooks/__tests__/useImageExport.test.tsx`

```typescript
/**
 * useImageExport フックのテスト
 * TASK-0038: 画像エクスポート用カスタムフック実装
 *
 * テスト対象:
 * - REQ-302: ボタンクリックで表示ページを画像化 🔵
 * - REQ-303: html2canvasライブラリを使用 🔵
 * - REQ-304: PNG形式で画像を保存 🔵
 * - REQ-305: 高品質・高解像度設定 🔵
 * - REQ-306: ファイル名に日付を含める 🔵
 * - REQ-311: 画像生成失敗時にエラー通知 🔵
 */
```

### 期待される失敗

**エラーメッセージ**:
```
Error: Failed to resolve import "../useImageExport" from "src/hooks/__tests__/useImageExport.test.tsx". Does the file exist?
```

**失敗理由**:
- `src/hooks/useImageExport.ts` ファイルが存在しない
- useImageExportフックが実装されていない

### テスト実行コマンド

```bash
npm test -- useImageExport
```

### 次のフェーズへの要求事項

Greenフェーズで以下を実装する必要があります：

#### 1. ファイル作成
- `src/hooks/useImageExport.ts` を作成

#### 2. 実装すべき機能

**状態管理**:
- `ImageExportState` 型を使用した状態管理
  - `isExporting: boolean` - エクスポート処理中フラグ
  - `progress: number` - 進捗（0-100）
  - `error: string | null` - エラーメッセージ

**exportAsImage関数**:
- 引数: `(element: HTMLElement, filename?: string) => Promise<boolean>`
- html2canvasを使用して要素を画像化
- オプション設定:
  - `backgroundColor: null` (IMAGE_EXPORT_CONFIG.BACKGROUND_COLOR)
  - `scale: 2` (IMAGE_EXPORT_CONFIG.SCALE)
  - `useCORS: true`
  - `logging: false`
  - `allowTaint: false`
- 進捗更新: 0% → 30% → 60% → 80% → 100%
- PNG形式でcanvasをDataURLに変換 (FORMAT='image/png', QUALITY=1.0)
- ダウンロードリンクを作成してクリック
- ファイル名: 引数で指定、または `formatFilename()` を使用
- 成功時: `showToast(SUCCESS_MESSAGES.IMAGE_SAVED, 'success')` を呼び出し
- 成功時: `true` を返す
- エラー時: エラーメッセージを state に設定
- エラー時: `showToast(errorMessage, 'error')` を呼び出し
- エラー時: `false` を返す

**resetError関数**:
- 引数: なし
- error状態をnullにリセット

**返り値**:
```typescript
{
  isExporting: boolean,
  progress: number,
  error: string | null,
  exportAsImage: (element: HTMLElement, filename?: string) => Promise<boolean>,
  resetError: () => void
}
```

#### 3. 使用する依存関係

```typescript
import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { useToast } from '../context/ToastContext';
import { formatFilename } from '../utils/dateFormatter';
import { IMAGE_EXPORT_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import type { ImageExportState, Html2CanvasOptions } from '../types';
```

#### 4. 要件対応

- **REQ-302**: ボタンクリックで表示ページを画像化 → exportAsImage関数で実装
- **REQ-303**: html2canvasライブラリを使用 → html2canvas関数を呼び出し
- **REQ-304**: PNG形式で画像を保存 → canvas.toDataURL('image/png', 1.0)
- **REQ-305**: 高品質・高解像度設定 → scale=2, quality=1.0
- **REQ-306**: ファイル名に日付を含める → formatFilename関数を使用
- **REQ-311**: 画像生成失敗時にエラー通知 → try-catchでshowToast呼び出し

### モック設定

テストでは以下のモックを使用：

```typescript
// html2canvasのモック
vi.mock('html2canvas', () => ({
  default: vi.fn(),
}));

// dateFormatterのモック
vi.mock('../../utils/dateFormatter', () => ({
  formatFilename: vi.fn(() => 'gift-words-20251122.png'),
}));
```

### 品質評価

#### ✅ 高品質な点

- **テスト実行**: 成功（失敗することを確認済み）
  - エラーメッセージが明確: "Failed to resolve import"
  - 実装ファイルが存在しないことが原因と特定できる

- **期待値**: 明確で具体的
  - 各テストケースで検証すべき値が明確
  - アサーションに日本語コメントで説明

- **アサーション**: 適切
  - 状態の各プロパティを個別に検証
  - 関数の呼び出し回数・引数を検証
  - モックの戻り値を検証

- **実装方針**: 明確
  - タスク定義書に基づく詳細な実装要件
  - 必要な依存関係が明記されている
  - 要件との対応が明確

#### 📊 テストカバレッジ

- **基本機能**: 100% (タスク定義書の8テストケース全て実装)
- **追加機能**: 4テストケース追加（PNG形式、進捗、戻り値）
- **要件カバレッジ**: REQ-302, 303, 304, 305, 306, 311 全てカバー
- **信頼性レベル**:
  - 🔵 高信頼: 10テストケース (83%)
  - 🟡 中信頼: 2テストケース (17%)
  - 🔴 低信頼: 0テストケース (0%)

### コメント品質

全てのテストケースに以下のコメントを付与：

- **【テスト目的】**: テストの目的を日本語で明記 ✅
- **【テスト内容】**: 具体的なテスト内容を説明 ✅
- **【期待される動作】**: 期待される結果を説明 ✅
- **🔵🟡🔴 信頼性レベル**: 各テストの信頼性を明示 ✅
- **各expectステートメントに日本語コメント**: 検証内容を明記 ✅

## 次のステップ

Greenフェーズ（最小実装）に進みます。

**推奨コマンド**:
```bash
/tsumiki:tdd-green TASK-0038
```

これにより、上記の12個のテストケースを通すための最小限の実装を行います。
