/**
 * 日付フォーマッター
 *
 * REQ-306: ファイル名フォーマット
 */

/**
 * ファイル名用の日付フォーマット
 * REQ-306: gift-words-YYYYMMDD.png
 */
export const formatFilename = (prefix = 'gift-words'): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${prefix}-${year}${month}${day}.png`;
};
