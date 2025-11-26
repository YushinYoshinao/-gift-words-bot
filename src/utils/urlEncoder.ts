/**
 * URLエンコード/デコード機能
 *
 * REQ-102: URLパラメータ形式
 * REQ-103: Base64エンコード
 */

import { GiftWordData, EncodeResult, DecodeResult, VALIDATION_RULES } from '../types';
import { ERROR_MESSAGES } from './constants';

/**
 * GiftWordDataをBase64エンコードしてURLパラメータ形式に変換
 * REQ-101, REQ-102, REQ-103
 */
export const encodeGiftWordData = (data: GiftWordData): EncodeResult => {
  try {
    // データをJSON文字列に変換
    const jsonString = JSON.stringify(data);

    // UTF-8エンコード -> Base64エンコード
    const base64 = btoa(encodeURIComponent(jsonString));

    // URLを生成
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/display?data=${base64}`;

    // REQ-111: URL長チェック
    if (url.length > VALIDATION_RULES.MAX_URL_LENGTH) {
      return {
        url: '',
        success: false,
        error: ERROR_MESSAGES.URL_TOO_LONG,
      };
    }

    return {
      url,
      success: true,
    };
  } catch (error) {
    return {
      url: '',
      success: false,
      error: ERROR_MESSAGES.ENCODE_FAILED,
    };
  }
};

/**
 * Base64エンコードされたURLパラメータをGiftWordDataにデコード
 * REQ-103, REQ-212, REQ-311
 */
export const decodeGiftWordData = (encodedData: string): DecodeResult => {
  try {
    // REQ-212: 空データチェック
    if (!encodedData || encodedData.trim() === '') {
      return {
        data: null,
        success: false,
        error: ERROR_MESSAGES.INVALID_URL,
      };
    }

    // Base64デコード -> UTF-8デコード
    const jsonString = decodeURIComponent(atob(encodedData));

    // JSON パース
    const data = JSON.parse(jsonString) as GiftWordData;

    // データ検証
    if (!data.word || !data.meaning) {
      return {
        data: null,
        success: false,
        error: ERROR_MESSAGES.INVALID_DATA,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    // REQ-311: デコードエラーハンドリング
    return {
      data: null,
      success: false,
      error: ERROR_MESSAGES.DECODE_FAILED,
    };
  }
};

/**
 * URLパラメータからdataを抽出
 */
export const extractDataFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const hash = urlObj.hash;

    // ハッシュからクエリパラメータを抽出
    const queryStart = hash.indexOf('?');
    if (queryStart === -1) {
      return null;
    }

    const queryString = hash.substring(queryStart + 1);
    const params = new URLSearchParams(queryString);
    return params.get('data');
  } catch {
    return null;
  }
};

/**
 * URLが有効かチェック
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
