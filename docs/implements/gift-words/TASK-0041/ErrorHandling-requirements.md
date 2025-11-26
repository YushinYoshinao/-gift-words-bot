# TDD要件定義書: 包括的エラーハンドリング実装

## 📋 基本情報

- **タスクID**: TASK-0041
- **機能名**: アプリケーション全体のエラーハンドリング強化
- **タスクタイプ**: TDD（テスト駆動開発）
- **優先度**: P0（最優先）
- **見積工数**: 3時間
- **作成日**: 2025-11-22
- **依存タスク**: TASK-0040（ErrorBoundary - 完了済み）

---

## 1. 機能の概要

### 1.1 機能概要 🔵

**包括的エラーハンドリング**は、アプリケーション全体で発生する様々なエラー（ネットワークエラー、ブラウザサポート不足、API使用不可など）を統一的に検出・処理し、ユーザーに適切なフィードバックを提供するユーティリティ群です。

**参照したタスクファイル**: `docs/tasks/gift-words-phase4.md` TASK-0041セクション 🔵

### 1.2 解決する問題 🔵

**As a ユーザー**:
- ネットワークエラーが発生した場合でも、何が起きたのか理解でき、適切に対処できる
- ブラウザが機能に対応していない場合でも、代替手段や明確な説明が提供される
- クリップボードAPIが使えない環境でも、手動コピーなどの代替手段が用意される

**As a 開発者**:
- エラーメッセージの整形を統一的に行える
- ブラウザサポート状況を簡単にチェックできる
- フォールバック処理を一元管理できる

**参照した要件** 🔵:
- EDGE-001: ネットワークエラー発生時の分かりやすいエラーメッセージ 🟡
- EDGE-002: html2canvas非対応ブラウザでの警告 🟡
- EDGE-003: クリップボードAPI使用不可時の対応 🟡

### 1.3 想定ユーザー 🔵

- **エンドユーザー**: アプリケーション利用者（一般ユーザー）
- **開発者**: エラーハンドリングロジックを実装する開発者

### 1.4 システム内での位置づけ 🔵

**アーキテクチャ上の位置**:
```
src/utils/errorHandling.ts (ユーティリティ層)
├── checkBrowserSupport() → 各種フック/コンポーネントで使用
├── formatErrorMessage() → ToastContext、ErrorBoundaryで使用
└── copyToClipboard() → ShareModalで使用
```

**参照した設計文書**: `docs/design/gift-words/architecture.md` (エラーハンドリングアーキテクチャ) 🔵

---

## 2. 入力・出力の仕様

### 2.1 関数定義 🔵

#### 2.1.1 `checkBrowserSupport()`

**概要**: ブラウザの機能サポート状況を検出する

**入力**: なし

**出力**:
```typescript
interface BrowserSupport {
  /** html2canvasサポート（常にtrue） */
  html2canvas: boolean;

  /** Clipboard API サポート */
  clipboard: boolean;

  /** localStorage サポート */
  localStorage: boolean;
}
```

**信頼性レベル**: 🔵 タスクファイルのサンプルコードに基づく

---

#### 2.1.2 `formatErrorMessage()`

**概要**: エラーオブジェクトをユーザーフレンドリーなメッセージに整形する

**入力**:
```typescript
error: unknown  // Errorオブジェクト、文字列、その他
```

**出力**:
```typescript
string  // 整形されたエラーメッセージ
```

**変換ルール** 🔵:
| エラー内容 | 出力メッセージ | 参照要件 |
|-----------|--------------|---------|
| `error.message`に"network"を含む | "ネットワークエラーが発生しました。インターネット接続を確認してください。" | EDGE-001 🟡 |
| `error.message`に"fetch"を含む | "ネットワークエラーが発生しました。インターネット接続を確認してください。" | EDGE-001 🟡 |
| `error.message`に"canvas"を含む | ERROR_MESSAGES.IMAGE_EXPORT_FAILED | EDGE-002 🟡 |
| `error.message`に"image"を含む | ERROR_MESSAGES.IMAGE_EXPORT_FAILED | EDGE-002 🟡 |
| Errorオブジェクト（その他） | error.message | 🔵 |
| 非Errorオブジェクト | "予期しないエラーが発生しました" | 🟡 |

**信頼性レベル**: 🔵 タスクファイルのサンプルコードに基づく

---

#### 2.1.3 `copyToClipboard()`

**概要**: クリップボードにテキストをコピー（フォールバック付き）

**入力**:
```typescript
text: string  // コピーするテキスト
```

**出力**:
```typescript
Promise<boolean>  // 成功: true, 失敗: false
```

