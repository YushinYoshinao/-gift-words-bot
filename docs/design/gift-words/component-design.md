# コンポーネント設計

## 概要

このドキュメントはReactコンポーネントの詳細設計を記載します。

**【信頼性レベル】**: 🔵 要件定義書と技術スタック定義に基づいて作成

## コンポーネント階層

```
src/
├── App.tsx                          # ルートコンポーネント
├── main.tsx                         # エントリーポイント
│
├── pages/                           # ページコンポーネント
│   ├── HomePage/
│   │   ├── HomePage.tsx            🔵 F-001, F-002
│   │   ├── HomePage.module.css
│   │   └── index.ts
│   │
│   ├── DisplayPage/
│   │   ├── DisplayPage.tsx         🔵 F-003, F-004
│   │   ├── DisplayPage.module.css
│   │   └── index.ts
│   │
│   └── ErrorPage/
│       ├── ErrorPage.tsx           🟡 エラーハンドリング
│       ├── ErrorPage.module.css
│       └── index.ts
│
├── components/                      # UIコンポーネント
│   ├── InputForm/
│   │   ├── InputForm.tsx           🔵 F-001
│   │   ├── InputForm.module.css
│   │   ├── WordInput.tsx           🔵 REQ-001
│   │   ├── WordInput.module.css
│   │   ├── MeaningTextarea.tsx     🔵 REQ-002
│   │   ├── MeaningTextarea.module.css
│   │   ├── CharacterCounter.tsx    🟡 UX改善
│   │   ├── CharacterCounter.module.css
│   │   └── index.ts
│   │
│   ├── TutorialModal/
│   │   ├── TutorialModal.tsx       🔵 REQ-004
│   │   ├── TutorialModal.module.css
│   │   └── index.ts
│   │
│   ├── ShareModal/
│   │   ├── ShareModal.tsx          🔵 F-002
│   │   ├── ShareModal.module.css
│   │   ├── CopyButton.tsx          🔵 REQ-104
│   │   ├── CopyButton.module.css
│   │   └── index.ts
│   │
│   ├── DisplayContent/
│   │   ├── BackgroundImage.tsx     🔵 REQ-201
│   │   ├── BackgroundImage.module.css
│   │   ├── VerticalTextDisplay.tsx 🔵 REQ-203
│   │   ├── VerticalTextDisplay.module.css
│   │   └── index.ts
│   │
│   ├── Toast/
│   │   ├── ToastContainer.tsx      🔵 REQ-105
│   │   ├── ToastContainer.module.css
│   │   ├── Toast.tsx               🔵 REQ-105
│   │   ├── Toast.module.css
│   │   └── index.ts
│   │
│   └── common/                      # 共通コンポーネント
│       ├── Button/
│       │   ├── Button.tsx
│       │   ├── Button.module.css
│       │   └── index.ts
│       │
│       ├── Modal/
│       │   ├── Modal.tsx
│       │   ├── Modal.module.css
│       │   └── index.ts
│       │
│       └── Loading/
│           ├── Loading.tsx
│           ├── Loading.module.css
│           └── index.ts
│
├── hooks/                           # カスタムフック
│   ├── useFormValidation.ts        🔵 F-001バリデーション
│   ├── useTypewriter.ts            🔵 REQ-205, REQ-231
│   ├── useImageExport.ts           🔵 F-004
│   ├── useToast.ts                 🔵 REQ-105
│   ├── useTutorial.ts              🔵 REQ-004
│   ├── useClipboard.ts             🔵 REQ-104
│   └── index.ts
│
├── contexts/                        # Context API
│   ├── AppContext.tsx              🔵 グローバル状態管理
│   ├── TutorialContext.tsx         🔵 REQ-004
│   ├── ToastContext.tsx            🔵 REQ-105
│   └── index.ts
│
├── utils/                           # ユーティリティ
│   ├── urlEncoder.ts               🔵 REQ-103
│   ├── validation.ts               🔵 バリデーション
│   ├── formatDate.ts               🟡 日付フォーマット
│   └── index.ts
│
├── types/                           # 型定義
│   └── index.ts                    🔵 全型定義
│
└── styles/                          # グローバルスタイル
    ├── global.css                  🔵 グローバルCSS
    ├── variables.css               🔵 CSS変数
    └── animations.css              🔵 アニメーション定義
```

