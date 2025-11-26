/// <reference types="vite/client" />
/// <reference types="@testing-library/jest-dom" />

/**
 * CSS Modules型定義
 * TASK-0008: CSS Modules設定
 *
 * 関連要件:
 * - REQ-232: 縦書きCSS writing-mode: vertical-rl 🔵
 * - REQ-233: チョーク風の色 🔵
 * - NFR-203: レスポンシブデザイン 🔵
 */

// CSS Modules型定義
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
