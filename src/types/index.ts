/**
 * TypeScript型定義
 *
 * プロジェクト全体で使用する型定義を定義します。
 * EARS要件定義書に基づいて各型を定義しています。
 */

/**
 * 贈る言葉のデータ構造
 * REQ-001, REQ-002
 */
export interface GiftWordData {
  /** 贈りたい言葉（最大50文字） REQ-013 🔵 */
  word: string;
  /** その意味（最大300文字） REQ-014 🔵 */
  meaning: string;
  /** 生成日時（オプション） 🟡 */
  timestamp?: number;
}

/**
 * バリデーションエラーの型
 * REQ-011, REQ-012, REQ-013, REQ-014
 */
export interface ValidationErrors {
  /** 「贈りたい言葉」のエラーメッセージ 🔵 */
  word?: string;
  /** 「その意味」のエラーメッセージ 🔵 */
  meaning?: string;
}

/**
 * フォームの状態
 * US-001: 言葉入力フォーム
 */
export interface FormState {
  /** 入力された言葉 🔵 */
  word: string;
  /** 入力された意味 🔵 */
  meaning: string;
  /** バリデーションエラー 🔵 */
  errors: ValidationErrors;
  /** フォームが有効かどうか 🔵 */
  isValid: boolean;
  /** 送信中かどうか 🟡 */
  isSubmitting: boolean;
}

/**
 * トーストメッセージの型
 * REQ-105, REQ-311
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  /** 一意のID 🔵 */
  id: string;
  /** 表示メッセージ 🔵 */
  message: string;
  /** メッセージの種類 🔵 */
  type: ToastType;
  /** 表示時間（ミリ秒） 🔵 */
  duration?: number;
}

/**
 * タイプライターアニメーションの設定
 * REQ-205, REQ-231
 */
export interface TypewriterConfig {
  /** 1文字あたりの表示時間（ミリ秒） REQ-231: 100ms 🔵 */
  delay: number;
  /** アニメーション完了時のコールバック 🟡 */
  onComplete?: () => void;
}

/**
 * URL エンコード/デコードの結果
 * REQ-102, REQ-103
 */
export interface EncodeResult {
  /** 生成されたURL 🔵 */
  url: string;
  /** 処理が成功したかどうか 🔵 */
  success: boolean;
  /** エラーメッセージ（失敗時） 🔵 */
  error?: string;
}

export interface DecodeResult {
  /** デコードされたデータ 🔵 */
  data: GiftWordData | null;
  /** 処理が成功したかどうか 🔵 */
  success: boolean;
  /** エラーメッセージ（失敗時） 🔵 */
  error?: string;
}

/**
 * 画像エクスポートの設定
 * REQ-303, REQ-304, REQ-305
 */
export interface ImageExportConfig {
  /** ファイル名 REQ-306 🔵 */
  filename?: string;
  /** 画像形式 REQ-304: PNG 🔵 */
  format?: 'png' | 'jpeg';
  /** 画質（0-1） REQ-305 🔵 */
  quality?: number;
}

/**
 * 画像エクスポートの状態
 * REQ-302, REQ-311
 * TASK-0037: html2canvas統合
 */
export interface ImageExportState {
  /** エクスポート処理中かどうか 🔵 */
  isExporting: boolean;
  /** 進捗（0-100） 🟡 */
  progress: number;
  /** エラーメッセージ（失敗時） 🔵 */
  error: string | null;
}

/**
 * html2canvas オプション設定
 * REQ-303, REQ-304, REQ-305
 * TASK-0037: html2canvas統合
 */
export interface Html2CanvasOptions {
  /** 背景色（null=透明） REQ-305 🔵 */
  backgroundColor: string | null;
  /** スケール（高解像度用） REQ-305 🔵 */
  scale: number;
  /** ログ出力（開発時のみtrue） 🟡 */
  logging: boolean;
  /** CORS対応画像の使用 🔵 */
  useCORS: boolean;
  /** Taint許可（セキュリティ注意） 🟡 */
  allowTaint: boolean;
}

/**
 * 定数定義
 */
export const VALIDATION_RULES = {
  /** 言葉の最大文字数 REQ-013 🔵 */
  MAX_WORD_LENGTH: 50,
  /** 意味の最大文字数 REQ-014 🔵 */
  MAX_MEANING_LENGTH: 300,
  /** URLの最大長 REQ-111 🔵 */
  MAX_URL_LENGTH: 2048, // ブラウザの一般的な最大URL長に合わせて増加
} as const;

export const ANIMATION_CONFIG = {
  /** タイプライター速度（ms/文字） REQ-231 🔵 */
  TYPEWRITER_DELAY: 100,
  /** アニメーションFPS REQ-002 🟡 */
  TARGET_FPS: 60,
} as const;

export const TOAST_CONFIG = {
  /** デフォルト表示時間（ms） 🟡 */
  DEFAULT_DURATION: 3000,
  /** 成功メッセージの表示時間 🟡 */
  SUCCESS_DURATION: 2000,
  /** エラーメッセージの表示時間 🟡 */
  ERROR_DURATION: 5000,
} as const;
