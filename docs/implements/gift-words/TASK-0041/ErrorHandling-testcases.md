# TDDテストケース定義書: 包括的エラーハンドリング実装

## 📋 基本情報

- **タスクID**: TASK-0041
- **機能名**: 包括的エラーハンドリング（checkBrowserSupport, formatErrorMessage, copyToClipboard）
- **作成日**: 2025-11-22
- **テストフレームワーク**: Vitest + @testing-library/jest-dom
- **テスト実行環境**: Node.js 18+, jsdom環境

---

## 📚 テスト対象の概要

### 実装する3つのユーティリティ関数

1. **checkBrowserSupport()**: ブラウザ機能サポート検出
2. **formatErrorMessage()**: エラーメッセージの整形
3. **copyToClipboard()**: クリップボードコピー（フォールバック付き）

### 参照ドキュメント

- **要件定義**: `docs/implements/gift-words/TASK-0041/ErrorHandling-requirements.md` 🔵
- **既存テストパターン**: `src/utils/__tests__/clipboard.test.ts` 🔵
- **定数定義**: `src/utils/constants.ts` 🔵

---

## 🧪 開発言語・フレームワーク

### プログラミング言語
- **言語**: TypeScript (strict mode)
- **言語選択の理由**: プロジェクト全体がTypeScriptで統一されており、型安全性が保証される 🔵
- **テストに適した機能**: 型推論により、テストケースでも型の不一致を早期検出できる 🔵

### テストフレームワーク
- **フレームワーク**: Vitest 1.2.0
- **アサーションライブラリ**: @testing-library/jest-dom
- **モックライブラリ**: Vitest組み込みの`vi`
- **フレームワーク選択の理由**:
  - プロジェクトで既に使用されている 🔵
  - Viteとの統合が優れている 🔵
  - JestのAPIと互換性があり学習コストが低い 🔵
- **テスト実行環境**: jsdom環境（ブラウザAPIをシミュレート） 🔵

🔵 **信頼性レベル**: package.json、vitest.config.tsの実際の設定に基づく

---

## 1. checkBrowserSupport() のテストケース

### 1.1 正常系テストケース

#### TC-BS-001: Clipboard APIサポート検出（サポートあり）

- **テスト名**: Clipboard APIがサポートされている場合、clipboard: trueを返す
  - **何をテストするか**: navigator.clipboard.writeTextが存在する環境でのサポート検出
  - **期待される動作**: BrowserSupport.clipboardがtrueになる
- **入力値**: なし（関数は引数を取らない）
  - **モック設定**: `navigator.clipboard.writeText = vi.fn()`
  - **入力データの意味**: モダンブラウザでClipboard APIが利用可能な状態を再現
- **期待される結果**:
  ```typescript
  {
    html2canvas: true,
    clipboard: true,
    localStorage: true (または実際の状態)
  }
  ```
  - **期待結果の理由**: Clipboard APIが存在する場合は利用可能と判定すべき
- **テストの目的**: Clipboard API利用可能時の正常な検出
  - **確認ポイント**: clipboard プロパティが正しく true になること
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.1-1に基づく

---

#### TC-BS-002: localStorageサポート検出（サポートあり）

- **テスト名**: localStorageがサポートされている場合、localStorage: trueを返す
  - **何をテストするか**: window.localStorageが正常に使える環境でのサポート検出
  - **期待される動作**: BrowserSupport.localStorageがtrueになる
- **入力値**: なし
  - **モック設定**: デフォルトのjsdom環境（localStorageが利用可能）
  - **入力データの意味**: 通常のブラウザ環境を再現
- **期待される結果**:
  ```typescript
  {
    html2canvas: true,
    clipboard: (実際の状態),
    localStorage: true
  }
  ```
  - **期待結果の理由**: localStorageが使える環境では利用可能と判定すべき
- **テストの目的**: localStorage利用可能時の正常な検出
  - **確認ポイント**: localStorage プロパティが正しく true になること
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.1-3に基づく

---

#### TC-BS-003: html2canvas常時サポート

- **テスト名**: html2canvasは常にtrueを返す
  - **何をテストするか**: html2canvasプロパティが常にtrueであることの確認
  - **期待される動作**: どの環境でもBrowserSupport.html2canvasがtrueになる
- **入力値**: なし
  - **入力データの意味**: html2canvasはnpmパッケージとして利用するため、常に利用可能
- **期待される結果**:
  ```typescript
  {
    html2canvas: true,
    clipboard: (実際の状態),
    localStorage: (実際の状態)
  }
  ```
  - **期待結果の理由**: html2canvasは依存関係として常に利用可能（将来の拡張用フィールド）
- **テストの目的**: html2canvasフィールドの仕様確認
  - **確認ポイント**: html2canvas プロパティが必ず true であること
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.1-5に基づく

---

### 1.2 異常系テストケース

#### TC-BS-004: Clipboard API未サポート

- **テスト名**: Clipboard APIが存在しない場合、clipboard: falseを返す
  - **エラーケースの概要**: 古いブラウザやClipboard APIが無効な環境
  - **エラー処理の重要性**: フォールバック処理の判定に使用されるため、正確な検出が必要
