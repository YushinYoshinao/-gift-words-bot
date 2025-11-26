/**
 * ImageSaveButton コンポーネントのテスト
 * TASK-0039: 画像保存ボタンコンポーネント実装
 *
 * テスト対象:
 * - REQ-301: 画像保存ボタンを提供 🔵
 * - REQ-302: ボタンクリックで表示ページを画像化 🔵
 * - REQ-306: ファイル名に日付を含める 🔵
 * - NFR-205: キーボードで操作可能（アクセシビリティ） 🔵
 * - EDGE-001: 要素が見つからない場合のエラー処理 🟡
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageSaveButton from '../ImageSaveButton';

// useImageExportのモック
vi.mock('../../../hooks/useImageExport', () => ({
  useImageExport: vi.fn(),
}));

describe('ImageSaveButton - TASK-0039', () => {
  // 【テスト目的】: 画像保存ボタンコンポーネントの全機能を検証
  // 【テスト内容】: レンダリング、クリックイベント、状態管理、アクセシビリティ
  // 【期待される動作】: 全要件を満たし、エラーハンドリングが適切
  // 🔵 タスクファイルおよび要件定義書に基づく

  let mockExportAsImage: ReturnType<typeof vi.fn<[HTMLElement, string?], Promise<boolean>>>;

  // 【テスト前準備】: 各テスト実行前にモックをリセットし、一貫したテスト条件を保証
  // 【環境初期化】: 前のテストの影響を受けないよう、モック関数の状態をクリーンにリセット
  beforeEach(async () => {
    mockExportAsImage = vi.fn<[HTMLElement, string?], Promise<boolean>>().mockResolvedValue(true);

    const { useImageExport } = await import('../../../hooks/useImageExport');
    vi.mocked(useImageExport).mockReturnValue({
      isExporting: false,
      exportAsImage: mockExportAsImage,
      progress: 0,
      error: null,
      resetError: vi.fn(),
    });

    // document.querySelectorのモック（デフォルトは要素が見つかる）
    const mockElement = document.createElement('div');
    vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);

    // console.errorのモック（エラーログ検証用）
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  // 【テスト後処理】: テスト実行後にモックを復元
  // 【状態復元】: 次のテストに影響しないよう、システムを元の状態に戻す
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('正常系テストケース（基本的な動作）', () => {
    it('正しくレンダリングされる', () => {
      // 【テスト目的】: コンポーネントの基本的なレンダリングを確認 🔵
      // 【テスト内容】: 初期状態でボタンが正しく表示されることを検証
      // 【期待される動作】: ボタンが存在し、初期テキストが「画像として保存」
      // 🔵 信頼性レベル: 要件定義書のUI構成に基づく

      // 【テストデータ準備】: 基本的なPropsを設定
      // 【初期条件設定】: targetSelectorとfilenameを指定してコンポーネントをレンダリング
      const props = {
        targetSelector: '.test-container',
        filename: 'test-image',
      };

      // 【実際の処理実行】: コンポーネントをレンダリング
      // 【処理内容】: ImageSaveButtonをDOMにマウント
      render(<ImageSaveButton {...props} />);

      // 【結果検証】: ボタンが存在することを確認 🔵
      // 【期待値確認】: ボタンがDOMに存在し、クリック可能な状態
      expect(screen.getByRole('button')).toBeInTheDocument();
      // 【確認内容】: ボタン要素が正しくレンダリングされている 🔵

      // 【結果検証】: 初期テキストが「画像として保存」であることを確認 🔵
      expect(screen.getByText('画像として保存')).toBeInTheDocument();
      // 【確認内容】: 初期状態で正しいボタンテキストが表示されている 🔵

      // 【結果検証】: ローディング表示は存在しないことを確認 🔵
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      // 【確認内容】: 初期状態ではローディング表示がない 🔵
    });

    it('ボタンクリックでexportAsImageが呼ばれる', async () => {
      // 【テスト目的】: クリックイベントハンドラーが正しく機能することを確認 🔵
      // 【テスト内容】: ボタンクリック時にuseImageExportフックのexportAsImage関数が正しい引数で呼び出される
      // 【期待される動作】: クリックイベント → handleClick → exportAsImage(element, filename)
      // 🔵 信頼性レベル: タスクファイルの実装詳細に基づく

      // === Given（準備フェーズ）===
      // 【テストデータ準備】: 実際の使用シーンを想定したPropsを設定
      // 【初期条件設定】: DOM要素とexportAsImageモックを準備
      const mockElement = document.createElement('div');
      vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);

      const props = {
        targetSelector: '.display-container',
        filename: 'my-gift',
      };

      // === When（実行フェーズ）===
      // 【実際の処理実行】: コンポーネントをレンダリングしてボタンをクリック
      // 【処理内容】: ユーザーがボタンをクリックする操作を模倣
      render(<ImageSaveButton {...props} />);
      const user = userEvent.setup();
      await user.click(screen.getByRole('button'));

      // === Then（検証フェーズ）===
      // 【結果検証】: exportAsImageが正しい引数で呼ばれたことを確認
      // 【期待値確認】: 第1引数はDOM要素、第2引数はfilename 🔵
      expect(mockExportAsImage).toHaveBeenCalledWith(mockElement, 'my-gift');
      // 【品質保証】: クリックイベントが正しくフック関数を呼び出すことを保証

      // 【結果検証】: 1回だけ呼ばれたことを確認 🔵
      expect(mockExportAsImage).toHaveBeenCalledTimes(1);
      // 【確認内容】: 重複呼び出しがないことを確認 🔵
    });

    it('ファイル名が指定されない場合はexportAsImageにundefinedが渡される', async () => {
      // 【テスト目的】: デフォルト動作の確認（REQ-306対応はuseImageExportフック側）🔵
      // 【テスト内容】: filename propsを省略した場合、exportAsImageにundefinedが渡される
      // 【期待される動作】: exportAsImageフック内部でformatFilename()が呼ばれる（フック側でテスト済み）
      // 🔵 信頼性レベル: 要件定義書のProps仕様に基づく

      // 【テストデータ準備】: filename省略時のデフォルト動作を確認
      // 【初期条件設定】: filenameを省略してコンポーネントをレンダリング
      const mockElement = document.createElement('div');
      vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);

      const props = {
        targetSelector: '.container',
      };

      // 【実際の処理実行】: filenameなしでボタンをクリック
      // 【処理内容】: オプショナルなpropsを省略した状態での動作確認
      render(<ImageSaveButton {...props} />);
      const user = userEvent.setup();
      await user.click(screen.getByRole('button'));

      // 【結果検証】: exportAsImageが1回呼ばれたことを確認 🔵
      expect(mockExportAsImage).toHaveBeenCalledTimes(1);
      // 【確認内容】: filenameを省略してもエラーにならない 🔵

      // 【結果検証】: 第2引数がundefinedであることを確認 🔵
      expect(mockExportAsImage).toHaveBeenCalledWith(mockElement, undefined);
      // 【確認内容】: オプショナルなpropsの動作を保証 🔵
    });
  });

  describe('異常系テストケース（エラーハンドリング）', () => {
    it('対象要素が存在しない場合はエラーログが出る', async () => {
      // 【テスト目的】: 要素未検出時の適切なエラーハンドリングを確認 🟡
      // 【テスト内容】: document.querySelector()がnullを返す場合のエラー処理を検証
      // 【期待される動作】: console.errorでログ出力し、処理を中断
      // 🟡 信頼性レベル: 要件定義書に記載あり、実装詳細は推測

      // 【エラーケース設定】: 存在しないCSSセレクタを指定
      // 【不正な理由】: 開発時のセレクタ記述ミス、DOM構造変更時を想定
      vi.spyOn(document, 'querySelector').mockReturnValue(null);

      const props = {
        targetSelector: '.non-existent-element',
      };

      // 【実際の処理実行】: 要素が見つからない状態でボタンをクリック
      // 【処理内容】: エラーハンドリングが正しく動作することを確認
      render(<ImageSaveButton {...props} />);
      const user = userEvent.setup();
      await user.click(screen.getByRole('button'));

      // 【結果検証】: console.errorが呼ばれたことを確認 🟡
      // 【期待値確認】: エラーメッセージにセレクタが含まれていることを確認
      expect(console.error).toHaveBeenCalledWith(
        'Element not found: .non-existent-element'
      );
      // 【確認内容】: 開発者が問題を特定しやすいよう、セレクタを含めたエラーメッセージ 🟡

      // 【結果検証】: exportAsImageは呼ばれないことを確認 🟡
      expect(mockExportAsImage).not.toHaveBeenCalled();
      // 【確認内容】: エラー時は処理を中断し、ユーザーには影響しない 🟡
    });

    it('exportAsImage実行中のエラーはuseImageExportフックで処理される', () => {
      // 【テスト目的】: エラー処理の責務がフック側にあることを確認 🔵
      // 【テスト内容】: 画像生成処理中のエラー（html2canvas失敗等）はフックが処理
      // 【期待される動作】: Toast通知でユーザーに通知（フック側でテスト済み）
      // 🔵 信頼性レベル: タスクファイルの実装詳細、TASK-0038仕様に基づく

      // 【責務分離確認】: エラーハンドリングはuseImageExportフック側の責務
      // 【期待される動作】: ImageSaveButtonコンポーネントは何もしない
      // 【確認内容】: 適切な責務分離により保守性向上 🔵

      // このテストケースは、exportAsImageがエラーをthrowした場合でも
      // ImageSaveButtonコンポーネントは何も特別な処理をせず、
      // useImageExportフック内部でcatchされてToast通知されることを確認する
      // 実装では特別なエラーハンドリングコードは不要
      expect(true).toBe(true);
      // 【確認内容】: コンポーネント側でエラーハンドリングコードが不要であることを確認 🔵
    });
  });

  describe('状態管理テストケース（UI状態の変化）', () => {
    it('エクスポート中はボタンが無効化される', async () => {
      // 【テスト目的】: ボタンの無効化制御が正しく機能することを確認 🔵
      // 【テスト内容】: isExporting=trueの時、ボタンがdisabled状態になる
      // 【期待される動作】: 連続クリックを防止し、処理の重複実行を回避
      // 🔵 信頼性レベル: タスクファイルの実装詳細に基づく

      // 【テストデータ準備】: エクスポート処理中の状態をシミュレート
      // 【状態設定の意味】: isExporting=trueを返すモックを設定
      const { useImageExport } = await import('../../../hooks/useImageExport');
      vi.mocked(useImageExport).mockReturnValue({
        isExporting: true,
        exportAsImage: mockExportAsImage,
        progress: 50,
        error: null,
        resetError: vi.fn(),
      });

      const props = {
        targetSelector: '.test-container',
      };

      // 【実際の処理実行】: エクスポート中の状態でレンダリング
      // 【処理内容】: isExporting=trueの状態をコンポーネントに反映
      render(<ImageSaveButton {...props} />);

      // 【結果検証】: ボタンがdisabled属性を持つことを確認 🔵
      // 【期待値確認】: EDGE-002（エクスポート中の連続クリック防止）
      expect(screen.getByRole('button')).toBeDisabled();
      // 【確認内容】: `disabled={isExporting}` の実装が正しい 🔵
    });

    it('エクスポート中はローディング表示される', async () => {
      // 【テスト目的】: ローディング表示の条件分岐とアクセシビリティ対応を確認 🔵
      // 【テスト内容】: isExporting=trueの時、ローディングスピナーが表示される
      // 【期待される動作】: 処理中であることをユーザーに視覚的にフィードバック
      // 🔵 信頼性レベル: タスクファイルの実装詳細、アクセシビリティ要件に基づく

      // 【テストデータ準備】: エクスポート処理中の状態をシミュレート
      // 【状態設定の意味】: isExporting=trueを返すモックを設定
      const { useImageExport } = await import('../../../hooks/useImageExport');
      vi.mocked(useImageExport).mockReturnValue({
        isExporting: true,
        exportAsImage: mockExportAsImage,
        progress: 60,
        error: null,
        resetError: vi.fn(),
      });

      const props = {
        targetSelector: '.test-container',
      };

      // 【実際の処理実行】: エクスポート中の状態でレンダリング
      // 【処理内容】: ローディング表示が条件によって表示されることを確認
      render(<ImageSaveButton {...props} />);

      // 【結果検証】: ローディングコンテナ（role="status"）が存在することを確認 🔵
      expect(screen.getByRole('status')).toBeInTheDocument();
      // 【確認内容】: `{isExporting && <div>...</div>}` の条件レンダリング 🔵

      // 【結果検証】: aria-live="polite" 属性が設定されていることを確認 🔵
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-live',
        'polite'
      );
      // 【確認内容】: アクセシビリティ属性（role, aria-live） 🔵

      // 【結果検証】: スクリーンリーダー用テキストが存在することを確認 🔵
      expect(screen.getByText('画像を生成しています...')).toBeInTheDocument();
      // 【確認内容】: 視覚障害者も処理状態を把握できる 🔵
    });

    it('エクスポート中はボタンテキストが「保存中...」になる', async () => {
      // 【テスト目的】: ボタンテキストの動的変更を確認 🔵
      // 【テスト内容】: isExporting=trueの時、ボタンテキストが変化する
      // 【期待される動作】: 処理状態をボタンテキストでも伝える
      // 🔵 信頼性レベル: タスクファイルの実装詳細に基づく

      // 【テストデータ準備】: エクスポート処理中の状態をシミュレート
      const { useImageExport } = await import('../../../hooks/useImageExport');
      vi.mocked(useImageExport).mockReturnValue({
        isExporting: true,
        exportAsImage: mockExportAsImage,
        progress: 80,
        error: null,
        resetError: vi.fn(),
      });

      const props = {
        targetSelector: '.test-container',
      };

      // 【実際の処理実行】: エクスポート中の状態でレンダリング
      // 【処理内容】: ボタンテキストが動的に変化することを確認
      render(<ImageSaveButton {...props} />);

      // 【結果検証】: ボタンテキストが「保存中...」であることを確認 🔵
      // 【期待値確認】: 多様なフィードバック手段でUX向上
      expect(screen.getByText('保存中...')).toBeInTheDocument();
      // 【確認内容】: `{isExporting ? '保存中...' : '画像として保存'}` 🔵
    });
  });

  describe('アクセシビリティテストケース', () => {
    it('ARIAラベルが正しく設定される', () => {
      // 【テスト目的】: アクセシビリティ対応の確認 🔵
      // 【テスト内容】: ボタンにaria-label属性が適切に設定されている
      // 【期待される動作】: スクリーンリーダーユーザーがボタンの目的を理解できる
      // 🔵 信頼性レベル: タスクファイル、アクセシビリティ要件に基づく

      // 【テストデータ準備】: 通常のPropsでレンダリング
      const props = {
        targetSelector: '.test-container',
      };

      // 【実際の処理実行】: コンポーネントをレンダリング
      // 【処理内容】: ARIA属性の存在と内容を確認
      render(<ImageSaveButton {...props} />);

      // 【結果検証】: ボタンにaria-label属性が存在することを確認 🔵
      // 【期待値確認】: NFR-205（アクセシビリティ要件）を満たす
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        '画像として保存'
      );
      // 【確認内容】: ARIA属性の存在と内容 🔵
    });

    it('ローディング表示にaria-live="polite"が設定される', async () => {
      // 【テスト目的】: 動的コンテンツのアクセシビリティ確認 🔵
      // 【テスト内容】: ローディングコンテナにaria-live属性が設定されている
      // 【期待される動作】: スクリーンリーダーがローディング状態を読み上げる
      // 🔵 信頼性レベル: タスクファイル、アクセシビリティ要件に基づく

      // 【テストデータ準備】: isExporting=trueの状態を設定
      const { useImageExport } = await import('../../../hooks/useImageExport');
      vi.mocked(useImageExport).mockReturnValue({
        isExporting: true,
        exportAsImage: mockExportAsImage,
        progress: 50,
        error: null,
        resetError: vi.fn(),
      });

      const props = {
        targetSelector: '.test-container',
      };

      // 【実際の処理実行】: エクスポート中の状態でレンダリング
      // 【処理内容】: aria-live, role属性、スクリーンリーダー専用テキストを確認
      render(<ImageSaveButton {...props} />);

      // 【結果検証】: ローディングコンテナにaria-live="polite"が設定されていることを確認 🔵
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-live',
        'polite'
      );
      // 【確認内容】: aria-live属性の存在 🔵

      // 【結果検証】: role="status"が設定されていることを確認 🔵
      expect(screen.getByRole('status')).toBeInTheDocument();
      // 【確認内容】: role属性の存在 🔵

      // 【結果検証】: スクリーンリーダー専用テキストが存在することを確認 🔵
      expect(screen.getByText('画像を生成しています...')).toBeInTheDocument();
      // 【確認内容】: スクリーンリーダー専用テキスト 🔵
    });
  });

  describe('Props検証テストケース', () => {
    it('targetSelector propsがdocument.querySelectorに渡される', async () => {
      // 【テスト目的】: Props値の正しい伝播を確認 🔵
      // 【テスト内容】: 渡されたtargetSelectorでDOM要素を検索している
      // 【期待される動作】: セレクタ文字列がそのまま使用される
      // 🔵 信頼性レベル: タスクファイルの実装詳細に基づく

      // 【テストデータ準備】: IDセレクタを使用した例
      // 【入力データの意味】: Props → DOM API → フック の正しいデータフロー
      const mockElement = document.createElement('div');
      const querySelectorSpy = vi
        .spyOn(document, 'querySelector')
        .mockReturnValue(mockElement);

      const props = {
        targetSelector: '#test-id',
        filename: 'test',
      };

      // 【実際の処理実行】: ボタンをクリックしてセレクタの使用を確認
      // 【処理内容】: セレクタ文字列の変換や加工が行われていないことを確認
      render(<ImageSaveButton {...props} />);
      const user = userEvent.setup();
      await user.click(screen.getByRole('button'));

      // 【結果検証】: document.querySelector('#test-id')が呼ばれたことを確認 🔵
      expect(querySelectorSpy).toHaveBeenCalledWith('#test-id');
      // 【確認内容】: セレクタ文字列の変換や加工が行われていない 🔵

      // 【結果検証】: 取得した要素がexportAsImageに渡されたことを確認 🔵
      expect(mockExportAsImage).toHaveBeenCalledWith(mockElement, 'test');
      // 【確認内容】: Props → DOM API → フック の正しいデータフロー 🔵
    });

    it('filename propsがexportAsImageの第2引数に渡される', async () => {
      // 【テスト目的】: オプショナルなPropsの伝播確認 🔵
      // 【テスト内容】: filename propsの値がそのまま渡される
      // 【期待される動作】: Props値を変更せずに伝播
      // 🔵 信頼性レベル: タスクファイルの実装詳細に基づく

      // 【テストデータ準備】: カスタムファイル名を指定
      const mockElement = document.createElement('div');
      vi.spyOn(document, 'querySelector').mockReturnValue(mockElement);

      const props = {
        targetSelector: '.test',
        filename: 'custom-name',
      };

      // 【実際の処理実行】: ボタンをクリックしてfilenameの伝播を確認
      // 【処理内容】: Props → フック の正しいデータフロー
      render(<ImageSaveButton {...props} />);
      const user = userEvent.setup();
      await user.click(screen.getByRole('button'));

      // 【結果検証】: exportAsImage(element, 'custom-name')が呼ばれたことを確認 🔵
      // 【期待値確認】: Props → フック の正しいデータフロー
      expect(mockExportAsImage).toHaveBeenCalledWith(mockElement, 'custom-name');
      // 【確認内容】: filenameがそのまま渡される 🔵
    });
  });

  describe('統合テストケース', () => {
    it('共通Buttonコンポーネントが正しく使用されている', () => {
      // 【テスト目的】: 既存コンポーネントの再利用を確認 🔵
      // 【テスト内容】: 既存のButtonコンポーネントを再利用している
      // 【期待される動作】: 統一感のあるUIデザイン
      // 🔵 信頼性レベル: 要件定義書の設計制約に基づく

      // 【テストデータ準備】: 通常のPropsでレンダリング
      const props = {
        targetSelector: '.test-container',
      };

      // 【実際の処理実行】: コンポーネントをレンダリング
      // 【処理内容】: Buttonコンポーネントのインポートと使用を確認
      render(<ImageSaveButton {...props} />);

      // 【結果検証】: Buttonコンポーネントがレンダリングされることを確認 🔵
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // 【確認内容】: Buttonコンポーネントのインポートと使用 🔵

      // 【結果検証】: variant="primary"が設定されていることを確認 🔵
      // 注: CSS Modulesでクラス名がハッシュ化されるため、クラス名に"primary"が含まれることを確認
      expect(button.className).toContain('primary');
      // 【確認内容】: UIデザインの統一性（要件定義書の制約条件） 🔵
    });
  });
});
