/**
 * ToastContext Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';
import { TOAST_CONFIG } from '../../types';

// テスト用コンポーネント
const TestComponent = () => {
  const { toasts, showToast, hideToast } = useToast();

  return (
    <div>
      <div data-testid="toast-count">{toasts.length}</div>
      <button
        onClick={() => showToast('Test message', 'success')}
        data-testid="show-toast"
      >
        Show Toast
      </button>
      <button
        onClick={() => showToast('Error message', 'error', 0)}
        data-testid="show-toast-no-auto-hide"
      >
        Show Toast (No Auto Hide)
      </button>
      {toasts.map((toast) => (
        <div key={toast.id} data-testid="toast-item">
          <span data-testid="toast-message">{toast.message}</span>
          <span data-testid="toast-type">{toast.type}</span>
          <button
            onClick={() => hideToast(toast.id)}
            data-testid="hide-toast"
          >
            Hide
          </button>
        </div>
      ))}
    </div>
  );
};

describe('ToastContext', () => {
  it('トーストを表示できる', () => {
    const { getByTestId, getAllByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // 初期状態は0個
    expect(getByTestId('toast-count').textContent).toBe('0');

    // トーストを表示
    act(() => {
      getByTestId('show-toast').click();
    });

    // トーストが1個表示される
    expect(getByTestId('toast-count').textContent).toBe('1');
    expect(getAllByTestId('toast-item')).toHaveLength(1);
    expect(getAllByTestId('toast-message')[0].textContent).toBe('Test message');
    expect(getAllByTestId('toast-type')[0].textContent).toBe('success');
  });

  it('複数のトーストを表示できる', () => {
    const { getByTestId, getAllByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // 2つのトーストを表示
    act(() => {
      getByTestId('show-toast').click();
      getByTestId('show-toast').click();
    });

    // トーストが2個表示される
    expect(getByTestId('toast-count').textContent).toBe('2');
    expect(getAllByTestId('toast-item')).toHaveLength(2);
  });

  it('トーストを手動で非表示にできる', () => {
    const { getByTestId, getAllByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // トーストを表示
    act(() => {
      getByTestId('show-toast-no-auto-hide').click();
    });

    // トーストが1個表示される
    expect(getByTestId('toast-count').textContent).toBe('1');

    // トーストを非表示
    act(() => {
      getAllByTestId('hide-toast')[0].click();
    });

    // トーストが0個になる
    expect(getByTestId('toast-count').textContent).toBe('0');
  });

  it('トーストが自動的に非表示になる', async () => {
    vi.useFakeTimers();

    const { getByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // トーストを表示（デフォルト3秒で自動削除）
    act(() => {
      getByTestId('show-toast').click();
    });

    // トーストが表示される
    expect(getByTestId('toast-count').textContent).toBe('1');

    // 3秒後にトーストが自動削除される
    await act(async () => {
      vi.advanceTimersByTime(TOAST_CONFIG.DEFAULT_DURATION);
      await vi.runAllTimersAsync();
    });

    expect(getByTestId('toast-count').textContent).toBe('0');

    vi.useRealTimers();
  });

  it('duration=0のトーストは自動削除されない', async () => {
    vi.useFakeTimers();

    const { getByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // トーストを表示（duration=0）
    act(() => {
      getByTestId('show-toast-no-auto-hide').click();
    });

    // トーストが表示される
    expect(getByTestId('toast-count').textContent).toBe('1');

    // 10秒経過してもトーストは残る
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(getByTestId('toast-count').textContent).toBe('1');

    vi.useRealTimers();
  });

  it('Provider外での使用時にエラーがスローされる', () => {
    // エラーを抑制
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within ToastProvider');

    console.error = consoleError;
  });
});