- **入力値**: なし
  - **モック設定**: `navigator.clipboard = undefined`
  - **不正な理由**: 一部のブラウザやHTTPS未使用時にClipboard APIが利用不可
  - **実際の発生シナリオ**: HTTP環境、古いブラウザ、プライバシーモード
- **期待される結果**:
  ```typescript
  {
    html2canvas: true,
    clipboard: false,
    localStorage: (実際の状態)
  }
  ```
  - **エラーメッセージの内容**: エラーメッセージは出力されない（検出のみ）
  - **システムの安全性**: フォールバック処理に切り替わり、システムは継続動作
- **テストの目的**: Clipboard API未サポート環境の検出
  - **品質保証の観点**: 古い環境でも適切にフォールバックできることを保証
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.1-2、EDGE-003に基づく

---

#### TC-BS-005: localStorage使用不可

- **テスト名**: localStorageが使用不可の場合、localStorage: falseを返す
  - **エラーケースの概要**: プライベートモードやストレージ無効環境
  - **エラー処理の重要性**: チュートリアル表示フラグの保存可否判定に使用
- **入力値**: なし
  - **モック設定**: `Object.defineProperty(window, 'localStorage', { get: () => { throw new Error('localStorage disabled'); } })`
  - **不正な理由**: プライベートブラウジング、ストレージクォータ超過、セキュリティポリシーによる無効化
  - **実際の発生シナリオ**: プライベートモード、企業のセキュリティポリシー
- **期待される結果**:
  ```typescript
  {
    html2canvas: true,
    clipboard: (実際の状態),
    localStorage: false
  }
  ```
  - **エラーメッセージの内容**: エラーメッセージは出力されない（Graceful Degradation）
  - **システムの安全性**: localStorage無しでも動作継続（チュートリアルが毎回表示される）
- **テストの目的**: localStorage使用不可環境の検出
  - **品質保証の観点**: ストレージ無効環境でもクラッシュしないことを保証
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.1-4に基づく

---

### 1.3 境界値テストケース

#### TC-BS-006: 全機能サポート済み環境

- **テスト名**: すべての機能がサポートされている場合、すべてtrueを返す
  - **境界値の意味**: 最良のケース（すべての機能が利用可能）
  - **境界値での動作保証**: モダンブラウザでの完全な動作を保証
- **入力値**: なし
  - **モック設定**:
    - `navigator.clipboard.writeText = vi.fn()`
    - localStorage利用可能（デフォルト）
  - **境界値選択の根拠**: すべての機能が利用可能な理想的な環境
  - **実際の使用場面**: Chrome/Firefox/Edge/Safari最新版での利用
- **期待される結果**:
  ```typescript
  {
    html2canvas: true,
    clipboard: true,
    localStorage: true
  }
  ```
  - **境界での正確性**: すべての機能が正しく検出される
  - **一貫した動作**: 完全な機能が提供される
- **テストの目的**: フル機能環境での動作確認
  - **堅牢性の確認**: すべてのAPIが利用可能な環境で正常動作することを確認
- 🟡 **信頼性レベル**: 一般的なテストパターンから妥当な推測

---

#### TC-BS-007: すべての機能が未サポートの環境

- **テスト名**: Clipboard APIとlocalStorageが両方とも使用不可の場合、両方falseを返す
  - **境界値の意味**: 最悪のケース（主要機能がすべて利用不可）
  - **境界値での動作保証**: 古いブラウザでも基本機能は動作することを保証
- **入力値**: なし
  - **モック設定**:
    - `navigator.clipboard = undefined`
    - `window.localStorage`にアクセス時エラー
  - **境界値選択の根拠**: 機能が最小限しか利用できない最悪の環境
  - **実際の使用場面**: 非常に古いブラウザ、セキュリティ制限が厳しい環境
- **期待される結果**:
  ```typescript
  {
    html2canvas: true,  // html2canvasは常にtrue
    clipboard: false,
    localStorage: false
  }
  ```
  - **境界での正確性**: 機能がなくても関数がクラッシュしない
  - **一貫した動作**: Graceful Degradationで基本機能は維持
- **テストの目的**: 最小限の環境での動作確認
  - **堅牢性の確認**: 機能が制限された環境でもクラッシュしないことを確認
- 🟡 **信頼性レベル**: Graceful Degradationの一般的なパターンから推測

---

## 2. formatErrorMessage() のテストケース

### 2.1 正常系テストケース

#### TC-FM-001: 通常のErrorオブジェクト

- **テスト名**: Errorオブジェクトのmessageをそのまま返す
  - **何をテストするか**: 標準的なErrorオブジェクトの処理
  - **期待される動作**: error.messageの値がそのまま返される
- **入力値**: `new Error('何らかのエラーが発生しました')`
  - **入力データの意味**: 一般的なエラーケース（特殊なキーワードを含まない）
- **期待される結果**: `'何らかのエラーが発生しました'`
  - **期待結果の理由**: 特殊なパターンに該当しない場合はメッセージをそのまま使用
- **テストの目的**: 通常のエラーメッセージの整形
  - **確認ポイント**: error.messageが変更されずに返されること
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.2-5に基づく

