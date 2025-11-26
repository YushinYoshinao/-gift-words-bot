# TDD Redフェーズ: 包括的エラーハンドリング実装

## 📋 基本情報

- **タスクID**: TASK-0041
- **機能名**: 包括的エラーハンドリング (checkBrowserSupport, formatErrorMessage, copyToClipboard)
- **フェーズ**: Red（失敗するテスト作成）
- **実施日**: 2025-11-22
- **テストフレームワーク**: Vitest 1.2.0
- **テストランナー**: @testing-library/react 14.1.0

---

## 🎯 Redフェーズの目的

失敗するテストケースを27個作成し、実装すべき機能を明確に定義します。

---

## 📝 作成したテストケース

### テスト対象ファイル

**テストファイル**: `src/utils/__tests__/errorHandling.test.ts`
**実装ファイル**: `src/utils/errorHandling.ts` (未作成)

### テストケース数

| 関数 | テストケース数 | 信頼性レベル |
|------|---------------|-------------|
| checkBrowserSupport() | 7 | 🔵 高信頼（5）+ 🟡 中信頼（2） |
| formatErrorMessage() | 10 | 🔵 高信頼（6）+ 🟡 中信頼（4） |
| copyToClipboard() | 10 | 🔵 高信頼（8）+ 🟡 中信頼（2） |
| **合計** | **27** | **🔵 19 + 🟡 8** |

---

## 🧪 テストケース詳細

### 1. checkBrowserSupport() のテストケース（7件）

#### TC-BS-001: Clipboard APIサポート検出（サポートあり） 🔵

**テスト目的**: Clipboard API利用可能時の正常な検出

**Given（準備）**:
```typescript
const mockWriteText = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, {
  clipboard: { writeText: mockWriteText },
});
```

**When（実行）**:
```typescript
const support: BrowserSupport = checkBrowserSupport();
```

**Then（検証）**:
```typescript
expect(support.clipboard).toBe(true);
expect(support.html2canvas).toBe(true);
expect(support.localStorage).toBeDefined();
```

**信頼性レベル**: 🔵 要件定義書のTC-BS-001に基づく

---

#### TC-BS-002: localStorageサポート検出（サポートあり） 🔵

**テスト目的**: localStorage利用可能時の正常な検出

**Given（準備）**: デフォルトのjsdom環境（localStorageが利用可能）

**When（実行）**:
```typescript
const support: BrowserSupport = checkBrowserSupport();
```

**Then（検証）**:
```typescript
expect(support.localStorage).toBe(true);
expect(support.html2canvas).toBe(true);
```

**信頼性レベル**: 🔵 要件定義書のTC-BS-002に基づく

---

#### TC-BS-003: html2canvas常時サポート 🔵

**テスト目的**: html2canvasフィールドの仕様確認

**When（実行）**:
```typescript
const support: BrowserSupport = checkBrowserSupport();
```

**Then（検証）**:
```typescript
expect(support.html2canvas).toBe(true);
```

**信頼性レベル**: 🔵 要件定義書のTC-BS-003に基づく

---

#### TC-BS-004: Clipboard API未サポート 🔵

**テスト目的**: Clipboard API未サポート環境の検出

**Given（準備）**:
```typescript
Object.assign(navigator, {
  clipboard: undefined,
});
```

**When（実行）**:
```typescript
const support: BrowserSupport = checkBrowserSupport();
```

**Then（検証）**:
```typescript
expect(support.clipboard).toBe(false);
expect(support.html2canvas).toBe(true);
```

**信頼性レベル**: 🔵 要件定義書のTC-BS-004、EDGE-003に基づく

---

#### TC-BS-005: localStorage使用不可 🔵

**テスト目的**: localStorage使用不可環境の検出

**Given（準備）**:
```typescript
Object.defineProperty(window, 'localStorage', {
  get: () => {
    throw new Error('localStorage disabled');
  },
  configurable: true,
});
```

**When（実行）**:
```typescript
const support: BrowserSupport = checkBrowserSupport();
```

**Then（検証）**:
```typescript
expect(support.localStorage).toBe(false);
expect(support.html2canvas).toBe(true);
```

**信頼性レベル**: 🔵 要件定義書のTC-BS-005に基づく

---

#### TC-BS-006: 全機能サポート済み環境 🟡

**テスト目的**: フル機能環境での動作確認

**Given（準備）**:
```typescript
const mockWriteText = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, {
  clipboard: { writeText: mockWriteText },
});
// localStorage利用可能（デフォルト）
```

**When（実行）**:
```typescript
const support: BrowserSupport = checkBrowserSupport();
```

**Then（検証）**:
```typescript
expect(support.html2canvas).toBe(true);
expect(support.clipboard).toBe(true);
expect(support.localStorage).toBe(true);
```

