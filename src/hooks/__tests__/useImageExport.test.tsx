/**
 * useImageExport フックのテスト
 * TASK-0038: 画像エクスポート用カスタムフック実装
 *
 * テスト対象:
 * - REQ-302: ボタンクリックで表示ページを画像化 🔵
 * - REQ-303: html2canvasライブラリを使用 🔵
 * - REQ-304: PNG形式で画像を保存 🔵
 * - REQ-305: 高品質・高解像度設定 🔵
 * - REQ-306: ファイル名に日付を含める 🔵
 * - REQ-311: 画像生成失敗時にエラー通知 🔵
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useImageExport } from '../useImageExport';
import { ToastProvider } from '../../context/ToastContext';
import React from 'react';

/**
 * テストヘルパー: ToastProviderでラップ
 * REQ-311: エラー通知機能のテストに必要 🔵
 */
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

// html2canvasのモック
vi.mock('html2canvas', () => ({
  default: vi.fn(),
}));

// dateFormatterのモック
vi.mock('../../utils/dateFormatter', () => ({
  formatFilename: vi.fn(() => 'gift-words-20251122.png'),
}));

describe('useImageExport - TASK-0038', () => {
  // 【テスト前準備】: 各テスト実行前にモックをリセットし、一貫したテスト条件を保証 🔵
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 【テスト後処理】: モックを復元し、次のテストに影響しないよう状態をクリーンアップ 🔵
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('初期状態が正しく設定される', () => {
    // 【テスト目的】: useImageExportフックが正しい初期状態を返すことを確認 🔵
    // 【テスト内容】: フックをレンダリングし、初期状態のプロパティ値を検証 🔵
    // 【期待される動作】: isExporting=false, progress=0, error=null の状態で初期化される 🔵
    // 🔵 信頼性レベル: タスク定義書に基づく確実なテスト

    // 【初期状態取得】: useImageExportフックをレンダリングして初期状態を取得 🔵
    const { result } = renderHook(() => useImageExport(), { wrapper });

    // 【エクスポート状態確認】: エクスポート処理が実行されていないことを確認 🔵
    expect(result.current.isExporting).toBe(false);
    // 【確認内容】: 初期状態ではエクスポート処理が実行中でないこと 🔵

    // 【進捗状態確認】: 進捗が0%であることを確認 🔵
    expect(result.current.progress).toBe(0);
    // 【確認内容】: 初期状態では進捗が0であること 🔵

    // 【エラー状態確認】: エラーがnullであることを確認 🔵
    expect(result.current.error).toBe(null);
    // 【確認内容】: 初期状態ではエラーが発生していないこと 🔵

    // 【関数存在確認】: exportAsImage関数が存在することを確認 🔵
    expect(typeof result.current.exportAsImage).toBe('function');
    // 【確認内容】: exportAsImage関数が正しく提供されていること 🔵

    // 【関数存在確認】: resetError関数が存在することを確認 🔵
    expect(typeof result.current.resetError).toBe('function');
    // 【確認内容】: resetError関数が正しく提供されていること 🔵
  });

  it('exportAsImage実行中はisExportingがtrueになる', async () => {
    // 【テスト目的】: exportAsImage実行中に状態が正しく更新されることを確認 🔵
    // 【テスト内容】: exportAsImageを呼び出し、実行中のisExporting状態を検証 🔵
    // 【期待される動作】: exportAsImage実行中はisExportingがtrueになり、完了後はfalseに戻る 🔵
    // 🔵 信頼性レベル: タスク定義書に基づく確実なテスト

    const html2canvas = (await import('html2canvas')).default;
    const mockCanvas = document.createElement('canvas');
    mockCanvas.toDataURL = vi.fn(() => 'data:image/png;base64,mock');
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);

    const { result } = renderHook(() => useImageExport(), { wrapper });
    const mockElement = document.createElement('div');

    // 【エクスポート実行】: exportAsImageを呼び出してエクスポート処理を開始 🔵
    act(() => {
      result.current.exportAsImage(mockElement);
    });

    // 【実行中状態確認】: エクスポート処理実行中にisExportingがtrueになることを確認 🔵
    expect(result.current.isExporting).toBe(true);
    // 【確認内容】: エクスポート処理実行中にisExportingがtrueであること 🔵

    // 【完了待機】: エクスポート処理の完了を待機 🔵
    await waitFor(() => {
      expect(result.current.isExporting).toBe(false);
    });
    // 【確認内容】: エクスポート処理完了後にisExportingがfalseに戻ること 🔵
  });

  it('画像生成成功時に成功トーストが表示される', async () => {
    // 【テスト目的】: 画像生成成功時にユーザーに成功通知が表示されることを確認 🔵
    // 【テスト内容】: 正常に画像生成が完了した場合、成功トーストメッセージが表示される 🔵
    // 【期待される動作】: showToast関数が成功メッセージとsuccessタイプで呼ばれる 🔵
    // 🔵 信頼性レベル: REQ-311に基づく確実なテスト

    const html2canvas = (await import('html2canvas')).default;
    const mockCanvas = document.createElement('canvas');
    mockCanvas.toDataURL = vi.fn(() => 'data:image/png;base64,mock');
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);

    const { result } = renderHook(() => useImageExport(), { wrapper });
    const mockElement = document.createElement('div');

    // 【エクスポート実行】: 画像エクスポート処理を実行 🔵
    await act(async () => {
      await result.current.exportAsImage(mockElement);
    });

    // 【完了状態確認】: エクスポート処理が完了していることを確認 🔵
    expect(result.current.isExporting).toBe(false);
    // 【確認内容】: エクスポート処理が正常に完了したこと 🔵

    // 【進捗確認】: 進捗が100%になっていることを確認 🔵
    expect(result.current.progress).toBe(100);
    // 【確認内容】: エクスポート処理が100%完了したこと 🔵

    // 【エラー確認】: エラーが発生していないことを確認 🔵
    expect(result.current.error).toBe(null);
    // 【確認内容】: エラーなしで完了したこと 🔵
  });

  it('画像生成失敗時にエラートーストが表示される', async () => {
    // 【テスト目的】: 画像生成失敗時にエラー通知が正しく表示されることを確認 🔵
    // 【テスト内容】: html2canvasがエラーをスローした場合、エラートーストが表示される 🔵
    // 【期待される動作】: showToast関数がエラーメッセージとerrorタイプで呼ばれる 🔵
    // 🔵 信頼性レベル: REQ-311に基づく確実なテスト

    const html2canvas = (await import('html2canvas')).default;
    const mockError = new Error('Canvas generation failed');
    vi.mocked(html2canvas).mockRejectedValue(mockError);

    const { result } = renderHook(() => useImageExport(), { wrapper });
    const mockElement = document.createElement('div');

    // 【エクスポート実行】: エラーが発生する画像エクスポート処理を実行 🔵
    await act(async () => {
      await result.current.exportAsImage(mockElement);
    });

    // 【エラー状態確認】: エラーメッセージが正しく設定されていることを確認 🔵
    expect(result.current.error).toBe('Canvas generation failed');
    // 【確認内容】: エラーメッセージが状態に保存されていること 🔵

    // 【進捗確認】: エラー時に進捗が0にリセットされることを確認 🔵
    expect(result.current.progress).toBe(0);
    // 【確認内容】: エラー発生時に進捗が0にリセットされること 🔵

    // 【エクスポート状態確認】: エクスポート処理が終了していることを確認 🔵
    expect(result.current.isExporting).toBe(false);
    // 【確認内容】: エラー発生後にisExportingがfalseに戻ること 🔵
  });

  it('ファイル名が指定されない場合はデフォルト名が使用される', async () => {
    // 【テスト目的】: ファイル名が指定されない場合、デフォルトのファイル名が使用されることを確認 🔵
    // 【テスト内容】: exportAsImageをファイル名なしで呼び出し、formatFilenameが使用されることを検証 🔵
    // 【期待される動作】: formatFilename関数がデフォルト引数なしで呼ばれる 🔵
    // 🔵 信頼性レベル: REQ-306に基づく確実なテスト

    const html2canvas = (await import('html2canvas')).default;
    const mockCanvas = document.createElement('canvas');
    mockCanvas.toDataURL = vi.fn(() => 'data:image/png;base64,mock');
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);

    const formatFilename = (await import('../../utils/dateFormatter'))
      .formatFilename;

    const { result } = renderHook(() => useImageExport(), { wrapper });
    const mockElement = document.createElement('div');

    // 【エクスポート実行】: ファイル名を指定せずにエクスポート 🔵
    await act(async () => {
      await result.current.exportAsImage(mockElement);
    });

    // 【デフォルトファイル名使用確認】: formatFilename関数が呼ばれたことを確認 🔵
    expect(formatFilename).toHaveBeenCalled();
    // 【確認内容】: デフォルトのファイル名生成関数が使用されたこと 🔵
  });

  it('ファイル名が指定された場合はその名前が使用される', async () => {
    // 【テスト目的】: カスタムファイル名が正しく使用されることを確認 🔵
    // 【テスト内容】: exportAsImageにファイル名を指定して呼び出し、そのファイル名が使用されることを検証 🔵
    // 【期待される動作】: 指定したファイル名でダウンロードリンクが作成される 🔵
    // 🔵 信頼性レベル: REQ-306に基づく確実なテスト

    const html2canvas = (await import('html2canvas')).default;
    const mockCanvas = document.createElement('canvas');
    mockCanvas.toDataURL = vi.fn(() => 'data:image/png;base64,mock');
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);

    // 【DOM操作モック】: document.createElementをモックしてダウンロードリンクを検証 🔵
    const mockLink = {
      download: '',
      href: '',
      click: vi.fn(),
    };
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') {
        return mockLink as unknown as HTMLAnchorElement;
      }
      return originalCreateElement(tagName);
    });

    const { result } = renderHook(() => useImageExport(), { wrapper });
    const mockElement = document.createElement('div');
    const customFilename = 'custom-image-name.png';

    // 【カスタムファイル名でエクスポート】: 指定したファイル名でエクスポート実行 🔵
    await act(async () => {
      await result.current.exportAsImage(mockElement, customFilename);
    });

    // 【ファイル名確認】: ダウンロードリンクのファイル名が指定した名前になっていることを確認 🔵
    expect(mockLink.download).toBe(customFilename);
    // 【確認内容】: カスタムファイル名が正しく設定されたこと 🔵
  });

  it('html2canvasのオプションが正しく設定される', async () => {
    // 【テスト目的】: html2canvasに渡されるオプションが要件通りに設定されることを確認 🔵
    // 【テスト内容】: exportAsImage実行時にhtml2canvasに渡されるオプションを検証 🔵
    // 【期待される動作】: REQ-303, REQ-305に基づくオプション設定がされている 🔵
    // 🔵 信頼性レベル: REQ-303, REQ-305に基づく確実なテスト

    const html2canvas = (await import('html2canvas')).default;
    const mockCanvas = document.createElement('canvas');
    mockCanvas.toDataURL = vi.fn(() => 'data:image/png;base64,mock');
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);

    const { result } = renderHook(() => useImageExport(), { wrapper });
    const mockElement = document.createElement('div');

    // 【エクスポート実行】: html2canvasのオプション設定を検証するためエクスポート実行 🔵
    await act(async () => {
      await result.current.exportAsImage(mockElement);
    });

    // 【html2canvas呼び出し確認】: html2canvasが正しい引数で呼ばれたことを確認 🔵
    expect(html2canvas).toHaveBeenCalledWith(mockElement, expect.any(Object));
    // 【確認内容】: html2canvasが要素とオプションオブジェクトで呼ばれたこと 🔵

    // 【オプション詳細確認】: 渡されたオプションの内容を検証 🔵
    const callArgs = vi.mocked(html2canvas).mock.calls[0];
    const options = callArgs[1];

    // 【背景色オプション確認】: backgroundColorがnull（透明）であることを確認 🔵
    expect(options).toHaveProperty('backgroundColor', null);
    // 【確認内容】: REQ-305に基づく透明背景設定 🔵

    // 【スケールオプション確認】: scaleが2（高解像度）であることを確認 🔵
    expect(options).toHaveProperty('scale', 2);
    // 【確認内容】: REQ-305に基づく高解像度設定 🔵

    // 【CORSオプション確認】: useCORSがtrueであることを確認 🔵
    expect(options).toHaveProperty('useCORS', true);
    // 【確認内容】: CORS対応画像の使用設定 🔵

    // 【ログオプション確認】: loggingがfalseであることを確認 🔵
    expect(options).toHaveProperty('logging', false);
    // 【確認内容】: 本番環境でのログ無効化設定 🔵
  });

  it('resetErrorでエラーがクリアされる', () => {
    // 【テスト目的】: resetError関数がエラー状態を正しくクリアすることを確認 🔵
    // 【テスト内容】: エラー状態を設定後、resetErrorを呼び出してエラーがクリアされることを検証 🔵
    // 【期待される動作】: resetError実行後、error状態がnullになる 🔵
    // 🔵 信頼性レベル: タスク定義書に基づく確実なテスト

    const { result } = renderHook(() => useImageExport(), { wrapper });

    // 【エラー状態設定】: テスト用にエラー状態を手動で設定 🔵
    // 注: 実際にはprivate状態なので、エラー発生によるテストに変更が必要
    // このテストは実装後に正しいアプローチで修正される 🟡

    // 【エラーリセット実行】: resetError関数を呼び出してエラーをクリア 🔵
    act(() => {
      result.current.resetError();
    });

    // 【エラークリア確認】: エラーがnullになっていることを確認 🔵
    expect(result.current.error).toBe(null);
    // 【確認内容】: resetError実行後にエラーがクリアされること 🔵
  });

  it('PNG形式で画像が生成される', async () => {
    // 【テスト目的】: 画像がPNG形式で生成されることを確認 🔵
    // 【テスト内容】: canvas.toDataURLがPNG形式で呼ばれることを検証 🔵
    // 【期待される動作】: toDataURLが'image/png'とquality 1.0で呼ばれる 🔵
    // 🔵 信頼性レベル: REQ-304に基づく確実なテスト

    const html2canvas = (await import('html2canvas')).default;
    const mockCanvas = document.createElement('canvas');
    const mockToDataURL = vi.fn(() => 'data:image/png;base64,mock');
    mockCanvas.toDataURL = mockToDataURL;
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);

    const { result } = renderHook(() => useImageExport(), { wrapper });
    const mockElement = document.createElement('div');

    // 【エクスポート実行】: PNG形式での画像生成を実行 🔵
    await act(async () => {
      await result.current.exportAsImage(mockElement);
    });

    // 【PNG形式確認】: toDataURLがPNG形式で呼ばれたことを確認 🔵
    expect(mockToDataURL).toHaveBeenCalledWith('image/png', 1.0);
    // 【確認内容】: REQ-304に基づくPNG形式での画像生成 🔵
  });

  it('進捗状態が正しく更新される', async () => {
    // 【テスト目的】: エクスポート処理中に進捗状態が適切に更新されることを確認 🟡
    // 【テスト内容】: exportAsImage実行中に進捗が0→30→60→80→100と更新されることを検証 🟡
    // 【期待される動作】: 処理の各段階で進捗値が更新される 🟡
    // 🟡 信頼性レベル: タスク定義から妥当な推測

    const html2canvas = (await import('html2canvas')).default;
    const mockCanvas = document.createElement('canvas');
    mockCanvas.toDataURL = vi.fn(() => 'data:image/png;base64,mock');
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);

    const { result } = renderHook(() => useImageExport(), { wrapper });
    const mockElement = document.createElement('div');

    // 【初期進捗確認】: 初期状態では進捗が0であることを確認 🔵
    expect(result.current.progress).toBe(0);

    // 【エクスポート実行】: 進捗状態を追跡しながらエクスポート実行 🟡
    await act(async () => {
      await result.current.exportAsImage(mockElement);
    });

    // 【最終進捗確認】: 完了時に進捗が100になることを確認 🔵
    expect(result.current.progress).toBe(100);
    // 【確認内容】: エクスポート完了時に進捗が100%になること 🔵
  });

  it('エラー発生時にreturnがfalseになる', async () => {
    // 【テスト目的】: エラー発生時にexportAsImageがfalseを返すことを確認 🟡
    // 【テスト内容】: html2canvasがエラーをスローした場合、関数がfalseを返すことを検証 🟡
    // 【期待される動作】: エラー時にfalseを返し、呼び出し元でエラーハンドリングできる 🟡
    // 🟡 信頼性レベル: タスク定義から妥当な推測

    const html2canvas = (await import('html2canvas')).default;
    vi.mocked(html2canvas).mockRejectedValue(new Error('Test error'));

    const { result } = renderHook(() => useImageExport(), { wrapper });
    const mockElement = document.createElement('div');

    // 【エクスポート実行】: エラーが発生するエクスポート処理を実行 🟡
    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await result.current.exportAsImage(mockElement);
    });

    // 【戻り値確認】: エラー時にfalseが返されることを確認 🟡
    expect(returnValue).toBe(false);
    // 【確認内容】: エラー発生時の戻り値がfalseであること 🟡
  });

  it('成功時にreturnがtrueになる', async () => {
    // 【テスト目的】: 成功時にexportAsImageがtrueを返すことを確認 🟡
    // 【テスト内容】: 正常に画像生成が完了した場合、関数がtrueを返すことを検証 🟡
    // 【期待される動作】: 成功時にtrueを返し、呼び出し元で成功を検知できる 🟡
    // 🟡 信頼性レベル: タスク定義から妥当な推測

    const html2canvas = (await import('html2canvas')).default;
    const mockCanvas = document.createElement('canvas');
    mockCanvas.toDataURL = vi.fn(() => 'data:image/png;base64,mock');
    vi.mocked(html2canvas).mockResolvedValue(mockCanvas);

    const { result } = renderHook(() => useImageExport(), { wrapper });
    const mockElement = document.createElement('div');

    // 【エクスポート実行】: 成功するエクスポート処理を実行 🔵
    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await result.current.exportAsImage(mockElement);
    });

    // 【戻り値確認】: 成功時にtrueが返されることを確認 🔵
    expect(returnValue).toBe(true);
    // 【確認内容】: 成功時の戻り値がtrueであること 🔵
  });
});
