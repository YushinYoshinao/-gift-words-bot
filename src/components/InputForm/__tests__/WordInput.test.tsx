import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WordInput from '../WordInput';
import { ERROR_MESSAGES } from '../../../utils/constants';

describe('WordInput', () => {
  it('should render input field', () => {
    render(<WordInput value="" onChange={vi.fn()} />);

    const input = screen.getByLabelText(/贈りたい言葉/);
    expect(input).toBeInTheDocument();
  });

  it('should display value', () => {
    render(<WordInput value="感謝" onChange={vi.fn()} />);

    const input = screen.getByDisplayValue('感謝');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when typing', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<WordInput value="" onChange={onChange} />);

    const input = screen.getByLabelText(/贈りたい言葉/);
    await user.type(input, '感謝');

    expect(onChange).toHaveBeenCalled();
  });

  it('should enforce maxLength (50 characters)', () => {
    render(<WordInput value="" onChange={vi.fn()} />);

    const input = screen.getByLabelText(/贈りたい言葉/) as HTMLInputElement;
    expect(input.maxLength).toBe(50);
  });

  it('should display character count', () => {
    render(<WordInput value="感謝" onChange={vi.fn()} />);

    expect(screen.getByText('2 / 50')).toBeInTheDocument();
  });

  it('should display 0 / 50 for empty input', () => {
    render(<WordInput value="" onChange={vi.fn()} />);

    expect(screen.getByText('0 / 50')).toBeInTheDocument();
  });

  it('should show warning style when less than 10 characters remaining', () => {
    const longText = 'あ'.repeat(45); // 5 characters remaining
    render(<WordInput value={longText} onChange={vi.fn()} />);

    const charCount = screen.getByText('45 / 50');
    expect(charCount.className).toContain('charCountWarning');
  });

  it('should not show warning style when 10 or more characters remaining', () => {
    const text = 'あ'.repeat(40); // 10 characters remaining
    render(<WordInput value={text} onChange={vi.fn()} />);

    const charCount = screen.getByText('40 / 50');
    expect(charCount.className).not.toContain('charCountWarning');
  });

  it('should display error message', () => {
    render(
      <WordInput
        value=""
        onChange={vi.fn()}
        error={ERROR_MESSAGES.WORD_REQUIRED}
      />
    );

    expect(screen.getByText(ERROR_MESSAGES.WORD_REQUIRED)).toBeInTheDocument();
  });

  it('should apply error style when error exists', () => {
    render(
      <WordInput
        value=""
        onChange={vi.fn()}
        error={ERROR_MESSAGES.WORD_REQUIRED}
      />
    );

    const input = screen.getByLabelText(/贈りたい言葉/);
    expect(input.className).toContain('inputError');
  });

  it('should have aria-invalid when error exists', () => {
    render(
      <WordInput
        value=""
        onChange={vi.fn()}
        error={ERROR_MESSAGES.WORD_REQUIRED}
      />
    );

    const input = screen.getByLabelText(/贈りたい言葉/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should have aria-describedby when error exists', () => {
    render(
      <WordInput
        value=""
        onChange={vi.fn()}
        error={ERROR_MESSAGES.WORD_REQUIRED}
      />
    );

    const input = screen.getByLabelText(/贈りたい言葉/);
    expect(input).toHaveAttribute('aria-describedby', 'word-error');
  });

  it('should show required marker', () => {
    render(<WordInput value="" onChange={vi.fn()} />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should have placeholder text', () => {
    render(<WordInput value="" onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText('例: 感謝');
    expect(input).toBeInTheDocument();
  });

  // ========================================
  // TASK-0045: ARIA属性・アクセシビリティ改善
  // ========================================

  describe('ARIA attributes for accessibility (TASK-0045)', () => {
    it('WordInputにaria-required="true"が設定される', () => {
      // 【テスト目的】: 必須項目のARIA属性が正しく設定されていることを確認 🔵
      // 【テスト内容】: WordInputコンポーネントのinput要素にaria-required属性が設定されていること 🔵
      // 【期待される動作】: スクリーンリーダーが必須項目を認識できること 🔵
      // 🔵 信頼性レベル: NFR-206要件、タスク仕様に基づく

      // 【テストデータ準備】: 標準的なWordInputコンポーネントの基本レンダリング 🔵
      // 【初期条件設定】: propsは最小限（valueとonChangeのみ） 🔵
      render(<WordInput value="" onChange={vi.fn()} />);

      // 【実際の処理実行】: input要素を取得 🔵
      // 【処理内容】: aria-required属性の存在を確認 🔵
      const input = screen.getByLabelText(/贈りたい言葉/);

      // 【結果検証】: aria-required属性が正しく設定されていることを確認 🔵
      // 【期待値確認】: 属性値が文字列"true"であること 🔵
      expect(input).toHaveAttribute('aria-required', 'true');
      // 【確認内容】: 必須項目であることがスクリーンリーダーに伝達される 🔵
    });

    it('必須マーカー(*)にaria-label="必須"が設定される', () => {
      // 【テスト目的】: 視覚記号に対する適切なARIAラベル付与を確認 🔵
      // 【テスト内容】: アスタリスク「*」がスクリーンリーダーで「必須」と読み上げられること 🔵
      // 【期待される動作】: 視覚的マーカーに音声的意味が付与されていること 🔵
      // 🔵 信頼性レベル: NFR-206要件、タスク仕様に基づく

      // 【テストデータ準備】: 必須マーカーが表示される通常の状態 🔵
      // 【初期条件設定】: エラーなし、空欄の初期状態 🔵
      render(<WordInput value="" onChange={vi.fn()} />);

      // 【実際の処理実行】: aria-labelで必須マーカーを取得 🔵
      // 【処理内容】: スクリーンリーダーが「必須」と読み上げる要素を検索 🔵
      const requiredMarker = screen.getByLabelText('必須');

      // 【結果検証】: 必須マーカーが存在し、正しい内容を持つことを確認 🔵
      // 【期待値確認】: textContentは「*」のまま（視覚的表示は変更しない） 🔵
      expect(requiredMarker).toBeInTheDocument();
      expect(requiredMarker.textContent).toBe('*');
      // 【確認内容】: 視覚的記号「*」に音声的意味「必須」が付与されている 🔵
    });
  });
});