**信頼性レベル**: 🟡 一般的なテストパターンから妥当な推測

---

#### TC-BS-007: すべての機能が未サポートの環境 🟡

**テスト目的**: 最小限の環境での動作確認

**Given（準備）**:
```typescript
Object.assign(navigator, {
  clipboard: undefined,
});
Object.defineProperty(window, 'localStorage', {
  get: () => {
    throw new Error('localStorage disabled');
  },
  configurable: true,
});
```

**When（実行）**:
```typescript
const support: BrowserSupport = checkBrowserSupport();
```

**Then（検証）**:
```typescript
expect(support.html2canvas).toBe(true); // html2canvasは常にtrue
expect(support.clipboard).toBe(false);
expect(support.localStorage).toBe(false);
```

**信頼性レベル**: 🟡 Graceful Degradationの一般的なパターンから推測

---

### 2. formatErrorMessage() のテストケース（10件）

#### TC-FM-001: 通常のErrorオブジェクト 🔵

**Given**: `new Error('何らかのエラーが発生しました')`
**When**: `formatErrorMessage(error)`
**Then**: `'何らかのエラーが発生しました'`
**信頼性**: 🔵 要件定義書のTC-FM-001に基づく

---

#### TC-FM-002: ネットワークエラー（"network"キーワード） 🔵

**Given**: `new Error('network error occurred')`
**When**: `formatErrorMessage(error)`
**Then**: `'ネットワークエラーが発生しました。インターネット接続を確認してください。'`
**信頼性**: 🔵 要件定義書のTC-FM-002、EDGE-001に基づく

---

#### TC-FM-003: ネットワークエラー（"fetch"キーワード） 🔵

**Given**: `new Error('Failed to fetch')`
**When**: `formatErrorMessage(error)`
**Then**: `'ネットワークエラーが発生しました。インターネット接続を確認してください。'`
**信頼性**: 🔵 要件定義書のTC-FM-003、EDGE-001に基づく

---

#### TC-FM-004: 画像エクスポートエラー（"canvas"キーワード） 🔵

**Given**: `new Error('canvas rendering failed')`
**When**: `formatErrorMessage(error)`
**Then**: `ERROR_MESSAGES.IMAGE_EXPORT_FAILED`
**信頼性**: 🔵 要件定義書のTC-FM-004、EDGE-002に基づく

---

#### TC-FM-005: 画像エクスポートエラー（"image"キーワード） 🔵

**Given**: `new Error('image processing error')`
**When**: `formatErrorMessage(error)`
**Then**: `ERROR_MESSAGES.IMAGE_EXPORT_FAILED`
**信頼性**: 🔵 要件定義書のTC-FM-005、EDGE-002に基づく

---

#### TC-FM-006: 非Errorオブジェクト 🔵

**Given**: `{ customError: 'Something went wrong' }`
**When**: `formatErrorMessage(customError)`
**Then**: `ERROR_MESSAGES.UNEXPECTED_ERROR`
**信頼性**: 🔵 要件定義書のTC-FM-006に基づく

---

#### TC-FM-007: 空文字列のErrorメッセージ 🟡

**Given**: `new Error('')`
**When**: `formatErrorMessage(error)`
**Then**: `ERROR_MESSAGES.UNEXPECTED_ERROR`
**信頼性**: 🟡 一般的なエッジケーステストパターンから推測

---

#### TC-FM-008: 非常に長いエラーメッセージ 🟡

**Given**: `new Error('あ'.repeat(10000))`
**When**: `formatErrorMessage(error)`
**Then**: `'あ'.repeat(10000)` (そのまま返す)
**信頼性**: 🟡 パフォーマンステストの一般的なパターンから推測

---

#### TC-FM-009: 複数のキーワードを含むエラーメッセージ 🟡

**Given**: `new Error('network error while processing image')`
**When**: `formatErrorMessage(error)`
**Then**: `'ネットワークエラーが発生しました。インターネット接続を確認してください。'` (ネットワークエラーが優先)
**信頼性**: 🟡 実装の優先順位ロジックに依存

---

#### TC-FM-010: 大文字小文字混在のキーワード 🟡

**Given**: `new Error('NETWORK ERROR')` または `new Error('Network Error')`
**When**: `formatErrorMessage(error)`
**Then**: `'ネットワークエラーが発生しました。インターネット接続を確認してください。'`
**信頼性**: 🟡 toLowerCase()を使う実装を想定

---

### 3. copyToClipboard() のテストケース（10件）

#### TC-CC-001: Clipboard APIで正常にコピー 🔵

**Given**: Clipboard API利用可能、`mockWriteText.mockResolvedValue(undefined)`
**When**: `copyToClipboard('https://example.com/share?data=abc123')`
**Then**: `result === true`, `mockWriteText`が正しく呼ばれる
**信頼性**: 🔵 要件定義書のTC-CC-001に基づく

