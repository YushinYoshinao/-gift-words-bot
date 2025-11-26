/**
 * VerticalTextDisplay - 縦書きテキスト表示コンポーネント
 * TASK-0030, TASK-0031: 縦書き表示・辞書風デザイン実装
 *
 * 【機能概要】: 言葉と意味を縦書きで辞書風に表示
 * 【実装方針】: REQ-203, REQ-232, REQ-233, REQ-204に基づく
 * 🔵 信頼性レベル: 縦書き表示要件に基づく
 *
 * 関連要件:
 * - REQ-203: 黒板の左側に縦書きで表示 🔵
 * - REQ-232: CSS `writing-mode: vertical-rl` 使用 🔵
 * - REQ-233: チョーク風の色 🔵
 * - REQ-204: 辞書風のデザインで表示 🔵
 */

import { useState } from 'react';
import useTypewriter from '../../hooks/useTypewriter';
import styles from './VerticalTextDisplay.module.css';
import clsx from 'clsx';

interface VerticalTextDisplayProps {
  word: string;
  meaning: string;
}

/**
 * 縦書きテキスト表示コンポーネント
 * REQ-203, REQ-232, REQ-233, REQ-204
 */
const VerticalTextDisplay: React.FC<VerticalTextDisplayProps> = ({
  word,
  meaning,
}) => {
  const [showMeaning, setShowMeaning] = useState(false);
  const [canSkip, setCanSkip] = useState(true);

  // 言葉のタイプライターアニメーション
  const {
    displayText: displayWord,
    isComplete: wordComplete,
    skip: skipWord,
  } = useTypewriter({
    text: word,
    delay: 300,
    enabled: true,
    onComplete: () => {
      console.log('Word animation complete', { word, displayWord });
      setTimeout(() => {
        setShowMeaning(true);
        setCanSkip(true);
      }, 500);
    },
  });

  // 意味のタイプライターアニメーション
  const {
    displayText: displayMeaning,
    isComplete: meaningComplete,
    skip: skipMeaning,
  } = useTypewriter({
    text: meaning,
    delay: 150,
    enabled: showMeaning,
    onComplete: () => {
      console.log('Meaning animation complete', { meaning, displayMeaning });
      setCanSkip(false);
    },
  });

  // クリックでスキップ
  const handleSkip = () => {
    if (!canSkip) return;

    if (!wordComplete) {
      skipWord();
    } else if (showMeaning && !meaningComplete) {
      skipMeaning();
    }
  };

  return (
    <div
      className={clsx(styles.container, canSkip && styles.clickable)}
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      aria-label="クリックでアニメーションをスキップ"
    >
      {/* 左: 意味の文字列（サブ・小さい） */}
      {showMeaning && (
        <div className={styles.meaningSection}>
          <p className={styles.meaning}>{displayMeaning}</p>
        </div>
      )}

      {/* 右: メインの言葉（大きい） */}
      <div className={styles.wordSection}>
        <h1 className={styles.word}>{displayWord}</h1>
      </div>

    </div>
  );
};

export default VerticalTextDisplay;
