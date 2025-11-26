import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkBrowserSupport, formatErrorMessage, copyToClipboard } from '../errorHandling';
import { ERROR_MESSAGES } from '../constants';
import type { BrowserSupport } from '../errorHandling';

/**
 * errorHandling.ts の統合テストスイート
 * TASK-0041: 包括的エラーハンドリング実装
 *
 * テスト対象関数:
 * - checkBrowserSupport(): ブラウザサポート検出（7テストケース）
 * - formatErrorMessage(): エラーメッセージ整形（10テストケース）
 * - copyToClipboard(): クリップボードコピー（10テストケース）
 *
 * 合計: 27テストケース
 */

describe('errorHandling', () => {
  // ========================================
  // 1. checkBrowserSupport() のテストケース
  // ========================================
  describe('checkBrowserSupport', () => {
    let originalLocalStorage: Storage | undefined;

    beforeEach(() => {
      // 【テスト前準備】: 各テスト実行前にモックをリセットして独立性を保証
      // 【環境初期化】: 前のテストの影響を受けないようクリーンな状態にする
      vi.restoreAllMocks();

      // localStorageの元の実装を保存
      originalLocalStorage = window.localStorage;
    });

    afterEach(() => {
      // 【テスト後処理】: テスト実行後にグローバル状態をクリア
      // 【状態復元】: 次のテストに影響しないようブラウザAPIモックを元に戻す

      // localStorageを元の状態に復元
      if (originalLocalStorage) {
        Object.defineProperty(window, 'localStorage', {
          value: originalLocalStorage,
          writable: true,
          configurable: true,
        });
      }
    });

    // TC-BS-001: Clipboard APIサポート検出（サポートあり）
    it('Clipboard APIがサポートされている場合、clipboard: trueを返す', () => {
      // 【テスト目的】: Clipboard API利用可能時の正常な検出
      // 【テスト内容】: navigator.clipboard.writeTextが存在する環境でのサポート検出
      // 【期待される動作】: BrowserSupport.clipboardがtrueになる
      // 🔵 要件定義書のTC-BS-001に基づく

      // 【テストデータ準備】: Clipboard APIが利用可能な環境をシミュレート
      // 【初期条件設定】: モダンブラウザでの標準的な状態
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      // 【実際の処理実行】: checkBrowserSupport()を呼び出してブラウザサポート状況を取得
      // 【処理内容】: ブラウザのClipboard API、localStorageの存在チェックを実行
      const support: BrowserSupport = checkBrowserSupport();

      // 【結果検証】: Clipboard APIサポート状況が正しく検出されたことを確認
      // 【期待値確認】: clipboard: true が返されることを確認
      expect(support.clipboard).toBe(true); // 【確認内容】: clipboardプロパティがtrueであることを確認 🔵
      expect(support.html2canvas).toBe(true); // 【確認内容】: html2canvasは常にtrueであることを確認
      expect(support.localStorage).toBeDefined(); // 【確認内容】: localStorageは環境に応じて検出されることを確認
    });

    // TC-BS-002: localStorageサポート検出（サポートあり）
    it('localStorageがサポートされている場合、localStorage: trueを返す', () => {
      // 【テスト目的】: localStorage利用可能時の正常な検出
      // 【テスト内容】: window.localStorageが正常に使える環境でのサポート検出
      // 【期待される動作】: BrowserSupport.localStorageがtrueになる
      // 🔵 要件定義書のTC-BS-002に基づく

      // 【テストデータ準備】: デフォルトのjsdom環境（localStorageが利用可能）
      // 【初期条件設定】: 通常のブラウザ環境を再現

      // 【実際の処理実行】: checkBrowserSupport()を呼び出してブラウザサポート状況を取得
      const support: BrowserSupport = checkBrowserSupport();

      // 【結果検証】: localStorage利用可能時の正常な検出
      // 【期待値確認】: localStorage: true が返されることを確認
      expect(support.localStorage).toBe(true); // 【確認内容】: localStorageプロパティがtrueであることを確認 🔵
      expect(support.html2canvas).toBe(true); // 【確認内容】: html2canvasは常にtrueであることを確認
    });

    // TC-BS-003: html2canvas常時サポート
    it('html2canvasは常にtrueを返す', () => {
      // 【テスト目的】: html2canvasフィールドの仕様確認
      // 【テスト内容】: html2canvasプロパティが常にtrueであることの確認
      // 【期待される動作】: どの環境でもBrowserSupport.html2canvasがtrueになる
      // 🔵 要件定義書のTC-BS-003に基づく

      // 【実際の処理実行】: checkBrowserSupport()を呼び出す
      // 【処理内容】: html2canvasは依存関係として常に利用可能（将来の拡張用フィールド）
      const support: BrowserSupport = checkBrowserSupport();

      // 【結果検証】: html2canvasフィールドの仕様確認
      // 【期待値確認】: html2canvas: true が常に返されることを確認
      expect(support.html2canvas).toBe(true); // 【確認内容】: html2canvasプロパティが必ずtrueであること 🔵
    });

    // TC-BS-004: Clipboard API未サポート
    it('Clipboard APIが存在しない場合、clipboard: falseを返す', () => {
      // 【テスト目的】: Clipboard API未サポート環境の検出
      // 【テスト内容】: 古いブラウザやClipboard APIが無効な環境での検出
      // 【期待される動作】: BrowserSupport.clipboardがfalseになる
      // 🔵 要件定義書のTC-BS-004、EDGE-003に基づく

      // 【テストデータ準備】: Clipboard APIが利用不可な環境をシミュレート
      // 【初期条件設定】: 一部のブラウザやHTTPS未使用時にClipboard APIが利用不可
      Object.assign(navigator, {
        clipboard: undefined,
      });

      // 【実際の処理実行】: checkBrowserSupport()を呼び出す
      // 【処理内容】: Clipboard APIの存在チェックを実行
      const support: BrowserSupport = checkBrowserSupport();

      // 【結果検証】: Clipboard API未サポート環境の検出
      // 【期待値確認】: clipboard: false が返されることを確認
      expect(support.clipboard).toBe(false); // 【確認内容】: clipboardプロパティがfalseであることを確認 🔵
      expect(support.html2canvas).toBe(true); // 【確認内容】: html2canvasは常にtrueであることを確認
    });

    // TC-BS-005: localStorage使用不可
    it('localStorageが使用不可の場合、localStorage: falseを返す', () => {
      // 【テスト目的】: localStorage使用不可環境の検出
      // 【テスト内容】: プライベートモードやストレージ無効環境での検出
      // 【期待される動作】: BrowserSupport.localStorageがfalseになる
      // 🔵 要件定義書のTC-BS-005に基づく

      // 【テストデータ準備】: localStorageが使用不可な環境をシミュレート
      // 【初期条件設定】: プライベートブラウジング、ストレージクォータ超過、セキュリティポリシーによる無効化
      Object.defineProperty(window, 'localStorage', {
        get: () => {
          throw new Error('localStorage disabled');
        },
        configurable: true,
      });

      // 【実際の処理実行】: checkBrowserSupport()を呼び出す
      // 【処理内容】: localStorageへのアクセス試行とエラーハンドリング
      const support: BrowserSupport = checkBrowserSupport();

      // 【結果検証】: localStorage使用不可環境の検出
      // 【期待値確認】: localStorage: false が返されることを確認
      expect(support.localStorage).toBe(false); // 【確認内容】: localStorageプロパティがfalseであることを確認 🔵
      expect(support.html2canvas).toBe(true); // 【確認内容】: html2canvasは常にtrueであることを確認
    });

    // TC-BS-006: 全機能サポート済み環境
    it('すべての機能がサポートされている場合、すべてtrueを返す', () => {
      // 【テスト目的】: フル機能環境での動作確認
      // 【テスト内容】: 最良のケース（すべての機能が利用可能）
      // 【期待される動作】: すべてのプロパティがtrueになる
      // 🟡 一般的なテストパターンから妥当な推測

      // 【テストデータ準備】: すべての機能が利用可能な理想的な環境
      // 【初期条件設定】: Chrome/Firefox/Edge/Safari最新版での利用を想定
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });
      // localStorage利用可能（デフォルト）

      // 【実際の処理実行】: checkBrowserSupport()を呼び出す
      const support: BrowserSupport = checkBrowserSupport();

      // 【結果検証】: フル機能環境での動作確認
      // 【期待値確認】: すべてのプロパティがtrueであることを確認
      expect(support.html2canvas).toBe(true); // 【確認内容】: html2canvasが利用可能
      expect(support.clipboard).toBe(true); // 【確認内容】: Clipboard APIが利用可能
      expect(support.localStorage).toBe(true); // 【確認内容】: localStorageが利用可能
    });

    // TC-BS-007: すべての機能が未サポートの環境
    it('Clipboard APIとlocalStorageが両方とも使用不可の場合、両方falseを返す', () => {
      // 【テスト目的】: 最小限の環境での動作確認
      // 【テスト内容】: 最悪のケース（主要機能がすべて利用不可）
      // 【期待される動作】: html2canvas以外がfalseになる
      // 🟡 Graceful Degradationの一般的なパターンから推測

      // 【テストデータ準備】: 機能が最小限しか利用できない最悪の環境
      // 【初期条件設定】: 非常に古いブラウザ、セキュリティ制限が厳しい環境
      Object.assign(navigator, {
        clipboard: undefined,
      });
      Object.defineProperty(window, 'localStorage', {
        get: () => {
          throw new Error('localStorage disabled');
        },
        configurable: true,
      });

      // 【実際の処理実行】: checkBrowserSupport()を呼び出す
      const support: BrowserSupport = checkBrowserSupport();

      // 【結果検証】: 最小限の環境での動作確認
      // 【期待値確認】: 機能がなくても関数がクラッシュしない、Graceful Degradationで基本機能は維持
      expect(support.html2canvas).toBe(true); // 【確認内容】: html2canvasは常にtrue
      expect(support.clipboard).toBe(false); // 【確認内容】: Clipboard APIが利用不可
      expect(support.localStorage).toBe(false); // 【確認内容】: localStorageが利用不可
    });
  });

  // ========================================
  // 2. formatErrorMessage() のテストケース
  // ========================================
  describe('formatErrorMessage', () => {
    // TC-FM-001: 通常のErrorオブジェクト
    it('Errorオブジェクトのmessageをそのまま返す', () => {
      // 【テスト目的】: 通常のエラーメッセージの整形
      // 【テスト内容】: 標準的なErrorオブジェクトの処理
      // 【期待される動作】: error.messageの値がそのまま返される
      // 🔵 要件定義書のTC-FM-001に基づく

      // 【テストデータ準備】: 一般的なエラーケース（特殊なキーワードを含まない）
      const error = new Error('何らかのエラーが発生しました');

      // 【実際の処理実行】: formatErrorMessage()を呼び出してエラーメッセージを整形
      const message = formatErrorMessage(error);

      // 【結果検証】: 通常のエラーメッセージの整形
      // 【期待値確認】: 特殊なパターンに該当しない場合はメッセージをそのまま使用
      expect(message).toBe('何らかのエラーが発生しました'); // 【確認内容】: error.messageが変更されずに返されること 🔵
    });

    // TC-FM-002: ネットワークエラー（"network"キーワード）
    it('messageに"network"を含む場合、ネットワークエラーメッセージを返す', () => {
      // 【テスト目的】: ネットワークエラーの特定とユーザーフレンドリーなメッセージ変換
      // 【テスト内容】: ネットワーク接続エラーの検出
      // 【期待される動作】: ユーザーにインターネット接続確認を促すメッセージが返される
      // 🔵 要件定義書のTC-FM-002、EDGE-001に基づく

      // 【テストデータ準備】: ネットワーク接続が切れている、または不安定な状況
      const error = new Error('network error occurred');

      // 【実際の処理実行】: formatErrorMessage()を呼び出す
      const message = formatErrorMessage(error);

      // 【結果検証】: ネットワークエラーの検出とメッセージ変換
      // 【期待値確認】: ユーザーが対処方法を理解できる明確なメッセージ
      expect(message).toBe('ネットワークエラーが発生しました。インターネット接続を確認してください。'); // 【確認内容】: ネットワークエラー専用メッセージが返される 🔵
    });

    // TC-FM-003: ネットワークエラー（"fetch"キーワード）
    it('messageに"fetch"を含む場合、ネットワークエラーメッセージを返す', () => {
      // 【テスト目的】: Fetch API特有のエラーパターンの検出
      // 【テスト内容】: Fetch APIによるネットワークエラーの検出
      // 【期待される動作】: TC-FM-002と同じユーザーフレンドリーなメッセージが返される
      // 🔵 要件定義書のTC-FM-003、EDGE-001に基づく

      // 【テストデータ準備】: fetch()リクエストが失敗（CORS問題、サーバー停止、タイムアウト）
      const error = new Error('Failed to fetch');

      // 【実際の処理実行】: formatErrorMessage()を呼び出す
      const message = formatErrorMessage(error);

      // 【結果検証】: Fetch API特有のエラーパターンの検出
      // 【期待値確認】: 異なるネットワークエラーパターンを統一的に処理
      expect(message).toBe('ネットワークエラーが発生しました。インターネット接続を確認してください。'); // 【確認内容】: ネットワークエラー専用メッセージが返される 🔵
    });

    // TC-FM-004: 画像エクスポートエラー（"canvas"キーワード）
    it('messageに"canvas"を含む場合、画像エクスポートエラーメッセージを返す', () => {
      // 【テスト目的】: Canvas関連エラーの検出とメッセージ変換
      // 【テスト内容】: html2canvasまたはCanvas API関連エラーの処理
      // 【期待される動作】: 画像生成失敗をユーザーに通知するメッセージが返される
      // 🔵 要件定義書のTC-FM-004、EDGE-002に基づく

      // 【テストデータ準備】: Canvas APIエラー、メモリ不足、レンダリング失敗
      const error = new Error('canvas rendering failed');

      // 【実際の処理実行】: formatErrorMessage()を呼び出す
      const message = formatErrorMessage(error);

      // 【結果検証】: Canvas関連エラーの検出とメッセージ変換
      // 【期待値確認】: 画像保存失敗を明確に伝えるメッセージ
      expect(message).toBe(ERROR_MESSAGES.IMAGE_EXPORT_FAILED); // 【確認内容】: 画像エクスポートエラー専用メッセージが返される 🔵
    });

    // TC-FM-005: 画像エクスポートエラー（"image"キーワード）
    it('messageに"image"を含む場合、画像エクスポートエラーメッセージを返す', () => {
      // 【テスト目的】: 画像処理エラー全般の検出
      // 【テスト内容】: 画像処理全般のエラー処理
      // 【期待される動作】: TC-FM-004と同じメッセージが返される
      // 🔵 要件定義書のTC-FM-005、EDGE-002に基づく

      // 【テストデータ準備】: 画像読み込み失敗、変換エラー、保存エラー
      const error = new Error('image processing error');

      // 【実際の処理実行】: formatErrorMessage()を呼び出す
      const message = formatErrorMessage(error);

      // 【結果検証】: 画像処理エラー全般の検出
      // 【期待値確認】: 画像関連エラーを包括的にカバー
      expect(message).toBe(ERROR_MESSAGES.IMAGE_EXPORT_FAILED); // 【確認内容】: 画像エクスポートエラー専用メッセージが返される 🔵
    });

    // TC-FM-006: 非Errorオブジェクト
    it('非Errorオブジェクトの場合、汎用エラーメッセージを返す', () => {
      // 【テスト目的】: 予期しないエラー型への対応
      // 【テスト内容】: 予期しない形式のエラー（非Errorオブジェクト）の処理
      // 【期待される動作】: 汎用的なエラーメッセージが返される
      // 🔵 要件定義書のTC-FM-006に基づく

      // 【テストデータ準備】: JavaScriptではどんな値でもthrowできる（サードパーティライブラリのエラー、レガシーコード）
      const customError = { customError: 'Something went wrong' };

      // 【実際の処理実行】: formatErrorMessage()を呼び出す
      const message = formatErrorMessage(customError);

      // 【結果検証】: 予期しないエラー型への対応
      // 【期待値確認】: どんなエラー型でも安全に処理できることを保証
      expect(message).toBe(ERROR_MESSAGES.UNEXPECTED_ERROR); // 【確認内容】: 汎用エラーメッセージが返される 🔵
    });

    // TC-FM-007: 空文字列のErrorメッセージ
    it('error.messageが空文字列の場合、汎用エラーメッセージを返す', () => {
      // 【テスト目的】: 空メッセージエラーの安全な処理
      // 【テスト内容】: エラーメッセージの最小値（空）への対応
      // 【期待される動作】: 汎用エラーメッセージが返される
      // 🟡 一般的なエッジケーステストパターンから推測

      // 【テストデータ準備】: messageが空文字列のエッジケース
      const error = new Error('');

      // 【実際の処理実行】: formatErrorMessage()を呼び出す
      const message = formatErrorMessage(error);

      // 【結果検証】: 空メッセージエラーの安全な処理
      // 【期待値確認】: 空メッセージの場合も汎用メッセージで対応、常に何らかのメッセージがユーザーに提示される
      expect(message).toBe(ERROR_MESSAGES.UNEXPECTED_ERROR); // 【確認内容】: 汎用エラーメッセージが返される 🟡
    });

    // TC-FM-008: 非常に長いエラーメッセージ
    it('非常に長いerror.messageの場合でも処理できる', () => {
      // 【テスト目的】: 長いエラーメッセージへの対応
      // 【テスト内容】: エラーメッセージの最大値（非常に長い文字列）への対応
      // 【期待される動作】: 長いメッセージでもクラッシュせず、そのまま返される
      // 🟡 パフォーマンステストの一般的なパターンから推測

      // 【テストデータ準備】: 極端に長いエラーメッセージ（スタックトレースが含まれるエラー、複雑なエラー詳細）
      const longMessage = 'あ'.repeat(10000);
      const error = new Error(longMessage);

      // 【実際の処理実行】: formatErrorMessage()を呼び出す
      const message = formatErrorMessage(error);

      // 【結果検証】: 長いエラーメッセージへの対応
      // 【期待値確認】: メッセージの長さに関わらず動作する
      expect(message).toBe(longMessage); // 【確認内容】: 長いメッセージでも処理が完了する 🟡
    });

    // TC-FM-009: 複数のキーワードを含むエラーメッセージ
    it('messageに複数のキーワード（"network"と"image"）を含む場合、優先順位に従って処理', () => {
      // 【テスト目的】: キーワード優先順位の確認
      // 【テスト内容】: 複数のパターンにマッチする複雑なケース
      // 【期待される動作】: ネットワークエラーチェックが先に行われるため、ネットワークエラーメッセージが返される
      // 🟡 実装の優先順位ロジックに依存（要件定義では明示されていない）

      // 【テストデータ準備】: 複数のエラーパターンが同時に該当するケース（ネットワーク経由の画像取得失敗）
      const error = new Error('network error while processing image');

      // 【実際の処理実行】: formatErrorMessage()を呼び出す
      const message = formatErrorMessage(error);

      // 【結果検証】: キーワード優先順位の確認
      // 【期待値確認】: ネットワークエラーチェックが先に行われるため、ネットワークエラーメッセージが返される
      expect(message).toBe('ネットワークエラーが発生しました。インターネット接続を確認してください。'); // 【確認内容】: 優先順位が明確に定義されている 🟡
    });

    // TC-FM-010: 大文字小文字混在のキーワード
    it('キーワード検索が大文字小文字を区別しない', () => {
      // 【テスト目的】: キーワードマッチングの仕様確認
      // 【テスト内容】: キーワードマッチングの大文字小文字の扱い
      // 【期待される動作】: 大文字小文字のバリエーションでも正しく検出される
      // 🟡 実装の仕様に依存（要件定義では明示されていない）

      // 【テストデータ準備】: エラーメッセージの大文字小文字が異なるケース（サードパーティライブラリのエラーメッセージ）
      const error1 = new Error('NETWORK ERROR');
      const error2 = new Error('Network Error');

      // 【実際の処理実行】: formatErrorMessage()を呼び出す
      const message1 = formatErrorMessage(error1);
      const message2 = formatErrorMessage(error2);

      // 【結果検証】: キーワードマッチングの仕様確認
      // 【期待値確認】: 大文字小文字のバリエーションへの対応を明確にする（toLowerCase()を使う実装を想定）
      expect(message1).toBe('ネットワークエラーが発生しました。インターネット接続を確認してください。'); // 【確認内容】: 大文字でもマッチする 🟡
      expect(message2).toBe('ネットワークエラーが発生しました。インターネット接続を確認してください。'); // 【確認内容】: 大文字小文字混在でもマッチする 🟡
    });
  });

  // ========================================
  // 3. copyToClipboard() のテストケース
  // ========================================
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

    // TC-CC-001: Clipboard APIで正常にコピー
    it('Clipboard APIが使用可能で成功する場合、trueを返す', async () => {
      // 【テスト目的】: Clipboard API使用時の正常動作
      // 【テスト内容】: navigator.clipboard.writeText()の正常動作
      // 【期待される動作】: テキストがクリップボードにコピーされ、trueが返される
      // 🔵 要件定義書のTC-CC-001に基づく

      // 【テストデータ準備】: 実際の共有URLをシミュレート
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      // 【実際の処理実行】: copyToClipboard()を呼び出してクリップボードにコピー
      const result = await copyToClipboard('https://example.com/share?data=abc123');

      // 【結果検証】: Clipboard API使用時の正常動作
      // 【期待値確認】: Clipboard API成功時はtrueを返す仕様
      expect(result).toBe(true); // 【確認内容】: 戻り値がtrueであること 🔵
      expect(mockWriteText).toHaveBeenCalledWith('https://example.com/share?data=abc123'); // 【確認内容】: navigator.clipboard.writeText()が正しく呼ばれること 🔵
    });

    // TC-CC-002: 空文字列のコピー
    it('空文字列をコピーする場合でも正常に動作', async () => {
      // 【テスト目的】: 空文字列の正常な処理
      // 【テスト内容】: エッジケース（空文字列）への対応
      // 【期待される動作】: 空文字列でもコピー処理が成功
      // 🔵 既存clipboard.test.tsのTC-CC-002パターンに基づく

      // 【テストデータ準備】: 空のテキスト
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      // 【実際の処理実行】: copyToClipboard()を呼び出す
      const result = await copyToClipboard('');

      // 【結果検証】: 空文字列の正常な処理
      // 【期待値確認】: 空文字列でもコピーは技術的に可能
      expect(result).toBe(true); // 【確認内容】: エラーが発生しないこと 🔵
      expect(mockWriteText).toHaveBeenCalledWith(''); // 【確認内容】: writeText('')が呼ばれること 🔵
    });

    // TC-CC-003: 長いテキストのコピー
    it('非常に長いテキストをコピーする場合でも正常に動作', async () => {
      // 【テスト目的】: 長いテキストの正常な処理
      // 【テスト内容】: 長いテキストへの対応
      // 【期待される動作】: 長いURLやテキストでもコピー成功
      // 🔵 既存clipboard.test.tsのTC-CC-003パターンに基づく

      // 【テストデータ準備】: 10,000文字の長いテキスト
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      const longText = 'a'.repeat(10000);

      // 【実際の処理実行】: copyToClipboard()を呼び出す
      const result = await copyToClipboard(longText);

      // 【結果検証】: 長いテキストの正常な処理
      // 【期待値確認】: Clipboard APIは長いテキストも処理可能
      expect(result).toBe(true); // 【確認内容】: メモリエラーが発生しないこと 🔵
      expect(mockWriteText).toHaveBeenCalledWith(longText); // 【確認内容】: 正しくコピーされること 🔵
    });

    // TC-CC-004: 特殊文字を含むテキストのコピー
    it('特殊文字を含むテキストをコピーできる', async () => {
      // 【テスト目的】: 特殊文字の正常な処理
      // 【テスト内容】: 特殊文字のエスケープ処理
      // 【期待される動作】: 特殊文字もそのままコピーされる
      // 🔵 既存clipboard.test.tsのTC-CC-004パターンに基づく

      // 【テストデータ準備】: HTML特殊文字、日本語、記号を含むテキスト
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      const specialText = '特殊文字 & "quotes" <tags>';

      // 【実際の処理実行】: copyToClipboard()を呼び出す
      const result = await copyToClipboard(specialText);

      // 【結果検証】: 特殊文字の正常な処理
      // 【期待値確認】: 特殊文字もそのままクリップボードにコピーされるべき
      expect(result).toBe(true); // 【確認内容】: エラーが発生しないこと 🔵
      expect(mockWriteText).toHaveBeenCalledWith(specialText); // 【確認内容】: 特殊文字がエスケープされずにコピーされること 🔵
    });

    // TC-CC-005: Clipboard API失敗時のフォールバック成功
    it('Clipboard APIが失敗した場合、フォールバックに切り替わる', async () => {
      // 【テスト目的】: フォールバック機構の動作確認
      // 【テスト内容】: Clipboard API拒否（権限エラーなど）時のフォールバック処理
      // 【期待される動作】: フォールバックにより機能継続、最終的にコピーが成功
      // 🔵 要件定義書のTC-CC-005に基づく

      // 【テストデータ準備】: ユーザーがクリップボード権限を拒否
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Permission denied'));
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      // フォールバック成功
      const mockExecCommand = vi.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      // 【実際の処理実行】: copyToClipboard()を呼び出す
      const result = await copyToClipboard('test text');

      // 【結果検証】: フォールバック機構の動作確認
      // 【期待値確認】: Clipboard API失敗後にフォールバックが実行されること、最終的にコピーが成功すること
      expect(result).toBe(true); // 【確認内容】: 戻り値がtrueであること 🔵
      expect(mockExecCommand).toHaveBeenCalledWith('copy'); // 【確認内容】: document.execCommand('copy')が呼ばれること 🔵
    });

    // TC-CC-006: フォールバック処理の成功（Clipboard API未サポート）
    it('フォールバック（execCommand）が成功する場合、trueを返す', async () => {
      // 【テスト目的】: Clipboard API未サポート環境での動作
      // 【テスト内容】: Clipboard API自体が存在しない環境での処理
      // 【期待される動作】: 古い環境でも機能提供、フォールバックが正常に実行される
      // 🔵 要件定義書のTC-CC-006に基づく

      // 【テストデータ準備】: 古いブラウザ、HTTP環境
      Object.assign(navigator, {
        clipboard: undefined,
      });

      // フォールバック成功
      const mockExecCommand = vi.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      // 【実際の処理実行】: copyToClipboard()を呼び出す
      const result = await copyToClipboard('fallback test');

      // 【結果検証】: Clipboard API未サポート環境での動作
      // 【期待値確認】: Clipboard APIチェックが正しく行われること、フォールバックが正常に実行されること
      expect(result).toBe(true); // 【確認内容】: 戻り値がtrueであること 🔵
      expect(mockExecCommand).toHaveBeenCalledWith('copy'); // 【確認内容】: execCommandが呼ばれること 🔵
    });

    // TC-CC-007: フォールバックも失敗する場合
    it('フォールバックも失敗する場合、falseを返す', async () => {
      // 【テスト目的】: 完全な失敗ケースの処理
      // 【テスト内容】: すべてのコピー手段が失敗
      // 【期待される動作】: falseを返すことで呼び出し側が適切に処理、クラッシュしない
      // 🔵 要件定義書のTC-CC-007に基づく

      // 【テストデータ準備】: 非常に古いブラウザ、セキュリティ制限
      Object.assign(navigator, {
        clipboard: undefined,
      });

      // フォールバック失敗
      const mockExecCommand = vi.fn().mockReturnValue(false);
      document.execCommand = mockExecCommand;

      // 【実際の処理実行】: copyToClipboard()を呼び出す
      const result = await copyToClipboard('test');

      // 【結果検証】: 完全な失敗ケースの処理
      // 【期待値確認】: すべての手段が失敗した場合にfalseが返されること、クラッシュしないこと
      expect(result).toBe(false); // 【確認内容】: 戻り値がfalseであること 🔵
    });

    // TC-CC-008: フォールバック時の一時要素削除確認
    it('フォールバック時に一時的なtextarea要素が削除される', async () => {
      // 【テスト目的】: メモリリーク防止の確認
      // 【テスト内容】: リソースリークの防止（メモリ管理）
      // 【期待される動作】: DOM要素のクリーンアップが確実に行われる
      // 🔵 要件定義書のTC-CC-008に基づく

      // 【テストデータ準備】: フォールバック処理の内部動作
      Object.assign(navigator, {
        clipboard: undefined,
      });

      const mockExecCommand = vi.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      // テスト前のDOM状態を記録
      const initialTextareaCount = document.querySelectorAll('textarea').length;

      // 【実際の処理実行】: copyToClipboard()を呼び出す
      await copyToClipboard('cleanup test');

      // 【結果検証】: メモリリーク防止の確認
      // 【期待値確認】: 要素が確実に削除される、毎回クリーンアップが実行される
      const finalTextareaCount = document.querySelectorAll('textarea').length;
      expect(finalTextareaCount).toBe(initialTextareaCount); // 【確認内容】: document.querySelectorAll('textarea').lengthが変化しないこと 🔵
    });

    // TC-CC-009: Clipboard API途中でエラー（例外）
    it('Clipboard API実行中に予期しない例外が発生した場合の処理', async () => {
      // 【テスト目的】: 予期しない例外への対応
      // 【テスト内容】: Promise rejectではなく同期的な例外の処理
      // 【期待される動作】: try-catchで例外を捕捉し、フォールバックまたはエラー処理
      // 🟡 一般的なエラーハンドリングパターンから推測

      // 【テストデータ準備】: ブラウザバグ、予期しない状態
      const mockWriteText = vi.fn().mockImplementation(() => {
        throw new Error('Unexpected sync error');
      });
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });

      // フォールバック準備
      const mockExecCommand = vi.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      // 【実際の処理実行】: copyToClipboard()を呼び出す
      const result = await copyToClipboard('error test');

      // 【結果検証】: 予期しない例外への対応
      // 【期待値確認】: 同期的な例外でもクラッシュしないこと、適切にフォールバックまたはエラー処理されること
      expect(result).toBe(true); // 【確認内容】: フォールバックが実行される 🟡
    });

    // TC-CC-010: navigator.clipboard自体がundefinedの場合
    it('navigator.clipboardプロパティ自体が存在しない場合の処理', async () => {
      // 【テスト目的】: undefined判定の正確性確認
      // 【テスト内容】: API未サポートの最も基本的なケース
      // 【期待される動作】: undefinedチェックが正しく機能、API未サポートでも動作継続
      // 🟡 TypeScriptのオプショナルチェーン使用を前提とした推測

      // 【テストデータ準備】: 古いブラウザ、非HTTPS環境
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true,
      });

      // フォールバック準備
      const mockExecCommand = vi.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      // 【実際の処理実行】: copyToClipboard()を呼び出す
      const result = await copyToClipboard('undefined test');

      // 【結果検証】: undefined判定の正確性確認
      // 【期待値確認】: navigator.clipboard?.writeTextのようなオプショナルチェーンが機能すること、フォールバックに確実に切り替わること
      expect(result).toBe(true); // 【確認内容】: フォールバックが実行される 🟡
      expect(mockExecCommand).toHaveBeenCalledWith('copy'); // 【確認内容】: execCommandが呼ばれること 🟡
    });
  });
});
