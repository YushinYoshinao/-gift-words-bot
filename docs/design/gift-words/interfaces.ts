/**
 * 贈る言葉BOT TypeScript型定義
 *
 * 【信頼性レベル】: 🔵 要件定義書に基づいて作成
 *
 * このファイルはプロジェクト全体で使用される型定義を含みます。
 * 実装時はこの型定義を src/types/index.ts にコピーして使用してください。
 */

// ============================================================================
// エンティティ型定義
// ============================================================================

/**
 * 贈る言葉のデータ構造
 * 🔵 REQ-001, REQ-002, REQ-101より
 */
export interface GiftWordData {
  /** 贈りたい言葉（最大50文字）*/
  word: string;

  /** その意味（最大300文字）*/
  meaning: string;

  /** 生成日時（オプション）*/
  timestamp?: number;
}

/**
 * バリデーションエラーの構造
 * 🔵 REQ-011, REQ-012, REQ-013, REQ-014より
 */
export interface ValidationErrors {
  /** 言葉のエラーメッセージ */
  word?: string;

  /** 意味のエラーメッセージ */
  meaning?: string;
}

/**
 * トーストメッセージの構造
 * 🔵 REQ-105, REQ-311より
 */
export interface ToastMessage {
  /** 一意のID */
  id: string;

  /** メッセージ内容 */
  message: string;

  /** メッセージタイプ */
  type: ToastType;

  /** 表示時間（ミリ秒、デフォルト3000）*/
  duration?: number;
}

/**
 * トーストメッセージのタイプ
 * 🔵 要件定義書より
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// ============================================================================
// コンポーネントProps型定義
// ============================================================================

/**
 * InputFormコンポーネントのProps
 * 🔵 F-001より
 */
export interface InputFormProps {
  /** 送信ハンドラー */
  onSubmit: (data: GiftWordData) => void;

  /** 送信中フラグ */
  isSubmitting?: boolean;
}

/**
 * WordInputコンポーネントのProps
 * 🔵 REQ-001, REQ-013より
 */
export interface WordInputProps {
  /** 入力値 */
  value: string;

  /** 変更ハンドラー */
  onChange: (value: string) => void;

  /** エラーメッセージ */
  error?: string;

  /** 最大文字数（デフォルト50）*/
  maxLength?: number;

  /** 無効化フラグ */
  disabled?: boolean;
}

/**
 * MeaningTextareaコンポーネントのProps
 * 🔵 REQ-002, REQ-014より
 */
export interface MeaningTextareaProps {
  /** 入力値 */
  value: string;

  /** 変更ハンドラー */
  onChange: (value: string) => void;

  /** エラーメッセージ */
  error?: string;

  /** 最大文字数（デフォルト300）*/
  maxLength?: number;

  /** 無効化フラグ */
  disabled?: boolean;
}

/**
 * CharacterCounterコンポーネントのProps
 * 🟡 一般的なUI要件から
 */
export interface CharacterCounterProps {
  /** 現在の文字数 */
  current: number;

  /** 最大文字数 */
  max: number;

  /** エラー状態 */
  hasError?: boolean;
}

/**
 * TutorialModalコンポーネントのProps
 * 🔵 REQ-004より
 */
export interface TutorialModalProps {
  /** 表示フラグ */
  isOpen: boolean;

  /** 閉じるハンドラー */
  onClose: () => void;

  /** 次回から表示しないオプション変更ハンドラー */
  onDontShowAgain?: (checked: boolean) => void;
}

/**
 * ShareModalコンポーネントのProps
 * 🔵 F-002より
 */
export interface ShareModalProps {
  /** 表示フラグ */
  isOpen: boolean;

  /** 生成されたURL */
  shareUrl: string;

  /** 閉じるハンドラー */
  onClose: () => void;
}

/**
 * DisplayPageコンポーネントのProps
 * 🔵 F-003より
 */
export interface DisplayPageProps {
  /** 表示する言葉データ */
  data: GiftWordData;
}

/**
 * VerticalTextDisplayコンポーネントのProps
 * 🔵 REQ-203より
 */
export interface VerticalTextDisplayProps {
  /** 贈る言葉 */
  word: string;

