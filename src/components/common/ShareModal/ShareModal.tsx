/**
 * ShareModalコンポーネント
 *
 * 共有リンク表示モーダルコンポーネント
 * REQ-104: 共有リンク表示モーダル
 * REQ-106: URLコピー機能
 * F-002: 共有リンク生成
 */

import { useState } from 'react';
import Button from '../Button/Button';
import { useToast } from '../../../context/ToastContext';
import { copyToClipboard } from '../../../utils/clipboard';
import styles from './ShareModal.module.css';

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

/**
 * 共有リンク表示モーダルコンポーネント
 * REQ-104, REQ-106, F-002
 */
const ShareModal: React.FC<ShareModalProps> = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    const result = await copyToClipboard(url);

    if (result.success) {
      setCopied(true);
      showToast(result.message, 'success');

      // 2秒後にリセット
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast(result.message, 'error');
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div
        className={styles.modal}
        role="dialog"
        aria-labelledby="share-title"
        aria-modal="true"
      >
        <h2 id="share-title" className={styles.title}>
          共有リンクを生成しました
        </h2>

        <div className={styles.content}>
          <p className={styles.description}>
            このリンクを友達に送って、言葉を贈りましょう!
          </p>

          <div className={styles.urlContainer}>
            <input
              type="text"
              value={url}
              readOnly
              className={styles.urlInput}
              aria-label="共有URL"
            />
          </div>
        </div>

        <div className={styles.footer}>
          <Button onClick={handleCopy} variant="primary">
            {copied ? 'コピーしました!' : 'URLをコピー'}
          </Button>
          <Button onClick={onClose} variant="secondary">
            閉じる
          </Button>
        </div>
      </div>
    </>
  );
};

export default ShareModal;
