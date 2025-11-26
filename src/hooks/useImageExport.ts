/**
 * useImageExport - 画像エクスポート用カスタムフック
 * TASK-0038: 画像エクスポート用カスタムフック実装
 *
 * html2canvasを使用してDOM要素をPNG画像としてエクスポートし、ダウンロード機能を提供します。
 * 進捗管理、エラーハンドリング、Toast通知を含む包括的な画像エクスポート機能を実装しています。
 *
 * 関連要件:
 * - REQ-302: ボタンクリックで表示ページを画像化
 * - REQ-303: html2canvasライブラリを使用
 * - REQ-304: PNG形式で画像を保存
 * - REQ-305: 高品質・高解像度設定
 * - REQ-306: ファイル名に日付を含める
 * - REQ-311: 画像生成失敗時にエラー通知
 */

import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { useToast } from '../context/ToastContext';
import { formatFilename } from '../utils/dateFormatter';
import {
  IMAGE_EXPORT_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../utils/constants';
import type { ImageExportState, Html2CanvasOptions } from '../types';

/**
 * useImageExportフックの返り値
 */
interface UseImageExportReturn extends ImageExportState {
  /** 要素を画像としてエクスポートし、ダウンロードする関数 */
  exportAsImage: (
    element: HTMLElement,
    filename?: string
  ) => Promise<boolean>;
  /** エラー状態をリセットする関数 */
  resetError: () => void;
}

/**
 * 画像エクスポート用カスタムフック
 *
 * @returns {UseImageExportReturn} エクスポート状態と関数を含むオブジェクト
 */
export const useImageExport = (): UseImageExportReturn => {
  const { showToast } = useToast();

  const [state, setState] = useState<ImageExportState>({
    isExporting: false,
    progress: 0,
    error: null,
  });

  /**
   * 要素を画像としてエクスポート
   *
   * @param {HTMLElement} element - 画像化する要素
   * @param {string} [filename] - ダウンロードファイル名（省略時はformatFilename()）
   * @returns {Promise<boolean>} - 成功時true、失敗時false
   */
  const exportAsImage = useCallback(
    async (element: HTMLElement, filename?: string): Promise<boolean> => {
      setState({ isExporting: true, progress: 0, error: null });

      try {
        // html2canvasオプション設定（REQ-303, REQ-305）
        const options: Html2CanvasOptions = {
          backgroundColor: IMAGE_EXPORT_CONFIG.BACKGROUND_COLOR,
          scale: IMAGE_EXPORT_CONFIG.SCALE,
          logging: IMAGE_EXPORT_CONFIG.LOGGING,
          useCORS: IMAGE_EXPORT_CONFIG.USE_CORS,
          allowTaint: false,
        };

        setState((prev) => ({ ...prev, progress: 30 }));

        // 要素をCanvasに変換
        const canvas = await html2canvas(element, options);

        setState((prev) => ({ ...prev, progress: 60 }));

        // PNG形式のDataURLに変換（REQ-304）
        const dataUrl = canvas.toDataURL(
          IMAGE_EXPORT_CONFIG.FORMAT,
          IMAGE_EXPORT_CONFIG.QUALITY
        );

        setState((prev) => ({ ...prev, progress: 80 }));

        // ダウンロード実行（REQ-306）
        const link = document.createElement('a');
        link.download = filename || formatFilename();
        link.href = dataUrl;
        link.click();

        setState({ isExporting: false, progress: 100, error: null });

        showToast(SUCCESS_MESSAGES.IMAGE_SAVED, 'success');

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.IMAGE_EXPORT_FAILED;

        setState({ isExporting: false, progress: 0, error: errorMessage });

        // エラー通知（REQ-311）
        showToast(errorMessage, 'error');

        return false;
      }
    },
    [showToast]
  );

  /**
   * エラー状態をリセット
   */
  const resetError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    exportAsImage,
    resetError,
  };
};

export default useImageExport;