  /** 意味 */
  meaning: string;

  /** タイプライターアニメーション有効フラグ */
  enableTypewriter?: boolean;

  /** アニメーション速度（ミリ秒/文字、デフォルト100）*/
  typewriterSpeed?: number;

  /** アニメーション完了コールバック */
  onAnimationComplete?: () => void;

  /** スキップコールバック */
  onSkip?: () => void;
}

/**
 * ToastContainerコンポーネントのProps
 * 🔵 REQ-105より
 */
export interface ToastContainerProps {
  /** トーストメッセージリスト */
  toasts: ToastMessage[];

  /** トースト削除ハンドラー */
  onRemove: (id: string) => void;
}

/**
 * ToastコンポーネントのProps
 * 🔵 REQ-105より
 */
export interface ToastProps {
  /** トーストメッセージ */
  toast: ToastMessage;

  /** 削除ハンドラー */
  onRemove: () => void;
}

// ============================================================================
// フック型定義
// ============================================================================

/**
 * useFormValidation hookの戻り値
 * 🔵 F-001バリデーション要件より
 */
export interface UseFormValidationReturn {
  /** 言葉の値 */
  word: string;

  /** 意味の値 */
  meaning: string;

  /** エラー状態 */
  errors: ValidationErrors;

  /** バリデーション実行中フラグ */
  isValidating: boolean;

  /** 全体が有効かどうか */
  isValid: boolean;

  /** 言葉の変更ハンドラー */
  handleWordChange: (value: string) => void;

  /** 意味の変更ハンドラー */
  handleMeaningChange: (value: string) => void;

  /** 手動バリデーション実行 */
  validate: () => boolean;

  /** フォームリセット */
  reset: () => void;
}

/**
 * useTypewriter hookの戻り値
 * 🔵 REQ-205, REQ-231より
 */
export interface UseTypewriterReturn {
  /** 現在表示されているテキスト */
  displayedText: string;

  /** アニメーション実行中フラグ */
  isAnimating: boolean;

  /** アニメーション完了フラグ */
  isComplete: boolean;

  /** アニメーション開始 */
  start: () => void;

  /** アニメーションスキップ */
  skip: () => void;

  /** アニメーションリセット */
  reset: () => void;
}

/**
 * useImageExport hookの戻り値
 * 🔵 F-004より
 */
export interface UseImageExportReturn {
  /** 画像エクスポート実行中フラグ */
  isExporting: boolean;

  /** エラー状態 */
  error: string | null;

  /** 画像エクスポート実行 */
  exportAsImage: (elementId: string) => Promise<void>;
}

/**
 * useToast hookの戻り値
 * 🔵 REQ-105より
 */
export interface UseToastReturn {
  /** トーストメッセージリスト */
  toasts: ToastMessage[];

  /** トースト表示 */
  showToast: (message: string, type?: ToastType, duration?: number) => void;

  /** 成功トースト表示 */
  showSuccess: (message: string) => void;

  /** エラートースト表示 */
  showError: (message: string) => void;

  /** 警告トースト表示 */
  showWarning: (message: string) => void;

  /** 情報トースト表示 */
  showInfo: (message: string) => void;

  /** トースト削除 */
  removeToast: (id: string) => void;
}

/**
 * useTutorial hookの戻り値
 * 🔵 REQ-004より
 */
export interface UseTutorialReturn {
  /** 初回訪問かどうか */
  isFirstVisit: boolean;

  /** チュートリアル表示フラグ */
  shouldShowTutorial: boolean;

  /** チュートリアル完了マーク */
  markTutorialComplete: () => void;

  /** チュートリアル表示設定更新 */
  setDontShowAgain: (value: boolean) => void;
}

// ============================================================================
// ユーティリティ型定義
// ============================================================================

/**
 * URLエンコード結果
 * 🔵 REQ-103より
 */
export interface EncodedUrlData {
  /** Base64エンコードされた文字列 */
  encoded: string;

  /** 元のデータ */
  original: GiftWordData;

  /** エンコード日時 */
  encodedAt: number;
}

/**
 * URLデコード結果
 * 🔵 REQ-103より
 */
