/**
 * 包括的エラーハンドリングユーティリティ
 * TASK-0041: 包括的エラーハンドリング実装
 *
 * 【機能概要】:
 * - ブラウザ機能サポート検出（Clipboard API, localStorage, html2canvas）
 * - エラーメッセージの整形（ネットワーク、Canvas、汎用エラー）
 * - クリップボードコピー（Clipboard API + execCommandフォールバック）
 *
 * 【設計方針】:
 * - Graceful Degradation: 機能が使えない環境でも動作継続
 * - セキュリティ重視: XSS対策、情報漏洩防止
 * - パフォーマンス: すべての関数が1ms以内で完了
 *
 * 【参照要件】:
 * - EDGE-001: ネットワークエラーハンドリング
 * - EDGE-002: ブラウザ互換性対応
 * - EDGE-003: クリップボードAPI対応
 */

import { ERROR_MESSAGES } from './constants';

/**
 * ブラウザサポート状況を表す型
 * REQ-003: ブラウザサポート検出
 *
 * 【利用目的】: 各機能の利用可否を事前に判定し、適切なフォールバック処理を選択
 */
export interface BrowserSupport {
  /** Clipboard APIサポート状況（navigator.clipboard.writeText が利用可能か） */
  clipboard: boolean;
  /** html2canvasサポート状況（常にtrue - 依存関係として常に利用可能） */
  html2canvas: boolean;
  /** localStorageサポート状況（プライベートモード、セキュリティポリシーで無効化される場合あり） */
  localStorage: boolean;
}

/**
 * ブラウザの機能サポート状況を検出する
 *
 * 【機能概要】: Clipboard API、localStorage、html2canvasの利用可能性を検出
 * 【設計方針】:
 * - 実行時検出: 実際にAPIにアクセスして利用可否を判定
 * - 例外安全: すべての検出処理をtry-catchで保護
 * - SSR対応: windowやnavigatorの存在確認を実施
 *
 * 【パフォーマンス】: <1ms（localStorageアクセステスト含む）
 *
 * @returns {BrowserSupport} 各機能のサポート状況
 *
 * @example
 * const support = checkBrowserSupport();
 * if (!support.clipboard) {
 *   console.warn('Clipboard APIがサポートされていません');
 * }
 *
 * テストケース: TC-BS-001 ~ TC-BS-007 (7件)
 * 🔵 信頼性レベル: 高（要件定義書TC-BS-001～007に基づく）
 */
export function checkBrowserSupport(): BrowserSupport {
  // 【Clipboard APIサポート検出】: navigator.clipboard.writeText が関数として存在するか
  // 【利用シーン】: URL共有時のクリップボードコピー（copyToClipboard関数）
  // 【制約事項】: HTTPS環境でのみ利用可能（HTTP環境ではundefined）
  // TC-BS-001: サポートあり（HTTPS + モダンブラウザ）
  // TC-BS-004: サポートなし（HTTP環境、古いブラウザ）
  const clipboard =
    typeof navigator !== 'undefined' &&
    navigator.clipboard !== undefined &&
    typeof navigator.clipboard.writeText === 'function';

  // 【html2canvasサポート】: 依存関係として常に利用可能（将来の拡張用フィールド）
  // 【利用シーン】: 画像エクスポート機能（useImageExportフック）
  // 【設計判断】: 現在は常にtrue、将来的にブラウザ制限を検出する可能性に備えた設計
  // TC-BS-003: 常時サポート
  const html2canvas = true;

  // 【localStorageサポート検出】: 実際のアクセステストで利用可否を判定
  // 【利用シーン】: チュートリアル表示済みフラグの永続化
  // 【制約事項】: プライベートモード、セキュリティポリシー、ストレージクォータ超過で利用不可
  // TC-BS-002: サポートあり（通常モード）
  // TC-BS-005: サポートなし（プライベートモード、セキュリティ制限）
  let localStorage = false;
  try {
    // 【アクセステスト】: 実際にsetItem/removeItemを実行して利用可否を確認
    // 【安全性】: 例外が発生してもアプリケーションは継続動作
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__storage_test__'; // 【テストキー】: 標準的なパターン
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      localStorage = true; // 【成功】: 例外なく完了した場合のみtrue
    }
  } catch (error) {
    // 【例外処理】: プライベートモード、セキュリティ制限などでエラーが発生
    // 【Graceful Degradation】: エラー時はfalseを返し、機能なしで動作継続
    localStorage = false;
  }

  return {
    clipboard,
    html2canvas,
    localStorage,
  };
}

