/**
 * HomePage - 言葉入力フォームページ
 *
 * F-001: 言葉入力フォーム 🔵
 * REQ-001: 「贈りたい言葉」入力欄
 * REQ-002: 「その意味」入力欄
 * REQ-003: 「共有リンクを生成」ボタン
 * REQ-004: 初回訪問時チュートリアル表示
 * REQ-104: 共有リンク表示モーダル
 */

import { useState } from 'react';
import InputForm from '../../components/InputForm/InputForm';
import TutorialModal from '../../components/common/TutorialModal/TutorialModal';
import ShareModal from '../../components/common/ShareModal/ShareModal';
import { useTutorial } from '../../context/TutorialContext';
import styles from './HomePage.module.css';

/**
 * HomePage コンポーネント
 * トップページ（言葉入力フォーム）
 */
const HomePage = () => {
  const { showTutorial, closeTutorial } = useTutorial();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  /**
   * InputForm からコールバック: 共有URL生成成功時
   * REQ-101, REQ-104
   * UX改善: チュートリアル表示中に共有リンク生成した場合、チュートリアルを自動で閉じる
   */
  const handleShareUrlGenerated = (url: string) => {
    // チュートリアル表示中なら閉じる（モーダル重複を防ぐ）
    if (showTutorial) {
      closeTutorial();
    }
    setShareUrl(url);
    setShowShareModal(true);
  };

  /**
   * ShareModal を閉じる
   * REQ-104
   */
  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setShareUrl(null);
  };

  return (
    <main className={styles.homePage} role="main">
      <div className={styles.container}>
        <h1 className={styles.title}>贈る言葉BOT</h1>
        <p className={styles.subtitle}>
          友達に贈る言葉を作成して、リンクで共有しましょう
        </p>

        <InputForm onShareUrlGenerated={handleShareUrlGenerated} />
      </div>

      {/* チュートリアルモーダル: 初回訪問時のみ表示 (REQ-004) */}
      {showTutorial && <TutorialModal />}

      {/* 共有モーダル: URL生成成功時に表示 (REQ-104) */}
      {shareUrl && showShareModal && (
        <ShareModal url={shareUrl} onClose={handleCloseShareModal} />
      )}
    </main>
  );
};

export default HomePage;