---

### 2.2 異常系テストケース（特殊パターン検出）

#### TC-FM-002: ネットワークエラー（"network"キーワード）

- **テスト名**: messageに"network"を含む場合、ネットワークエラーメッセージを返す
  - **エラーケースの概要**: ネットワーク接続エラー
  - **エラー処理の重要性**: ユーザーにインターネット接続確認を促す
- **入力値**: `new Error('network error occurred')`
  - **不正な理由**: ネットワーク接続が切れている、または不安定
  - **実際の発生シナリオ**: Wi-Fi切断、機内モード、DNSエラー
- **期待される結果**: `'ネットワークエラーが発生しました。インターネット接続を確認してください。'`
  - **エラーメッセージの内容**: ユーザーが対処方法を理解できる明確なメッセージ
  - **システムの安全性**: エラー検出後、適切な通知でユーザーに状況を説明
- **テストの目的**: ネットワークエラーの特定とユーザーフレンドリーなメッセージ変換
  - **品質保証の観点**: ユーザーが問題を理解し、適切に対処できることを保証
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.2-1、EDGE-001に基づく

---

#### TC-FM-003: ネットワークエラー（"fetch"キーワード）

- **テスト名**: messageに"fetch"を含む場合、ネットワークエラーメッセージを返す
  - **エラーケースの概要**: Fetch APIによるネットワークエラー
  - **エラー処理の重要性**: Fetch API特有のエラーを検出
- **入力値**: `new Error('Failed to fetch')`
  - **不正な理由**: fetch()リクエストが失敗
  - **実際の発生シナリオ**: CORS問題、サーバー停止、タイムアウト
- **期待される結果**: `'ネットワークエラーが発生しました。インターネット接続を確認してください。'`
  - **エラーメッセージの内容**: TC-FM-002と同じユーザーフレンドリーなメッセージ
  - **システムの安全性**: Fetch APIエラーも適切に処理
- **テストの目的**: Fetch API特有のエラーパターンの検出
  - **品質保証の観点**: 異なるネットワークエラーパターンを統一的に処理
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.2-2、EDGE-001に基づく

---

#### TC-FM-004: 画像エクスポートエラー（"canvas"キーワード）

- **テスト名**: messageに"canvas"を含む場合、画像エクスポートエラーメッセージを返す
  - **エラーケースの概要**: html2canvasまたはCanvas API関連エラー
  - **エラー処理の重要性**: 画像生成失敗をユーザーに通知
- **入力値**: `new Error('canvas rendering failed')`
  - **不正な理由**: Canvas APIエラー、メモリ不足、レンダリング失敗
  - **実際の発生シナリオ**: 大きすぎる画像、メモリ不足、ブラウザ制限
- **期待される結果**: `ERROR_MESSAGES.IMAGE_EXPORT_FAILED` → `'画像の保存に失敗しました'`
  - **エラーメッセージの内容**: 画像保存失敗を明確に伝えるメッセージ
  - **システムの安全性**: 画像生成失敗時も適切なエラー通知
- **テストの目的**: Canvas関連エラーの検出とメッセージ変換
  - **品質保証の観点**: 画像生成失敗時の適切なユーザー通知を保証
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.2-3、EDGE-002に基づく

---

#### TC-FM-005: 画像エクスポートエラー（"image"キーワード）

- **テスト名**: messageに"image"を含む場合、画像エクスポートエラーメッセージを返す
  - **エラーケースの概要**: 画像処理全般のエラー
  - **エラー処理の重要性**: 様々な画像関連エラーを統一的に処理
- **入力値**: `new Error('image processing error')`
  - **不正な理由**: 画像読み込み失敗、変換エラー、保存エラー
  - **実際の発生シナリオ**: 画像フォーマット問題、ディスク容量不足
- **期待される結果**: `ERROR_MESSAGES.IMAGE_EXPORT_FAILED` → `'画像の保存に失敗しました'`
  - **エラーメッセージの内容**: TC-FM-004と同じメッセージ
  - **システムの安全性**: 異なる画像エラーパターンを統一的に処理
- **テストの目的**: 画像処理エラー全般の検出
  - **品質保証の観点**: 画像関連エラーを包括的にカバー
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.2-4、EDGE-002に基づく

---

#### TC-FM-006: 非Errorオブジェクト

- **テスト名**: 非Errorオブジェクトの場合、汎用エラーメッセージを返す
  - **エラーケースの概要**: 予期しない形式のエラー
  - **エラー処理の重要性**: 型安全でないエラーハンドリングのフォールバック
- **入力値**: `{ customError: 'Something went wrong' }` または `'string error'` または `null`
  - **不正な理由**: JavaScriptではどんな値でもthrowできる
  - **実際の発生シナリオ**: サードパーティライブラリのエラー、レガシーコード
- **期待される結果**: `ERROR_MESSAGES.UNEXPECTED_ERROR` → `'予期しないエラーが発生しました'`
  - **エラーメッセージの内容**: 汎用的なエラーメッセージ
  - **システムの安全性**: 未知のエラーでもクラッシュせず適切に通知
- **テストの目的**: 予期しないエラー型への対応
  - **品質保証の観点**: どんなエラー型でも安全に処理できることを保証
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.2-6に基づく