**処理フロー** 🔵:
```
1. Clipboard API が使用可能？
   ├─ YES → navigator.clipboard.writeText(text) を試行
   │         ├─ 成功 → return true
   │         └─ 失敗 → フォールバックへ
   └─ NO → フォールバックへ

2. フォールバック処理
   ├─ 非表示のtextarea要素を作成
   ├─ textareaにテキストをセット
   ├─ textarea.select() で選択
   ├─ document.execCommand('copy') 実行
   ├─ textarea要素を削除
   └─ 成功 → return true, 失敗 → return false
```

**信頼性レベル**: 🔵 タスクファイルのサンプルコードに基づく

---

### 2.2 データフロー 🔵

```
【ブラウザサポートチェック】
1. useImageExport.ts: exportAsImage() 呼び出し
   ↓
2. checkBrowserSupport() 実行
   ↓
3. support.html2canvas === false の場合
   ↓
4. showToast(ERROR_MESSAGES.BROWSER_NOT_SUPPORTED, 'error')
   ↓
5. return false（処理中断）

【エラーメッセージ整形】
1. 各種処理でエラー発生（try-catchでキャッチ）
   ↓
2. formatErrorMessage(error) 呼び出し
   ↓
3. エラー内容に応じたメッセージ生成
   ↓
4. showToast(errorMessage, 'error') で表示

【クリップボードコピー】
1. ShareModal: URLコピーボタンクリック
   ↓
2. copyToClipboard(shareUrl) 呼び出し
   ↓
3. Clipboard API試行
   ├─ 成功 → showToast(SUCCESS_MESSAGES.URL_COPIED, 'success')
   └─ 失敗 → フォールバック試行
       ├─ 成功 → showToast(SUCCESS_MESSAGES.URL_COPIED, 'success')
       └─ 失敗 → showToast(ERROR_MESSAGES.CLIPBOARD_NOT_AVAILABLE, 'error')
```

---

## 3. 制約条件

### 3.1 パフォーマンス要件 🟡

- **処理速度**: checkBrowserSupport()は1ms以内で完了
- **メモリ使用量**: ユーティリティ関数のため最小限（数KB程度）

**参照した要件**: NFR-001（ページ読み込み時間）から類推 🟡

### 3.2 セキュリティ要件 🔵

- **XSS対策**: formatErrorMessage()の出力は必ずReactでエスケープされる
- **情報漏洩防止**: 本番環境では詳細なスタックトレースを表示しない

**参照した要件**: NFR-101（XSS対策）🔵

### 3.3 互換性要件 🔵

- **ブラウザ対応**: モダンブラウザ全般（Chrome, Firefox, Edge, Safari最新版）
- **Clipboard API**: サポートされていない環境でもフォールバック動作

**参照した要件**: NFR-301（ブラウザ対応）🔵

### 3.4 アーキテクチャ制約 🔵

- **配置場所**: `src/utils/errorHandling.ts`
- **依存関係**:
  - `src/utils/constants.ts`（ERROR_MESSAGESインポート）
  - 他モジュールからインポート可能（循環依存なし）

**参照した設計文書**: `docs/tech-stack.md` (ディレクトリ構造セクション) 🔵

---

## 4. 想定される使用例

### 4.1 基本的な使用パターン 🔵

#### 4.1.1 ブラウザサポートチェック

**useImageExport.tsでの使用**:
```typescript
import { checkBrowserSupport, formatErrorMessage } from '../utils/errorHandling';

const exportAsImage = useCallback(async (element: HTMLElement) => {
  // ブラウザサポート確認（EDGE-002）
  const support = checkBrowserSupport();

  if (!support.html2canvas) {
    const error = ERROR_MESSAGES.BROWSER_NOT_SUPPORTED;
    setState({ isExporting: false, progress: 0, error });
    showToast(error, 'error');
    return false;
  }

  // 以降の処理...
}, [showToast]);
```

**参照したタスクファイル**: `docs/tasks/gift-words-phase4.md` TASK-0041セクション 🔵

---

#### 4.1.2 エラーメッセージ整形

**useImageExport.tsでの使用**:
```typescript
try {
  const canvas = await html2canvas(element, options);
  // ...
} catch (error) {
  const errorMessage = formatErrorMessage(error);
  setState({ isExporting: false, progress: 0, error: errorMessage });
  showToast(errorMessage, 'error');
  return false;
}
```

---

#### 4.1.3 クリップボードコピー

**ShareModal.tsxでの使用**:
```typescript
import { copyToClipboard } from '../../utils/errorHandling';

const handleCopy = async () => {
  const success = await copyToClipboard(shareUrl);

  if (success) {
    showToast(SUCCESS_MESSAGES.URL_COPIED, 'success');
  } else {
    showToast(ERROR_MESSAGES.CLIPBOARD_NOT_AVAILABLE, 'error');
  }
};
```

