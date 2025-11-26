/**
 * ImageSaveButton - 画像保存ボタンコンポーネント
 * TASK-0039: 画像保存ボタンコンポーネント実装
 *
 * 【機能概要】: 表示ページのDOM要素を画像化してPNG形式でダウンロードするボタンコンポーネント 🔵
 * 【実装方針】: useImageExportフックとButtonコンポーネントを組み合わせた最小限の実装 🔵
 * 【テスト対応】: 13個のテストケースを通すための実装 🔵
 *
 * 関連要件:
 * - REQ-301: 画像保存ボタンを提供 🔵
 * - REQ-302: ボタンクリックで表示ページを画像化 🔵
 * - REQ-306: ファイル名に日付を含める（useImageExportフックで処理） 🔵
 * - NFR-205: キーボードで操作可能（アクセシビリティ） 🔵
 * - EDGE-001: 要素が見つからない場合のエラー処理 🟡
 */

import React from 'react';
import { useImageExport } from '../../hooks/useImageExport';
import Button from '../common/Button/Button';
import styles from './ImageSaveButton.module.css';

/**
 * ImageSaveButtonコンポーネントのProps型定義
 * 🔵 信頼性レベル: 要件定義書に基づく
 */
interface ImageSaveButtonProps {
  /** エクスポート対象の要素のCSSセレクタ（REQ-302） 🔵 */
  targetSelector: string;
  /** ファイル名（オプション、省略時はformatFilename()で日付付き名前生成）（REQ-306） 🔵 */
  filename?: string;
}

/**
 * ImageSaveButton - 画像保存ボタンコンポーネント
 *
 * 【機能概要】: 表示ページを画像として保存するボタンを提供 🔵
 * 【実装方針】: useImageExportフックとButtonコンポーネントを組み合わせた実装 🔵
 * 【テスト対応】: テスト1-1〜6-1を通すための実装 🔵
 *
 * @param {ImageSaveButtonProps} props - コンポーネントのProps
 * @returns {JSX.Element} 画像保存ボタン
 */
const ImageSaveButton: React.FC<ImageSaveButtonProps> = ({
  targetSelector,
  filename,
}) => {
  // 【useImageExportフック取得】: 画像エクスポート機能を使用 🔵
  // 【REQ-302対応】: exportAsImage関数でDOM要素を画像化 🔵
  const { isExporting, exportAsImage } = useImageExport();

  /**
   * ボタンクリックハンドラー
   *
   * 【機能概要】: ボタンクリック時にDOM要素を取得し、画像エクスポートを実行 🔵
   * 【実装方針】: document.querySelector()で要素を取得し、exportAsImage()を呼び出す 🔵
   * 【テスト対応】: テスト1-2, 1-3, 2-1, 5-1, 5-2を通すための実装 🔵
   * 🔵 信頼性レベル: タスクファイルの実装詳細に基づく
   */
  const handleClick = async () => {
    // 【DOM要素取得】: targetSelectorを使用してDOM要素を取得 🔵
    // 【REQ-302対応】: 表示ページの要素を取得して画像化の準備 🔵
    const element = document.querySelector(targetSelector) as HTMLElement;

    // 【要素未検出エラー処理】: 要素が見つからない場合はエラーログを出力 🟡
    // 【EDGE-001対応】: 開発者が問題を特定しやすいようエラーメッセージを出力 🟡
    if (!element) {
      console.error(`Element not found: ${targetSelector}`);
      // 【処理中断】: 要素が見つからない場合は処理を中断 🟡
      return;
    }

    // 【画像エクスポート実行】: useImageExportフックのexportAsImage関数を呼び出し 🔵
    // 【REQ-302対応】: DOM要素を画像化してダウンロード 🔵
    // 【REQ-306対応】: filenameが省略された場合はformatFilename()で日付付き名前生成（フック側で処理） 🔵
    await exportAsImage(element, filename);
  };

  return (
    <div className={styles.container}>
      {/* 【保存ボタン】: 既存のButtonコンポーネントを使用してUI統一性を確保 🔵 */}
      {/* 【REQ-301対応】: 画像保存ボタンを提供 🔵 */}
      {/* 【NFR-205対応】: aria-label属性でアクセシビリティ対応 🔵 */}
      <Button
        onClick={handleClick}
        disabled={isExporting}
        variant="primary"
        aria-label="画像として保存"
      >
        {/* 【ボタンテキスト動的変更】: isExportingに応じてテキストを切り替え 🔵 */}
        {/* 【テスト対応】: テスト3-3を通すための実装 🔵 */}
        {isExporting ? '保存中...' : '画像として保存'}
      </Button>

      {/* 【ローディング表示】: エクスポート中のみ表示 🔵 */}
      {/* 【条件付きレンダリング】: isExportingがtrueの時のみローディングを表示 🔵 */}
      {/* 【テスト対応】: テスト3-2, 4-2を通すための実装 🔵 */}
      {isExporting && (
        <div
          className={styles.loading}
          role="status"
          aria-live="polite"
        >
          {/* 【スクリーンリーダー専用テキスト】: .sr-onlyクラスで視覚的に隠しつつ読み上げ対応 🔵 */}
          {/* 【NFR-205対応】: アクセシビリティ要件を満たす 🔵 */}
          <span className="sr-only">画像を生成しています...</span>

          {/* 【スピナー要素】: 回転アニメーションで処理中を視覚的に表示 🔵 */}
          <div className={styles.spinner} />
        </div>
      )}
    </div>
  );
};

export default ImageSaveButton;