---

### 2.3 境界値テストケース

#### TC-FM-007: 空文字列のErrorメッセージ

- **テスト名**: error.messageが空文字列の場合、汎用エラーメッセージを返す
  - **境界値の意味**: エラーメッセージの最小値（空）
  - **境界値での動作保証**: 空のエラーメッセージでも適切に処理
- **入力値**: `new Error('')`
  - **境界値選択の根拠**: messageが空文字列のエッジケース
  - **実際の使用場面**: エラー生成時にメッセージが設定されなかった場合
- **期待される結果**: `ERROR_MESSAGES.UNEXPECTED_ERROR` → `'予期しないエラーが発生しました'`
  - **境界での正確性**: 空メッセージの場合も汎用メッセージで対応
  - **一貫した動作**: 常に何らかのメッセージがユーザーに提示される
- **テストの目的**: 空メッセージエラーの安全な処理
  - **堅牢性の確認**: エッジケースでも適切なメッセージが表示されることを確認
- 🟡 **信頼性レベル**: 一般的なエッジケーステストパターンから推測

---

#### TC-FM-008: 非常に長いエラーメッセージ

- **テスト名**: 非常に長いerror.messageの場合でも処理できる
  - **境界値の意味**: エラーメッセージの最大値（非常に長い文字列）
  - **境界値での動作保証**: 長いメッセージでもクラッシュしない
- **入力値**: `new Error('あ'.repeat(10000))`
  - **境界値選択の根拠**: 極端に長いエラーメッセージ
  - **実際の使用場面**: スタックトレースが含まれるエラー、複雑なエラー詳細
- **期待される結果**: `'あ'.repeat(10000)` （メッセージをそのまま返す）
  - **境界での正確性**: 長いメッセージでも処理が完了する
  - **一貫した動作**: メッセージの長さに関わらず動作する
- **テストの目的**: 長いエラーメッセージへの対応
  - **堅牢性の確認**: メッセージ長に制限がなくても安全に処理できることを確認
- 🟡 **信頼性レベル**: パフォーマンステストの一般的なパターンから推測

---

#### TC-FM-009: 複数のキーワードを含むエラーメッセージ

- **テスト名**: messageに複数のキーワード（"network"と"image"）を含む場合、優先順位に従って処理
  - **境界値の意味**: 複数のパターンにマッチする複雑なケース
  - **境界値での動作保証**: キーワード優先順位の一貫性を保証
- **入力値**: `new Error('network error while processing image')`
  - **境界値選択の根拠**: 複数のエラーパターンが同時に該当するケース
  - **実際の使用場面**: ネットワーク経由の画像取得失敗
- **期待される結果**: `'ネットワークエラーが発生しました。インターネット接続を確認してください。'`
  - **期待結果の理由**: ネットワークエラーチェックが先に行われるため
  - **境界での正確性**: 優先順位が明確に定義されている
  - **一貫した動作**: 同じパターンでは常に同じ結果
- **テストの目的**: キーワード優先順位の確認
  - **堅牢性の確認**: 複雑なエラーメッセージでも予測可能な動作を保証
- 🟡 **信頼性レベル**: 実装の優先順位ロジックに依存（要件定義では明示されていない）

---

#### TC-FM-010: 大文字小文字混在のキーワード

- **テスト名**: キーワード検索が大文字小文字を区別しない（または区別する）
  - **境界値の意味**: キーワードマッチングの大文字小文字の扱い
  - **境界値での動作保証**: 大文字小文字のバリエーションでも正しく検出
- **入力値**: `new Error('NETWORK ERROR')` または `new Error('Network Error')`
  - **境界値選択の根拠**: エラーメッセージの大文字小文字が異なるケース
  - **実際の使用場面**: サードパーティライブラリのエラーメッセージ
- **期待される結果**:
  - **ケース1（大文字小文字区別なし）**: ネットワークエラーメッセージを返す
  - **ケース2（大文字小文字区別あり）**: 汎用エラーメッセージを返す
  - **期待結果の理由**: 実装仕様により決定（toLowerCase()を使うかどうか）
- **テストの目的**: キーワードマッチングの仕様確認
  - **堅牢性の確認**: 大文字小文字のバリエーションへの対応を明確にする
- 🟡 **信頼性レベル**: 実装の仕様に依存（要件定義では明示されていない）

---

## 3. copyToClipboard() のテストケース

### 3.1 正常系テストケース（Clipboard API成功）

#### TC-CC-001: Clipboard APIで正常にコピー

- **テスト名**: Clipboard APIが使用可能で成功する場合、trueを返す
  - **何をテストするか**: navigator.clipboard.writeText()の正常動作
  - **期待される動作**: テキストがクリップボードにコピーされ、trueが返される
- **入力値**: `'https://example.com/share?data=abc123'`
  - **入力データの意味**: 実際の共有URL
- **モック設定**:
  ```typescript
  const mockWriteText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, {
    clipboard: { writeText: mockWriteText }
  });
  ```
- **期待される結果**: `true`
  - **期待結果の理由**: Clipboard API成功時はtrueを返す仕様
  - **副作用の検証**: `mockWriteText`が正しい引数で呼ばれたことを確認
