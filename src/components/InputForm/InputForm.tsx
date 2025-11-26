/**
 * InputFormコンポーネント
 *
 * 言葉入力フォームを統合するコンポーネント
 * F-001: 言葉入力フォーム
 * REQ-003: 送信ボタン
 * REQ-101: 一意のURL生成
 */

import { useState } from 'react';
import WordInput from './WordInput';
import MeaningTextarea from './MeaningTextarea';
import Button from '../common/Button/Button';
import { validateForm } from '../../utils/validation';
import { encodeGiftWordData } from '../../utils/urlEncoder';
import { useToast } from '../../context/ToastContext';
import { ERROR_MESSAGES } from '../../utils/constants';
import type { ValidationErrors } from '../../types';
import styles from './InputForm.module.css';

interface InputFormProps {
  onShareUrlGenerated?: (url: string) => void;
}

/**
 * 言葉入力フォームコンポーネント
 * F-001, REQ-001, REQ-002, REQ-003
 */
const InputForm: React.FC<InputFormProps> = ({ onShareUrlGenerated }) => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    const validationErrors = validateForm(word, meaning);
    setErrors(validationErrors);

    if (validationErrors.word || validationErrors.meaning) {
      showToast(ERROR_MESSAGES.VALIDATION_FAILED, 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // URLエンコード
      const result = encodeGiftWordData({ word, meaning });

      if (!result.success) {
        showToast(result.error || ERROR_MESSAGES.ENCODE_FAILED, 'error');
        return;
      }

      // 共有モーダルを開く
      if (onShareUrlGenerated) {
        onShareUrlGenerated(result.url);
      }
    } catch (error) {
      showToast(ERROR_MESSAGES.UNEXPECTED_ERROR, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <WordInput value={word} onChange={setWord} error={errors.word} />

      <MeaningTextarea
        value={meaning}
        onChange={setMeaning}
        error={errors.meaning}
      />

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? '生成中...' : '共有リンクを生成'}
      </Button>
    </form>
  );
};

export default InputForm;
