import { describe, it, expect, beforeEach, vi } from 'vitest';
import { copyToClipboard, isClipboardAvailable } from '../clipboard';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';

describe('clipboard', () => {
  describe('copyToClipboard', () => {
    beforeEach(() => {
      // Reset mocks
      vi.restoreAllMocks();
    });

    it('should copy text using Clipboard API', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const result = await copyToClipboard('test text');

      expect(result.success).toBe(true);
      expect(result.message).toBe(SUCCESS_MESSAGES.URL_COPIED);
      expect(mockWriteText).toHaveBeenCalledWith('test text');
    });

    it('should copy URL successfully', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const url = 'https://example.com/share?data=abc123';
      const result = await copyToClipboard(url);

      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(url);
    });

    it('should handle empty string', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const result = await copyToClipboard('');

      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('');
    });

    it('should handle long text', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const longText = 'a'.repeat(10000);
      const result = await copyToClipboard(longText);

      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(longText);
    });

    it('should handle special characters', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const specialText = '特殊文字 & "quotes" <tags>';
      const result = await copyToClipboard(specialText);

      expect(result.success).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(specialText);
    });

    it('should return error when Clipboard API fails', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Permission denied'));
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const result = await copyToClipboard('test');

      expect(result.success).toBe(false);
      expect(result.message).toBe(ERROR_MESSAGES.COPY_FAILED);
    });

    it('should use fallback when Clipboard API is unavailable', async () => {
      // Mock no Clipboard API
      Object.assign(navigator, {
        clipboard: undefined,
      });

      // Mock document.execCommand
      const mockExecCommand = vi.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const result = await copyToClipboard('test text');

      expect(result.success).toBe(true);
      expect(result.message).toBe(SUCCESS_MESSAGES.URL_COPIED);
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
    });

    it('should return error when fallback fails', async () => {
      // Mock no Clipboard API
      Object.assign(navigator, {
        clipboard: undefined,
      });

      // Mock failed execCommand
      const mockExecCommand = vi.fn().mockReturnValue(false);
      document.execCommand = mockExecCommand;

      const result = await copyToClipboard('test');

      expect(result.success).toBe(false);
      expect(result.message).toBe(ERROR_MESSAGES.COPY_FAILED);
    });
  });

  describe('isClipboardAvailable', () => {
    it('should return true when Clipboard API is available', () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(),
        },
      });

      expect(isClipboardAvailable()).toBe(true);
    });

    it('should return false when Clipboard API is unavailable', () => {
      Object.assign(navigator, {
        clipboard: undefined,
      });

      expect(isClipboardAvailable()).toBe(false);
    });

    it('should return false when writeText is missing', () => {
      Object.assign(navigator, {
        clipboard: {},
      });

      expect(isClipboardAvailable()).toBe(false);
    });
  });
});