## ページコンポーネント詳細

### HomePage 🔵

**責務**: 言葉入力フォームと共有リンク生成機能を提供

**Props**: なし

**State**:
```typescript
{
  isSubmitting: boolean;
  shareUrl: string | null;
  showShareModal: boolean;
}
```

**主な機能**:
- チュートリアルモーダル表示制御（初回訪問時）
- 入力フォームのデータ管理
- 共有リンク生成
- 共有モーダル表示

**使用フック**:
- `useTutorial()` - チュートリアル制御
- `useToast()` - トースト表示

**実装例**:
```tsx
export const HomePage: React.FC = () => {
  const { shouldShowTutorial, markTutorialComplete } = useTutorial();
  const { showSuccess, showError } = useToast();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleSubmit = async (data: GiftWordData) => {
    try {
      const encoded = encodeGiftWordData(data);
      const url = `${window.location.origin}/display?data=${encoded}`;

      if (url.length > VALIDATION_CONSTANTS.URL_MAX_LENGTH) {
        showError('URLが長すぎます。文字数を減らしてください。');
        return;
      }

      setShareUrl(url);
      setShowShareModal(true);
    } catch (error) {
      showError('URLの生成に失敗しました。');
    }
  };

  return (
    <div className={styles.homePage}>
      {shouldShowTutorial && (
        <TutorialModal
          isOpen={shouldShowTutorial}
          onClose={markTutorialComplete}
        />
      )}

      <InputForm onSubmit={handleSubmit} />

      {shareUrl && (
        <ShareModal
          isOpen={showShareModal}
          shareUrl={shareUrl}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
```

### DisplayPage 🔵

**責務**: 贈られた言葉を表示、タイプライターアニメーション、画像保存機能

**Props**: なし（URLパラメータから取得）

**State**:
```typescript
{
  giftWordData: GiftWordData | null;
  error: DecodeError | null;
  isExporting: boolean;
}
```

**主な機能**:
- URLパラメータのデコードと検証
- タイプライターアニメーション制御
- 画像保存機能
- エラーハンドリング

**使用フック**:
- `useSearchParams()` - URLパラメータ取得
- `useImageExport()` - 画像エクスポート
- `useToast()` - トースト表示

**実装例**:
```tsx
export const DisplayPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { exportAsImage, isExporting } = useImageExport();
  const { showError } = useToast();

  const [giftWordData, setGiftWordData] = useState<GiftWordData | null>(null);
  const [error, setError] = useState<DecodeError | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');

    if (!dataParam) {
      setError(DecodeError.MISSING_PARAMETER);
      return;
    }

    try {
      const decoded = decodeGiftWordData(dataParam);
      if (!isGiftWordData(decoded)) {
        setError(DecodeError.VALIDATION_FAILED);
        return;
      }

      setGiftWordData(decoded);
    } catch (err) {
      setError(DecodeError.DECODE_FAILED);
    }
  }, [searchParams]);

  const handleSaveImage = async () => {
    try {
      await exportAsImage('display-container');
    } catch (error) {
      showError('画像の保存に失敗しました。');
    }
  };

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (!giftWordData) {
    return <Loading />;
  }

  return (
    <div id="display-container" className={styles.displayPage}>
      <BackgroundImage src="/武田鉄矢.png" alt="武田鉄矢" />

      <VerticalTextDisplay
        word={giftWordData.word}
        meaning={giftWordData.meaning}
        enableTypewriter
        typewriterSpeed={ANIMATION_CONSTANTS.TYPEWRITER_SPEED}
      />

      <div className={styles.actionButtons}>
        <Button
          onClick={handleSaveImage}
          disabled={isExporting}
          aria-label="画像として保存"
        >
          {isExporting ? '保存中...' : '画像を保存'}
        </Button>

        <Button
          onClick={() => navigate('/')}
          variant="secondary"
          aria-label="新しい言葉を贈る"
        >
          新しい言葉を贈る
        </Button>
      </div>
    </div>
  );
};
```

## UIコンポーネント詳細

### InputForm 🔵

**責務**: 言葉と意味の入力フォーム、バリデーション