- **テストの目的**: Clipboard API使用時の正常動作
  - **確認ポイント**:
    - 戻り値がtrueであること
    - navigator.clipboard.writeText()が正しく呼ばれること
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.3-1、既存clipboard.test.ts参考

---

#### TC-CC-002: 空文字列のコピー

- **テスト名**: 空文字列をコピーする場合でも正常に動作
  - **何をテストするか**: エッジケース（空文字列）への対応
  - **期待される動作**: 空文字列でもコピー処理が成功
- **入力値**: `''`
  - **入力データの意味**: 空のテキスト
- **モック設定**: TC-CC-001と同じ
- **期待される結果**: `true`
  - **期待結果の理由**: 空文字列でもコピーは技術的に可能
- **テストの目的**: 空文字列の正常な処理
  - **確認ポイント**:
    - エラーが発生しないこと
    - writeText('')が呼ばれること
- 🔵 **信頼性レベル**: 既存clipboard.test.tsのTC-CC-002パターンに基づく

---

#### TC-CC-003: 長いテキストのコピー

- **テスト名**: 非常に長いテキストをコピーする場合でも正常に動作
  - **何をテストするか**: 長いテキストへの対応
  - **期待される動作**: 長いURLやテキストでもコピー成功
- **入力値**: `'a'.repeat(10000)`
  - **入力データの意味**: 10,000文字の長いテキスト
- **モック設定**: TC-CC-001と同じ
- **期待される結果**: `true`
  - **期待結果の理由**: Clipboard APIは長いテキストも処理可能
- **テストの目的**: 長いテキストの正常な処理
  - **確認ポイント**:
    - メモリエラーが発生しないこと
    - 正しくコピーされること
- 🔵 **信頼性レベル**: 既存clipboard.test.tsのTC-CC-003パターンに基づく

---

#### TC-CC-004: 特殊文字を含むテキストのコピー

- **テスト名**: 特殊文字を含むテキストをコピーできる
  - **何をテストするか**: 特殊文字のエスケープ処理
  - **期待される動作**: 特殊文字もそのままコピーされる
- **入力値**: `'特殊文字 & "quotes" <tags>'`
  - **入力データの意味**: HTML特殊文字、日本語、記号を含むテキスト
- **モック設定**: TC-CC-001と同じ
- **期待される結果**: `true`
  - **期待結果の理由**: 特殊文字もそのままクリップボードにコピーされるべき
- **テストの目的**: 特殊文字の正常な処理
  - **確認ポイント**:
    - 特殊文字がエスケープされずにコピーされること
    - エラーが発生しないこと
- 🔵 **信頼性レベル**: 既存clipboard.test.tsのTC-CC-004パターンに基づく

---

### 3.2 異常系テストケース（Clipboard API失敗→フォールバック）

#### TC-CC-005: Clipboard API失敗時のフォールバック成功

- **テスト名**: Clipboard APIが失敗した場合、フォールバックに切り替わる
  - **エラーケースの概要**: Clipboard API拒否（権限エラーなど）
  - **エラー処理の重要性**: APIが使えない場合でもコピー機能を提供
- **入力値**: `'test text'`
  - **実際の発生シナリオ**: ユーザーがクリップボード権限を拒否
- **モック設定**:
  ```typescript
  // Clipboard API失敗
  const mockWriteText = vi.fn().mockRejectedValue(new Error('Permission denied'));
  Object.assign(navigator, {
    clipboard: { writeText: mockWriteText }
  });

  // フォールバック成功
  const mockExecCommand = vi.fn().mockReturnValue(true);
  document.execCommand = mockExecCommand;
  ```
- **期待される結果**: `true`
  - **エラーメッセージの内容**: エラーメッセージは出力されない（フォールバック成功）
  - **システムの安全性**: フォールバックにより機能継続
- **テストの目的**: フォールバック機構の動作確認
  - **品質保証の観点**:
    - Clipboard API失敗後にフォールバックが実行されること
    - 最終的にコピーが成功すること
  - **確認ポイント**:
    - document.execCommand('copy')が呼ばれること
    - 戻り値がtrueであること
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.3-2、既存clipboard.test.ts参考

---

#### TC-CC-006: フォールバック処理の成功（Clipboard API未サポート）

- **テスト名**: フォールバック（execCommand）が成功する場合、trueを返す
  - **エラーケースの概要**: Clipboard API自体が存在しない環境
  - **エラー処理の重要性**: 古いブラウザでもコピー機能を提供
- **入力値**: `'fallback test'`
  - **実際の発生シナリオ**: 古いブラウザ、HTTP環境
- **モック設定**:
  ```typescript
  // Clipboard API未サポート
  Object.assign(navigator, {
    clipboard: undefined
  });

  // フォールバック成功
  const mockExecCommand = vi.fn().mockReturnValue(true);
  document.execCommand = mockExecCommand;
  ```
- **期待される結果**: `true`
  - **エラーメッセージの内容**: エラーメッセージなし
  - **システムの安全性**: 古い環境でも機能提供
