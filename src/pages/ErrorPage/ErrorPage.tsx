/**
 * ErrorPage - エラー表示ページ
 * TASK-0027: ErrorPage詳細実装
 *
 * 【機能概要】: データ読み込み失敗時の分かりやすいエラーページ
 * 【実装方針】: REQ-211, REQ-213に基づく
 * 🔵 信頼性レベル: エラーハンドリング要件に基づく
 *
 * 関連要件:
 * - REQ-211: 不正なURLパラメータ時のエラーページ 🟡
 * - REQ-213: 分かりやすいエラーメッセージ 🟡
 */

import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import styles from './ErrorPage.module.css';

interface ErrorPageProps {
  message?: string;
  showHomeButton?: boolean;
}

/**
 * エラーページコンポーネント
 * REQ-211, REQ-213
 */
const ErrorPage: React.FC<ErrorPageProps> = ({
  message = 'データの読み込みに失敗しました',
  showHomeButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>⚠️</div>

        <h1 className={styles.title}>エラーが発生しました</h1>

        <p className={styles.message}>{message}</p>

        <div className={styles.suggestions}>
          <p>以下をお試しください:</p>
          <ul>
            <li>URLが正しいか確認してください</li>
            <li>リンクを送ってくれた友達に確認してください</li>
            <li>新しい言葉を作成してみてください</li>
          </ul>
        </div>

        {showHomeButton && (
          <div className={styles.actions}>
            <Button onClick={() => navigate('/')} variant="primary">
              トップページに戻る
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
