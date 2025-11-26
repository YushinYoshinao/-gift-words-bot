/**
 * TutorialModalコンポーネント
 *
 * チュートリアルモーダルコンポーネント
 * REQ-004: チュートリアル表示
 * REQ-041: 初回訪問時のみ表示
 * REQ-042: LocalStorage永続化
 */

import { useTutorial } from '../../../context/TutorialContext';
import Button from '../Button/Button';
import styles from './TutorialModal.module.css';

/**
 * チュートリアルモーダルコンポーネント
 * REQ-004, REQ-041, REQ-042
 */
const TutorialModal: React.FC = () => {
  const { showTutorial, closeTutorial } = useTutorial();

  if (!showTutorial) {
    return null;
  }

  return (
    <>
      <div className={styles.overlay} onClick={closeTutorial} />
      <div
        className={styles.modal}
        role="dialog"
        aria-labelledby="tutorial-title"
        aria-modal="true"
      >
        <h2 id="tutorial-title" className={styles.title}>
          贈る言葉BOTの使い方
        </h2>

        <div className={styles.content}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <p>贈りたい言葉とその意味を入力してください</p>
          </div>

          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <p>「共有リンクを生成」ボタンをクリック</p>
          </div>

          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <p>生成されたリンクを友達に送って言葉を贈りましょう!</p>
          </div>
        </div>

        <div className={styles.footer}>
          <Button onClick={closeTutorial} variant="primary">
            わかりました
          </Button>
        </div>
      </div>
    </>
  );
};

export default TutorialModal;