**Props**:
```typescript
interface InputFormProps {
  onSubmit: (data: GiftWordData) => void;
  isSubmitting?: boolean;
}
```

**使用フック**:
- `useFormValidation()` - バリデーションロジック

**実装例**:
```tsx
export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const {
    word,
    meaning,
    errors,
    isValid,
    handleWordChange,
    handleMeaningChange,
    validate,
  } = useFormValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({ word, meaning });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputForm} aria-label="言葉入力フォーム">
      <WordInput
        value={word}
        onChange={handleWordChange}
        error={errors.word}
        maxLength={VALIDATION_CONSTANTS.WORD_MAX_LENGTH}
        disabled={isSubmitting}
      />

      <MeaningTextarea
        value={meaning}
        onChange={handleMeaningChange}
        error={errors.meaning}
        maxLength={VALIDATION_CONSTANTS.MEANING_MAX_LENGTH}
        disabled={isSubmitting}
      />

      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        fullWidth
        aria-label="送信"
      >
        {isSubmitting ? '送信中...' : '送信'}
      </Button>
    </form>
  );
};
```

### WordInput 🔵

**責務**: 言葉入力欄、文字数カウンター、バリデーションエラー表示

**Props**:
```typescript
interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
}
```

**実装例**:
```tsx
export const WordInput: React.FC<WordInputProps> = ({
  value,
  onChange,
  error,
  maxLength = VALIDATION_CONSTANTS.WORD_MAX_LENGTH,
  disabled = false,
}) => {
  const hasError = Boolean(error);
  const inputId = 'word-input';
  const errorId = `${inputId}-error`;

  return (
    <div className={styles.wordInput}>
      <label htmlFor={inputId} className={styles.label}>
        贈りたい言葉
      </label>

      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        disabled={disabled}
        className={clsx(styles.input, hasError && styles.inputError)}
        aria-required="true"
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        placeholder="例: ありがとう"
      />

      <CharacterCounter current={value.length} max={maxLength} hasError={hasError} />

      {hasError && (
        <span id={errorId} role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};
```

### MeaningTextarea 🔵

**責務**: 意味入力欄（複数行）、文字数カウンター、バリデーションエラー表示

**Props**:
```typescript
interface MeaningTextareaProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
}
```

**実装例**:
```tsx
export const MeaningTextarea: React.FC<MeaningTextareaProps> = ({
  value,
  onChange,
  error,
  maxLength = VALIDATION_CONSTANTS.MEANING_MAX_LENGTH,
  disabled = false,
}) => {
  const hasError = Boolean(error);
  const textareaId = 'meaning-textarea';
  const errorId = `${textareaId}-error`;

  return (
    <div className={styles.meaningTextarea}>
      <label htmlFor={textareaId} className={styles.label}>
        その意味
      </label>

      <textarea
        id={textareaId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        disabled={disabled}
        rows={5}
        className={clsx(styles.textarea, hasError && styles.textareaError)}
        aria-required="true"
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        placeholder="例: いつも支えてくれてありがとう"
      />

      <CharacterCounter current={value.length} max={maxLength} hasError={hasError} />

      {hasError && (
        <span id={errorId} role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};
```

### VerticalTextDisplay 🔵

**責務**: 縦書きテキスト表示、タイプライターアニメーション

**Props**:
```typescript
interface VerticalTextDisplayProps {
  word: string;
  meaning: string;
  enableTypewriter?: boolean;
  typewriterSpeed?: number;
  onAnimationComplete?: () => void;
  onSkip?: () => void;
}
```

**使用フック**:
- `useTypewriter()` - タイプライターアニメーション

