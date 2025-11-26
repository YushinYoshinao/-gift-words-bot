/**
 * バリデーション関数
 *
 * フォーム入力のバリデーションを行います。
 * REQ-011-015: バリデーション
 */

import { VALIDATION_RULES } from '../types';
import { ValidationErrors } from '../types';
import { ERROR_MESSAGES } from './constants';

/**
 * 言葉のバリデーション
 * REQ-011: 空欄チェック
 * REQ-013: 文字数制限チェック
 */
export const validateWord = (word: string): string | undefined => {
  const trimmedWord = word.trim();

  // REQ-011: 空欄チェック
  if (!trimmedWord) {
    return ERROR_MESSAGES.WORD_REQUIRED;
  }

  // REQ-013: 文字数制限チェック
  if (word.length > VALIDATION_RULES.MAX_WORD_LENGTH) {
    return ERROR_MESSAGES.WORD_TOO_LONG;
  }

  return undefined;
};

/**
 * 意味のバリデーション
 * REQ-012: 空欄チェック
 * REQ-014: 文字数制限チェック
 */
export const validateMeaning = (meaning: string): string | undefined => {
  const trimmedMeaning = meaning.trim();

  // REQ-012: 空欄チェック
  if (!trimmedMeaning) {
    return ERROR_MESSAGES.MEANING_REQUIRED;
  }

  // REQ-014: 文字数制限チェック
  if (meaning.length > VALIDATION_RULES.MAX_MEANING_LENGTH) {
    return ERROR_MESSAGES.MEANING_TOO_LONG;
  }

  return undefined;
};

/**
 * フォーム全体のバリデーション
 * REQ-011, REQ-012, REQ-013, REQ-014
 */
export const validateForm = (
  word: string,
  meaning: string
): ValidationErrors => {
  return {
    word: validateWord(word),
    meaning: validateMeaning(meaning),
  };
};

/**
 * フォームが有効かチェック
 */
export const isFormValid = (errors: ValidationErrors): boolean => {
  return !errors.word && !errors.meaning;
};
