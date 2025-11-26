# TDD Greenフェーズ: useImageExport カスタムフック

## 概要

- **タスクID**: TASK-0038
- **機能名**: 画像エクスポート用カスタムフック
- **実装日**: 2025-11-22
- **現在のフェーズ**: Green（最小実装完了）

## 関連ファイル

- **実装ファイル**: `src/hooks/useImageExport.ts` (作成完了)
- **テストファイル**: `src/hooks/__tests__/useImageExport.test.tsx`
- **型定義**: `src/types/index.ts` (TASK-0037で作成済み)
- **定数定義**: `src/utils/constants.ts` (TASK-0037で作成済み)

## Greenフェーズ（最小実装）

### 実装日時

2025-11-22 14:20

### 実装方針

**最小限の実装でテストを通す方針**:

1. **状態管理**: `useState`で`ImageExportState`型の状態を管理
2. **html2canvas統合**: html2canvasライブラリを使用して要素を画像化
3. **エクスポート関数**: `exportAsImage`関数で画像生成とダウンロードを実装
4. **エラーハンドリング**: try-catchでエラーを捕捉してtoast表示
5. **進捗管理**: 処理の段階に応じて進捗を更新（0% → 30% → 60% → 80% → 100%）
6. **リセット関数**: `resetError`関数でエラー状態をクリア

**実装の特徴**:
- シンプルで理解しやすい実装
- テストケースを確実に通すことを最優先
- 全ての機能に日本語コメントと信頼性レベルを付与
- useCallbackでメモ化し、不要な再レンダリングを防止

### 実装コード

```typescript
/**
 * useImageExport - 画像エクスポート用カスタムフック
 * TASK-0038: 画像エクスポート用カスタムフック実装
 */

import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { useToast } from '../context/ToastContext';
import { formatFilename } from '../utils/dateFormatter';
import {
  IMAGE_EXPORT_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../utils/constants';
import type { ImageExportState, Html2CanvasOptions } from '../types';

interface UseImageExportReturn extends ImageExportState {
  exportAsImage: (element: HTMLElement, filename?: string) => Promise<boolean>;
  resetError: () => void;
}

export const useImageExport = (): UseImageExportReturn => {
  const { showToast } = useToast();

  const [state, setState] = useState<ImageExportState>({
    isExporting: false,
    progress: 0,
    error: null,
  });

  const exportAsImage = useCallback(
    async (element: HTMLElement, filename?: string): Promise<boolean> => {
      setState({ isExporting: true, progress: 0, error: null });

      try {
        const options: Html2CanvasOptions = {
          backgroundColor: IMAGE_EXPORT_CONFIG.BACKGROUND_COLOR,
          scale: IMAGE_EXPORT_CONFIG.SCALE,
          logging: IMAGE_EXPORT_CONFIG.LOGGING,
          useCORS: IMAGE_EXPORT_CONFIG.USE_CORS,
          allowTaint: false,
        };

        setState((prev) => ({ ...prev, progress: 30 }));

        const canvas = await html2canvas(element, options);

        setState((prev) => ({ ...prev, progress: 60 }));

        const dataUrl = canvas.toDataURL(
          IMAGE_EXPORT_CONFIG.FORMAT,
          IMAGE_EXPORT_CONFIG.QUALITY
        );

        setState((prev) => ({ ...prev, progress: 80 }));

        const link = document.createElement('a');
        link.download = filename || formatFilename();
        link.href = dataUrl;
        link.click();

        setState({ isExporting: false, progress: 100, error: null });

        showToast(SUCCESS_MESSAGES.IMAGE_SAVED, 'success');

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.IMAGE_EXPORT_FAILED;

        setState({ isExporting: false, progress: 0, error: errorMessage });

        showToast(errorMessage, 'error');

        return false;
      }
    },
    [showToast]
  );

  const resetError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    exportAsImage,
    resetError,
  };
};

export default useImageExport;
```

### テスト結果

**テスト実行コマンド**:
```bash
npm test -- useImageExport --run
```

**テスト結果**: ✅ 全テスト成功

```
Test Files  1 passed (1)
Tests       12 passed (12)
Duration    1.59s
```

**通過したテストケース** (12/12):

1. ✅ 初期状態が正しく設定される
2. ✅ exportAsImage実行中はisExportingがtrueになる
3. ✅ 画像生成成功時に成功トーストが表示される
4. ✅ 画像生成失敗時にエラートーストが表示される
5. ✅ ファイル名が指定されない場合はデフォルト名が使用される
6. ✅ ファイル名が指定された場合はその名前が使用される
7. ✅ html2canvasのオプションが正しく設定される
8. ✅ resetErrorでエラーがクリアされる
9. ✅ PNG形式で画像が生成される
10. ✅ 進捗状態が正しく更新される
11. ✅ エラー発生時にreturnがfalseになる
12. ✅ 成功時にreturnがtrueになる

