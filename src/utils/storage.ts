/**
 * LocalStorage操作ユーティリティ
 *
 * REQ-042: LocalStorage永続化
 */

import { STORAGE_KEYS } from './constants';

/**
 * チュートリアル表示済みフラグを取得
 * REQ-042
 */
export const getTutorialShown = (): boolean => {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.TUTORIAL_SHOWN);
    return value === 'true';
  } catch {
    // LocalStorage非対応の場合はfalseを返す
    return false;
  }
};

/**
 * チュートリアル表示済みフラグを設定
 * REQ-042
 */
export const setTutorialShown = (shown: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TUTORIAL_SHOWN, String(shown));
  } catch {
    // LocalStorage非対応の場合は何もしない
  }
};

/**
 * チュートリアル表示済みフラグをクリア
 */
export const clearTutorialShown = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TUTORIAL_SHOWN);
  } catch {
    // LocalStorage非対応の場合は何もしない
  }
};
