/**
 * Toastコンポーネント
 *
 * 個別のトーストメッセージコンポーネント
 * REQ-105: トーストメッセージ表示
 * REQ-311: エラーメッセージ表示
 */

import { useEffect } from 'react';
import { Toast as ToastType } from '../../../types';
import styles from './Toast.module.css';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

/**
 * 個別のトーストメッセージコンポーネント
 * REQ-105, REQ-311
 */
const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]}`}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <span className={styles.icon}>{getIcon()}</span>
      <span className={styles.message}>{toast.message}</span>
      <button
        className={styles.closeButton}
        onClick={() => onClose(toast.id)}
        aria-label="通知を閉じる"
        type="button"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
