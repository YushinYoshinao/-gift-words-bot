/**
 * クリップボード操作ユーティリティ
 *
 * REQ-106: URLコピー機能
 * REQ-313: クリップボードAPIフォールバック
 */

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';

export interface ClipboardResult {
  success: boolean;
  message: string;
}

/**
 * クリップボードにテキストをコピー
 * REQ-106, REQ-313
 */
export const copyToClipboard = async (text: string): Promise<ClipboardResult> => {
  try {
    // Clipboard API優先
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return {
        success: true,
        message: SUCCESS_MESSAGES.URL_COPIED,
      };
    }

    // REQ-313: フォールバック(古いブラウザ対応)
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      return {
        success: true,
        message: SUCCESS_MESSAGES.URL_COPIED,
      };
    }

    throw new Error('execCommand failed');
  } catch (error) {
    // REQ-314: コピー失敗通知
    return {
      success: false,
      message: ERROR_MESSAGES.COPY_FAILED,
    };
  }
};

/**
 * クリップボードAPIが利用可能かチェック
 */
export const isClipboardAvailable = (): boolean => {
  return !!(navigator.clipboard && navigator.clipboard.writeText);
};
