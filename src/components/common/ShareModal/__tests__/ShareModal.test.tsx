/**
 * ShareModal コンポーネントのテスト
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareModal from '../ShareModal';
import { ToastProvider } from '../../../../context/ToastContext';

// テストヘルパー: ToastProviderでラップ
const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ToastProvider>{ui}</ToastProvider>);
};

// クリップボードAPIのモック
const mockClipboard = () => {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
    writable: true,
    configurable: true,
  });
};

describe('ShareModal', () => {
  beforeEach(() => {
    mockClipboard();
  });

  it('URLが表示される', () => {
    const testUrl = 'https://example.com/display?data=test123';
    const onClose = vi.fn();

    renderWithProvider(<ShareModal url={testUrl} onClose={onClose} />);

    const urlInput = screen.getByDisplayValue(testUrl);
    expect(urlInput).toBeInTheDocument();
  });

  it('コピーボタンをクリックするとクリップボードにコピーされる', async () => {
    const user = userEvent.setup();
    const testUrl = 'https://example.com/display?data=test123';
    const onClose = vi.fn();
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue(undefined);

    renderWithProvider(<ShareModal url={testUrl} onClose={onClose} />);

    const copyButton = screen.getByRole('button', {
      name: /URLをコピー/i,
    });
    await user.click(copyButton);

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalledWith(testUrl);
    });
  });

  it('コピー成功時にボタンテキストが変わる', async () => {
    const user = userEvent.setup();
    const testUrl = 'https://example.com/display?data=test123';
    const onClose = vi.fn();

    renderWithProvider(<ShareModal url={testUrl} onClose={onClose} />);

    const copyButton = screen.getByRole('button', {
      name: /URLをコピー/i,
    });
    await user.click(copyButton);

    await waitFor(() => {
      expect(copyButton).toHaveTextContent(/コピーしました!/i);
    });
  });


  it('閉じるボタンをクリックすると閉じる', () => {
    const testUrl = 'https://example.com/display?data=test123';
    const onClose = vi.fn();

    renderWithProvider(<ShareModal url={testUrl} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: /閉じる/i });
    closeButton.click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('オーバーレイをクリックすると閉じる', () => {
    const testUrl = 'https://example.com/display?data=test123';
    const onClose = vi.fn();

    const { container } = renderWithProvider(
      <ShareModal url={testUrl} onClose={onClose} />
    );

    const overlay = container.querySelector('[class*="overlay"]') as HTMLElement;
    expect(overlay).toBeInTheDocument();

    overlay.click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('適切なARIA属性が設定されている', () => {
    const testUrl = 'https://example.com/display?data=test123';
    const onClose = vi.fn();

    renderWithProvider(<ShareModal url={testUrl} onClose={onClose} />);

    const dialog = screen.getByRole('dialog', {
      name: /共有リンクを生成しました/i,
    });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'share-title');

    const urlInput = screen.getByLabelText(/共有URL/i);
    expect(urlInput).toBeInTheDocument();
  });
});
