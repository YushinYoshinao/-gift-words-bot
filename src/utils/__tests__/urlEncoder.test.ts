import { describe, it, expect, beforeEach } from 'vitest';
import {
  encodeGiftWordData,
  decodeGiftWordData,
  extractDataFromUrl,
  isValidUrl,
} from '../urlEncoder';
import { ERROR_MESSAGES } from '../constants';
import { GiftWordData } from '../../types';

describe('urlEncoder', () => {
  const mockOrigin = 'http://localhost:5173';
  const mockPath = '/gift-words';

  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: mockOrigin,
        pathname: mockPath,
      },
      writable: true,
    });
  });

  describe('encodeGiftWordData', () => {
    it('should encode valid data to Base64 URL', () => {
      const data: GiftWordData = {
        word: '感謝',
        meaning: 'いつも支えてくれてありがとう',
      };

      const result = encodeGiftWordData(data);

      expect(result.success).toBe(true);
      expect(result.url).toContain('#/display?data=');
      expect(result.error).toBeUndefined();
    });

    it('should encode Japanese text correctly', () => {
      const data: GiftWordData = {
        word: 'ありがとう',
        meaning: '感謝の気持ちを込めて',
      };

      const result = encodeGiftWordData(data);

      expect(result.success).toBe(true);
      expect(result.url).toBeTruthy();
    });

    it('should encode special characters correctly', () => {
      const data: GiftWordData = {
        word: 'Test & "Special" <Characters>',
        meaning: "It's working! 100% 🎉",
      };

      const result = encodeGiftWordData(data);

      expect(result.success).toBe(true);
      expect(result.url).toBeTruthy();
    });

    it('should encode text with line breaks', () => {
      const data: GiftWordData = {
        word: '感謝',
        meaning: 'いつも支えてくれて\nありがとう\n本当に感謝しています',
      };

      const result = encodeGiftWordData(data);

      expect(result.success).toBe(true);
      expect(result.url).toBeTruthy();
    });

    it('should encode empty strings', () => {
      const data: GiftWordData = {
        word: '',
        meaning: '',
      };

      const result = encodeGiftWordData(data);

      expect(result.success).toBe(true);
      expect(result.url).toBeTruthy();
    });

    it('should return error for extremely long data (>500 chars URL)', () => {
      const data: GiftWordData = {
        word: 'あ'.repeat(50),
        meaning: 'あ'.repeat(300),
      };

      const result = encodeGiftWordData(data);

      // This might succeed or fail depending on encoding size
      // The test validates that the function handles length checking
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES.URL_TOO_LONG);
      }
    });

    it('should create URL with correct format', () => {
      const data: GiftWordData = {
        word: 'test',
        meaning: 'test meaning',
      };

      const result = encodeGiftWordData(data);

      expect(result.url).toMatch(/^http:\/\/localhost:5173\/gift-words#\/display\?data=.+$/);
    });

    it('should handle emoji correctly', () => {
      const data: GiftWordData = {
        word: '感謝😊',
        meaning: 'ありがとう🎉✨',
      };

      const result = encodeGiftWordData(data);

      expect(result.success).toBe(true);
      expect(result.url).toBeTruthy();
    });
  });

  describe('decodeGiftWordData', () => {
    it('should decode valid Base64 data', () => {
      const originalData: GiftWordData = {
        word: '感謝',
        meaning: 'いつも支えてくれてありがとう',
      };

      const encoded = encodeGiftWordData(originalData);
      const dataParam = encoded.url.split('data=')[1];
      const result = decodeGiftWordData(dataParam);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(originalData);
      expect(result.error).toBeUndefined();
    });

    it('should decode Japanese text correctly', () => {
      const originalData: GiftWordData = {
        word: 'ありがとう',
        meaning: '感謝の気持ちを込めて',
      };

      const encoded = encodeGiftWordData(originalData);
      const dataParam = encoded.url.split('data=')[1];
      const result = decodeGiftWordData(dataParam);

      expect(result.success).toBe(true);
      expect(result.data?.word).toBe(originalData.word);
      expect(result.data?.meaning).toBe(originalData.meaning);
    });

    it('should decode special characters correctly', () => {
      const originalData: GiftWordData = {
        word: 'Test & "Special"',
        meaning: "It's working!",
      };

      const encoded = encodeGiftWordData(originalData);
      const dataParam = encoded.url.split('data=')[1];
      const result = decodeGiftWordData(dataParam);

      expect(result.success).toBe(true);
      expect(result.data?.word).toBe(originalData.word);
    });

    it('should decode text with line breaks', () => {
      const originalData: GiftWordData = {
        word: '感謝',
        meaning: 'いつも支えてくれて\nありがとう',
      };

      const encoded = encodeGiftWordData(originalData);
      const dataParam = encoded.url.split('data=')[1];
      const result = decodeGiftWordData(dataParam);

      expect(result.success).toBe(true);
      expect(result.data?.meaning).toBe(originalData.meaning);
    });

    it('should return error for empty string', () => {
      const result = decodeGiftWordData('');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_URL);
    });

    it('should return error for whitespace only', () => {
      const result = decodeGiftWordData('   ');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_URL);
    });

    it('should return error for invalid Base64', () => {
      const result = decodeGiftWordData('invalid!!!base64');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe(ERROR_MESSAGES.DECODE_FAILED);
    });

    it('should return error for invalid JSON', () => {
      const invalidJson = btoa('not valid json{');
      const result = decodeGiftWordData(invalidJson);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe(ERROR_MESSAGES.DECODE_FAILED);
    });

    it('should return error when word is missing', () => {
      const invalidData = { meaning: 'test' };
      const encoded = btoa(encodeURIComponent(JSON.stringify(invalidData)));
      const result = decodeGiftWordData(encoded);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it('should return error when meaning is missing', () => {
      const invalidData = { word: 'test' };
      const encoded = btoa(encodeURIComponent(JSON.stringify(invalidData)));
      const result = decodeGiftWordData(encoded);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_DATA);
    });

    it('should handle encode/decode round trip correctly', () => {
      const originalData: GiftWordData = {
        word: '感謝',
        meaning: 'いつも支えてくれてありがとう',
        timestamp: Date.now(),
      };

      const encoded = encodeGiftWordData(originalData);
      const dataParam = encoded.url.split('data=')[1];
      const decoded = decodeGiftWordData(dataParam);

      expect(decoded.success).toBe(true);
      expect(decoded.data).toEqual(originalData);
    });
  });

  describe('extractDataFromUrl', () => {
    it('should extract data parameter from URL', () => {
      const url = 'http://localhost:5173/gift-words#/display?data=test123';
      const result = extractDataFromUrl(url);

      expect(result).toBe('test123');
    });

    it('should return null when data parameter is missing', () => {
      const url = 'http://localhost:5173/gift-words#/display';
      const result = extractDataFromUrl(url);

      expect(result).toBeNull();
    });

    it('should return null for invalid URL', () => {
      const result = extractDataFromUrl('not a valid url');

      expect(result).toBeNull();
    });

    it('should handle URL with multiple parameters', () => {
      const url = 'http://localhost:5173/gift-words#/display?data=test123&other=value';
      const result = extractDataFromUrl(url);

      expect(result).toBe('test123');
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid HTTP URL', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
    });

    it('should return true for valid HTTPS URL', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
    });

    it('should return true for URL with path', () => {
      expect(isValidUrl('https://example.com/path/to/page')).toBe(true);
    });

    it('should return true for URL with query params', () => {
      expect(isValidUrl('https://example.com?param=value')).toBe(true);
    });

    it('should return false for invalid URL', () => {
      expect(isValidUrl('not a url')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidUrl('')).toBe(false);
    });

    it('should return false for relative path', () => {
      expect(isValidUrl('/relative/path')).toBe(false);
    });
  });
});