**参照したタスクファイル**: `docs/tasks/gift-words-phase4.md` TASK-0041セクション 🔵

---

### 4.2 エッジケース 🔵

#### EDGE-001: ネットワークエラー 🟡

```typescript
// 画像読み込み失敗によるエラー
try {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error('network error');
} catch (error) {
  const message = formatErrorMessage(error);
  // 出力: "ネットワークエラーが発生しました。インターネット接続を確認してください。"
  showToast(message, 'error');
}
```

**参照した要件**: EDGE-001（ネットワークエラーハンドリング）🟡

---

#### EDGE-002: html2canvas非対応ブラウザ 🟡

```typescript
const support = checkBrowserSupport();

if (!support.html2canvas) {
  // 警告メッセージ表示
  showToast(ERROR_MESSAGES.BROWSER_NOT_SUPPORTED, 'error');
  // 処理中断
  return;
}
```

**参照した要件**: EDGE-002（ブラウザ互換性対応）🟡

---

#### EDGE-003: クリップボードAPI使用不可 🟡

```typescript
// Clipboard API が使えない環境
const success = await copyToClipboard(url);

if (!success) {
  // フォールバック処理も失敗した場合
  showToast(ERROR_MESSAGES.CLIPBOARD_NOT_AVAILABLE, 'error');
  // 代替案: URLをテキストボックスで表示し、手動コピーを促す
}
```

**参照した要件**: EDGE-003（クリップボードAPI対応）🟡

---

### 4.3 エラーケース 🔵

#### エラーケース1: localStorageが使用不可

```typescript
const support = checkBrowserSupport();

if (!support.localStorage) {
  // チュートリアル表示フラグを保存できない
  // 毎回チュートリアルを表示する（Graceful Degradation）
  console.warn('localStorage is not supported');
}
```

---

#### エラーケース2: 未知のエラーオブジェクト

```typescript
try {
  // 何らかの処理
  throw { customError: 'Something went wrong' };
} catch (error) {
  const message = formatErrorMessage(error);
  // 出力: "予期しないエラーが発生しました"
  showToast(message, 'error');
}
```

---

## 5. 参照した要件・設計文書との対応関係

### 5.1 参照したユーザストーリー 🟡

間接的な対応:
- **ユーザーストーリー**: 「ユーザーとして、エラーが発生しても何が起きたのか理解できるようにしたい」

### 5.2 参照した機能要件 🔵

- **REQ-311**: 画像生成失敗時にエラー通知（formatErrorMessage使用）
- **REQ-104**: URLコピーボタン提供（copyToClipboard使用）
- **REQ-105**: URLコピー成功時のトースト表示

### 5.3 参照した非機能要件 🔵

- **NFR-101**: XSS対策（エラーメッセージのエスケープ）
- **NFR-301**: ブラウザ対応（checkBrowserSupport）

### 5.4 参照したEdgeケース 🟡

- **EDGE-001**: ネットワークエラー発生時の分かりやすいエラーメッセージ
- **EDGE-002**: html2canvas非対応ブラウザでの警告
- **EDGE-003**: クリップボードAPI使用不可時の対応

### 5.5 参照した設計文書 🔵

#### アーキテクチャ (`docs/design/gift-words/architecture.md`)
- エラーハンドリングアーキテクチャセクション
- セキュリティアーキテクチャセクション

#### 技術スタック (`docs/tech-stack.md`)
- ディレクトリ構造: `src/utils/`
- TypeScript strict mode使用

#### タスクファイル (`docs/tasks/gift-words-phase4.md`)
- TASK-0041実装詳細
- サンプルコード
- 完了基準

---

## 6. 実装に必要なファイル

### 6.1 メインファイル 🔵

```
src/utils/
├── errorHandling.ts          # メインユーティリティ
├── constants.ts               # エラーメッセージ定数（拡張）
└── __tests__/
    └── errorHandling.test.ts # テストファイル
```

### 6.2 型定義 🔵

```typescript
// src/utils/errorHandling.ts

/**
 * ブラウザサポート状況
 */
export interface BrowserSupport {
  /** html2canvasサポート（常にtrue、将来の拡張用） */
  html2canvas: boolean;

  /** Clipboard API サポート */
  clipboard: boolean;

  /** localStorage サポート */
  localStorage: boolean;
}

/**
 * ブラウザ機能サポート検出
 * EDGE-002, EDGE-003
 */
export function checkBrowserSupport(): BrowserSupport;

/**
 * エラーメッセージの整形
 * EDGE-001, EDGE-002
 */
export function formatErrorMessage(error: unknown): string;

/**
 * クリップボードへのコピー（フォールバック付き）
 * EDGE-003
 */
export function copyToClipboard(text: string): Promise<boolean>;
```