---

#### TC-CC-002: 空文字列のコピー 🔵

**Given**: Clipboard API利用可能
**When**: `copyToClipboard('')`
**Then**: `result === true`, `mockWriteText('')`が呼ばれる
**信頼性**: 🔵 既存clipboard.test.tsのパターンに基づく

---

#### TC-CC-003: 長いテキストのコピー 🔵

**Given**: Clipboard API利用可能
**When**: `copyToClipboard('a'.repeat(10000))`
**Then**: `result === true`, メモリエラーなし
**信頼性**: 🔵 既存clipboard.test.tsのパターンに基づく

---

#### TC-CC-004: 特殊文字を含むテキストのコピー 🔵

**Given**: Clipboard API利用可能
**When**: `copyToClipboard('特殊文字 & "quotes" <tags>')`
**Then**: `result === true`, 特殊文字がエスケープされずにコピー
**信頼性**: 🔵 既存clipboard.test.tsのパターンに基づく

---

#### TC-CC-005: Clipboard API失敗時のフォールバック成功 🔵

**Given**: Clipboard API失敗（`mockWriteText.mockRejectedValue`）、execCommand成功
**When**: `copyToClipboard('test text')`
**Then**: `result === true`, `execCommand('copy')`が呼ばれる
**信頼性**: 🔵 要件定義書のTC-CC-005に基づく

---

#### TC-CC-006: フォールバック処理の成功（Clipboard API未サポート） 🔵

**Given**: `navigator.clipboard === undefined`、execCommand成功
**When**: `copyToClipboard('fallback test')`
**Then**: `result === true`, `execCommand('copy')`が呼ばれる
**信頼性**: 🔵 要件定義書のTC-CC-006に基づく

---

#### TC-CC-007: フォールバックも失敗する場合 🔵

**Given**: `navigator.clipboard === undefined`、execCommand失敗
**When**: `copyToClipboard('test')`
**Then**: `result === false`
**信頼性**: 🔵 要件定義書のTC-CC-007に基づく

---

#### TC-CC-008: フォールバック時の一時要素削除確認 🔵

**Given**: フォールバック処理
**When**: `copyToClipboard('cleanup test')`
**Then**: 一時的なtextarea要素が削除される（メモリリーク防止）
**信頼性**: 🔵 要件定義書のTC-CC-008に基づく

---

#### TC-CC-009: Clipboard API途中でエラー（例外） 🟡

**Given**: `mockWriteText`が同期的に例外をスロー、execCommand成功
**When**: `copyToClipboard('error test')`
**Then**: `result === true` (フォールバック成功)
**信頼性**: 🟡 一般的なエラーハンドリングパターンから推測

---

#### TC-CC-010: navigator.clipboard自体がundefinedの場合 🟡

**Given**: `navigator.clipboard === undefined` (Object.definePropertyで設定)、execCommand成功
**When**: `copyToClipboard('undefined test')`
**Then**: `result === true` (フォールバック成功)
**信頼性**: 🟡 TypeScriptのオプショナルチェーン使用を前提

---

## 🧩 テスト設計のポイント

### 1. Given-When-Thenパターンの徹底

すべてのテストケースでGiven-When-Thenパターンを使用し、日本語コメントで明示:

```typescript
// 【テストデータ準備】: ...
// 【初期条件設定】: ...
const input = ...;

// 【実際の処理実行】: ...
// 【処理内容】: ...
const result = ...;

// 【結果検証】: ...
// 【期待値確認】: ...
expect(result).toBe(...); // 【確認内容】: ...
```

### 2. 信頼性レベルの明示

各テストケースに信頼性レベルを明記:
- 🔵 **高信頼**: 要件定義書、既存テストパターンに基づく
- 🟡 **中信頼**: 一般的なパターンから妥当な推測

### 3. エッジケースの網羅

- **正常系**: 基本的な動作確認
- **異常系**: エラーハンドリング、フォールバック
- **境界値**: 空文字列、非常に長い文字列、特殊文字
- **環境依存**: API未サポート、例外発生

### 4. モック戦略

- **navigator.clipboard**: Clipboard APIのモック
- **window.localStorage**: localStorageのモック
- **document.execCommand**: フォールバック処理のモック

---

## 🎬 テスト実行結果

### 実行コマンド

```bash
npm test -- src/utils/__tests__/errorHandling.test.ts --run
```

### 実行結果

```
Error: Failed to resolve import "../errorHandling" from "src/utils/__tests__/errorHandling.test.ts".
Does the file exist?
```

**ステータス**: ❌ **失敗** (期待通り)

**失敗理由**: `src/utils/errorHandling.ts` ファイルが存在しないため、テストファイルのimportに失敗しました。

