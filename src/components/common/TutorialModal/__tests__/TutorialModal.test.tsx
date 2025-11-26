/**
 * TutorialModal コンポーネントのテスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TutorialModal from '../TutorialModal';
import { TutorialProvider } from '../../../../context/TutorialContext';

// テストヘルパー: TutorialProviderでラップ
const renderWithProvider = (ui: React.ReactElement) => {
  return render(<TutorialProvider>{ui}</TutorialProvider>);
};

describe('TutorialModal', () => {
  beforeEach(() => {
    // LocalStorageをクリア
    localStorage.clear();
  });

  it('showTutorial=trueの場合に表示される', () => {
    renderWithProvider(<TutorialModal />);

    expect(
      screen.getByRole('dialog', { name: /贈る言葉BOTの使い方/i })
    ).toBeInTheDocument();
  });

  it('チュートリアル内容が表示される', () => {
    renderWithProvider(<TutorialModal />);

    expect(
      screen.getByText(/贈りたい言葉とその意味を入力してください/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/「共有リンクを生成」ボタンをクリック/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/生成されたリンクを友達に送って言葉を贈りましょう!/i)
    ).toBeInTheDocument();
  });

  it('「わかりました」ボタンをクリックすると閉じる', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TutorialModal />);

    const button = screen.getByRole('button', { name: /わかりました/i });
    await user.click(button);

    // モーダルが非表示になる
    expect(
      screen.queryByRole('dialog', { name: /贈る言葉BOTの使い方/i })
    ).not.toBeInTheDocument();
  });

  it('オーバーレイをクリックすると閉じる', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProvider(<TutorialModal />);

    const overlay = container.querySelector('[class*="overlay"]');
    expect(overlay).toBeInTheDocument();

    if (overlay) {
      await user.click(overlay);
    }

    // モーダルが非表示になる
    expect(
      screen.queryByRole('dialog', { name: /贈る言葉BOTの使い方/i })
    ).not.toBeInTheDocument();
  });

  it('閉じた後はLocalStorageに保存される', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TutorialModal />);

    const button = screen.getByRole('button', { name: /わかりました/i });
    await user.click(button);

    // LocalStorageに保存されている
    expect(localStorage.getItem('tutorial_shown')).toBe('true');
  });

  it('適切なARIA属性が設定されている', () => {
    renderWithProvider(<TutorialModal />);

    const dialog = screen.getByRole('dialog', {
      name: /贈る言葉BOTの使い方/i,
    });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'tutorial-title');
  });
});
