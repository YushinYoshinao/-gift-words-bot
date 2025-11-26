/**
 * InputForm コンポーネントのテスト
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputForm from '../InputForm';
import { ToastProvider } from '../../../context/ToastContext';

// テストヘルパー: Providerでラップ
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ToastProvider>{ui}</ToastProvider>);
};

describe('InputForm', () => {
  it('フォームが正常にレンダリングされる', () => {
    renderWithProviders(<InputForm />);

    expect(
      screen.getByLabelText(/贈りたい言葉/i, { selector: 'input' })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/その意味/i, { selector: 'textarea' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /共有リンクを生成/i })
    ).toBeInTheDocument();
  });

  it('送信ボタンが表示される', () => {
    renderWithProviders(<InputForm />);

    const button = screen.getByRole('button', { name: /共有リンクを生成/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('空欄で送信するとエラーが表示される', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InputForm />);

    const submitButton = screen.getByRole('button', {
      name: /共有リンクを生成/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/言葉を入力してください/i)).toBeInTheDocument();
      expect(screen.getByText(/意味を入力してください/i)).toBeInTheDocument();
    });
  });

  it('正常な入力で送信するとURLが生成される', async () => {
    const user = userEvent.setup();
    const onShareUrlGenerated = vi.fn();

    renderWithProviders(
      <InputForm onShareUrlGenerated={onShareUrlGenerated} />
    );

    const wordInput = screen.getByLabelText(/贈りたい言葉/i, {
      selector: 'input',
    });
    const meaningInput = screen.getByLabelText(/その意味/i, {
      selector: 'textarea',
    });
    const submitButton = screen.getByRole('button', {
      name: /共有リンクを生成/i,
    });

    await user.type(wordInput, '感謝');
    await user.type(meaningInput, 'いつも支えてくれてありがとう');
    await user.click(submitButton);

    await waitFor(() => {
      expect(onShareUrlGenerated).toHaveBeenCalledTimes(1);
      expect(onShareUrlGenerated).toHaveBeenCalledWith(
        expect.stringContaining('#/display?data=')
      );
    });
  });

  it('送信処理が正常に完了する', async () => {
    const user = userEvent.setup();
    const onShareUrlGenerated = vi.fn();

    renderWithProviders(
      <InputForm onShareUrlGenerated={onShareUrlGenerated} />
    );

    const wordInput = screen.getByLabelText(/贈りたい言葉/i, {
      selector: 'input',
    });
    const meaningInput = screen.getByLabelText(/その意味/i, {
      selector: 'textarea',
    });
    const submitButton = screen.getByRole('button', {
      name: /共有リンクを生成/i,
    });

    await user.type(wordInput, '感謝');
    await user.type(meaningInput, 'いつも支えてくれてありがとう');
    await user.click(submitButton);

    // 完了後はボタンが再度有効化される
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(onShareUrlGenerated).toHaveBeenCalled();
    });
  });

  it('言葉のみ空欄の場合は言葉のみエラー', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InputForm />);

    const meaningInput = screen.getByLabelText(/その意味/i, {
      selector: 'textarea',
    });
    const submitButton = screen.getByRole('button', {
      name: /共有リンクを生成/i,
    });

    await user.type(meaningInput, 'いつも支えてくれてありがとう');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/言葉を入力してください/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/意味を入力してください/i)
      ).not.toBeInTheDocument();
    });
  });

  it('意味のみ空欄の場合は意味のみエラー', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InputForm />);

    const wordInput = screen.getByLabelText(/贈りたい言葉/i, {
      selector: 'input',
    });
    const submitButton = screen.getByRole('button', {
      name: /共有リンクを生成/i,
    });

    await user.type(wordInput, '感謝');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/言葉を入力してください/i)
      ).not.toBeInTheDocument();
      expect(screen.getByText(/意味を入力してください/i)).toBeInTheDocument();
    });
  });
});