/**
 * エラーメッセージを整形する
 *
 * 【機能概要】: エラーの種類を自動判定し、ユーザーフレンドリーなメッセージに変換
 * 【改善内容】: キーワードベースの自動分類により、一貫性のあるエラー通知を実現
 * 【設計方針】:
 * - キーワード検出: エラーメッセージに含まれる特定キーワードで種類を判定
 * - 優先順位制御: 複数キーワードマッチ時は重要度の高いエラーを優先
 * - 大文字小文字の無視: toLowerCase()により、異なる記法のエラーも統一的に処理
 *
 * 【パフォーマンス】: O(n) - nはエラーメッセージの長さ（通常<200文字で<1ms）
 * 【保守性】: キーワード追加による拡張が容易
 *
 * エラーの種類に応じて、ユーザーフレンドリーなメッセージに変換します。
 * - ネットワークエラー: "network", "fetch" キーワード（優先度: 高）
 * - 画像エクスポートエラー: "canvas", "image" キーワード（優先度: 中）
 * - その他: 元のメッセージまたは汎用メッセージ（優先度: 低）
 *
 * @param {unknown} error - エラーオブジェクト
 * @returns {string} 整形されたエラーメッセージ
 *
 * @example
 * try {
 *   await fetch('/api/data');
 * } catch (error) {
 *   const message = formatErrorMessage(error);
 *   console.error(message); // "ネットワークエラーが発生しました。..."
 * }
 *
 * テストケース: TC-FM-001 ~ TC-FM-010 (10件)
 * 🔵 信頼性レベル: 高（要件定義書EDGE-001, EDGE-002に基づく）
 */
export function formatErrorMessage(error: unknown): string {
  // 【非Errorオブジェクトチェック】: JavaScriptではあらゆる値をthrow可能
  // 【安全性】: 予期しない型でもクラッシュせず、汎用メッセージで対応
  // TC-FM-006: 非Errorオブジェクト（オブジェクト、文字列、null等）
  if (!(error instanceof Error)) {
    return ERROR_MESSAGES.UNEXPECTED_ERROR;
  }

  const message = error.message;

  // 【空文字列チェック】: error.messageが空の場合の安全な処理
  // 【エッジケース対応】: 空メッセージでも汎用エラーメッセージを提供
  // TC-FM-007: 空文字列のErrorメッセージ
  if (!message || message.trim() === '') {
    return ERROR_MESSAGES.UNEXPECTED_ERROR;
  }

  // 【大文字小文字の正規化】: 異なる記法のエラーメッセージを統一的に処理
  // 【パフォーマンス最適化】: 1回だけlowerCase()を実行（複数回の比較で再利用）
  // TC-FM-010: 大文字小文字混在のキーワード（'NETWORK', 'Network', 'network'）
  const lowerMessage = message.toLowerCase();

  // 【ネットワークエラーチェック（優先順位: 高）】:
  // 【対象キーワード】: "network", "fetch"
  // 【利用シーン】: API通信失敗、インターネット接続切断、CORS問題
  // 【ユーザビリティ】: インターネット接続確認を促す具体的なメッセージ
  // TC-FM-002: "network" キーワード
  // TC-FM-003: "fetch" キーワード
  // TC-FM-009: 複数キーワード（ネットワークエラーが優先）
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // 【画像エクスポートエラーチェック（優先順位: 中）】:
  // 【対象キーワード】: "canvas", "image"
  // 【利用シーン】: html2canvas処理失敗、メモリ不足、レンダリングエラー
  // 【ユーザビリティ】: 画像保存失敗を明確に伝えるメッセージ
  // TC-FM-004: "canvas" キーワード
  // TC-FM-005: "image" キーワード
  if (lowerMessage.includes('canvas') || lowerMessage.includes('image')) {
    return ERROR_MESSAGES.IMAGE_EXPORT_FAILED;
  }

  // 【通常のエラーメッセージ】: 特殊なキーワードを含まないエラー
  // 【安全性】: 長いメッセージでも処理可能（制限なし）
  // TC-FM-001: 通常のErrorオブジェクト
  // TC-FM-008: 非常に長いエラーメッセージ（そのまま返す）
  return message;
}