export type DecodeResult<T> =
  | { success: true; data: T }
  | { success: false; error: DecodeError };

/**
 * デコードエラーの種類
 * 🔵 REQ-211, REQ-212, REQ-213より
 */
export enum DecodeError {
  /** パラメータ不在 */
  MISSING_PARAMETER = 'MISSING_PARAMETER',

  /** Base64デコード失敗 */
  DECODE_FAILED = 'DECODE_FAILED',

  /** JSON解析失敗 */
  PARSE_FAILED = 'PARSE_FAILED',

  /** データ検証失敗 */
  VALIDATION_FAILED = 'VALIDATION_FAILED',

  /** URL長さ超過 */
  URL_TOO_LONG = 'URL_TOO_LONG',
}

/**
 * バリデーションルール
 * 🔵 REQ-013, REQ-014より
 */
export interface ValidationRule {
  /** ルール名 */
  name: string;

  /** バリデーション関数 */
  validate: (value: string) => boolean;

  /** エラーメッセージ */
  message: string;
}

/**
 * バリデーション設定
 * 🔵 バリデーション要件より
 */
export interface ValidationConfig {
  /** 言葉の最大文字数 */
  wordMaxLength: number;

  /** 意味の最大文字数 */
  meaningMaxLength: number;

  /** URL最大長 */
  urlMaxLength: number;
}

/**
 * アニメーション設定
 * 🔵 REQ-231より
 */
export interface TypewriterConfig {
  /** 文字表示速度（ミリ秒/文字）*/
  speed: number;

  /** スキップ可能フラグ */
  skippable: boolean;

  /** 自動開始フラグ */
  autoStart: boolean;
}

/**
 * 画像エクスポート設定
 * 🔵 REQ-304, REQ-305より
 */
export interface ImageExportConfig {
  /** ファイル形式 */
  format: 'png' | 'jpeg';

  /** 画質（0-1、PNGでは無視）*/
  quality: number;

  /** ファイル名プレフィックス */
  filenamePrefix: string;

  /** 日付フォーマット含むか */
  includeDateInFilename: boolean;
}

// ============================================================================
// Context型定義
// ============================================================================

/**
 * AppContextの型
 * 🔵 状態管理要件より
 */
export interface AppContextType {
  /** チュートリアル状態 */
  tutorial: UseTutorialReturn;

  /** トースト状態 */
  toast: UseToastReturn;
}

/**
 * TutorialContextの型
 * 🔵 REQ-004より
 */
export interface TutorialContextType {
  /** 初回訪問フラグ */
  isFirstVisit: boolean;

  /** 初回訪問フラグ設定 */
  setFirstVisit: (value: boolean) => void;

  /** 次回から表示しないフラグ */
  dontShowAgain: boolean;

  /** 次回から表示しないフラグ設定 */
  setDontShowAgain: (value: boolean) => void;
}

/**
 * ToastContextの型
 * 🔵 REQ-105より
 */
export interface ToastContextType {
  /** トーストリスト */
  toasts: ToastMessage[];

  /** トースト追加 */
  addToast: (message: string, type: ToastType, duration?: number) => void;

  /** トースト削除 */
  removeToast: (id: string) => void;
}

// ============================================================================
// エラー型定義
// ============================================================================

/**
 * アプリケーションエラーの基底クラス
 * 🟡 エラーハンドリング要件より
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * バリデーションエラー
 * 🔵 バリデーション要件より
 */
export class ValidationError extends AppError {
  constructor(message: string, public field: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * URLデコードエラー
 * 🔵 REQ-211, REQ-212, REQ-213より
 */
export class UrlDecodeError extends AppError {
  constructor(message: string, public errorType: DecodeError, details?: unknown) {
    super(message, 'URL_DECODE_ERROR', details);
    this.name = 'UrlDecodeError';
  }
}

/**
 * 画像エクスポートエラー
 * 🔵 REQ-311より
 */
export class ImageExportError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'IMAGE_EXPORT_ERROR', details);
    this.name = 'ImageExportError';
  }
}

// ============================================================================
// 定数型定義
// ============================================================================

/**
 * バリデーション定数
 * 🔵 要件定義書より
 */
