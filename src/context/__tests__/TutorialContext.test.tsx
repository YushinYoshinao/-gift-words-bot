/**
 * TutorialContext Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TutorialProvider, useTutorial } from '../TutorialContext';
import { STORAGE_KEYS } from '../../utils/constants';

// テスト用コンポーネント
const TestComponent = () => {
  const { isFirstVisit, showTutorial, closeTutorial } = useTutorial();

  return (
    <div>
      <div data-testid="first-visit">{isFirstVisit ? 'true' : 'false'}</div>
      <div data-testid="show-tutorial">{showTutorial ? 'true' : 'false'}</div>
      <button onClick={closeTutorial} data-testid="close-button">
        Close
      </button>
    </div>
  );
};

describe('TutorialContext', () => {
  beforeEach(() => {
    // localStorageをクリア
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('初回訪問時にチュートリアルが表示される', () => {
    render(
      <TutorialProvider>
        <TestComponent />
      </TutorialProvider>
    );

    expect(screen.getByTestId('first-visit').textContent).toBe('true');
    expect(screen.getByTestId('show-tutorial').textContent).toBe('true');
  });

  it('2回目以降の訪問時にチュートリアルが表示されない', () => {
    // 既にチュートリアルを見たことにする
    localStorage.setItem(STORAGE_KEYS.TUTORIAL_SHOWN, 'true');

    render(
      <TutorialProvider>
        <TestComponent />
      </TutorialProvider>
    );

    expect(screen.getByTestId('first-visit').textContent).toBe('false');
    expect(screen.getByTestId('show-tutorial').textContent).toBe('false');
  });

  it('closeTutorialでチュートリアルが閉じられる', () => {
    const { getByTestId } = render(
      <TutorialProvider>
        <TestComponent />
      </TutorialProvider>
    );

    // 初回訪問時はtrue
    expect(getByTestId('show-tutorial').textContent).toBe('true');

    // ボタンクリックで閉じる
    act(() => {
      getByTestId('close-button').click();
    });

    // チュートリアルが閉じられる
    expect(getByTestId('show-tutorial').textContent).toBe('false');
    expect(getByTestId('first-visit').textContent).toBe('false');

    // localStorageに保存される
    expect(localStorage.getItem(STORAGE_KEYS.TUTORIAL_SHOWN)).toBe('true');
  });

  it('Provider外での使用時にエラーがスローされる', () => {
    // エラーを抑制
    const consoleError = console.error;
    console.error = () => {};

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTutorial must be used within TutorialProvider');

    console.error = consoleError;
  });
});
