/**
 * ErrorBoundary コンポーネントのテスト
 *
 * 【テスト対象】: ErrorBoundary（React Error Boundary）
 * 【参照ドキュメント】: docs/implements/gift-words/TASK-0040/ErrorBoundary-testcases.md
 * 【信頼性レベル】: 🔵 高信頼（要件定義書、React公式ドキュメント、既存パターンに基づく）
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';

describe('ErrorBoundary', () => {
  // === beforeEach（各テスト実行前）===
  // 🔵 信頼性レベル: プロジェクト共通パターン
  beforeEach(() => {
    // 【テスト前準備】: 各テスト実行前にモックをリセット 🔵
    // 【環境初期化】: 前のテストの影響を受けないよう、モックの状態をクリーンにする

    // console.errorのモックをリセット（エラーログでテストログが汚れないように）
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  // === afterEach（各テスト実行後）===
  // 🔵 信頼性レベル: プロジェクト共通パターン
  afterEach(() => {
    // 【テスト後処理】: 各テスト実行後にモックを復元 🔵
    // 【状態復元】: 次のテストに影響しないよう、システムを元の状態に戻す

    vi.restoreAllMocks();
  });

  // ================================================================
  // 1. 正常系テストケース（基本的な動作）
  // ================================================================

  it('エラーがない場合は子要素を表示する', () => {
    // 【テスト目的】: ErrorBoundaryが正常時に子要素を透過的に表示することを確認 🔵
    // 【テスト内容】: エラーを発生しないコンポーネントを子要素として配置
    // 【期待される動作】: 子要素がそのままレンダリングされ、フォールバックUIは表示されない
    // 🔵 信頼性レベル: React公式ドキュメントに基づく

    // === Given（準備フェーズ）===
    // 【テストデータ準備】: 正常に動作する子コンポーネントを用意
    const NormalComponent = () => <div>正常なコンポーネント</div>;

    // === When（実行フェーズ）===
    // 【実際の処理実行】: ErrorBoundaryで子コンポーネントをラップしてレンダリング
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    // === Then（検証フェーズ）===
    // 【結果検証】: 子要素のテキストが表示されることを確認 🔵
    expect(screen.getByText('正常なコンポーネント')).toBeInTheDocument();
    // 【確認内容】: 子要素が正常にレンダリングされている

    // 【結果検証】: フォールバックUIのタイトルが表示されないことを確認 🔵
    expect(screen.queryByText('エラーが発生しました')).not.toBeInTheDocument();
    // 【確認内容】: エラー時のUIは表示されていない
  });

  it('ErrorBoundaryが正しくレンダリングされる', () => {
    // 【テスト目的】: ErrorBoundaryコンポーネント自体が正常にマウントされることを確認 🔵
    // 【テスト内容】: 最小限の子要素でErrorBoundaryをレンダリング
    // 【期待される動作】: コンポーネントツリーに正常に組み込まれる
    // 🔵 信頼性レベル: 要件定義書の基本仕様に基づく

    // === Given（準備フェーズ）===
    // 【テストデータ準備】: 最小限の子要素を持つErrorBoundary

    // === When（実行フェーズ）===
    // 【実際の処理実行】: ErrorBoundaryをレンダリング
    render(
      <ErrorBoundary>
        <div>Test</div>
      </ErrorBoundary>
    );

    // === Then（検証フェーズ）===
    // 【結果検証】: 子要素が表示されることを確認 🔵
    expect(screen.getByText('Test')).toBeInTheDocument();
    // 【確認内容】: ErrorBoundaryがエラーなくマウントされ、子要素が表示される
  });

  // ================================================================
  // 2. 異常系テストケース（エラーハンドリング）
  // ================================================================

  it('子コンポーネントでエラー発生時にフォールバックUIを表示する', () => {
    // 【テスト目的】: ErrorBoundaryがエラーをキャッチしてフォールバックUIを表示することを確認 🔵
    // 【テスト内容】: エラーを発生する子コンポーネントをレンダリングし、適切なエラーUIが表示される
    // 【期待される動作】: getDerivedStateFromError → フォールバックUI表示
    // 🔵 信頼性レベル: 要件定義書とReact公式ドキュメントに基づく

    // === Given（準備フェーズ）===
    // 【テストデータ準備】: エラーを発生するコンポーネントを用意
    // 【初期条件設定】: 意図的にErrorをthrowしてエラー状態を再現
    const BrokenComponent = () => {
      throw new Error('Test error');
    };

    // console.errorのモック（Reactが内部でエラーログを出すため、テストログを汚さない）
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // === When（実行フェーズ）===
    // 【実際の処理実行】: ErrorBoundaryでエラーを発生するコンポーネントをレンダリング
    // 【処理内容】: BrokenComponentがエラーをthrowし、ErrorBoundaryがキャッチ
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    // === Then（検証フェーズ）===
    // 【結果検証】: フォールバックUIのタイトルが表示される 🔵
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    // 【確認内容】: エラー発生時に適切なタイトルが表示される

    // 【結果検証】: エラーメッセージが表示される 🔵
    expect(
      screen.getByText(/申し訳ございません。アプリケーションでエラーが発生しました。/)
    ).toBeInTheDocument();
    // 【確認内容】: ユーザーに分かりやすいエラーメッセージが表示される

    // 【結果検証】: トップページに戻るボタンが表示される 🔵
    expect(screen.getByText('トップページに戻る')).toBeInTheDocument();
    // 【確認内容】: ユーザーがリカバリーできる手段が提供されている

    // 【クリーンアップ】: console.errorモックを復元
    consoleErrorSpy.mockRestore();
  });

  it('エラー発生時にコンソールログが出力される', () => {
    // 【テスト目的】: componentDidCatchでエラーログが出力されることを確認 🔵
    // 【テスト内容】: エラー発生時にconsole.errorが適切な引数で呼ばれる
    // 【期待される動作】: エラーキャッチ → console.error呼び出し
    // 🔵 信頼性レベル: 要件定義書の実装詳細に基づく

    // === Given（準備フェーズ）===
    // 【テストデータ準備】: エラーを発生するコンポーネント
    const testError = new Error('Test error message');
    const BrokenComponent = () => {
      throw testError;
    };

    // 【モック準備】: console.errorをスパイしてログ出力を検証
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // === When（実行フェーズ）===
    // 【実際の処理実行】: ErrorBoundaryでエラーを発生
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    // === Then（検証フェーズ）===
    // 【結果検証】: console.errorが呼ばれることを確認 🔵
    expect(consoleErrorSpy).toHaveBeenCalled();
    // 【確認内容】: エラーログが出力されている

    // 【結果検証】: console.errorの呼び出しに適切なメッセージが含まれる 🔵
    // 【修正理由】: Reactは複数回console.errorを呼ぶため、全ての呼び出しをチェック
    const allCalls = consoleErrorSpy.mock.calls.flat().join(' ');
    expect(allCalls).toContain('ErrorBoundary caught an error');
    // 【確認内容】: 識別しやすいログメッセージが出力されている

    // 【クリーンアップ】
    consoleErrorSpy.mockRestore();
  });

  it('リセットボタンでトップページに戻る', async () => {
    // 【テスト目的】: handleResetでトップページに遷移することを確認 🔵
    // 【テスト内容】: ボタンクリック時にwindow.location.hrefが設定される
    // 【期待される動作】: ボタンクリック → window.location.href = '/'
    // 🔵 信頼性レベル: 要件定義書の実装詳細に基づく

    // === Given（準備フェーズ）===
    // 【テストデータ準備】: エラーを発生するコンポーネント
    const BrokenComponent = () => {
      throw new Error('Test error');
    };

    // 【モック準備】: window.location.hrefをモック化
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.location = { href: '' } as any;

    // console.errorのモック
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // === When（実行フェーズ）===
    // 【実際の処理実行】: ErrorBoundaryをレンダリングしてエラー状態にする
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    // 【実際の処理実行】: リセットボタンをクリック
    const resetButton = screen.getByText('トップページに戻る');
    await userEvent.click(resetButton);

    // === Then（検証フェーズ）===
    // 【結果検証】: window.location.hrefが'/'に設定される 🔵
    expect(window.location.href).toBe('/');
    // 【確認内容】: トップページへのリダイレクトが実行される

    // 【クリーンアップ】
    consoleErrorSpy.mockRestore();
  });

  // ================================================================
  // 3. カスタムフォールバックUIテストケース
  // ================================================================

  it('カスタムfallback propsが指定されている場合はそれを表示する', () => {
    // 【テスト目的】: カスタムフォールバックUIが表示されることを確認 🟡
    // 【テスト内容】: fallback propsでカスタムUIを指定し、エラー時にそれが表示される
    // 【期待される動作】: エラー発生 → カスタムfallback表示（デフォルトUI非表示）
    // 🟡 信頼性レベル: 一般的なReactパターンから推測

    // === Given（準備フェーズ）===
    // 【テストデータ準備】: カスタムフォールバックUIとエラーコンポーネント
    const CustomFallback = <div>カスタムエラーUI</div>;
    const BrokenComponent = () => {
      throw new Error('Test error');
    };

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // === When（実行フェーズ）===
    // 【実際の処理実行】: fallback propsを指定してErrorBoundaryをレンダリング
    render(
      <ErrorBoundary fallback={CustomFallback}>
        <BrokenComponent />
      </ErrorBoundary>
    );

    // === Then（検証フェーズ）===
    // 【結果検証】: カスタムUIが表示される 🟡
    expect(screen.getByText('カスタムエラーUI')).toBeInTheDocument();
    // 【確認内容】: fallback propsで指定したUIが表示される

    // 【結果検証】: デフォルトUIは表示されない 🟡
    expect(screen.queryByText('エラーが発生しました')).not.toBeInTheDocument();
    // 【確認内容】: カスタムUIがデフォルトUIを上書きしている

    consoleErrorSpy.mockRestore();
  });

  // ================================================================
  // 4. エッジケーステストケース
  // ================================================================

  it('複数のエラー発生後もフォールバックUIが正しく表示される', async () => {
    // 【テスト目的】: ErrorBoundaryのState管理の堅牢性を確認 🟡
    // 【テスト内容】: 複数回エラーが発生しても一貫した動作を行う
    // 【期待される動作】: 1回目エラー → リセット → 2回目エラー → 両方で同じフォールバックUI表示
    // 🟡 信頼性レベル: State管理のベストプラクティスから推測

    // === Given（準備フェーズ）===
    // 【テストデータ準備】: エラーを発生するコンポーネント
    const BrokenComponent = () => {
      throw new Error('Test error');
    };

    // 【モック準備】: window.location.hrefをモック化
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.location = { href: '' } as any;

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // === When（実行フェーズ - 1回目）===
    // 【実際の処理実行】: 1回目のエラー発生
    const { unmount } = render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    // === Then（検証フェーズ - 1回目）===
    // 【結果検証】: 1回目のフォールバックUIが表示される 🟡
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();

    // 【クリーンアップ】: 1回目のコンポーネントをアンマウント
    unmount();

    // === When（実行フェーズ - 2回目）===
    // 【実際の処理実行】: 2回目のエラー発生（新しいインスタンス）
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    // === Then（検証フェーズ - 2回目）===
    // 【結果検証】: 2回目のフォールバックUIも正しく表示される 🟡
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    // 【確認内容】: 複数回のエラーでも一貫した動作が保証されている

    consoleErrorSpy.mockRestore();
  });

  it('エラー詳細が展開可能な<details>要素で表示される', () => {
    // 【テスト目的】: <details>要素でエラー詳細が表示されることを確認 🟡
    // 【テスト内容】: エラー発生時に展開可能なエラー詳細が表示される
    // 【期待される動作】: <details><summary>エラー詳細</summary><pre>...</pre></details>
    // 🟡 信頼性レベル: 要件定義書のSHOULD機能から推測

    // === Given（準備フェーズ）===
    const testError = new Error('Test error message');
    const BrokenComponent = () => {
      throw testError;
    };

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // === When（実行フェーズ）===
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    // === Then（検証フェーズ）===
    // 【結果検証】: <summary>要素が存在する 🟡
    expect(screen.getByText('エラー詳細')).toBeInTheDocument();
    // 【確認内容】: 展開可能なエラー詳細セクションがある

    // 【結果検証】: エラーメッセージが含まれる 🟡
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();
    // 【確認内容】: エラーの詳細情報が表示されている

    consoleErrorSpy.mockRestore();
  });
});