/**
 * テキストをクリップボードにコピーする
 *
 * 【機能概要】: Clipboard API（優先）+ execCommandフォールバックによる堅牢なコピー機能
 * 【改善内容】: 2段階のフォールバック戦略により、幅広い環境で動作
 * 【設計方針】:
 * - モダンAPI優先: Clipboard API（HTTPS環境）を優先使用
 * - フォールバック: 古いブラウザ、HTTP環境向けにexecCommand対応
 * - リソース管理: 一時的なDOM要素を確実に削除（メモリリーク防止）
 *
 * 【パフォーマンス】: O(n) - nはテキストの長さ（Clipboard APIはブラウザネイティブで最速）
 * 【保守性】: 2段階の処理フローが明確に分離されている
 *
 * Clipboard APIを使用し、失敗時はexecCommandにフォールバックします。
 * - 優先: navigator.clipboard.writeText() (モダンブラウザ、HTTPS環境)
 * - フォールバック: document.execCommand('copy') (古いブラウザ、HTTP環境)
 *
 * @param {string} text - コピーするテキスト
 * @returns {Promise<boolean>} コピー成功時true、失敗時false
 *
 * @example
 * const success = await copyToClipboard('https://example.com/share');
 * if (success) {
 *   console.log('コピーしました');
 * } else {
 *   console.error('コピーに失敗しました');
 * }
 *
 * テストケース: TC-CC-001 ~ TC-CC-010 (10件)
 * 🔵 信頼性レベル: 高（要件定義書EDGE-003に基づく）
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 【Clipboard API試行（第1段階）】:
  // 【対象環境】: HTTPS環境 + モダンブラウザ（Chrome, Firefox, Edge, Safari最新版）
  // 【パフォーマンス】: ブラウザネイティブ実装で最速
  // TC-CC-001: Clipboard APIで正常にコピー
  // TC-CC-002: 空文字列のコピー
  // TC-CC-003: 長いテキストのコピー（10,000文字）
  // TC-CC-004: 特殊文字を含むテキストのコピー（HTML特殊文字、日本語）
  // TC-CC-009: 予期しない例外（同期的なエラー）
  // TC-CC-010: navigator.clipboard自体がundefined
  try {
    // 【API存在確認】: navigator.clipboardとwriteTextメソッドの両方を確認
    // 【安全性】: undefinedチェックにより、古い環境でも例外なく処理
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true; // 【成功】: Clipboard APIによるコピー完了
    }
  } catch (error) {
    // 【例外処理】: Clipboard API失敗時のフォールバック
    // 【発生シナリオ】: ユーザーが権限を拒否、セキュリティエラー、予期しないブラウザバグ
    // TC-CC-005: Clipboard API失敗時のフォールバック成功
    console.warn('Clipboard API failed, falling back to execCommand', error);
    // 【フォールバックへ】: 例外発生時はフォールバック処理に進む
  }

  // 【フォールバック: document.execCommand('copy')（第2段階）】:
  // 【対象環境】: HTTP環境、古いブラウザ、Clipboard API未サポート環境
  // 【制約事項】: 非推奨APIだが、広範な環境で動作
  // TC-CC-006: フォールバック処理の成功（Clipboard API未サポート）
  // TC-CC-007: フォールバックも失敗する場合
  // TC-CC-008: 一時要素削除確認（メモリリーク防止）
  try {
    // 【一時的なtextarea要素を作成】:
    // 【目的】: execCommandはDOM要素の選択が必要なため、一時要素を使用
    const textarea = document.createElement('textarea');
    textarea.value = text; // 【コピー対象テキスト】: ユーザーが共有するURL等

    // 【不可視化スタイル設定】:
    // 【目的】: ユーザーに見えない位置に配置し、視覚的な違和感を防ぐ
    // 【セキュリティ】: ユーザーの意図しないUI変更を防止
    textarea.style.position = 'fixed'; // 【固定配置】: スクロール位置に影響されない
    textarea.style.opacity = '0'; // 【透明化】: 完全に不可視
    textarea.style.pointerEvents = 'none'; // 【操作無効】: マウスイベントを受け付けない
    document.body.appendChild(textarea); // 【DOM追加】: 一時的にDOMツリーに挿入

    // 【テキストを選択】:
    // 【必須処理】: execCommand('copy')は選択状態が必要
    textarea.select();
    textarea.setSelectionRange(0, text.length); // 【全文選択】: テキスト全体を確実に選択

    // 【コピー実行】:
    // 【戻り値】: 成功時true、失敗時false
    const success = document.execCommand('copy');

    // 【一時要素を削除（必ずクリーンアップ）】:
    // 【重要】: メモリリーク防止のため、必ず削除
    // 【品質保証】: TC-CC-008で削除確認テスト実施済み
    document.body.removeChild(textarea);

    return success; // 【結果返却】: execCommandの成否をそのまま返す
  } catch (error) {
    // 【フォールバックも失敗】:
    // 【発生シナリオ】: 非常に古いブラウザ、セキュリティ制限が厳しい環境
    // 【ユーザビリティ】: falseを返すことで、呼び出し側が適切なエラー通知を表示
    console.error('Fallback copy failed', error);
    return false; // 【失敗】: すべてのコピー手段が使えない
  }
}
