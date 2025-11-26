import React from 'react';
import styles from './LoadingSpinner.module.css';

/**
 * LoadingSpinnerコンポーネント
 *
 * ページ読み込み中に表示されるローディングスピナー。
 * React.lazyによるコード分割時のSuspenseフォールバックとして使用。
 *
 * @requirements
 * - NFR-001: ページ読み込み時間3秒以内（コード分割によるパフォーマンス最適化）
 * - NFR-205: キーボード操作可能（スクリーンリーダー対応）
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <p className={styles.text}>読み込み中...</p>
      <span className="sr-only">ページを読み込んでいます</span>
    </div>
  );
};

export default LoadingSpinner;
