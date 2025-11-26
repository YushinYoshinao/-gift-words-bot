/**
 * ToastContainerコンポーネント
 *
 * トーストメッセージのコンテナコンポーネント
 * REQ-105: トーストメッセージ表示
 * REQ-312: 複数トーストの同時表示
 */

import { useToast } from '../../../context/ToastContext';
import Toast from './Toast';
import styles from './ToastContainer.module.css';

/**
 * トーストメッセージのコンテナコンポーネント
 * REQ-105, REQ-312
 */
const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={hideToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
