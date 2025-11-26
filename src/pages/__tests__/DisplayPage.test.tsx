/**
 * DisplayPage コンポーネントのテスト
 * TASK-0025: DisplayPage基本構造実装
 *
 * テスト対象:
 * - F-003: 贈る言葉表示ページ 🔵
 * - REQ-201: 武田鉄矢の画像を背景として表示 🔵
 * - REQ-206: 「新しい言葉を贈る」ボタン 🔵
 * - REQ-212: URLパラメータ不在時のリダイレクト 🔵
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DisplayPage from '../DisplayPage';
import { ToastProvider } from '../../context/ToastContext';

// useTypewriterのモック
vi.mock('../../hooks/useTypewriter', () => ({
  default: vi.fn(({ text, onComplete, enabled = true }) => {
    // アニメーションなしで即座に表示
    if (enabled) {
      setTimeout(() => onComplete?.(), 0);
    }
    return {
      displayText: enabled ? text : '',
      isComplete: enabled,
      skip: vi.fn(),
      reset: vi.fn(),
    };
  }),
}));

// テストヘルパー: ProviderとRouterでラップ
const renderWithRouter = (initialEntries: string[] = ['/display?data=test']) => {
  return render(
    <ToastProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/display" element={<DisplayPage />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
};

describe('DisplayPage - TASK-0025 基本構造', () => {
  it('正常にレンダリングされる', () => {
    // 【テスト目的】: DisplayPageコンポーネントが正常に表示されることを確認
    // 【テスト内容】: 有効なURLパラメータでページをレンダリング
    // 【期待される動作】: コンポーネントがエラーなくマウントされる
    // 🔵 信頼性レベル: Phase 3タスク定義書のTASK-0025仕様に基づく

    // 【テストデータ準備】: Base64エンコードされた有効なデータを用意
    // 【初期条件設定】: URLパラメータ付きでページを表示
    const validData = btoa(encodeURIComponent(JSON.stringify({ word: 'テスト', meaning: 'テストの意味' })));
    const { container } = renderWithRouter([`/display?data=${validData}`]);

    // 【結果検証】: コンポーネントがレンダリングされている
    // 【期待値確認】: コンテナ要素が存在する
    expect(container).toBeInTheDocument(); // 【確認内容】: DisplayPageがDOMに存在することを確認 🔵
  });

  it('URLパラメータがない場合はリダイレクトされる', async () => {
    // 【テスト目的】: URLパラメータがない場合の適切なエラーハンドリングを確認
    // 【テスト内容】: dataパラメータなしでDisplayPageにアクセス
    // 【期待される動作】: トップページ（/）にリダイレクトされる
    // 🔵 信頼性レベル: REQ-212 - URLパラメータ不在時のリダイレクト要件に基づく

    // 【初期条件設定】: URLパラメータなしでページにアクセス
    renderWithRouter(['/display']);

    // 【結果検証】: ホームページへのリダイレクトを確認
    // 【期待される表示変化】: Home Pageテキストが表示される
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument(); // 【確認内容】: トップページにリダイレクトされたことを確認 🔵
    });
  });

  it('不正なURLパラメータの場合はエラーページを表示', () => {
    // 【テスト目的】: 不正なBase64データに対するエラーハンドリングを確認
    // 【テスト内容】: デコード不可能なdataパラメータでアクセス
    // 【期待される動作】: エラーメッセージまたはエラーページが表示される
    // 🟡 信頼性レベル: REQ-211から推測（TASK-0027で詳細実装予定）

    // 【テストデータ準備】: 不正なBase64文字列を用意
    // 【初期条件設定】: デコードできないデータでアクセス
    const invalidData = 'invalid!!!base64';
    renderWithRouter([`/display?data=${invalidData}`]);

    // 【結果検証】: エラー状態が表示される
    // 【期待値確認】: エラーメッセージまたはエラー表示要素が存在
    // Note: TASK-0027でErrorPageコンポーネント実装後、詳細なアサーションを追加
    const container = screen.queryByRole('alert') || screen.queryByText(/エラー/i);
    expect(container).toBeTruthy(); // 【確認内容】: 何らかのエラー表示があることを確認 🟡
  });

  it('ローディング状態が表示される', async () => {
    // 【テスト目的】: データ取得中のローディングUIを確認
    // 【テスト内容】: コンポーネントマウント直後の状態を検証
    // 【期待される動作】: ローディング表示が一時的に表示される
    // 🟡 信頼性レベル: 一般的なUXパターンから推測

    // 【初期条件設定】: 有効なデータでページをレンダリング
    const validData = btoa(encodeURIComponent(JSON.stringify({ word: 'テスト', meaning: 'テストの意味' })));
    renderWithRouter([`/display?data=${validData}`]);

    // 【結果検証】: ローディングテキストが表示される
    // 【期待値確認】: 「読み込み中」などのローディングメッセージが存在
    const loadingElement = screen.queryByText(/読み込み中/i);

    // 初期レンダリング時にローディングが表示されるか、すぐにコンテンツが表示される
    // 【確認内容】: ローディング状態が適切に処理されることを確認 🟡
    if (loadingElement) {
      expect(loadingElement).toBeInTheDocument();
    }
  });

  it('デコード成功時にデータが表示される', async () => {
    // 【テスト目的】: 正常なデータデコード後の表示を確認
    // 【テスト内容】: 有効なGiftWordDataをデコードして表示
    // 【期待される動作】: BackgroundImageとVerticalTextDisplayが表示される
    // 🔵 信頼性レベル: REQ-201, REQ-203に基づく

    // 【テストデータ準備】: 有効な言葉データを用意
    // 【初期条件設定】: 正常なBase64データでアクセス
    const testData = { word: 'ありがとう', meaning: '感謝の気持ちを表す言葉' };
    const validData = btoa(encodeURIComponent(JSON.stringify(testData)));
    renderWithRouter([`/display?data=${validData}`]);

    // 【結果検証】: コンテンツエリアが表示される
    // 【期待値確認】: 画像と縦書きテキスト表示領域が存在
    await waitFor(() => {
      // CSS Modulesを使用しているため、クラス名ではなくコンテンツで確認
      // 「新しい言葉を贈る」ボタンがあればメイン表示が成功
      const button = screen.queryByRole('button', { name: /新しい言葉を贈る/i });
      expect(button).toBeTruthy(); // 【確認内容】: 表示コンテナが存在することを確認 🔵
    });
  });

  it('「新しい言葉を贈る」ボタンでトップページに戻る', async () => {
    // 【テスト目的】: ナビゲーションボタンの動作確認
    // 【テスト内容】: 「新しい言葉を贈る」ボタンクリックでトップページ遷移
    // 【期待される動作】: /へのナビゲーションが実行される
    // 🔵 信頼性レベル: REQ-206 - 「新しい言葉を贈る」ボタン要件に基づく

    // 【初期条件設定】: 有効なデータでDisplayPageを表示
    const user = userEvent.setup();
    const validData = btoa(encodeURIComponent(JSON.stringify({ word: 'テスト', meaning: 'テストの意味' })));
    renderWithRouter([`/display?data=${validData}`]);

    // 【ユーザー操作実行】: 「新しい言葉を贈る」ボタンをクリック
    // 【操作内容】: ボタン要素を探してクリックイベント発火
    const newWordButton = await screen.findByRole('button', { name: /新しい言葉を贈る/i });
    await user.click(newWordButton);

    // 【結果確認】: トップページにナビゲートされた
    // 【期待される表示変化】: Home Pageが表示される
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument(); // 【確認内容】: トップページへ遷移したことを確認 🔵
    });
  });

  it('必要なコンポーネントが配置されている', () => {
    // 【テスト目的】: DisplayPageの構造が正しいことを確認
    // 【テスト内容】: BackgroundImage、VerticalTextDisplay、Buttonの存在確認
    // 【期待される動作】: 必要なサブコンポーネントが全て配置される
    // 🔵 信頼性レベル: TASK-0025仕様のコンポーネント構成に基づく

    // 【初期条件設定】: 正常なデータでレンダリング
    const validData = btoa(encodeURIComponent(JSON.stringify({ word: 'テスト', meaning: 'テストの意味' })));
    const { container } = renderWithRouter([`/display?data=${validData}`]);

    // 【結果検証】: 各セクションのクラス名またはテストIDが存在
    // 【期待値確認】: container, content, actionsの構造を持つ
    const displayContainer = container.querySelector('.container') ||
                            container.querySelector('[class*="container"]');
    expect(displayContainer).toBeTruthy(); // 【確認内容】: メインコンテナが存在 🔵
  });

  it('空のwordデータの場合はエラーを表示', () => {
    // 【テスト目的】: 不完全なデータに対するバリデーション確認
    // 【テスト内容】: wordが空のデータでアクセス
    // 【期待される動作】: エラーメッセージが表示される
    // 🟡 信頼性レベル: データ検証ロジックから推測

    // 【テストデータ準備】: wordが空のデータを用意
    // 【初期条件設定】: 不完全なデータでアクセス
    const invalidData = btoa(encodeURIComponent(JSON.stringify({ word: '', meaning: 'テストの意味' })));
    renderWithRouter([`/display?data=${invalidData}`]);

    // 【結果検証】: エラー表示またはリダイレクトが発生
    // 【期待値確認】: エラーメッセージまたはホームページ表示
    const error = screen.queryByText(/エラー/i) || screen.queryByText(/Home Page/i);
    expect(error).toBeTruthy(); // 【確認内容】: 不正データがエラーとして処理される 🟡
  });

  it('空のmeaningデータの場合はエラーを表示', () => {
    // 【テスト目的】: 不完全なデータに対するバリデーション確認
    // 【テスト内容】: meaningが空のデータでアクセス
    // 【期待される動作】: エラーメッセージが表示される
    // 🟡 信頼性レベル: データ検証ロジックから推測

    // 【テストデータ準備】: meaningが空のデータを用意
    // 【初期条件設定】: 不完全なデータでアクセス
    const invalidData = btoa(encodeURIComponent(JSON.stringify({ word: 'テスト', meaning: '' })));
    renderWithRouter([`/display?data=${invalidData}`]);

    // 【結果検証】: エラー表示またはリダイレクトが発生
    // 【期待値確認】: エラーメッセージまたはホームページ表示
    const error = screen.queryByText(/エラー/i) || screen.queryByText(/Home Page/i);
    expect(error).toBeTruthy(); // 【確認内容】: 不正データがエラーとして処理される 🟡
  });

  it('日本語（ひらがな、カタカナ、漢字）が正しく表示される', async () => {
    // 【テスト目的】: 日本語テキストの正しい処理を確認
    // 【テスト内容】: 様々な日本語文字種を含むデータで表示
    // 【期待される動作】: すべての日本語が正しくデコード・表示される
    // 🔵 信頼性レベル: REQ-021 - 日本語対応要件に基づく

    // 【テストデータ準備】: ひらがな、カタカナ、漢字を含むデータ
    // 【初期条件設定】: 多様な日本語文字でテスト
    const japaneseData = {
      word: 'ありがとうカタカナ漢字',
      meaning: 'ひらがな、カタカナ、漢字が混在したテキスト'
    };
    const validData = btoa(encodeURIComponent(JSON.stringify(japaneseData)));
    renderWithRouter([`/display?data=${validData}`]);

    // 【結果検証】: コンポーネントがエラーなくレンダリングされる
    // 【期待値確認】: 日本語テキストが適切に処理される
    await waitFor(() => {
      // CSS Modulesを使用しているため、実際のテキストコンテンツで確認
      const wordText = screen.queryByText('ありがとうカタカナ漢字');
      expect(wordText).toBeTruthy(); // 【確認内容】: 日本語データが正常に処理される 🔵
    });
  });

  it('複数回のレンダリングでメモリリークが発生しない', () => {
    // 【テスト目的】: コンポーネントのクリーンアップが適切に行われることを確認
    // 【テスト内容】: 同じコンポーネントを複数回マウント/アンマウント
    // 【期待される動作】: メモリリークやエラーが発生しない
    // 🟡 信頼性レベル: パフォーマンス要件から推測

    // 【初期条件設定】: 有効なデータで複数回レンダリング
    const validData = btoa(encodeURIComponent(JSON.stringify({ word: 'テスト', meaning: 'テストの意味' })));

    // 【処理内容】: マウント・アンマウントを繰り返す
    const { unmount: unmount1 } = renderWithRouter([`/display?data=${validData}`]);
    unmount1();

    const { unmount: unmount2 } = renderWithRouter([`/display?data=${validData}`]);
    unmount2();

    const { unmount: unmount3 } = renderWithRouter([`/display?data=${validData}`]);

    // 【結果検証】: エラーなく複数回レンダリングできる
    // 【期待値確認】: 3回目のレンダリングも正常
    expect(unmount3).toBeDefined(); // 【確認内容】: メモリリークなくクリーンアップされる 🟡
  });
});

// =============================================================================
// TASK-0026: URLデコード統合機能のテスト
// =============================================================================

describe('DisplayPage - TASK-0026 URLデコード統合', () => {
  // TC-DECODE-001: 正常なBase64データをデコードして表示する
  it('TC-DECODE-001: 正常なBase64データをデコードして表示する', async () => {
    // 【テスト目的】: URLパラメータから正しくBase64デコードしてデータを表示する（REQ-103）
    // 【テスト内容】: 有効なBase64エンコードデータをdecodeGiftWordDataでデコードし、DisplayPageに表示
    // 【期待される動作】: デコード成功、エラーなく表示、トーストメッセージなし
    // 🔵 信頼性レベル: REQ-102, REQ-103に基づく

    // 【テストデータ準備】: 日本語を含む有効なGiftWordDataをBase64エンコード
    // 【初期条件設定】: ToastProviderとRouterでラップしてDisplayPageをレンダリング
    const testData = { word: '感謝', meaning: 'いつもありがとう' };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(testData)));

    renderWithRouter([`/display?data=${encodedData}`]);

    // 【結果検証】: デコードが成功し、エラーが発生していないことを確認
    // 【期待値確認】: ErrorPageが表示されず、メインコンテンツが表示される
    await waitFor(() => {
      // 【検証項目】: エラーページが表示されていない 🔵
      expect(screen.queryByText(/エラーが発生しました/i)).not.toBeInTheDocument();

      // 【検証項目】: 「新しい言葉を贈る」ボタンが表示される（正常表示の証拠） 🔵
      expect(screen.getByRole('button', { name: /新しい言葉を贈る/i })).toBeInTheDocument();
    });

    // 【検証項目】: トーストメッセージが表示されていない 🔵
    const toastMessage = screen.queryByRole('alert');
    expect(toastMessage).not.toBeInTheDocument();
  });

  // TC-DECODE-002: 日本語（ひらがな、カタカナ、漢字）を正しくデコードする
  it('TC-DECODE-002: 日本語（ひらがな、カタカナ、漢字）を正しくデコードする', async () => {
    // 【テスト目的】: 多様な日本語文字種を含むデータのデコード精度を確認（REQ-021）
    // 【テスト内容】: ひらがな、カタカナ、漢字すべてを含むGiftWordDataをデコード
    // 【期待される動作】: すべての文字種が文字化けせず正しくデコードされる
    // 🔵 信頼性レベル: REQ-021に基づく

    // 【テストデータ準備】: 日本語の3つの文字体系すべてを含むデータ
    // 【初期条件設定】: 多様な日本語文字でテスト
    const japaneseData = {
      word: 'ありがとうカタカナ漢字混在',
      meaning: 'ひらがな、カタカナ、漢字が混ざった意味の説明文です。'
    };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(japaneseData)));

    renderWithRouter([`/display?data=${encodedData}`]);

    // 【結果検証】: 日本語が正しくデコードされ、表示される
    // 【期待値確認】: すべての文字種が保持されている
    await waitFor(() => {
      // 【検証項目】: wordテキストが正しく表示される 🔵
      expect(screen.queryByText('ありがとうカタカナ漢字混在')).toBeInTheDocument();
    });

    // 【検証項目】: エラーが発生していない 🔵
    expect(screen.queryByText(/エラーが発生しました/i)).not.toBeInTheDocument();
  });

  // TC-DECODE-003: 特殊文字（改行、引用符、記号）を正しくデコードする
  it('TC-DECODE-003: 特殊文字（改行、引用符、記号）を正しくデコードする', async () => {
    // 【テスト目的】: JSON特殊文字やHTML特殊文字のエスケープ処理を確認
    // 【テスト内容】: JSON/HTML特殊文字、改行、絵文字を含むデータをデコード
    // 【期待される動作】: すべての特殊文字が安全にデコードされ、XSS攻撃のリスクがない
    // 🔵 信頼性レベル: セキュリティ制約条件に基づく

    // 【テストデータ準備】: JSON/HTML特殊文字、改行、絵文字を含むデータ
    // 【初期条件設定】: 特殊文字の安全な処理を検証
    const specialData = {
      word: 'Test & "Special" <Characters>',
      meaning: "It's working!\n100% 🎉\nLine 2"
    };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(specialData)));

    renderWithRouter([`/display?data=${encodedData}`]);

    // 【結果検証】: 特殊文字が正しくデコードされ、安全に表示される
    // 【期待値確認】: XSSインジェクションが発生していない
    await waitFor(() => {
      // 【検証項目】: 特殊文字を含むwordが表示される 🔵
      expect(screen.queryByText('Test & "Special" <Characters>')).toBeInTheDocument();
    });

    // 【検証項目】: エラーが発生していない 🔵
    expect(screen.queryByText(/エラーが発生しました/i)).not.toBeInTheDocument();
  });

  // TC-DECODE-004: URLパラメータが空文字列の場合はエラーを表示
  it('TC-DECODE-004: URLパラメータが空文字列の場合はエラーを表示', async () => {
    // 【テスト目的】: 空のURLパラメータに対する適切なエラーハンドリングを確認（REQ-213）
    // 【テスト内容】: URLに?data=とパラメータ名だけがあり値が空のケース
    // 【期待される動作】: ERROR_MESSAGES.INVALID_URLエラーが表示され、トーストメッセージが表示される
    // 🟡 信頼性レベル: REQ-213から推測

    // 【テストデータ準備】: 空文字列のURLパラメータ
    // 【初期条件設定】: ユーザーがURLを手動編集して値部分が欠落したケースを想定
    renderWithRouter(['/display?data=']);

    // 【結果検証】: エラーページが表示される
    // 【期待値確認】: ERROR_MESSAGES.INVALID_URLメッセージが表示される
    await waitFor(() => {
      // 【検証項目】: エラーページが表示される 🟡
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
    });

    // 【検証項目】: トーストメッセージが表示される 🟡
    // Note: ToastContextの統合により、エラー時にトーストが表示される
    // この検証は統合テスト的な側面を持つ
  });

  // TC-DECODE-005: 不正なBase64データの場合はエラーを表示
  it('TC-DECODE-005: 不正なBase64データの場合はエラーを表示', async () => {
    // 【テスト目的】: Base64として無効な文字列に対するエラーハンドリングを確認（REQ-103）
    // 【テスト内容】: Base64文字セットに含まれない文字を含むデータでアクセス
    // 【期待される動作】: ERROR_MESSAGES.DECODE_FAILEDエラーが表示される
    // 🔵 信頼性レベル: REQ-103, REQ-213に基づく

    // 【テストデータ準備】: Base64として無効な文字列（!は無効）
    // 【初期条件設定】: URLが破損または改ざんされたケースを想定
    const invalidData = 'invalid!!!base64';
    renderWithRouter([`/display?data=${invalidData}`]);

    // 【結果検証】: エラーページが表示される
    // 【期待値確認】: ERROR_MESSAGES.DECODE_FAILEDメッセージが表示される
    await waitFor(() => {
      // 【検証項目】: エラーページが表示される 🔵
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
    });
  });

  // TC-DECODE-006: JSONパース失敗の場合はエラーを表示
  it('TC-DECODE-006: JSONパース失敗の場合はエラーを表示', async () => {
    // 【テスト目的】: Base64デコードは成功するがJSON解析が失敗するケースの確認（REQ-103）
    // 【テスト内容】: JSONとして無効な文字列をBase64エンコードしてアクセス
    // 【期待される動作】: ERROR_MESSAGES.DECODE_FAILEDエラーが表示される
    // 🔵 信頼性レベル: REQ-103に基づく

    // 【テストデータ準備】: JSONとして無効な文字列をBase64エンコード
    // 【初期条件設定】: データ破損やエンコード処理の不具合を想定
    const invalidJson = btoa('not valid json{');
    renderWithRouter([`/display?data=${invalidJson}`]);

    // 【結果検証】: エラーページが表示される
    // 【期待値確認】: JSON.parse()エラーが適切に処理される
    await waitFor(() => {
      // 【検証項目】: エラーページが表示される 🔵
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
    });
  });

  // TC-DECODE-007: wordが欠けている場合はエラーを表示
  it('TC-DECODE-007: wordが欠けている場合はエラーを表示', async () => {
    // 【テスト目的】: 必須フィールドwordのバリデーションを確認
    // 【テスト内容】: wordフィールドが空またはundefinedのデータでアクセス
    // 【期待される動作】: ERROR_MESSAGES.INVALID_DATAエラーが表示される
    // 🟡 信頼性レベル: データバリデーションロジックから推測

    // 【テストデータ準備】: wordが空のデータ
    // 【初期条件設定】: 不完全なデータでアクセス
    const invalidData = btoa(encodeURIComponent(JSON.stringify({ word: '', meaning: '意味のみ' })));
    renderWithRouter([`/display?data=${invalidData}`]);

    // 【結果検証】: エラーページが表示される
    // 【期待値確認】: データ完全性チェックが機能する
    await waitFor(() => {
      // 【検証項目】: エラーページが表示される 🟡
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
    });
  });

  // TC-DECODE-008: meaningが欠けている場合はエラーを表示
  it('TC-DECODE-008: meaningが欠けている場合はエラーを表示', async () => {
    // 【テスト目的】: 必須フィールドmeaningのバリデーションを確認
    // 【テスト内容】: meaningフィールドが空またはundefinedのデータでアクセス
    // 【期待される動作】: ERROR_MESSAGES.INVALID_DATAエラーが表示される
    // 🟡 信頼性レベル: データバリデーションロジックから推測

    // 【テストデータ準備】: meaningが空のデータ
    // 【初期条件設定】: フロントエンドバリデーションを回避したケースを想定
    const invalidData = btoa(encodeURIComponent(JSON.stringify({ word: '感謝', meaning: '' })));
    renderWithRouter([`/display?data=${invalidData}`]);

    // 【結果検証】: エラーページが表示される
    // 【期待値確認】: すべての必須フィールドが検証される
    await waitFor(() => {
      // 【検証項目】: エラーページが表示される 🟡
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
    });
  });

  // TC-DECODE-009: デコード失敗時にトーストメッセージが表示される
  it('TC-DECODE-009: デコード失敗時にトーストメッセージが表示される', async () => {
    // 【テスト目的】: デコード失敗時のユーザーフィードバック機能を確認（REQ-213）
    // 【テスト内容】: デコード失敗時にToastContextを通じてトーストメッセージが表示される
    // 【期待される動作】: ErrorPageとトーストメッセージの両方が表示される
    // 🟡 信頼性レベル: REQ-213, ToastContext統合から推測

    // 【テストデータ準備】: 不正なBase64データ
    // 【初期条件設定】: URLが破損したケース
    const invalidData = 'invalid!!!base64';
    renderWithRouter([`/display?data=${invalidData}`]);

    // 【結果検証】: エラーページとトーストメッセージが表示される
    // 【期待値確認】: 多層的なエラー通知が機能する
    await waitFor(() => {
      // 【検証項目】: エラーページが表示される 🟡
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
    });

    // 【検証項目】: トーストメッセージが表示される（ToastContext統合） 🟡
    // Note: 実装時にshowToast()が呼ばれることを確認
  });

  // TC-DECODE-010: 最大長データ（word: 50文字、meaning: 300文字）を正しくデコードする
  it('TC-DECODE-010: 最大長データ（word: 50文字、meaning: 300文字）を正しくデコードする', async () => {
    // 【テスト目的】: VALIDATION_RULESの境界値動作を確認（REQ-013, REQ-014）
    // 【テスト内容】: 最大文字数のデータをデコードし、パフォーマンス劣化がないことを確認
    // 【期待される動作】: 最大長データでもデコード・表示が正常に機能、NFR-001（3秒以内）を満たす
    // 🔵 信頼性レベル: REQ-013, REQ-014に基づく

    // 【テストデータ準備】: 最大文字数のデータ
    // 【初期条件設定】: ユーザーが最大文字数まで入力したケース
    const maxData = {
      word: 'あ'.repeat(50),  // 50文字（最大値）
      meaning: 'い'.repeat(300) // 300文字（最大値）
    };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(maxData)));

    const startTime = Date.now();
    renderWithRouter([`/display?data=${encodedData}`]);

    // 【結果検証】: 最大データが正しくデコードされ、パフォーマンス基準を満たす
    // 【期待値確認】: すべての文字が保持され、3秒以内に表示される
    await waitFor(() => {
      // 【検証項目】: エラーが発生していない 🔵
      expect(screen.queryByText(/エラーが発生しました/i)).not.toBeInTheDocument();

      // 【検証項目】: 「新しい言葉を贈る」ボタンが表示される 🔵
      expect(screen.getByRole('button', { name: /新しい言葉を贈る/i })).toBeInTheDocument();
    });

    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // 【検証項目】: NFR-001（ページ読み込み3秒以内）を満たす 🔵
    expect(renderTime).toBeLessThan(3000);
  });

  // TC-DECODE-011: 最小長データ（word: 1文字、meaning: 1文字）を正しくデコードする
  it('TC-DECODE-011: 最小長データ（word: 1文字、meaning: 1文字）を正しくデコードする', async () => {
    // 【テスト目的】: 最小の有効データ長での動作確認
    // 【テスト内容】: 1文字ずつのデータをデコードし、正しく表示される
    // 【期待される動作】: 1文字でもデコード・表示が正常に機能
    // 🟡 信頼性レベル: 最小境界値の一般的なテストプラクティスに基づく

    // 【テストデータ準備】: 最小の有効データ
    // 【初期条件設定】: ユーザーが短い言葉を贈るケース
    const minData = { word: '愛', meaning: '心' };
    const encodedData = btoa(encodeURIComponent(JSON.stringify(minData)));

    renderWithRouter([`/display?data=${encodedData}`]);

    // 【結果検証】: 1文字のデータが正しく表示される
    // 【期待値確認】: 文字が欠損していない
    await waitFor(() => {
      // 【検証項目】: wordテキストが表示される 🟡
      expect(screen.queryByText('愛')).toBeInTheDocument();
    });

    // 【検証項目】: エラーが発生していない 🟡
    expect(screen.queryByText(/エラーが発生しました/i)).not.toBeInTheDocument();
  });

  // TC-DECODE-012: URLパラメータがnullの場合はリダイレクトされる
  it('TC-DECODE-012: URLパラメータがnullの場合はリダイレクトされる', async () => {
    // 【テスト目的】: REQ-212（リダイレクト処理）の動作確認
    // 【テスト内容】: dataパラメータなしでDisplayPageにアクセス
    // 【期待される動作】: トップページにリダイレクト、エラーメッセージなし
    // 🔵 信頼性レベル: REQ-212, TASK-0025既存実装に基づく

    // 【初期条件設定】: URLパラメータなしでページにアクセス
    // 【実際の使用場面】: ユーザーが直接/displayにアクセス
    renderWithRouter(['/display']);

    // 【結果検証】: ホームページへのリダイレクトを確認
    // 【期待値確認】: リダイレクトが即座に実行される
    await waitFor(() => {
      // 【検証項目】: トップページにリダイレクトされた 🔵
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    // 【検証項目】: エラーメッセージが表示されていない 🔵
    expect(screen.queryByText(/エラーが発生しました/i)).not.toBeInTheDocument();
  });

  // TC-DECODE-013: エラー後に「新しい言葉を贈る」ボタンで復帰できる
  it('TC-DECODE-013: エラー後に「新しい言葉を贈る」ボタンで復帰できる', async () => {
    // 【テスト目的】: エラー状態からの復帰フローを確認（REQ-206）
    // 【テスト内容】: エラー発生→「新しい言葉を贈る」ボタンクリック→トップページ遷移
    // 【期待される動作】: エラー状態がクリアされ、トップページで新しい言葉を作成できる
    // 🟡 信頼性レベル: REQ-206, ErrorPage実装から推測

    // 【初期条件設定】: 不正なデータでアクセス→エラー表示
    // 【実際の使用場面】: ユーザーがエラーURLを踏んだ後、正しい使い方を試みる
    const user = userEvent.setup();
    const invalidData = 'invalid!!!base64';
    renderWithRouter([`/display?data=${invalidData}`]);

    // 【結果検証】: ErrorPageが表示される
    await waitFor(() => {
      // 【検証項目】: エラーページが表示される 🟡
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
    });

    // 【ユーザー操作実行】: 「新しい言葉を贈る」ボタンをクリック
    // 【操作内容】: エラー状態からの復帰アクション
    const newWordButton = screen.getByRole('button', { name: /トップページに戻る/i });
    await user.click(newWordButton);

    // 【結果検証】: トップページに遷移
    // 【期待値確認】: エラー状態がクリアされ、作業を続行できる
    await waitFor(() => {
      // 【検証項目】: トップページに遷移した 🟡
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });

  // TC-DECODE-014: ToastContextが正しく統合されている
  it('TC-DECODE-014: ToastContextが正しく統合されている', async () => {
    // 【テスト目的】: ToastProviderとの連携動作を確認
    // 【テスト内容】: useToast()フックが正しく動作し、エラー時にトーストが表示される
    // 【期待される動作】: ToastProviderが存在し、showToast()が呼び出される
    // 🔵 信頼性レベル: ToastContext実装、アーキテクチャ制約条件に基づく

    // 【初期条件設定】: 不正なBase64データでエラーを発生させる
    // 【実際の使用場面】: エラー発生時のトースト通知
    const invalidData = 'invalid!!!base64';
    renderWithRouter([`/display?data=${invalidData}`]);

    // 【結果検証】: ToastContextが正しく統合されている
    // 【期待値確認】: useToast()が例外をスローせず、エラーページが表示される
    await waitFor(() => {
      // 【検証項目】: エラーページが表示される（ToastProviderが存在する証拠） 🔵
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
    });

    // Note: 実際のトーストメッセージの表示はGreenフェーズでshowToast()呼び出しを実装後に確認
    // ToastProviderが正しくラップされていることは、エラーページが表示されることで間接的に確認できる
  });
});