**実装例**:
```tsx
export const VerticalTextDisplay: React.FC<VerticalTextDisplayProps> = ({
  word,
  meaning,
  enableTypewriter = true,
  typewriterSpeed = ANIMATION_CONSTANTS.TYPEWRITER_SPEED,
  onAnimationComplete,
  onSkip,
}) => {
  const {
    displayedText: displayedWord,
    isAnimating: isWordAnimating,
    isComplete: isWordComplete,
    start: startWord,
    skip: skipWord,
  } = useTypewriter(word, typewriterSpeed);

  const {
    displayedText: displayedMeaning,
    isAnimating: isMeaningAnimating,
    start: startMeaning,
    skip: skipMeaning,
  } = useTypewriter(meaning, typewriterSpeed);

  useEffect(() => {
    if (enableTypewriter) {
      startWord();
    }
  }, [enableTypewriter, startWord]);

  useEffect(() => {
    if (isWordComplete && enableTypewriter) {
      startMeaning();
    }
  }, [isWordComplete, enableTypewriter, startMeaning]);

  const handleClick = () => {
    if (isWordAnimating) {
      skipWord();
      startMeaning();
    } else if (isMeaningAnimating) {
      skipMeaning();
    }
    onSkip?.();
  };

  return (
    <div
      className={styles.verticalTextDisplay}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="クリックでアニメーションをスキップ"
    >
      <div className={styles.wordSection}>
        <h1 className={styles.word}>{displayedWord}</h1>
      </div>

      <div className={styles.meaningSection}>
        <p className={styles.meaning}>{displayedMeaning}</p>
      </div>
    </div>
  );
};
```

**CSS例（縦書き）**:
```css
.verticalTextDisplay {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: 'Noto Serif JP', serif;
}

.word {
  font-size: 32px;
  font-weight: bold;
  color: #fffacd;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.meaning {
  font-size: 18px;
  color: #f0f0f0;
  line-height: 1.8;
  margin-top: 2rem;
}
```

### TutorialModal 🔵

**責務**: 初回訪問時のチュートリアル表示

**Props**:
```typescript
interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDontShowAgain?: (checked: boolean) => void;
}
```

**実装例**:
```tsx
export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onDontShowAgain,
}) => {
  const [dontShow, setDontShow] = useState(false);

  const handleClose = () => {
    if (dontShow && onDontShowAgain) {
      onDontShowAgain(true);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} aria-label="使い方チュートリアル">
      <div className={styles.tutorialModal}>
        <h2>贈る言葉BOTの使い方</h2>

        <ol className={styles.steps}>
          <li>
            <strong>ステップ1:</strong> 贈りたい言葉を入力
          </li>
          <li>
            <strong>ステップ2:</strong> その言葉の意味を入力
          </li>
          <li>
            <strong>ステップ3:</strong> URLを友達に共有
          </li>
        </ol>

        <p className={styles.description}>
          友達がリンクを開くと、武田鉄矢が黒板の前で言葉を贈ってくれます！
        </p>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={dontShow}
            onChange={(e) => setDontShow(e.target.checked)}
          />
          次回から表示しない
        </label>

        <Button onClick={handleClose} fullWidth>
          始める
        </Button>
      </div>
    </Modal>
  );
};
```

### ShareModal 🔵

**責務**: 共有URL表示、コピーボタン

**Props**:
```typescript
interface ShareModalProps {
  isOpen: boolean;
  shareUrl: string;
  onClose: () => void;
}
```

**使用フック**:
- `useClipboard()` - クリップボード操作

**実装例**:
```tsx
export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, shareUrl, onClose }) => {
  const { copyToClipboard, isCopied, isSupported } = useClipboard();
  const { showSuccess } = useToast();

  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      showSuccess('URLをコピーしました！');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} aria-label="共有リンク">
      <div className={styles.shareModal}>
        <h2>共有リンクが生成されました！</h2>

        <div className={styles.urlContainer}>
          <input
            type="text"
            value={shareUrl}
            readOnly
            className={styles.urlInput}
            aria-label="共有URL"
          />

          {isSupported ? (
            <CopyButton onClick={handleCopy} isCopied={isCopied} />
          ) : (
            <p className={styles.manualCopy}>
              URLを選択してコピーしてください
            </p>
          )}
        </div>

        <p className={styles.instructions}>
          このURLを友達に送って言葉を贈りましょう！
        </p>

        <Button onClick={onClose} variant="secondary">
          閉じる
        </Button>
      </div>
    </Modal>
  );
};
```

### ToastContainer 🔵

**責務**: トーストメッセージの表示管理

**Props**:
```typescript
interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}
```

**実装例**:
```tsx
export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className={styles.toastContainer} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
      ))}
    </div>
  );
};
```

### Toast 🔵

**責務**: 個別トーストメッセージの表示

**Props**:
```typescript
interface ToastProps {
  toast: ToastMessage;
  onRemove: () => void;
}
```

