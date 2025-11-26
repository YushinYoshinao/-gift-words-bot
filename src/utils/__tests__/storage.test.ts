import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTutorialShown,
  setTutorialShown,
  clearTutorialShown,
} from '../storage';
import { STORAGE_KEYS } from '../constants';

describe('storage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('getTutorialShown', () => {
    it('should return false when not set', () => {
      expect(getTutorialShown()).toBe(false);
    });

    it('should return true when set to true', () => {
      localStorage.setItem(STORAGE_KEYS.TUTORIAL_SHOWN, 'true');
      expect(getTutorialShown()).toBe(true);
    });

    it('should return false when set to false', () => {
      localStorage.setItem(STORAGE_KEYS.TUTORIAL_SHOWN, 'false');
      expect(getTutorialShown()).toBe(false);
    });

    it('should return false when set to invalid value', () => {
      localStorage.setItem(STORAGE_KEYS.TUTORIAL_SHOWN, 'invalid');
      expect(getTutorialShown()).toBe(false);
    });

    it('should return false when set to empty string', () => {
      localStorage.setItem(STORAGE_KEYS.TUTORIAL_SHOWN, '');
      expect(getTutorialShown()).toBe(false);
    });
  });

  describe('setTutorialShown', () => {
    it('should save true value', () => {
      setTutorialShown(true);
      expect(localStorage.getItem(STORAGE_KEYS.TUTORIAL_SHOWN)).toBe('true');
    });

    it('should save false value', () => {
      setTutorialShown(false);
      expect(localStorage.getItem(STORAGE_KEYS.TUTORIAL_SHOWN)).toBe('false');
    });

    it('should overwrite existing value', () => {
      setTutorialShown(true);
      setTutorialShown(false);
      expect(localStorage.getItem(STORAGE_KEYS.TUTORIAL_SHOWN)).toBe('false');
    });

    it('should persist value', () => {
      setTutorialShown(true);
      expect(getTutorialShown()).toBe(true);
    });
  });

  describe('clearTutorialShown', () => {
    it('should remove the value', () => {
      setTutorialShown(true);
      clearTutorialShown();
      expect(localStorage.getItem(STORAGE_KEYS.TUTORIAL_SHOWN)).toBeNull();
    });

    it('should make getTutorialShown return false after clear', () => {
      setTutorialShown(true);
      clearTutorialShown();
      expect(getTutorialShown()).toBe(false);
    });

    it('should not throw when value does not exist', () => {
      expect(() => clearTutorialShown()).not.toThrow();
    });

    it('should allow setting value again after clear', () => {
      setTutorialShown(true);
      clearTutorialShown();
      setTutorialShown(true);
      expect(getTutorialShown()).toBe(true);
    });
  });
});
