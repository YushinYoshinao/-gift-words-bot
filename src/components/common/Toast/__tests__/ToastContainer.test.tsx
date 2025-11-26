/**
 * ToastContainer コンポーネントのテスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToastContainer from '../ToastContainer';
import {
  ToastProvider,
  useToast,
} from '../../../../context/ToastContext';

// テストヘルパー: ToastProviderでラップ
const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ToastProvider>{ui}</ToastProvider>);
};

// ToastContextを使うカスタムコンポーネント
const ToastTrigger: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div>
      <button onClick={() => showToast('Success message', 'success')}>
        Show Success
      </button>
      <button onClick={() => showToast('Error message', 'error')}>
        Show Error
      </button>
      <button onClick={() => showToast('Info message', 'info')}>
        Show Info
      </button>
      <ToastContainer />
    </div>
  );
};

describe('ToastContainer', () => {
  it('トーストがない場合は何も表示しない', () => {
    renderWithProvider(<ToastContainer />);

    // コンテナが存在しない
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('1つのトーストが表示される', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ToastTrigger />);

    const showButton = screen.getByRole('button', { name: /Show Success/i });
    await user.click(showButton);

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('複数のトーストが同時に表示される', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ToastTrigger />);

    const successButton = screen.getByRole('button', {
      name: /Show Success/i,
    });
    const errorButton = screen.getByRole('button', { name: /Show Error/i });
    const infoButton = screen.getByRole('button', { name: /Show Info/i });

    await user.click(successButton);
    await user.click(errorButton);
    await user.click(infoButton);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('トーストを閉じると削除される', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ToastTrigger />);

    const showButton = screen.getByRole('button', { name: /Show Success/i });
    await user.click(showButton);

    expect(screen.getByText('Success message')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /閉じる/i });
    await user.click(closeButton);

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('正しい順序でトーストが表示される', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ToastTrigger />);

    const successButton = screen.getByRole('button', {
      name: /Show Success/i,
    });
    const errorButton = screen.getByRole('button', { name: /Show Error/i });

    await user.click(successButton);
    await user.click(errorButton);

    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(2);
    expect(alerts[0]).toHaveTextContent('Success message');
    expect(alerts[1]).toHaveTextContent('Error message');
  });

  it('適切なARIA属性が設定されている', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ToastTrigger />);

    const showButton = screen.getByRole('button', { name: /Show Success/i });
    await user.click(showButton);

    const container = screen.getByText('Success message').parentElement
      ?.parentElement;

    expect(container).toHaveAttribute('aria-live', 'polite');
    expect(container).toHaveAttribute('aria-atomic', 'false');
  });
});
