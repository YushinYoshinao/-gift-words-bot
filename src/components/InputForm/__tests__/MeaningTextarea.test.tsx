import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MeaningTextarea from '../MeaningTextarea';
import { ERROR_MESSAGES } from '../../../utils/constants';

describe('MeaningTextarea', () => {
  it('should render textarea', () => {
    render(<MeaningTextarea value="" onChange={vi.fn()} />);

    const textarea = screen.getByLabelText(/その意味/);
    expect(textarea).toBeInTheDocument();
  });

  it('should display value', () => {
    render(
      <MeaningTextarea
        value="いつも支えてくれてありがとう"
        onChange={vi.fn()}
      />
    );

    const textarea = screen.getByDisplayValue('いつも支えてくれてありがとう');
    expect(textarea).toBeInTheDocument();
  });

  it('should call onChange when typing', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<MeaningTextarea value="" onChange={onChange} />);

    const textarea = screen.getByLabelText(/その意味/);
    await user.type(textarea, 'ありがとう');

    expect(onChange).toHaveBeenCalled();
  });

  it('should enforce maxLength (300 characters)', () => {
    render(<MeaningTextarea value="" onChange={vi.fn()} />);

    const textarea = screen.getByLabelText(/その意味/) as HTMLTextAreaElement;
    expect(textarea.maxLength).toBe(300);
  });

  it('should display character count', () => {
    const text = 'いつも支えてくれてありがとう';
    render(<MeaningTextarea value={text} onChange={vi.fn()} />);

    const expectedCount = `${text.length} / 300`;
    expect(screen.getByText(expectedCount)).toBeInTheDocument();
  });

  it('should display 0 / 300 for empty input', () => {
    render(<MeaningTextarea value="" onChange={vi.fn()} />);

    expect(screen.getByText('0 / 300')).toBeInTheDocument();
  });

  it('should show warning style when less than 30 characters remaining', () => {
    const longText = 'あ'.repeat(280); // 20 characters remaining
    render(<MeaningTextarea value={longText} onChange={vi.fn()} />);

    const charCount = screen.getByText('280 / 300');
    expect(charCount.className).toContain('charCountWarning');
  });

  it('should not show warning style when 30 or more characters remaining', () => {
    const text = 'あ'.repeat(270); // 30 characters remaining
    render(<MeaningTextarea value={text} onChange={vi.fn()} />);

    const charCount = screen.getByText('270 / 300');
    expect(charCount.className).not.toContain('charCountWarning');
  });

  it('should handle text with line breaks', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<MeaningTextarea value="" onChange={onChange} />);

    const textarea = screen.getByLabelText(/その意味/);
    await user.type(textarea, 'Line 1{Enter}Line 2');

    expect(onChange).toHaveBeenCalled();
  });

  it('should display error message', () => {
    render(
      <MeaningTextarea
        value=""
        onChange={vi.fn()}
        error={ERROR_MESSAGES.MEANING_REQUIRED}
      />
    );

    expect(
      screen.getByText(ERROR_MESSAGES.MEANING_REQUIRED)
    ).toBeInTheDocument();
  });

  it('should apply error style when error exists', () => {
    render(
      <MeaningTextarea
        value=""
        onChange={vi.fn()}
        error={ERROR_MESSAGES.MEANING_REQUIRED}
      />
    );

    const textarea = screen.getByLabelText(/その意味/);
    expect(textarea.className).toContain('textareaError');
  });

  it('should have aria-invalid when error exists', () => {
    render(
      <MeaningTextarea
        value=""
        onChange={vi.fn()}
        error={ERROR_MESSAGES.MEANING_REQUIRED}
      />
    );

    const textarea = screen.getByLabelText(/その意味/);
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('should have aria-describedby when error exists', () => {
    render(
      <MeaningTextarea
        value=""
        onChange={vi.fn()}
        error={ERROR_MESSAGES.MEANING_REQUIRED}
      />
    );

    const textarea = screen.getByLabelText(/その意味/);
    expect(textarea).toHaveAttribute('aria-describedby', 'meaning-error');
  });

  it('should show required marker', () => {
    render(<MeaningTextarea value="" onChange={vi.fn()} />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should have placeholder text', () => {
    render(<MeaningTextarea value="" onChange={vi.fn()} />);

    const textarea = screen.getByPlaceholderText(
      '例: いつも支えてくれてありがとう'
    );
    expect(textarea).toBeInTheDocument();
  });

  it('should have 6 rows', () => {
    render(<MeaningTextarea value="" onChange={vi.fn()} />);

    const textarea = screen.getByLabelText(/その意味/) as HTMLTextAreaElement;
    expect(textarea.rows).toBe(6);
  });

  // ========================================
  // TASK-0045: ARIA属性・アクセシビリティ改善
  // ========================================

  describe('ARIA attributes for accessibility (TASK-0045)', () => {
    it('MeaningTextareaにaria-required="true"が設定される', () => {
      // 【テスト目的】: 複数の入力フィールドで統一されたARIA属性設定を確認 🔵
      // 【テスト内容】: MeaningTextareaコンポーネントのtextarea要素にaria-required属性が設定されていること 🔵
      // 【期待される動作】: WordInputと同様に必須項目であることがスクリーンリーダーに伝達される 🔵
      // 🔵 信頼性レベル: NFR-206要件、タスク仕様に基づく

      // 【テストデータ準備】: 標準的なMeaningTextareaコンポーネントの基本レンダリング 🔵
      // 【初期条件設定】: エラーなし、空欄の初期状態 🔵
      render(<MeaningTextarea value="" onChange={vi.fn()} />);

      // 【実際の処理実行】: textarea要素を取得 🔵
      // 【処理内容】: aria-required属性の存在を確認 🔵
      const textarea = screen.getByLabelText(/その意味/);

      // 【結果検証】: aria-required属性が正しく設定されていることを確認 🔵
      // 【期待値確認】: 属性値が文字列"true"であること 🔵
      expect(textarea).toHaveAttribute('aria-required', 'true');
      // 【確認内容】: textarea要素でもWordInputと同じパターンでARIA属性が設定される 🔵
    });

    it('必須マーカー(*)にaria-label="必須"が設定される', () => {
      // 【テスト目的】: フォーム全体で一貫したARIA属性パターンを確認 🔵
      // 【テスト内容】: MeaningTextareaの必須マーカーもWordInputと同様のaria-labelを持つこと 🔵
      // 【期待される動作】: すべての必須項目で統一された音声的意味付け 🔵
      // 🔵 信頼性レベル: NFR-206要件、タスク仕様に基づく

      // 【テストデータ準備】: 必須マーカーが表示される通常の状態 🔵
      // 【初期条件設定】: エラーなし、空欄の初期状態 🔵
      render(<MeaningTextarea value="" onChange={vi.fn()} />);

      // 【実際の処理実行】: aria-labelで必須マーカーを取得 🔵
      // 【処理内容】: スクリーンリーダーが「必須」と読み上げる要素を検索 🔵
      const requiredMarker = screen.getByLabelText('必須');

      // 【結果検証】: 必須マーカーが存在し、正しい内容を持つことを確認 🔵
      // 【期待値確認】: textContentは「*」のまま（視覚的表示は変更しない） 🔵
      expect(requiredMarker).toBeInTheDocument();
      expect(requiredMarker.textContent).toBe('*');
      // 【確認内容】: WordInputとMeaningTextareaで一貫したARIA属性パターン 🔵
    });
  });
});