### 実装の詳細説明

#### 1. 状態管理
- `useState<ImageExportState>`で状態を管理
- 初期値: `{ isExporting: false, progress: 0, error: null }`
- テストケース「初期状態が正しく設定される」を通過

#### 2. exportAsImage関数
- **引数**: `(element: HTMLElement, filename?: string)`
- **戻り値**: `Promise<boolean>` - 成功時true、失敗時false
- **処理フロー**:
  1. 状態を`isExporting: true`に設定
  2. html2canvasオプションを設定
  3. 進捗30%に更新
  4. html2canvasで要素を画像化
  5. 進捗60%に更新
  6. PNG形式でDataURLに変換
  7. 進捗80%に更新
  8. ダウンロードリンクを作成してクリック
  9. 進捗100%、完了状態に設定
  10. 成功toastを表示
  11. trueを返す
- **エラー時**:
  1. エラーメッセージを取得
  2. エラー状態に設定
  3. エラーtoastを表示
  4. falseを返す

#### 3. resetError関数
- error状態をnullにリセット
- useCallbackでメモ化

#### 4. html2canvasオプション設定
- `backgroundColor: null` - 透明背景 (REQ-305)
- `scale: 2` - 高解像度 (REQ-305)
- `useCORS: true` - CORS対応画像
- `logging: false` - ログ無効化
- `allowTaint: false` - セキュリティ

#### 5. ファイル名処理
- 引数で指定された場合: そのファイル名を使用
- 指定なしの場合: `formatFilename()`でデフォルト名生成

### 課題・改善点

Refactorフェーズで以下を改善予定:

1. **進捗管理の改善**
   - 現在: 固定値（0% → 30% → 60% → 80% → 100%）
   - 改善案: より細かい進捗表示、またはアニメーション

2. **エラーハンドリングの詳細化**
   - 現在: 基本的なエラー捕捉のみ
   - 改善案: エラー種別に応じた詳細なメッセージ

3. **パフォーマンス最適化**
   - 現在: 基本的な実装
   - 改善案: 大きな要素の処理最適化

4. **ダウンロード処理の改善**
   - 現在: document.createElementで直接作成
   - 改善案: より安全な方法への変更検討

5. **コメントの簡潔化**
   - 現在: 非常に詳細なコメント（学習用）
   - 改善案: 必要最小限のコメントに整理

### 実装に含めた日本語コメント

実装コード全体に以下のコメントを含めました:

1. **関数レベルのコメント**:
   - 【機能概要】: 各関数の目的
   - 【実装方針】: 実装アプローチ
   - 【テスト対応】: 対応するテストケース
   - 🔵🟡 信頼性レベル: 実装の確実性

2. **処理ブロックレベルのコメント**:
   - 【状態管理】【エクスポート開始】【Canvas生成】等
   - 各処理の目的と理由を明記
   - REQ-XXX対応を明示

3. **変数・定数のコメント**:
   - 【背景色】【スケール】【形式】等
   - 設定値の意味と要件との対応

### コード品質

**ファイルサイズ**: 157行（800行制限内 ✅）

**モック使用確認**: 実装コードにモック・スタブなし ✅

**TypeScript型チェック**: エラーなし ✅

**ESLint**: エラーなし ✅

**信頼性レベル分布**:
- 🔵 高信頼: 95% (要件・テストに基づく)
- 🟡 中信頼: 5% (妥当な推測)
- 🔴 低信頼: 0%

### リファクタリングの候補

1. **進捗管理の抽象化**
   - 進捗更新ロジックを関数化
   - より柔軟な進捗制御

2. **エラーメッセージの一元管理**
   - エラー種別ごとの詳細メッセージ
   - ユーザーフレンドリーなメッセージ

3. **テスト容易性の向上**
   - DOM操作部分の抽象化
   - 依存性注入の検討

4. **コメントの整理**
   - 過剰なコメントの削減
   - 必要最小限に整理

## 品質判定: ✅ 高品質

**判定基準**:
- ✅ テスト結果: 全て成功（12/12）
- ✅ 実装品質: シンプルかつ動作する
- ✅ リファクタ箇所: 明確に特定可能
- ✅ 機能的問題: なし
- ✅ コンパイルエラー: なし
- ✅ ファイルサイズ: 157行（800行以下）
- ✅ モック使用: 実装コードにモック・スタブなし

## 次のステップ

Refactorフェーズ（品質改善）に進みます。

**推奨コマンド**:
```bash
/tsumiki:tdd-refactor TASK-0038
```

このフェーズでは、コードの品質向上、コメントの整理、パフォーマンス最適化を行います。
