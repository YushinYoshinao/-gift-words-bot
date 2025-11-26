/**
 * ページタイトルを動的に更新するカスタムフック
 * TASK-0045: NFR-204 セマンティックHTML対応
 *
 * @module usePageTitle
 */

import { useEffect } from 'react';

/**
 * ページタイトルを動的に更新し、アンマウント時に復元するフック
 *
 * @param title - ページ固有のタイトル(例: "言葉を作成")
 *
 * @example
 * ```tsx
 * function HomePage() {
 *   usePageTitle('言葉を作成');
 *   return <div>...</div>;
 * }
 * ```
 *
 * @remarks
 * - タイトルは"{title} - 贈る言葉BOT"のフォーマットで設定される
 * - コンポーネントアンマウント時に元のタイトルに自動復元される
 * - 空文字列や長いタイトル(200文字以上)にも対応
 */
export const usePageTitle = (title: string): void => {
  useEffect(() => {
    // 【タイトル保存】: 元のタイトルを保存
    const prevTitle = document.title;

    // 【タイトル更新】: 新しいタイトルを設定(フォーマット: "{title} - 贈る言葉BOT")
    document.title = `${title} - 贈る言葉BOT`;

    // 【クリーンアップ】: アンマウント時に元のタイトルに復元
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