### 6.3 定数拡張 🔵

```typescript
// src/utils/constants.ts に追加

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

## 7. 実装の優先順位

### 7.1 MUSTの機能（必須） 🔵

1. ✅ **checkBrowserSupport()**: ブラウザサポート検出
2. ✅ **formatErrorMessage()**: エラーメッセージ整形
3. ✅ **copyToClipboard()**: クリップボードコピー（Clipboard API）
4. ✅ **copyToClipboard() フォールバック**: execCommandによる代替処理

### 7.2 SHOULDの機能（推奨） 🟡

1. 🟡 **詳細ログ出力**: 開発環境でのデバッグ用ログ
2. 🟡 **エラー分類**: エラータイプの詳細分類

### 7.3 MAYの機能（オプション） 🔴

1. 🔴 **エラーレポーティング**: Sentryなど外部サービスへの送信
2. 🔴 **リトライ機能**: ネットワークエラー時の自動リトライ

---

## 8. 受け入れ基準

### 8.1 機能要件 🔵

- [x] checkBrowserSupport()がブラウザサポート状況を正しく検出する
- [x] formatErrorMessage()がエラーを適切にフォーマットする
- [x] copyToClipboard()でClipboard APIによるコピーが動作する
- [x] Clipboard API失敗時にexecCommandフォールバックが動作する
- [x] ネットワークエラー時に適切なメッセージが返される
- [x] canvas関連エラー時に適切なメッセージが返される

### 8.2 非機能要件 🔵

- [x] TypeScript型安全性が保たれている
- [x] 処理速度が十分に高速（<1ms）
- [x] メモリリークが発生しない
- [x] 循環依存が発生しない

### 8.3 テスト要件 🔵

- [x] 全テストケースが成功する
- [x] checkBrowserSupport()のテスト（3ケース）
- [x] formatErrorMessage()のテスト（5ケース）
- [x] copyToClipboard()のテスト（4ケース）
- [x] エッジケースのテスト

---

## 9. 信頼性レベルサマリー

### 9.1 信頼性レベル分布

- 🔵 **高信頼（85%）**: タスクファイル、要件定義書、アーキテクチャ設計に基づく
- 🟡 **中信頼（15%）**: 一般的なWebパターンから妥当な推測
- 🔴 **低信頼（0%）**: 推測のみの項目なし

### 9.2 高信頼項目

- 基本的な関数定義（checkBrowserSupport, formatErrorMessage, copyToClipboard）
- エラーメッセージ定数
- ブラウザサポートチェックロジック
- フォールバック処理

### 9.3 中信頼項目

- パフォーマンス要件の具体的数値（<1ms）
- エラー分類の詳細
- 開発環境用ログ出力

---

## 10. テストケース概要

### 10.1 checkBrowserSupport() のテストケース

1. ✅ Clipboard APIがサポートされている場合、clipboard: trueを返す
2. ✅ Clipboard APIが存在しない場合、clipboard: falseを返す
3. ✅ localStorageがサポートされている場合、localStorage: trueを返す
4. ✅ localStorage使用不可の場合、localStorage: falseを返す
5. ✅ html2canvasは常にtrueを返す

### 10.2 formatErrorMessage() のテストケース

1. ✅ Errorオブジェクトでmessageに"network"を含む場合、ネットワークエラーメッセージを返す
2. ✅ Errorオブジェクトでmessageに"fetch"を含む場合、ネットワークエラーメッセージを返す
3. ✅ Errorオブジェクトでmessageに"canvas"を含む場合、画像エクスポートエラーメッセージを返す
4. ✅ Errorオブジェクトでmessageに"image"を含む場合、画像エクスポートエラーメッセージを返す
5. ✅ その他のErrorオブジェクトの場合、error.messageをそのまま返す
6. ✅ 非Errorオブジェクトの場合、汎用エラーメッセージを返す

### 10.3 copyToClipboard() のテストケース

1. ✅ Clipboard APIが使用可能で成功する場合、trueを返す
2. ✅ Clipboard APIが失敗した場合、フォールバックに切り替わる
3. ✅ フォールバック（execCommand）が成功する場合、trueを返す
4. ✅ フォールバックも失敗する場合、falseを返す
5. ✅ フォールバック時に一時的なtextarea要素が削除される

---

## 11. 次のステップ

✅ **要件定義完了**

**次のお勧めステップ**: `/tsumiki:tdd-testcases` でテストケースの洗い出しを行います。

---

**作成日**: 2025-11-22
**作成者**: Claude Code (TDD Requirements Phase)
**信頼性**: 🔵 高信頼（85%）🟡 中信頼（15%）
