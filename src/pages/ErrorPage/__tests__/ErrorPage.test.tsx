/**
 * ErrorPage コンポーネントのテスト
 * TASK-0027: ErrorPage詳細実装
 *
 * テスト対象:
 * - REQ-211: 不正なURLパラメータ時のエラーページ 🟡
 * - REQ-213: 分かりやすいエラーメッセージ 🟡
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ErrorPage from '../ErrorPage';

const renderErrorPage = (props = {}) => {
  return render(
    <MemoryRouter>
      <ErrorPage {...props} />
    </MemoryRouter>
  );
};

describe('ErrorPage - TASK-0027', () => {
  it('デフォルトメッセージが表示される', () => {
    renderErrorPage();
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    expect(screen.getByText('データの読み込みに失敗しました')).toBeInTheDocument();
  });

  it('カスタムエラーメッセージが表示される', () => {
    const customMessage = '不正なURLパラメータです';
    renderErrorPage({ message: customMessage });
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('トップページに戻るボタンが表示される', () => {
    renderErrorPage();
    const button = screen.getByRole('button', { name: /トップページに戻る/i });
    expect(button).toBeInTheDocument();
  });

  it('showHomeButton=falseの場合はボタンが非表示', () => {
    renderErrorPage({ showHomeButton: false });
    const button = screen.queryByRole('button', { name: /トップページに戻る/i });
    expect(button).not.toBeInTheDocument();
  });

  it('提案リストが表示される', () => {
    renderErrorPage();
    expect(screen.getByText('以下をお試しください:')).toBeInTheDocument();
    expect(screen.getByText(/URLが正しいか確認してください/i)).toBeInTheDocument();
    expect(screen.getByText(/リンクを送ってくれた友達に確認してください/i)).toBeInTheDocument();
    expect(screen.getByText(/新しい言葉を作成してみてください/i)).toBeInTheDocument();
  });

  it('エラーアイコンが表示される', () => {
    renderErrorPage();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
});
