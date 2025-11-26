/**
 * Vitestセットアップファイル
 * TASK-0007: Vitest設定
 *
 * 関連要件:
 * - なし（テスト環境の構築）
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// @testing-library/jest-dom matchers を追加
expect.extend(matchers);

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup();
});