export const VALIDATION_CONSTANTS = {
  /** 言葉の最大文字数 */
  WORD_MAX_LENGTH: 50, // REQ-013

  /** 意味の最大文字数 */
  MEANING_MAX_LENGTH: 300, // REQ-014

  /** URL最大長 */
  URL_MAX_LENGTH: 500, // REQ-111
} as const;

/**
 * アニメーション定数
 * 🔵 要件定義書より
 */
export const ANIMATION_CONSTANTS = {
  /** タイプライター速度（ミリ秒/文字）*/
  TYPEWRITER_SPEED: 100, // REQ-231

  /** 目標FPS */
  TARGET_FPS: 60, // NFR-002
} as const;

/**
 * パフォーマンス定数
 * 🔵 要件定義書より
 */
export const PERFORMANCE_CONSTANTS = {
  /** ページ読み込み目標時間（ミリ秒）*/
  PAGE_LOAD_TARGET: 3000, // NFR-001

  /** バンドルサイズ目標（バイト、gzip圧縮後）*/
  BUNDLE_SIZE_TARGET: 500 * 1024, // NFR-003
} as const;

/**
 * トースト定数
 * 🔵 要件定義書より
 */
export const TOAST_CONSTANTS = {
  /** デフォルト表示時間（ミリ秒）*/
  DEFAULT_DURATION: 3000,

  /** 最大同時表示数 */
  MAX_TOASTS: 3,
} as const;

/**
 * LocalStorage キー定数
 * 🔵 REQ-004より
 */
export const STORAGE_KEYS = {
  /** チュートリアル表示済みフラグ */
  TUTORIAL_SHOWN: 'tutorial_shown',

  /** 次回から表示しないフラグ */
  DONT_SHOW_TUTORIAL: 'dont_show_tutorial',
} as const;

/**
 * ファイル名定数
 * 🔵 REQ-306より
 */
export const FILE_CONSTANTS = {
  /** 画像ファイル名プレフィックス */
  IMAGE_PREFIX: 'gift-words',

  /** 画像ファイル拡張子 */
  IMAGE_EXTENSION: 'png',
} as const;

// ============================================================================
// ルーティング型定義
// ============================================================================

/**
 * アプリケーションルート
 * 🔵 ルーティング要件より
 */
export enum AppRoutes {
  /** トップページ */
  HOME = '/',

  /** 表示ページ */
  DISPLAY = '/display',

  /** エラーページ */
  ERROR = '/error',
}

/**
 * ルートパラメータ
 * 🔵 URLパラメータ要件より
 */
export interface DisplayPageParams {
  /** Base64エンコードされたデータ */
  data: string;
}

// ============================================================================
// ユーティリティ型
// ============================================================================

/**
 * Promiseの戻り値型を取得
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * 関数の引数型を取得
 */
export type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;

/**
 * オプショナルなプロパティのみ抽出
 */
export type Optional<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K];
};

/**
 * 必須プロパティのみ抽出
 */
export type Required<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};

// ============================================================================
// 型ガード関数
// ============================================================================

/**
 * GiftWordDataの型ガード
 * 🔵 データ検証要件より
 */
export function isGiftWordData(value: unknown): value is GiftWordData {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const data = value as Partial<GiftWordData>;

  return (
    typeof data.word === 'string' &&
    data.word.length > 0 &&
    data.word.length <= VALIDATION_CONSTANTS.WORD_MAX_LENGTH &&
    typeof data.meaning === 'string' &&
    data.meaning.length > 0 &&
    data.meaning.length <= VALIDATION_CONSTANTS.MEANING_MAX_LENGTH &&
    (data.timestamp === undefined || typeof data.timestamp === 'number')
  );
}

/**
 * ToastTypeの型ガード
 * 🟡 型安全性向上のため
 */
export function isToastType(value: unknown): value is ToastType {
  return (
    typeof value === 'string' &&
    ['success', 'error', 'warning', 'info'].includes(value)
  );
}

/**
 * DecodeErrorの型ガード
 * 🟡 型安全性向上のため
 */
export function isDecodeError(value: unknown): value is DecodeError {
  return (
    typeof value === 'string' &&
    Object.values(DecodeError).includes(value as DecodeError)
  );
}
