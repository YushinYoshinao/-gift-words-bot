/**
 * Buttonコンポーネントのテスト
 * TASK-0008: CSS Modules設定
 *
 * CSS Modulesの動作確認用テスト
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText('Primary');
    // CSS Modulesはクラス名をハッシュ化するため、className属性の存在のみを確認
    expect(button.className).toBeTruthy();
    expect(button.className).toContain('button');
    expect(button.className).toContain('primary');
  });

  it('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    // CSS Modulesはクラス名をハッシュ化するため、className属性の存在のみを確認
    expect(button.className).toBeTruthy();
    expect(button.className).toContain('button');
    expect(button.className).toContain('secondary');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(clicked).toBe(true);
  });
});
