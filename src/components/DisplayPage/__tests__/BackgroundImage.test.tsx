/**
 * BackgroundImage コンポーネントのテスト
 * TASK-0028: BackgroundImage完全実装
 *
 * テスト対象:
 * - REQ-201: 武田鉄矢の画像を背景として表示 🔵
 * - REQ-202: 画像を右側〜中央に配置 🔵
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BackgroundImage from '../BackgroundImage';

describe('BackgroundImage - TASK-0028', () => {
  it('画像が表示される', () => {
    render(<BackgroundImage />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
  });

  it('画像パスが正しい', () => {
    render(<BackgroundImage />);
    const img = screen.getByRole('img') as HTMLImageElement;
    // URL encodeされた形式も含めてチェック
    expect(img.src).toMatch(/武田鉄矢\.png|%E6%AD%A6%E7%94%B0%E9%89%84%E7%9F%A2\.png/);
  });

  it('alt属性が設定されている', () => {
    render(<BackgroundImage />);
    const img = screen.getByAltText('武田鉄矢');
    expect(img).toBeInTheDocument();
  });

  it('loading属性がeagerに設定されている', () => {
    render(<BackgroundImage />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('decoding属性がasyncに設定されている', () => {
    render(<BackgroundImage />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toHaveAttribute('decoding', 'async');
  });
});
