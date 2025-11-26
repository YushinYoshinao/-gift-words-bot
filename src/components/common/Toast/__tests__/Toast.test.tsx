/**
 * Toast コンポーネントのテスト
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../Toast';
import { Toast as ToastType } from '../../../../types';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createToast = (
    type: ToastType['type'],
    duration?: number
  ): ToastType => ({
    id: 'test-toast-1',
    message: 'テストメッセージ',
    type,
    duration: duration ?? 3000,
  });

  it('メッセージが表示される', () => {
    const toast = createToast('info');
    const onClose = vi.fn();

    render(<Toast toast={toast} onClose={onClose} />);

    expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
  });

  it('successタイプで正しいスタイルが適用される', () => {
    const toast = createToast('success');
    const onClose = vi.fn();

    const { container } = render(<Toast toast={toast} onClose={onClose} />);
    const toastElement = container.firstChild as HTMLElement;

    expect(toastElement.className).toMatch(/success/);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('errorタイプで正しいスタイルが適用される', () => {
    const toast = createToast('error');
    const onClose = vi.fn();

    const { container } = render(<Toast toast={toast} onClose={onClose} />);
    const toastElement = container.firstChild as HTMLElement;

    expect(toastElement.className).toMatch(/error/);
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('warningタイプで正しいスタイルが適用される', () => {
    const toast = createToast('warning');
    const onClose = vi.fn();

    const { container } = render(<Toast toast={toast} onClose={onClose} />);
    const toastElement = container.firstChild as HTMLElement;

    expect(toastElement.className).toMatch(/warning/);
    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('infoタイプで正しいスタイルが適用される', () => {
    const toast = createToast('info');
    const onClose = vi.fn();

    const { container } = render(<Toast toast={toast} onClose={onClose} />);
    const toastElement = container.firstChild as HTMLElement;

    expect(toastElement.className).toMatch(/info/);
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('閉じるボタンをクリックすると閉じる', async () => {
    vi.useRealTimers(); // Real timers for userEvent
    const user = userEvent.setup();
    const toast = createToast('info', 0); // Disable auto-close
    const onClose = vi.fn();

    render(<Toast toast={toast} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: /閉じる/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledWith('test-toast-1');
    vi.useFakeTimers(); // Restore fake timers
  });

  it('指定時間後に自動で閉じる', () => {
    const toast = createToast('info', 3000);
    const onClose = vi.fn();

    render(<Toast toast={toast} onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();

    // 3秒後
    vi.advanceTimersByTime(3000);

    expect(onClose).toHaveBeenCalledWith('test-toast-1');
  });

  it('duration=0の場合は自動で閉じない', () => {
    const toast = createToast('info', 0);
    const onClose = vi.fn();

    render(<Toast toast={toast} onClose={onClose} />);

    // 10秒経過しても閉じない
    vi.advanceTimersByTime(10000);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('適切なARIA属性が設定されている', () => {
    const toast = createToast('info');
    const onClose = vi.fn();

    const { container } = render(<Toast toast={toast} onClose={onClose} />);
    const toastElement = container.firstChild as HTMLElement;

    expect(toastElement).toHaveAttribute('role', 'alert');
    expect(toastElement).toHaveAttribute('aria-live', 'polite');
  });

  // ========================================
  // TASK-0045: ARIA属性・アクセシビリティ改善
  // ========================================

  describe('ARIA attributes for accessibility (TASK-0045)', () => {
    it('エラートーストにaria-live="assertive"が設定される', () => {
      // 【テスト目的】: エラーメッセージの緊急性がARIA属性で表現されることを確認 🔵
      // 【テスト内容】: type="error"のToastコンポーネントにaria-live="assertive"が設定されること 🔵
      // 【期待される動作】: スクリーンリーダーが現在の読み上げを中断してエラーを読み上げる 🔵
      // 🔵 信頼性レベル: NFR-206要件、タスク仕様に基づく

      // 【テストデータ準備】: type="error"のエラートースト 🔵
      // 【初期条件設定】: 実際のエラー通知シナリオを再現 🔵
      const toast = createToast('error');
      const onClose = vi.fn();

      // 【実際の処理実行】: Toastコンポーネントをレンダリング 🔵
      // 【処理内容】: エラータイプのトーストを表示 🔵
      const { container } = render(<Toast toast={toast} onClose={onClose} />);
      const toastElement = container.firstChild as HTMLElement;

      // 【結果検証】: aria-live="assertive"が設定されていることを確認 🔵
      // 【期待値確認】: エラーは重要な情報なので即座に伝える必要がある 🔵
      expect(toastElement).toHaveAttribute('role', 'alert');
      expect(toastElement).toHaveAttribute('aria-live', 'assertive');
      // 【確認内容】: エラートーストのみassertiveレベルで現在の読み上げを中断する 🔵
    });

    it('通常トースト(success/info/warning)にaria-live="polite"が設定される', () => {
      // 【テスト目的】: メッセージの緊急性に応じた適切なaria-live値の設定を確認 🔵
      // 【テスト内容】: type="success", "info", "warning"のToastにaria-live="polite"が設定されること 🔵
      // 【期待される動作】: 通常メッセージは現在の読み上げ完了後に読み上げられること 🔵
      // 🔵 信頼性レベル: NFR-206要件、タスク仕様に基づく

      // 【テストデータ準備】: type="success"の成功トースト 🔵
      // 【初期条件設定】: 非緊急の通知メッセージ 🔵
      const successToast = createToast('success');
      const onClose = vi.fn();

      // 【実際の処理実行】: 成功トーストをレンダリング 🔵
      const { container: successContainer } = render(
        <Toast toast={successToast} onClose={onClose} />
      );
      const successElement = successContainer.firstChild as HTMLElement;

      // 【結果検証】: aria-live="polite"が設定されていることを確認 🔵
      // 【期待値確認】: 成功メッセージは緊急性が低く、中断する必要がない 🔵
      expect(successElement).toHaveAttribute('aria-live', 'polite');
      // 【確認内容】: politeレベルで読み上げ順序を守る挙動が適切 🔵

      // 【追加検証】: infoトーストもpoliteであることを確認 🔵
      const infoToast = createToast('info');
      const { container: infoContainer } = render(
        <Toast toast={infoToast} onClose={vi.fn()} />
      );
      const infoElement = infoContainer.firstChild as HTMLElement;
      expect(infoElement).toHaveAttribute('aria-live', 'polite');
      // 【確認内容】: すべての非エラートーストでpoliteが設定される 🔵
    });

    it('Toastにaria-atomic="true"が設定される', () => {
      // 【テスト目的】: ライブリージョンの読み上げ単位が正しく設定されることを確認 🔵
      // 【テスト内容】: すべてのToastコンポーネントにaria-atomic="true"が設定されること 🔵
      // 【期待される動作】: トースト全体が一つのユニットとして読み上げられること 🔵
      // 🔵 信頼性レベル: NFR-206要件、タスク仕様に基づく

      // 【テストデータ準備】: 標準的なトースト通知 🔵
      // 【初期条件設定】: typeに依存しない共通属性の確認 🔵
      const toast = createToast('info');
      const onClose = vi.fn();

      // 【実際の処理実行】: Toastコンポーネントをレンダリング 🔵
      const { container } = render(<Toast toast={toast} onClose={onClose} />);
      const toastElement = container.firstChild as HTMLElement;

      // 【結果検証】: aria-atomic="true"が設定されていることを確認 🔵
      // 【期待値確認】: トーストメッセージは1つの完全なメッセージとして読み上げるべき 🔵
      expect(toastElement).toHaveAttribute('aria-atomic', 'true');
      // 【確認内容】: 部分更新で読み上げが途切れるのを防ぐ 🔵
    });

    it('閉じるボタンにaria-label="通知を閉じる"が設定される', () => {
      // 【テスト目的】: ボタン要素の明確なラベル付けを確認 🔵
      // 【テスト内容】: 閉じるボタン（×）にわかりやすいARIAラベルが設定されること 🔵
      // 【期待される動作】: スクリーンリーダーが「通知を閉じる、ボタン」と読み上げる 🔵
      // 🔵 信頼性レベル: NFR-206要件、タスク仕様に基づく

      // 【テストデータ準備】: 閉じるボタンが表示される通常のトースト 🔵
      // 【初期条件設定】: ボタン要素のARIA属性確認 🔵
      const toast = createToast('info');
      const onClose = vi.fn();

      // 【実際の処理実行】: Toastコンポーネントをレンダリング 🔵
      render(<Toast toast={toast} onClose={onClose} />);

      // 【結果検証】: aria-labelが「通知を閉じる」に設定されていることを確認 🔵
      // 【期待値確認】: 記号「×」だけでは機能が不明確なので具体的なラベルが必要 🔵
      const closeButton = screen.getByRole('button', { name: '通知を閉じる' });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('type', 'button');
      // 【確認内容】: 既存のaria-label="閉じる"から"通知を閉じる"に変更される 🔵
    });
  });
});