---

## 📊 コードカバレッジ予測

### 関数カバレッジ

- **checkBrowserSupport()**: 100% (7テストケース)
- **formatErrorMessage()**: 100% (10テストケース)
- **copyToClipboard()**: 100% (10テストケース)
- **合計**: 100% (3関数すべてテスト済み)

### 分岐カバレッジ

- **checkBrowserSupport()**: 90%以上
  - Clipboard APIあり/なし
  - localStorageあり/なし

- **formatErrorMessage()**: 95%以上
  - Errorオブジェクト/非Errorオブジェクト
  - 各種キーワード検出（network, fetch, canvas, image）
  - 空文字列、長いメッセージ

- **copyToClipboard()**: 95%以上
  - Clipboard API成功/失敗
  - フォールバック成功/失敗
  - 各種エッジケース

### 行カバレッジ

**予測**: 95%以上（想定実装に基づく）

---

## 📝 実装への指針

### 1. BrowserSupport型定義

```typescript
export interface BrowserSupport {
  html2canvas: boolean;
  clipboard: boolean;
  localStorage: boolean;
}
```

### 2. checkBrowserSupport() 実装方針

```typescript
export function checkBrowserSupport(): BrowserSupport {
  return {
    html2canvas: true, // 常にtrue
    clipboard: !!navigator.clipboard?.writeText,
    localStorage: (() => {
      try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
  };
}
```

**ポイント**:
- Clipboard APIの存在をオプショナルチェーンで確認
- localStorageの利用可能性をtry-catchで確認
- html2canvasは常にtrue（将来の拡張用）

### 3. formatErrorMessage() 実装方針

```typescript
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // ネットワークエラー（優先度高）
    if (message.includes('network') || message.includes('fetch')) {
      return 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
    }

    // 画像エクスポートエラー
    if (message.includes('canvas') || message.includes('image')) {
      return ERROR_MESSAGES.IMAGE_EXPORT_FAILED;
    }

    // 空文字列チェック
    if (error.message === '') {
      return ERROR_MESSAGES.UNEXPECTED_ERROR;
    }

    return error.message;
  }

  return ERROR_MESSAGES.UNEXPECTED_ERROR;
}
```

**ポイント**:
- toLowerCase()で大文字小文字を区別しない
- ネットワークエラーを優先的にチェック（TC-FM-009）
- 空文字列の場合は汎用エラーメッセージ
- 非Errorオブジェクトは汎用エラーメッセージ

### 4. copyToClipboard() 実装方針

```typescript
export async function copyToClipboard(text: string): Promise<boolean> {
  // Clipboard API試行
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Clipboard API failed:', error);
      // フォールバックへ
    }
  }

  // フォールバック: execCommand
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea); // メモリリーク防止
    return success;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    return false;
  }
}
```

**ポイント**:
- Clipboard API優先、失敗時にフォールバック
- フォールバック後に一時的なtextarea要素を削除（TC-CC-008）
- すべて失敗した場合はfalseを返す

### 5. 定数の拡張

`src/utils/constants.ts` に追加が必要なメッセージ（既に存在するかもしれない）:

```typescript
export const ERROR_MESSAGES = {
  // ... 既存のメッセージ

  /** ネットワークエラー（EDGE-001） */
  NETWORK_ERROR: 'ネットワークエラーが発生しました。インターネット接続を確認してください。',

  /** ブラウザ非対応（EDGE-002） */
  BROWSER_NOT_SUPPORTED: 'お使いのブラウザはこの機能に対応していません。',

  /** クリップボード使用不可（EDGE-003） */
  CLIPBOARD_NOT_AVAILABLE: 'クリップボードにコピーできませんでした。URLを手動でコピーしてください。',
} as const;
```

---

## ✅ 完了基準

### Redフェーズ完了条件

- [x] テストケース27個作成完了
- [x] すべてのテストが失敗することを確認
- [x] 実装ファイルが存在しないためimportエラーが発生
- [x] 各テストに日本語コメント記載
- [x] 信頼性レベル表示
- [x] Given-When-Thenパターン適用

### 次のステップ

**次のお勧めステップ**: `/tsumiki:tdd-green` でGreenフェーズ（最小実装）を開始します。

**実装タスク**:
1. `src/utils/errorHandling.ts` 新規作成
2. BrowserSupport型定義
3. checkBrowserSupport() 実装
4. formatErrorMessage() 実装
5. copyToClipboard() 実装
6. 定数拡張（必要に応じて）
7. 全テスト成功確認

---

**作成日**: 2025-11-22
**作成者**: Claude Code (TDD Red Phase)
**フェーズ**: Red（失敗するテスト作成） ✅ 完了
**テストケース数**: 27個
**品質判定**: ✅ 高品質（実装可能）
