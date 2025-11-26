/**
 * usePageTitle フックのテスト
 * TASK-0045: ARIA属性・アクセシビリティ改善
 *
 * テスト対象:
 * - NFR-204: セマンティックHTML使用 🔵
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePageTitle } from '../usePageTitle';

describe('usePageTitle - TASK-0045', () => {
  let originalTitle: string;

  // 【テスト前準備】: 各テスト実行前に元のタイトルを保存 🔵
  // 【環境初期化】: テスト終了後に元のタイトルに復元するための準備 🔵
  beforeEach(() => {
    originalTitle = document.title;
  });

  // 【テスト後処理】: 各テスト実行後に元のタイトルに復元 🔵
  // 【状態復元】: 次のテストに影響しないよう、document.titleを元に戻す 🔵
  afterEach(() => {
    document.title = originalTitle;
  });

  it('ページタイトルが動的に更新される', () => {
    // 【テスト目的】: 動的ページタイトル更新機能の実装確認 🔵
    // 【テスト内容】: usePageTitleフックがdocument.titleを正しく更新すること 🔵
    // 【期待される動作】: フォーマット「{title} - 贈る言葉BOT」が適用されること 🔵
    // 🔵 信頼性レベル: NFR-204要件、タスク仕様に基づく

    // 【テストデータ準備】: ページ固有タイトル「言葉を作成」 🔵
    // 【初期条件設定】: HomePageでの使用を想定 🔵
    const pageTitle = '言葉を作成';

    // 【実際の処理実行】: usePageTitleフックを呼び出す 🔵
    // 【処理内容】: document.titleが更新されることを期待 🔵
    renderHook(() => usePageTitle(pageTitle));

    // 【結果検証】: document.titleが正しいフォーマットで更新されたことを確認 🔵
    // 【期待値確認】: サフィックス「- 贈る言葉BOT」が自動追加される 🔵
    expect(document.title).toBe('言葉を作成 - 贈る言葉BOT');
    // 【確認内容】: ページごとに異なるタイトルでユーザーの現在地を明確化 🔵
  });

  it('アンマウント時にタイトルが復元される', () => {
    // 【テスト目的】: useEffectクリーンアップ関数の動作確認 🔵
    // 【テスト内容】: コンポーネントアンマウント時にdocument.titleが元に戻ること 🔵
    // 【期待される動作】: メモリリークや状態漏洩がないこと 🔵
    // 🔵 信頼性レベル: NFR-204要件、Reactクリーンアップパターンに基づく

    // 【テストデータ準備】: 元のタイトルを保存してから新しいタイトルを設定 🔵
    // 【初期条件設定】: アンマウント動作のテスト 🔵
    const initialTitle = document.title;
    const pageTitle = '新しいタイトル';

    // 【実際の処理実行】: usePageTitleフックを呼び出してレンダリング 🔵
    // 【処理内容】: マウント時にタイトルが更新される 🔵
    const { unmount } = renderHook(() => usePageTitle(pageTitle));

    // 【マウント時の検証】: タイトルが更新されていることを確認 🔵
    expect(document.title).toBe('新しいタイトル - 贈る言葉BOT');
    // 【確認内容】: useEffectの副作用が正しく実行される 🔵

    // 【アンマウント実行】: コンポーネントをアンマウント 🔵
    // 【処理内容】: useEffectのreturn関数（クリーンアップ）が実行される 🔵
    unmount();

    // 【結果検証】: 元のタイトルに復元されたことを確認 🔵
    // 【期待値確認】: ページ遷移やコンポーネント破棄時にタイトルが正しく管理される 🔵
    expect(document.title).toBe(initialTitle);
    // 【確認内容】: 副作用の適切なクリーンアップでメモリリーク防止 🔵
  });

  it('タイトル変更時に前のタイトルが復元される', () => {
    // 【テスト目的】: useEffectの依存配列による再実行を確認 🔵
    // 【テスト内容】: タイトルが変更された際、古いタイトルから新しいタイトルに切り替わること 🔵
    // 【期待される動作】: アンマウント時は最初のタイトルに戻ること 🔵
    // 🔵 信頼性レベル: React Hooksのベストプラクティスに基づく

    // 【初期テストデータ準備】: 最初のタイトル 🔵
    // 【初期条件設定】: 「言葉を作成」ページ 🔵
    const firstTitle = '言葉を作成';
    const initialTitle = document.title;

    // 【フックレンダリング】: 初期タイトルでフックを実行 🔵
    const { rerender, unmount } = renderHook(
      ({ title }) => usePageTitle(title),
      { initialProps: { title: firstTitle } }
    );

    // 【初期タイトル確認】: 最初のタイトルが設定されていることを確認 🔵
    expect(document.title).toBe('言葉を作成 - 贈る言葉BOT');
    // 【確認内容】: 初期タイトルが正しく適用される 🔵

    // 【タイトル更新】: 「言葉を表示」ページに変更 🔵
    // 【処理内容】: rerenderでタイトルを変更 🔵
    const secondTitle = '言葉を表示';
    rerender({ title: secondTitle });

    // 【更新後確認】: 新しいタイトルに変更されていることを確認 🔵
    expect(document.title).toBe('言葉を表示 - 贈る言葉BOT');
    // 【確認内容】: タイトルの動的更新が正しく動作する 🔵

    // 【アンマウント後確認】: 元のタイトルに復元されることを確認 🔵
    unmount();
    expect(document.title).toBe(initialTitle);
    // 【確認内容】: 最初のタイトル（rerenderで変更される前のタイトル）に戻る 🔵
  });

  describe('境界値テスト (TASK-0045)', () => {
    it('空文字列タイトルでもエラーが発生しない', () => {
      // 【テスト目的】: 境界値での堅牢性を確認 🟡
      // 【テスト内容】: usePageTitleに空文字列が渡された場合の処理 🟡
      // 【期待される動作】: 空文字列でもクラッシュしない 🟡
      // 🟡 信頼性レベル: エッジケースハンドリングから推測

      // 【テストデータ準備】: title=""は最小限の入力値 🟡
      // 【初期条件設定】: 異常値としてテストすべき境界値 🟡
      const emptyTitle = '';

      // 【実際の処理実行】: 空文字列でフックを呼び出す 🟡
      // 【処理内容】: エラーがスローされないことを確認 🟡
      expect(() => {
        renderHook(() => usePageTitle(emptyTitle));
      }).not.toThrow();
      // 【確認内容】: 空文字列でもシステムが安定動作する 🟡

      // 【結果検証】: document.titleが正しく設定されたことを確認 🟡
      // 【期待値確認】: 空文字列の場合は「- 贈る言葉BOT」となる 🟡
      expect(document.title).toBe('- 贈る言葉BOT');
      // 【確認内容】: 極端な入力値でもユーザー体験が損なわれない 🟡
    });

    it('非常に長いタイトル（200文字）でもエラーが発生しない', () => {
      // 【テスト目的】: 文字列長の境界値での動作確認 🟡
      // 【テスト内容】: usePageTitleに長いタイトル（200文字）が渡された場合の処理 🟡
      // 【期待される動作】: 長いタイトルでも正しく設定される 🟡
      // 🟡 信頼性レベル: エッジケースハンドリングから推測

      // 【テストデータ準備】: 極端に長い文字列での動作確認 🟡
      // 【初期条件設定】: メモリやパフォーマンスへの影響確認 🟡
      const longTitle = 'あ'.repeat(200);

      // 【実際の処理実行】: 長いタイトルでフックを呼び出す 🟡
      // 【処理内容】: エラーがスローされないことを確認 🟡
      expect(() => {
        renderHook(() => usePageTitle(longTitle));
      }).not.toThrow();
      // 【確認内容】: 極端な長さでも正常動作する 🟡

      // 【結果検証】: document.titleが正しく設定されたことを確認 🟡
      // 【期待値確認】: 文字列連結が正確に行われる 🟡
      const expectedTitle = longTitle + ' - 贈る言葉BOT';
      expect(document.title).toBe(expectedTitle);
      // 【確認内容】: 文字列の長さに関わらず正しく処理される 🟡
    });
  });
});
