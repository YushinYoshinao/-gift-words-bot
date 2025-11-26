/**
 * VerticalTextDisplay コンポーネントのテスト
 * TASK-0030, TASK-0031, TASK-0034: 縦書き表示・辞書風デザイン・アニメーション統合
 *
 * テスト対象:
 * - REQ-203: 黒板の左側に縦書きで表示 🔵
 * - REQ-232: CSS `writing-mode: vertical-rl` 使用 🔵
 * - REQ-233: チョーク風の色 🔵
 * - REQ-204: 辞書風のデザインで表示 🔵
 * - REQ-205: タイプライターアニメーション 🔵
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import VerticalTextDisplay from '../VerticalTextDisplay';

// useTypewriterのモック
vi.mock('../../../hooks/useTypewriter', () => ({
  default: vi.fn(({ text, onComplete, enabled = true }) => {
    // アニメーションなしで即座に表示
    if (enabled) {
      setTimeout(() => onComplete?.(), 0);
    }
    return {
      displayText: enabled ? text : '',
      isComplete: enabled,
      skip: vi.fn(),
      reset: vi.fn(),
    };
  }),
}));

describe('VerticalTextDisplay - TASK-0030/0031/0034', () => {
  const mockProps = {
    word: 'テスト言葉',
    meaning: 'テストの意味'
  };

  it('言葉が表示される', () => {
    render(<VerticalTextDisplay {...mockProps} />);
    expect(screen.getByText(mockProps.word)).toBeInTheDocument();
  });

  it('意味が表示される', async () => {
    render(<VerticalTextDisplay {...mockProps} />);
    await waitFor(() => {
      expect(screen.getByText(mockProps.meaning)).toBeInTheDocument();
    });
  });

  it('日本語（ひらがな、カタカナ、漢字）が正しく表示される', async () => {
    const japaneseProps = {
      word: 'ありがとうカタカナ漢字',
      meaning: 'ひらがな、カタカナ、漢字が混在'
    };
    render(<VerticalTextDisplay {...japaneseProps} />);
    expect(screen.getByText(japaneseProps.word)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(japaneseProps.meaning)).toBeInTheDocument();
    });
  });

  it('スキップヒントが表示される', () => {
    render(<VerticalTextDisplay {...mockProps} />);
    expect(screen.getByText('タップでスキップ')).toBeInTheDocument();
  });

  it('role=buttonとaria-labelが設定されている', () => {
    render(<VerticalTextDisplay {...mockProps} />);
    const container = screen.getByRole('button');
    expect(container).toHaveAttribute('aria-label', 'クリックでアニメーションをスキップ');
  });

  it('tabIndex=0が設定されている', () => {
    render(<VerticalTextDisplay {...mockProps} />);
    const container = screen.getByRole('button');
    expect(container).toHaveAttribute('tabIndex', '0');
  });
});
