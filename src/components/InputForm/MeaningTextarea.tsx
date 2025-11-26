/**
 * その意味の入力フィールドコンポーネント
 * REQ-002, REQ-014, REQ-015
 */

import { VALIDATION_RULES } from '../../types';
import styles from './MeaningTextarea.module.css';

interface MeaningTextareaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  maxLength?: number;
}

const MeaningTextarea: React.FC<MeaningTextareaProps> = ({
  value,
  onChange,
  error,
  maxLength = VALIDATION_RULES.MAX_MEANING_LENGTH,
}) => {
  const remainingChars = maxLength - value.length;
  const isWarning = remainingChars < 30;

  return (
    <div className={styles.inputGroup}>
      <label htmlFor="meaning" className={styles.label}>
        その意味 <span className={styles.required} aria-label="必須">*</span>
      </label>
      <textarea
        id="meaning"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        rows={6}
        className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
        placeholder="例: いつも支えてくれてありがとう"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'meaning-error' : undefined}
      />
      <div className={styles.inputMeta}>
        <span
          className={`${styles.charCount} ${isWarning ? styles.charCountWarning : ''}`}
        >
          {value.length} / {maxLength}
        </span>
      </div>
      {error && (
        <p id="meaning-error" className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default MeaningTextarea;
