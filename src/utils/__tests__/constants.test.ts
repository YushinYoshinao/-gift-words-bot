/**
 * 定数のテスト
 * TASK-0007: Vitest設定
 *
 * このテストはVitest設定の動作確認用サンプルです
 */

import { describe, it, expect } from 'vitest';
import { VALIDATION_RULES } from '../../types';

describe('Constants', () => {
  it('should have correct validation rules', () => {
    expect(VALIDATION_RULES.MAX_WORD_LENGTH).toBe(50);
    expect(VALIDATION_RULES.MAX_MEANING_LENGTH).toBe(300);
    expect(VALIDATION_RULES.MAX_URL_LENGTH).toBe(500);
  });

  it('should have positive validation rule values', () => {
    expect(VALIDATION_RULES.MAX_WORD_LENGTH).toBeGreaterThan(0);
    expect(VALIDATION_RULES.MAX_MEANING_LENGTH).toBeGreaterThan(0);
    expect(VALIDATION_RULES.MAX_URL_LENGTH).toBeGreaterThan(0);
  });

  it('should have MAX_MEANING_LENGTH greater than MAX_WORD_LENGTH', () => {
    expect(VALIDATION_RULES.MAX_MEANING_LENGTH).toBeGreaterThan(
      VALIDATION_RULES.MAX_WORD_LENGTH
    );
  });
});