**実装例**:
```tsx
export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, toast.duration || TOAST_CONSTANTS.DEFAULT_DURATION);

    return () => clearTimeout(timer);
  }, [toast.duration, onRemove]);

  return (
    <div
      className={clsx(styles.toast, styles[toast.type])}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.message}>{toast.message}</div>
      <button
        onClick={onRemove}
        className={styles.closeButton}
        aria-label="閉じる"
      >
        ×
      </button>
    </div>
  );
};
```

## カスタムフック詳細

### useFormValidation 🔵

**責務**: フォームバリデーションロジック

**実装例**:
```typescript
export const useFormValidation = (): UseFormValidationReturn => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateWord = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'この項目は必須です';
    }
    if (value.length > VALIDATION_CONSTANTS.WORD_MAX_LENGTH) {
      return `${VALIDATION_CONSTANTS.WORD_MAX_LENGTH}文字以内で入力してください（現在: ${value.length}文字）`;
    }
    return undefined;
  };

  const validateMeaning = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'この項目は必須です';
    }
    if (value.length > VALIDATION_CONSTANTS.MEANING_MAX_LENGTH) {
      return `${VALIDATION_CONSTANTS.MEANING_MAX_LENGTH}文字以内で入力してください（現在: ${value.length}文字）`;
    }
    return undefined;
  };

  const handleWordChange = (value: string) => {
    setWord(value);
    const error = validateWord(value);
    setErrors((prev) => ({ ...prev, word: error }));
  };

  const handleMeaningChange = (value: string) => {
    setMeaning(value);
    const error = validateMeaning(value);
    setErrors((prev) => ({ ...prev, meaning: error }));
  };

  const validate = (): boolean => {
    setIsValidating(true);
    const wordError = validateWord(word);
    const meaningError = validateMeaning(meaning);

    setErrors({
      word: wordError,
      meaning: meaningError,
    });

    setIsValidating(false);
    return !wordError && !meaningError;
  };

  const reset = () => {
    setWord('');
    setMeaning('');
    setErrors({});
  };

  const isValid = !errors.word && !errors.meaning && word.trim() && meaning.trim();

  return {
    word,
    meaning,
    errors,
    isValidating,
    isValid,
    handleWordChange,
    handleMeaningChange,
    validate,
    reset,
  };
};
```

### useTypewriter 🔵

**責務**: タイプライターアニメーション

**実装例**:
```typescript
export const useTypewriter = (
  text: string,
  speed: number = ANIMATION_CONSTANTS.TYPEWRITER_SPEED
): UseTypewriterReturn => {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setIsAnimating(true);
    setIsComplete(false);
    indexRef.current = 0;

    const animate = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
        timerRef.current = window.setTimeout(animate, speed);
      } else {
        setIsAnimating(false);
        setIsComplete(true);
      }
    };

    animate();
  }, [text, speed]);

  const skip = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setDisplayedText(text);
    setIsAnimating(false);
    setIsComplete(true);
  }, [text]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setDisplayedText('');
    setIsAnimating(false);
    setIsComplete(false);
    indexRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    displayedText,
    isAnimating,
    isComplete,
    start,
    skip,
    reset,
  };
};
```

### useImageExport 🔵

**責務**: html2canvasを使った画像エクスポート

**実装例**:
```typescript
export const useImageExport = (): UseImageExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportAsImage = async (elementId: string): Promise<void> => {
    setIsExporting(true);
    setError(null);

    try {
      // 動的インポート
      const html2canvas = (await import('html2canvas')).default;

      const element = document.getElementById(elementId);
      if (!element) {
        throw new ImageExportError('要素が見つかりません');
      }

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2, // 高解像度
      });

      const dataUrl = canvas.toDataURL('image/png');
      const date = new Date();
      const filename = `${FILE_CONSTANTS.IMAGE_PREFIX}-${formatDate(date, 'YYYYMMDD')}.${FILE_CONSTANTS.IMAGE_EXTENSION}`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '画像の保存に失敗しました';
      setError(errorMessage);
      throw new ImageExportError(errorMessage, err);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    error,
    exportAsImage,
  };
};
```

## 更新履歴

- 2025-01-20: 初回作成（/tsumiki:kairo-designにより生成）
