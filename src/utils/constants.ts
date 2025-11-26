/**
 * アプリケーション全体の定数定義
 *
 * ルート、ストレージキー、メッセージなどの定数を管理します。
 */

/** ローカルストレージのキー 🟡 */
export const STORAGE_KEYS = {
  /** チュートリアル表示済みフラグ REQ-004 🔵 */
  TUTORIAL_SHOWN: 'tutorial_shown',
} as const;

/** ルートパス 🔵 */
export const ROUTES = {
  /** ホームページ（入力フォーム） F-001 🔵 */
  HOME: '/',
  /** 表示ページ F-003 🔵 */
  DISPLAY: '/display',
  /** エラーページ 🟡 */
  ERROR: '/error',
} as const;

/** エラーメッセージ 🔵 */
export const ERROR_MESSAGES = {
  /** 言葉未入力エラー REQ-011 🔵 */
  WORD_REQUIRED: '贈りたい言葉を入力してください',
  /** 意味未入力エラー REQ-012 🔵 */
  MEANING_REQUIRED: 'その意味を入力してください',
  /** 言葉文字数超過エラー REQ-013 🔵 */
  WORD_TOO_LONG: '贈りたい言葉は50文字以内で入力してください',
  /** 意味文字数超過エラー REQ-014 🔵 */
  MEANING_TOO_LONG: 'その意味は300文字以内で入力してください',
  /** 不正なURL REQ-212 🔵 */
  INVALID_URL: 'URLが正しくありません',
  /** 不正なデータ 🔵 */
  INVALID_DATA: 'データが不正です',
  /** デコード失敗 REQ-103 🔵 */
  DECODE_FAILED: 'データの読み込みに失敗しました',
  /** エンコード失敗 REQ-102 🔵 */
  ENCODE_FAILED: 'URLの生成に失敗しました',
  /** URL長超過 REQ-111 🔵 */
  URL_TOO_LONG: 'URLが長すぎます',
  /** クリップボードコピー失敗 REQ-106 🔵 */
  COPY_FAILED: 'URLのコピーに失敗しました',
  /** バリデーション失敗 🔵 */
  VALIDATION_FAILED: '入力内容に誤りがあります',
  /** 予期しないエラー 🔵 */
  UNEXPECTED_ERROR: '予期しないエラーが発生しました',
  /** 画像エクスポート失敗 REQ-303 🔵 */
  IMAGE_EXPORT_FAILED: '画像の保存に失敗しました',
  /** ネットワークエラー TASK-0041 🔵 */
  NETWORK_ERROR: 'ネットワークエラーが発生しました。インターネット接続を確認してください。',
} as const;

/** 成功メッセージ 🔵 */
export const SUCCESS_MESSAGES = {
  /** URL コピー成功 REQ-104 🔵 */
  URL_COPIED: 'URLをコピーしました',
  /** 画像保存成功 REQ-303 🔵 */
  IMAGE_SAVED: '画像を保存しました',
} as const;

/** CSS変数名 🟡 */
export const CSS_VARS = {
  /** チョークの色 🟡 */
  CHALK_COLOR: '--color-chalk',
  /** 黒板の背景色 🟡 */
  BLACKBOARD_BG: '--color-blackboard',
} as const;

/**
 * 画像エクスポート設定
 * TASK-0037: html2canvas統合
 * REQ-303, REQ-304, REQ-305, REQ-306
 */
export const IMAGE_EXPORT_CONFIG = {
  /** PNG形式（REQ-304） 🔵 */
  FORMAT: 'image/png' as const,
  /** 画質（標準品質）REQ-305 🔵 */
  QUALITY: 1.0,
  /** スケール（高解像度用）REQ-305 🔵 */
  SCALE: 2,
  /** 背景色（null=透明）REQ-305 🔵 */
  BACKGROUND_COLOR: null,
  /** CORS対応 🔵 */
  USE_CORS: true,
  /** ログ出力（開発環境のみ）🟡 */
  LOGGING: false,
  /** ファイル名プレフィックス REQ-306 🔵 */
  FILENAME_PREFIX: 'gift-words-',
} as const;