- **テストの目的**: Clipboard API未サポート環境での動作
  - **品質保証の観点**:
    - Clipboard APIチェックが正しく行われること
    - フォールバックが正常に実行されること
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.3-3、既存clipboard.test.ts参考

---

#### TC-CC-007: フォールバックも失敗する場合

- **テスト名**: フォールバックも失敗する場合、falseを返す
  - **エラーケースの概要**: すべてのコピー手段が失敗
  - **エラー処理の重要性**: 失敗を正しく検出してユーザーに通知
- **入力値**: `'test'`
  - **実際の発生シナリオ**: 非常に古いブラウザ、セキュリティ制限
- **モック設定**:
  ```typescript
  // Clipboard API未サポート
  Object.assign(navigator, {
    clipboard: undefined
  });

  // フォールバック失敗
  const mockExecCommand = vi.fn().mockReturnValue(false);
  document.execCommand = mockExecCommand;
  ```
- **期待される結果**: `false`
  - **エラーメッセージの内容**: 呼び出し側でエラー通知を表示
  - **システムの安全性**: falseを返すことで呼び出し側が適切に処理
- **テストの目的**: 完全な失敗ケースの処理
  - **品質保証の観点**:
    - すべての手段が失敗した場合にfalseが返されること
    - クラッシュしないこと
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.3-4、既存clipboard.test.ts参考

---

### 3.3 境界値・特殊ケーステストケース

#### TC-CC-008: フォールバック時の一時要素削除確認

- **テスト名**: フォールバック時に一時的なtextarea要素が削除される
  - **境界値の意味**: リソースリークの防止（メモリ管理）
  - **境界値での動作保証**: DOM要素のクリーンアップが確実に行われる
- **入力値**: `'cleanup test'`
  - **実際の使用場面**: フォールバック処理の内部動作
- **モック設定**: TC-CC-006と同じ
- **期待される結果**:
  - コピー処理完了後、DOM内に一時的なtextareaが存在しない
  - **境界での正確性**: 要素が確実に削除される
  - **一貫した動作**: 毎回クリーンアップが実行される
- **テストの目的**: メモリリーク防止の確認
  - **堅牢性の確認**:
    - 一時要素が残らないこと
    - 何度実行しても要素が蓄積しないこと
  - **確認ポイント**:
    - `document.body.contains(textarea)` が false であること
    - または `document.querySelectorAll('textarea').length` が変化しないこと
- 🔵 **信頼性レベル**: 要件定義書のテストケース概要10.3-5に基づく

---

#### TC-CC-009: Clipboard API途中でエラー（例外）

- **テスト名**: Clipboard API実行中に予期しない例外が発生した場合の処理
  - **エラーケースの概要**: Promise rejectではなく同期的な例外
  - **エラー処理の重要性**: 予期しないエラーでクラッシュしない
- **入力値**: `'error test'`
  - **実際の発生シナリオ**: ブラウザバグ、予期しない状態
- **モック設定**:
  ```typescript
  const mockWriteText = vi.fn().mockImplementation(() => {
    throw new Error('Unexpected sync error');
  });
  Object.assign(navigator, {
    clipboard: { writeText: mockWriteText }
  });

  // フォールバック準備
  const mockExecCommand = vi.fn().mockReturnValue(true);
  document.execCommand = mockExecCommand;
  ```
- **期待される結果**: `true` （フォールバックが実行される）または `false`
  - **期待結果の理由**: try-catchで例外を捕捉し、フォールバックまたはエラー処理
- **テストの目的**: 予期しない例外への対応
  - **堅牢性の確認**:
    - 同期的な例外でもクラッシュしないこと
    - 適切にフォールバックまたはエラー処理されること
- 🟡 **信頼性レベル**: 一般的なエラーハンドリングパターンから推測

---

#### TC-CC-010: navigator.clipboard自体がundefinedの場合

- **テスト名**: navigator.clipboardプロパティ自体が存在しない場合の処理
  - **境界値の意味**: API未サポートの最も基本的なケース
  - **境界値での動作保証**: undefinedチェックが正しく機能
- **入力値**: `'undefined test'`
  - **実際の使用場面**: 古いブラウザ、非HTTPS環境
- **モック設定**:
  ```typescript
  // clipboardプロパティを削除
  Object.defineProperty(navigator, 'clipboard', {
    value: undefined,
    configurable: true
  });

  // フォールバック準備
  const mockExecCommand = vi.fn().mockReturnValue(true);
  document.execCommand = mockExecCommand;
  ```
- **期待される結果**: `true` （フォールバックが実行される）
  - **境界での正確性**: undefinedチェックが正しく機能
  - **一貫した動作**: API未サポートでも動作継続
- **テストの目的**: undefined判定の正確性確認
  - **堅牢性の確認**:
    - navigator.clipboard?.writeTextのようなオプショナルチェーンが機能すること
    - フォールバックに確実に切り替わること
- 🟡 **信頼性レベル**: TypeScriptのオプショナルチェーン使用を前提とした推測

---

## 4. モック戦略

### 4.1 ブラウザAPIのモック

#### navigator.clipboard

