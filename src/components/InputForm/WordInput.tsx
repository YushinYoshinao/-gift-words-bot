/**
 * 贈りたい言葉の入力フィールドコンポーネント
 * REQ-001, REQ-013, REQ-015
 */

import { VALIDATION_RULES } from '../../types';
import styles from './WordInput.module.css';

interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  maxLength?: number;
}

const WordInput: React.FC<WordInputProps> = ({
  value,
  onChange,
  error,
  maxLength = VALIDATION_RULES.MAX_WORD_LENGTH,
}) => {
  const remainingChars = maxLength - value.length;
  const isWarning = remainingChars < 10;

  return (
    <div className={styles.inputGroup}>
      <label htmlFor="word" className={styles.label}>
        贈りたい言葉 <span className={styles.required} aria-label="必須">*</span>
      </label>
      <input
        id="word"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        placeholder="例: 感謝"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'word-error' : undefined}
      />
      <div className={styles.inputMeta}>
        <span
          className={`${styles.charCount} ${isWarning ? styles.charCountWarning : ''}`}
        >
          {value.length} / {maxLength}
        </span>
      </div>
      {error && (
        <p id="word-error" className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default WordInput;
