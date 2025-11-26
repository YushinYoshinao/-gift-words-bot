/**
 * ErrorBoundary コンポーネント
 *
 * 【機能概要】: Reactコンポーネントツリー内のJavaScriptエラーをキャッチし、フォールバックUIを表示
 * 【実装方針】: React Error Boundary APIを使用したClass Component実装
 * 【テスト対応】: 8つのテストケース（正常系2、異常系3、カスタムUI1、エッジケース2）を通すための実装
 * 🔵 信頼性レベル: React公式ドキュメント + 要件定義書に基づく
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

/**
 * 【Props型定義】: ErrorBoundaryコンポーネントのプロパティ
 * 🔵 信頼性レベル: 要件定義書に基づく
 */
interface ErrorBoundaryProps {
  /** 【必須プロパティ】: 子コンポーネント（エラー監視対象） */
  children: ReactNode;

  /** 【オプションプロパティ】: カスタムフォールバックUI（エラー時に表示） */
  fallback?: ReactNode;
}

/**
 * 【State型定義】: ErrorBoundaryコンポーネントの状態管理
 * 🔵 信頼性レベル: React Error Boundary公式ドキュメントに基づく
 */
interface ErrorBoundaryState {
  /** 【エラーフラグ】: エラーが発生したかどうかを示すフラグ */
  hasError: boolean;

  /** 【エラーオブジェクト】: キャッチしたエラーの詳細情報 */
  error: Error | null;

  /** 【エラー情報】: Reactが提供するエラースタックトレース情報 */
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary クラスコンポーネント
 *
 * 【実装方針】: React Error Boundary APIはClass Componentでのみ実装可能
 * 【テスト対応】: 全8テストケースを通すための最小実装
 * 🔵 信頼性レベル: React公式ドキュメント準拠
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * 【コンストラクタ】: 初期状態の設定
   * 【実装内容】: エラーなし状態で初期化
   * 🔵 信頼性レベル: React Class Component標準パターン
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // 【初期状態設定】: エラー未発生の状態で初期化
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * 【静的メソッド】: エラー発生時にStateを更新する
   * 【実装方針】: React Error Boundary API標準メソッド
   * 【テスト対応】: テスト2-1（フォールバックUI表示）を通すための実装
   * 🔵 信頼性レベル: React公式ドキュメント準拠
   *
   * @param error - キャッチされたエラーオブジェクト
   * @returns 更新後のState（hasError: true）
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 【State更新】: エラーフラグをtrueに設定し、フォールバックUIを表示させる
    // 【テスト対応】: エラー発生時にフォールバックUIが表示されることを保証
    return {
      hasError: true,
      error,
    };
  }

  /**
   * 【ライフサイクルメソッド】: エラー発生時にコンソールログを出力
   * 【実装方針】: 開発者がエラーを特定できるようログ出力
   * 【テスト対応】: テスト2-2（コンソールログ出力）を通すための実装
   * 🔵 信頼性レベル: 要件定義書の実装詳細に基づく
   *
   * @param error - キャッチされたエラーオブジェクト
   * @param errorInfo - Reactが提供するエラースタックトレース
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 【エラーログ出力】: 開発者がデバッグできるようconsole.errorに出力
    // 【テスト対応】: テストで検証されるログメッセージ形式
    // 🔵 信頼性レベル: 要件定義書に明記された形式
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 【State更新】: エラー情報をStateに保存（オプション）
    this.setState({
      errorInfo,
    });
  }

  /**
   * 【リセットハンドラー】: トップページに戻る処理
   * 【実装方針】: window.location.hrefでページ遷移
   * 【テスト対応】: テスト2-3（リセットボタン）を通すための実装
   * 🔵 信頼性レベル: 要件定義書の実装詳細に基づく
   */
  handleReset = (): void => {
    // 【ページ遷移】: トップページ（'/'）にリダイレクト
    // 【テスト対応】: テストでwindow.location.hrefが'/'に設定されることを検証
    // 🔵 信頼性レベル: 要件定義書に明記された遷移先
    window.location.href = '/';
  };

  /**
   * 【レンダリングメソッド】: コンポーネントの描画処理
   * 【実装方針】: エラー有無とカスタムfallbackの有無で分岐
   * 【テスト対応】:
   *   - テスト1-1: エラーなし → children表示
   *   - テスト2-1: エラーあり、fallbackなし → デフォルトUI表示
   *   - テスト3-1: エラーあり、fallbackあり → カスタムUI表示
   * 🔵 信頼性レベル: 要件定義書の出力仕様に基づく
   */
  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    // 【エラー時の処理】: エラーが発生している場合の分岐
    if (hasError) {
      // 【カスタムフォールバック優先】: fallback propsが指定されている場合はそれを表示
      // 【テスト対応】: テスト3-1（カスタムfallback表示）を通すための実装
      // 🟡 信頼性レベル: 一般的なReact Error Boundaryパターンから推測
      if (fallback) {
        return fallback;
      }

      // 【デフォルトフォールバックUI】: fallbackが指定されていない場合のデフォルト表示
      // 【テスト対応】: テスト2-1（デフォルトUI表示）、テスト4-2（エラー詳細表示）を通すための実装
      // 🔵 信頼性レベル: 要件定義書の出力仕様に基づく
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            {/* 【タイトル】: エラー発生を示すタイトル */}
            <h1>エラーが発生しました</h1>

            {/* 【メッセージ】: ユーザー向けのエラーメッセージ */}
            {/* 🔵 信頼性レベル: 要件定義書に明記されたメッセージ */}
            <p>申し訳ございません。アプリケーションでエラーが発生しました。</p>

            {/* 【エラー詳細】: 展開可能な<details>要素でエラー詳細を表示 */}
            {/* 【テスト対応】: テスト4-2（エラー詳細表示）を通すための実装 */}
            {/* 🟡 信頼性レベル: 要件定義書のSHOULD機能から推測 */}
            <details>
              <summary>エラー詳細</summary>
              <pre>{error?.toString()}</pre>
            </details>

            {/* 【リセットボタン】: トップページに戻るボタン */}
            {/* 【テスト対応】: テスト2-3（リセット機能）を通すための実装 */}
            {/* 🔵 信頼性レベル: 要件定義書の実装詳細に基づく */}
            <button onClick={this.handleReset}>トップページに戻る</button>
          </div>
        </div>
      );
    }

    // 【正常時の処理】: エラーがない場合は子要素をそのまま表示
    // 【テスト対応】: テスト1-1（子要素表示）、テスト1-2（正常レンダリング）を通すための実装
    // 🔵 信頼性レベル: React Error Boundary公式ドキュメント準拠
    return children;
  }
}

export default ErrorBoundary;