```typescript
// モック方法
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined) // 成功時
    // または
    // writeText: vi.fn().mockRejectedValue(new Error('Permission denied')) // 失敗時
  }
});

// 未サポートのシミュレーション
Object.assign(navigator, {
  clipboard: undefined
});
```

🔵 **信頼性レベル**: 既存clipboard.test.tsのパターンに基づく

---

#### window.localStorage

```typescript
// 利用可能（デフォルト）
// jsdomでは自動的に利用可能

// 利用不可のシミュレーション
Object.defineProperty(window, 'localStorage', {
  get: () => {
    throw new Error('localStorage is disabled');
  },
  configurable: true
});
```

🟡 **信頼性レベル**: 一般的なlocalStorageモックパターン

---

#### document.execCommand

```typescript
// モック方法
const mockExecCommand = vi.fn().mockReturnValue(true); // 成功時
// または
// const mockExecCommand = vi.fn().mockReturnValue(false); // 失敗時

document.execCommand = mockExecCommand;

// 検証
expect(mockExecCommand).toHaveBeenCalledWith('copy');
```

🔵 **信頼性レベル**: 既存clipboard.test.tsのパターンに基づく

---

### 4.2 DOM操作のモック

#### 一時的なtextarea要素の検証

```typescript
// テスト前のDOM状態を記録
const initialTextareaCount = document.querySelectorAll('textarea').length;

// copyToClipboard実行

// テスト後にtextareaが削除されたことを確認
const finalTextareaCount = document.querySelectorAll('textarea').length;
expect(finalTextareaCount).toBe(initialTextareaCount);
```

🔵 **信頼性レベル**: 要件定義書のTC-CC-008要件に基づく

---

### 4.3 エラーオブジェクトのモック

#### 様々なエラー型のシミュレーション

```typescript
// 標準Errorオブジェクト
const standardError = new Error('standard error message');

// ネットワークエラー
const networkError = new Error('network error occurred');

// 非Errorオブジェクト
const customError = { customError: 'Something went wrong' };
const stringError = 'string error';
const nullError = null;
```

🔵 **信頼性レベル**: 要件定義書のformatErrorMessage仕様に基づく

---

## 5. テスト実装時の日本語コメント指針

### 5.1 テストケース開始時のコメント

```typescript
describe('checkBrowserSupport', () => {
  it('Clipboard APIがサポートされている場合、clipboard: trueを返す', () => {
    // 【テスト目的】: Clipboard API利用可能時の正常な検出
    // 【テスト内容】: navigator.clipboard.writeTextが存在する環境でのサポート検出
    // 【期待される動作】: BrowserSupport.clipboardがtrueになる
    // 🔵 要件定義書のTC-BS-001に基づく
  });
});
```

---

### 5.2 Given（準備フェーズ）のコメント

```typescript
// 【テストデータ準備】: Clipboard APIが利用可能な環境をシミュレート
const mockWriteText = vi.fn().mockResolvedValue(undefined);
Object.assign(navigator, {
  clipboard: { writeText: mockWriteText }
});

// 【初期条件設定】: モダンブラウザでの標準的な状態
// 【前提条件確認】: navigator.clipboardが存在することが前提
```

---

### 5.3 When（実行フェーズ）のコメント

```typescript
// 【実際の処理実行】: checkBrowserSupport()を呼び出してブラウザサポート状況を取得
const support = checkBrowserSupport();

// 【処理内容】: ブラウザのClipboard API、localStorageの存在チェックを実行
// 【実行タイミング】: テスト環境のセットアップ直後に実行
```

---

### 5.4 Then（検証フェーズ）のコメント

```typescript
// 【結果検証】: Clipboard APIサポート状況が正しく検出されたことを確認
// 【期待値確認】: clipboard: true が返されることを確認
// 【品質保証】: モダンブラウザでのClipboard API利用可能性を保証

// 【検証項目】: clipboardプロパティがtrueであることを確認
// 🔵 要件に基づく検証
expect(support.clipboard).toBe(true);

// 【検証項目】: html2canvasは常にtrueであることを確認
expect(support.html2canvas).toBe(true);

// 【検証項目】: localStorageは環境に応じて検出されることを確認
expect(support.localStorage).toBeDefined();
```

---

### 5.5 セットアップ・クリーンアップのコメント

```typescript
describe('copyToClipboard', () => {
  beforeEach(() => {
    // 【テスト前準備】: 各テスト実行前にモックをリセットして独立性を保証
    // 【環境初期化】: 前のテストの影響を受けないようクリーンな状態にする
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // 【テスト後処理】: DOM要素のクリーンアップ（一時的なtextareaの削除確認）
    // 【状態復元】: 次のテストに影響しないようブラウザAPIモックを元に戻す
  });
});
```

---

## 6. テストケースの優先順位

### 6.1 P0（最優先 - 必須実装）

