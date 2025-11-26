/**
 * BackgroundImage - 武田鉄矢背景画像コンポーネント
 * TASK-0028: BackgroundImage完全実装
 *
 * 【機能概要】: 武田鉄矢の画像を右側〜中央に背景として表示
 * 【実装方針】: REQ-201, REQ-202に基づく
 * 🔵 信頼性レベル: 画像表示要件に基づく
 *
 * 関連要件:
 * - REQ-201: 武田鉄矢の画像を背景として表示 🔵
 * - REQ-202: 画像を右側〜中央に配置 🔵
 */

import { memo } from 'react';
import styles from './BackgroundImage.module.css';

/**
 * 武田鉄矢の背景画像コンポーネント
 * REQ-201, REQ-202
 */
const BackgroundImage: React.FC = memo(() => {
  return (
    <div className={styles.container}>
      <img
        src="/takeda-tetsuya.png"
        alt="武田鉄矢"
        className={styles.image}
        loading="eager"
        decoding="async"
        onError={(e) => {
          console.error('Image failed to load:', e);
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
});

BackgroundImage.displayName = 'BackgroundImage';

export default BackgroundImage;
