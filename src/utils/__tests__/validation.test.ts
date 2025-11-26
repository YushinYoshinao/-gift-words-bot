import { describe, it, expect } from 'vitest';
import {
  validateWord,
  validateMeaning,
  validateForm,
  isFormValid,
} from '../validation';
import { ERROR_MESSAGES } from '../constants';

describe('validation', () => {
  describe('validateWord', () => {
    it('should return undefined for valid word', () => {
      expect(validateWord('感謝')).toBeUndefined();
      expect(validateWord('ありがとう')).toBeUndefined();
      expect(validateWord('Hello World')).toBeUndefined();
    });

    it('should return error for empty string', () => {
      expect(validateWord('')).toBe(ERROR_MESSAGES.WORD_REQUIRED);
    });

    it('should return error for whitespace only', () => {
      expect(validateWord('   ')).toBe(ERROR_MESSAGES.WORD_REQUIRED);
      expect(validateWord('\t\n  ')).toBe(ERROR_MESSAGES.WORD_REQUIRED);
    });

    it('should accept exactly 50 characters', () => {
      const word50 = 'あ'.repeat(50);
      expect(validateWord(word50)).toBeUndefined();
    });

    it('should return error for 51 characters or more', () => {
      const word51 = 'あ'.repeat(51);
      expect(validateWord(word51)).toBe(ERROR_MESSAGES.WORD_TOO_LONG);
    });

    it('should handle emoji characters', () => {
      expect(validateWord('感謝😊')).toBeUndefined();
    });

    it('should handle mixed Japanese and English', () => {
      expect(validateWord('感謝 Thank you')).toBeUndefined();
    });
  });

  describe('validateMeaning', () => {
    it('should return undefined for valid meaning', () => {
      expect(validateMeaning('いつも支えてくれてありがとう')).toBeUndefined();
      expect(validateMeaning('Thank you for everything')).toBeUndefined();
    });

    it('should return error for empty string', () => {
      expect(validateMeaning('')).toBe(ERROR_MESSAGES.MEANING_REQUIRED);
    });

    it('should return error for whitespace only', () => {
      expect(validateMeaning('   ')).toBe(ERROR_MESSAGES.MEANING_REQUIRED);
      expect(validateMeaning('\t\n  ')).toBe(ERROR_MESSAGES.MEANING_REQUIRED);
    });

    it('should accept exactly 300 characters', () => {
      const meaning300 = 'あ'.repeat(300);
      expect(validateMeaning(meaning300)).toBeUndefined();
    });

    it('should return error for 301 characters or more', () => {
      const meaning301 = 'あ'.repeat(301);
      expect(validateMeaning(meaning301)).toBe(
        ERROR_MESSAGES.MEANING_TOO_LONG
      );
    });

    it('should handle text with line breaks', () => {
      const multiLine = 'いつも支えてくれて\nありがとう';
      expect(validateMeaning(multiLine)).toBeUndefined();
    });

    it('should handle emoji characters', () => {
      expect(validateMeaning('感謝の気持ち😊🎉')).toBeUndefined();
    });
  });

  describe('validateForm', () => {
    it('should return errors for both fields when empty', () => {
      const errors = validateForm('', '');
      expect(errors.word).toBe(ERROR_MESSAGES.WORD_REQUIRED);
      expect(errors.meaning).toBe(ERROR_MESSAGES.MEANING_REQUIRED);
    });

    it('should return word error when word is empty', () => {
      const errors = validateForm('', 'いつも支えてくれてありがとう');
      expect(errors.word).toBe(ERROR_MESSAGES.WORD_REQUIRED);
      expect(errors.meaning).toBeUndefined();
    });

    it('should return meaning error when meaning is empty', () => {
      const errors = validateForm('感謝', '');
      expect(errors.word).toBeUndefined();
      expect(errors.meaning).toBe(ERROR_MESSAGES.MEANING_REQUIRED);
    });

    it('should return no errors for valid input', () => {
      const errors = validateForm('感謝', 'いつも支えてくれてありがとう');
      expect(errors.word).toBeUndefined();
      expect(errors.meaning).toBeUndefined();
    });

    it('should return errors for both fields when too long', () => {
      const word51 = 'あ'.repeat(51);
      const meaning301 = 'あ'.repeat(301);
      const errors = validateForm(word51, meaning301);
      expect(errors.word).toBe(ERROR_MESSAGES.WORD_TOO_LONG);
      expect(errors.meaning).toBe(ERROR_MESSAGES.MEANING_TOO_LONG);
    });
  });

  describe('isFormValid', () => {
    it('should return true when no errors', () => {
      expect(isFormValid({})).toBe(true);
      expect(
        isFormValid({ word: undefined, meaning: undefined })
      ).toBe(true);
    });

    it('should return false when word error exists', () => {
      expect(
        isFormValid({ word: ERROR_MESSAGES.WORD_REQUIRED })
      ).toBe(false);
    });

    it('should return false when meaning error exists', () => {
      expect(
        isFormValid({ meaning: ERROR_MESSAGES.MEANING_REQUIRED })
      ).toBe(false);
    });

    it('should return false when both errors exist', () => {
      expect(
        isFormValid({
          word: ERROR_MESSAGES.WORD_REQUIRED,
          meaning: ERROR_MESSAGES.MEANING_REQUIRED,
        })
      ).toBe(false);
    });
  });
});