1. ✅ **TC-BS-001**: Clipboard APIサポート検出（サポートあり）
2. ✅ **TC-BS-002**: localStorageサポート検出（サポートあり）
3. ✅ **TC-BS-003**: html2canvas常時サポート
4. ✅ **TC-BS-004**: Clipboard API未サポート
5. ✅ **TC-FM-002**: ネットワークエラー（"network"キーワード）
6. ✅ **TC-FM-004**: 画像エクスポートエラー（"canvas"キーワード）
7. ✅ **TC-FM-006**: 非Errorオブジェクト
8. ✅ **TC-CC-001**: Clipboard APIで正常にコピー
9. ✅ **TC-CC-005**: Clipboard API失敗時のフォールバック成功
10. ✅ **TC-CC-006**: フォールバック処理の成功（Clipboard API未サポート）
11. ✅ **TC-CC-007**: フォールバックも失敗する場合
12. ✅ **TC-CC-008**: フォールバック時の一時要素削除確認

🔵 **信頼性レベル**: 要件定義書の受け入れ基準8.3に基づく

---

### 6.2 P1（推奨実装）

1. 🟡 **TC-BS-005**: localStorage使用不可
2. 🟡 **TC-FM-001**: 通常のErrorオブジェクト
3. 🟡 **TC-FM-003**: ネットワークエラー（"fetch"キーワード）
4. 🟡 **TC-FM-005**: 画像エクスポートエラー（"image"キーワード）
5. 🟡 **TC-CC-002**: 空文字列のコピー
6. 🟡 **TC-CC-003**: 長いテキストのコピー
7. 🟡 **TC-CC-004**: 特殊文字を含むテキストのコピー

🟡 **信頼性レベル**: 既存テストパターンとエッジケース対応

---

### 6.3 P2（余裕があれば実装）

1. 🟡 **TC-BS-006**: 全機能サポート済み環境
2. 🟡 **TC-BS-007**: すべての機能が未サポートの環境
3. 🟡 **TC-FM-007**: 空文字列のErrorメッセージ
4. 🟡 **TC-FM-008**: 非常に長いエラーメッセージ
5. 🟡 **TC-FM-009**: 複数のキーワードを含むエラーメッセージ
6. 🟡 **TC-FM-010**: 大文字小文字混在のキーワード
7. 🟡 **TC-CC-009**: Clipboard API途中でエラー（例外）
8. 🟡 **TC-CC-010**: navigator.clipboard自体がundefinedの場合

🟡 **信頼性レベル**: エッジケース・堅牢性テスト

---

## 7. カバレッジ目標

### 7.1 コードカバレッジ

- **行カバレッジ（Line Coverage）**: 95%以上
- **分岐カバレッジ（Branch Coverage）**: 90%以上
- **関数カバレッジ（Function Coverage）**: 100%

🔵 **信頼性レベル**: 要件定義書の品質基準に基づく

---

### 7.2 要件カバレッジ

- **checkBrowserSupport()**: 5テストケース → 100%カバー
- **formatErrorMessage()**: 10テストケース → 100%カバー
- **copyToClipboard()**: 10テストケース → 100%カバー

**合計**: 25テストケース

🔵 **信頼性レベル**: 要件定義書のテストケース概要セクションに基づく

---

## 8. 品質判定基準

### ✅ 高品質（実装可能）

以下の条件をすべて満たす場合、テストケースは高品質と判定：

- [x] **テストケース分類**: 正常系・異常系・境界値が網羅されている
- [x] **期待値定義**: 各テストケースの期待値が明確に定義されている
- [x] **技術選択**: TypeScript + Vitest + vi (モック) が確定している
- [x] **実装可能性**: 既存のテストパターンに沿った実現可能な設計
- [x] **モック戦略**: ブラウザAPIのモック方法が明確
- [x] **信頼性レベル**: 各テストケースの信頼性が明記されている

### 判定結果

✅ **高品質**: すべての基準を満たしています。Redフェーズ（失敗テスト作成）に進むことができます。

---

## 9. 信頼性レベルサマリー

### 9.1 信頼性レベル分布

- 🔵 **高信頼（75%）**: 要件定義書、既存テストパターン、実際の設定ファイルに基づく
- 🟡 **中信頼（25%）**: 一般的なテストパターン、エッジケースの推測
- 🔴 **低信頼（0%）**: 推測のみの項目なし

### 9.2 高信頼項目（🔵）

- P0の主要テストケース（TC-BS-001～004, TC-FM-002/004/006, TC-CC-001/005～008）
- テストフレームワーク選択（Vitest）
- モック戦略（既存clipboard.test.tsのパターン）
- 定数定義（ERROR_MESSAGES, SUCCESS_MESSAGES）

### 9.3 中信頼項目（🟡）

- エッジケーステスト（TC-FM-007～010, TC-CC-009～010）
- 境界値テスト（TC-BS-006～007）
- 大文字小文字の扱い（実装仕様に依存）

---

## 10. 次のステップ

### ✅ テストケース定義完了

**次のお勧めステップ**: `/tsumiki:tdd-red` でRedフェーズ（失敗テスト作成）を開始します。

**実装の流れ**:
1. Redフェーズ: 失敗するテストケースを作成
2. Greenフェーズ: テストを通すための実装
3. Refactorフェーズ: コード品質の改善

---

**作成日**: 2025-11-22
**作成者**: Claude Code (TDD Test Cases Phase)
**品質判定**: ✅ 高品質（実装可能）
**信頼性**: 🔵 高信頼（75%）🟡 中信頼（25%）
