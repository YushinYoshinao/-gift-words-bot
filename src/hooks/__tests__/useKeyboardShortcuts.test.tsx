/**
 * useKeyboardShortcuts フックのテスト
 * TASK-0044: キーボードナビゲーション実装
 *
 * テスト対象:
 * - NFR-205: 全機能をキーボードで操作可能 🔵
 * - NFR-002: アニメーション60fps維持 🔵
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

/**
 * KeyboardShortcut型定義（テスト用）
 * 実装ファイルから自動的にインポートされる想定
 */
interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description: string;
}

describe('useKeyboardShortcuts - TASK-0044', () => {
  // 【テスト前準備】: 各テスト実行前にイベントリスナーのスパイを設定 🔵
  // 【環境初期化】: window.addEventListener/removeEventListenerを監視し、正しくイベント管理されているか確認 🔵
  beforeEach(() => {
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  // 【テスト後処理】: すべてのモックをリストアし、次のテストに影響しないようにする 🔵
  // 【状態復元】: グローバルイベントリスナーを元の状態に戻す 🔵
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('正常系テスト', () => {
    it('単一のキーボードショートカットが正しく登録され、キー押下時にコールバックが実行される', () => {
      // 【テスト目的】: useKeyboardShortcutsフックの基本動作を確認 🔵
      // 【テスト内容】: Escapeキー押下時にコールバックが実行されることを検証 🔵
      // 【期待される動作】: Escapeキー押下でmockCallbackが1回呼ばれ、event.preventDefault()が実行される 🔵
      // 🔵 信頼性レベル: NFR-205要件定義書＋テストケース定義書に基づく確実なテスト

      // 【テストデータ準備】: 単一ショートカット（修飾キーなし）を準備し、基本動作を確認 🔵
      // 【初期条件設定】: Escapeキーのみのシンプルなショートカット登録 🔵
      const mockCallback = vi.fn();
      const shortcuts: KeyboardShortcut[] = [
        {
          key: 'Escape',
          callback: mockCallback,
          description: 'トップページに戻る',
        },
      ];

      // 【実際の処理実行】: useKeyboardShortcutsフックをレンダリング 🔵
      // 【処理内容】: フックマウント時にイベントリスナーが登録される 🔵
      renderHook(() => useKeyboardShortcuts(shortcuts));

      // 【前提条件確認】: イベントリスナーが登録されていることを確認 🔵
      expect(window.addEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
      // 【確認内容】: window.addEventListenerが正しく呼ばれている 🔵

      // 【キーイベント発火】: Escapeキー押下イベントをシミュレート 🔵
      // 【実行タイミング】: イベントリスナー登録直後にキーイベントを発生 🔵
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });

      act(() => {
        window.dispatchEvent(event);
      });

      // 【結果検証】: コールバックが正しく実行されたことを確認 🔵
      // 【期待値確認】: mockCallbackが正確に1回呼ばれることを検証 🔵
      expect(mockCallback).toHaveBeenCalledTimes(1);
      // 【確認内容】: Escapeキー押下時にコールバックが1回実行される 🔵
    });

    it('Ctrl+Sで指定したコールバックが実行される', () => {
      // 【テスト目的】: 修飾キー（Ctrl）との組み合わせショートカットの動作確認 🔵
      // 【テスト内容】: Ctrl+S押下時のコールバック実行と、修飾キーなし's'との区別を検証 🔵
      // 【期待される動作】: Ctrl+Sでのみコールバックが実行され、's'単独では実行されない 🔵
      // 🔵 信頼性レベル: TASK-0044仕様書の使用例（DisplayPageでの画像保存）に基づく

      // 【テストデータ準備】: Ctrl+Sショートカットを準備（実際の使用シナリオ） 🔵
      // 【初期条件設定】: DisplayPageでの画像保存機能を想定したショートカット 🔵
      const mockCallback = vi.fn();
      const shortcuts: KeyboardShortcut[] = [
        {
          key: 's',
          ctrlKey: true,
          callback: mockCallback,
          description: '画像として保存',
        },
      ];

      renderHook(() => useKeyboardShortcuts(shortcuts));

      // 【Ctrl+S押下テスト】: Ctrl+S同時押下イベントを発火 🔵
      // 【処理内容】: 修飾キーありのキーイベントをシミュレート 🔵
      const ctrlSEvent = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });

      act(() => {
        window.dispatchEvent(ctrlSEvent);
      });

      // 【結果検証】: Ctrl+Sでコールバックが実行されることを確認 🔵
      expect(mockCallback).toHaveBeenCalledTimes(1);
      // 【確認内容】: Ctrl+S押下時にコールバックが1回実行される 🔵

      // 【's'キーのみ押下テスト】: 修飾キーなしの's'キー押下 🔵
      // 【処理内容】: コールバックが実行されないことを確認（修飾キー判定の正確性） 🔵
      mockCallback.mockClear();

      const sOnlyEvent = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: false,
        bubbles: true,
        cancelable: true,
      });

      act(() => {
        window.dispatchEvent(sOnlyEvent);
      });

      // 【修飾キー判定確認】: 's'単独ではコールバックが呼ばれないことを検証 🔵
      expect(mockCallback).not.toHaveBeenCalled();
      // 【確認内容】: 修飾キーの有無が正しく区別される 🔵
    });

    it('複数のショートカットが同時に機能する', () => {
      // 【テスト目的】: 複数ショートカットの同時登録と独立動作を確認 🔵
      // 【テスト内容】: Ctrl+SとEscapeの両方を登録し、それぞれ独立して動作することを検証 🔵
      // 【期待される動作】: 各ショートカットが互いに干渉せず、正しく実行される 🔵
      // 🔵 信頼性レベル: DisplayPageでの実際の使用シナリオ（複数機能の併用）に基づく

      // 【テストデータ準備】: 2つの異なるショートカットを準備（実運用パターン） 🔵
      // 【初期条件設定】: Ctrl+S（保存）とEscape（戻る）の組み合わせ 🔵
      const mockSaveCallback = vi.fn();
      const mockEscapeCallback = vi.fn();
      const shortcuts: KeyboardShortcut[] = [
        {
          key: 's',
          ctrlKey: true,
          callback: mockSaveCallback,
          description: '画像として保存',
        },
        {
          key: 'Escape',
          callback: mockEscapeCallback,
          description: 'トップページに戻る',
        },
      ];

      renderHook(() => useKeyboardShortcuts(shortcuts));

      // 【Ctrl+S押下テスト】: 1つ目のショートカット実行 🔵
      const ctrlSEvent = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
      });

      act(() => {
        window.dispatchEvent(ctrlSEvent);
      });

      // 【結果検証】: Ctrl+Sで保存コールバックのみが実行される 🔵
      expect(mockSaveCallback).toHaveBeenCalledTimes(1);
      expect(mockEscapeCallback).not.toHaveBeenCalled();
      // 【確認内容】: 1つ目のショートカットのみが実行され、2つ目は実行されない 🔵

      // 【Escape押下テスト】: 2つ目のショートカット実行 🔵
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });

      act(() => {
        window.dispatchEvent(escapeEvent);
      });

      // 【結果検証】: Escapeで戻るコールバックのみが実行される 🔵
      expect(mockSaveCallback).toHaveBeenCalledTimes(1); // 以前のまま
      expect(mockEscapeCallback).toHaveBeenCalledTimes(1);
      // 【確認内容】: 2つ目のショートカットが独立して実行される 🔵
    });

    it('Shift+Enterでコールバックが実行される', () => {
      // 【テスト目的】: Ctrl以外の修飾キー（Shift）も正しく機能するか確認 🔵
      // 【テスト内容】: shiftKeyフラグの判定が正確に行われることを検証 🔵
      // 【期待される動作】: Shift+Enterでのみコールバックが実行される 🔵
      // 🟡 信頼性レベル: 一般的なキーボードショートカットパターンから推測

      // 【テストデータ準備】: Shift修飾キーの動作確認用ショートカット 🟡
      // 【初期条件設定】: すべての修飾キータイプの網羅性確保 🟡
      const mockCallback = vi.fn();
      const shortcuts: KeyboardShortcut[] = [
        {
          key: 'Enter',
          shiftKey: true,
          callback: mockCallback,
          description: 'Shift+Enter送信',
        },
      ];

      renderHook(() => useKeyboardShortcuts(shortcuts));

      // 【Shift+Enter押下テスト】: Shift修飾キーありのキーイベント 🟡
      const shiftEnterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: true,
        bubbles: true,
      });

      act(() => {
        window.dispatchEvent(shiftEnterEvent);
      });

      // 【結果検証】: Shift+Enterでコールバックが実行される 🟡
      expect(mockCallback).toHaveBeenCalledTimes(1);
      // 【確認内容】: shiftKeyフラグの判定が正確に機能する 🟡

      // 【Enterのみ押下テスト】: 修飾キーなしでは実行されないことを確認 🟡
      mockCallback.mockClear();

      const enterOnlyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: false,
        bubbles: true,
      });

      act(() => {
        window.dispatchEvent(enterOnlyEvent);
      });

      // 【修飾キー判定確認】: Enterのみではコールバックが呼ばれない 🟡
      expect(mockCallback).not.toHaveBeenCalled();
      // 【確認内容】: shiftKeyの有無が正しく区別される 🟡
    });
  });

  describe('異常系テスト', () => {
    it('空のshortcuts配列でもエラーが発生しない', () => {
      // 【テスト目的】: 空配列での堅牢性を確認 🔵
      // 【テスト内容】: ショートカット未登録時にクラッシュしないことを検証 🔵
      // 【期待される動作】: エラーなく動作し、キー押下時も何も実行されない 🔵
      // 🔵 信頼性レベル: 要件定義書のエッジケースEDGE-001に基づく

      // 【テストデータ準備】: 空配列（ショートカット未登録状態） 🔵
      // 【初期条件設定】: 動的ショートカット管理の初期状態を想定 🔵
      const shortcuts: KeyboardShortcut[] = [];

      // 【エラーハンドリング確認】: エラーがスローされないことを確認 🔵
      expect(() => {
        renderHook(() => useKeyboardShortcuts(shortcuts));
      }).not.toThrow();
      // 【確認内容】: 空配列でもフックがクラッシュしない 🔵

      // 【イベントリスナー登録確認】: 空配列でもイベントリスナーは登録される 🔵
      expect(window.addEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
      // 【確認内容】: 空配列でもイベントリスナーが正しく登録される 🔵

      // 【キーイベント発火】: キー押下時に何も実行されないことを確認 🔵
      const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true });

      expect(() => {
        act(() => {
          window.dispatchEvent(event);
        });
      }).not.toThrow();
      // 【確認内容】: 空配列でもキーイベント処理がエラーにならない 🔵
    });

    it('コールバック内で例外がスローされてもフックが継続動作する', () => {
      // 【テスト目的】: コールバックエラー時の分離とフック継続動作を確認 🟡
      // 【テスト内容】: 1つのコールバックエラーが他のショートカットに影響しないことを検証 🟡
      // 【期待される動作】: エラー発生後も他のショートカットは正常動作する 🟡
      // 🟡 信頼性レベル: 一般的なエラーハンドリングベストプラクティスから推測

      // 【テストデータ準備】: エラーを発生させるコールバックと正常なコールバック 🟡
      // 【初期条件設定】: 部分的な障害がシステム全体に波及しないことを確認 🟡
      const mockErrorCallback = vi.fn(() => {
        throw new Error('Test error in callback');
      });
      const mockNormalCallback = vi.fn();

      const shortcuts: KeyboardShortcut[] = [
        {
          key: 'a',
          callback: mockErrorCallback,
          description: 'Error test',
        },
        {
          key: 'b',
          callback: mockNormalCallback,
          description: 'Normal callback',
        },
      ];

      renderHook(() => useKeyboardShortcuts(shortcuts));

      // 【エラー発生テスト】: 'a'キー押下でエラーが発生 🟡
      // 【処理内容】: コールバック内のエラーがスローされることを確認 🟡
      const aKeyEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });

      // Note: エラーはコールバック内で発生するため、window.dispatchEventではキャッチされない
      // 実装側でtry-catchが必要かを確認する意図
      act(() => {
        window.dispatchEvent(aKeyEvent);
      });

      // 【エラー後の継続動作確認】: 'b'キー押下で正常動作することを確認 🟡
      const bKeyEvent = new KeyboardEvent('keydown', { key: 'b', bubbles: true });

      act(() => {
        window.dispatchEvent(bKeyEvent);
      });

      // 【結果検証】: エラー発生後も他のショートカットは正常動作 🟡
      expect(mockNormalCallback).toHaveBeenCalledTimes(1);
      // 【確認内容】: 1つのコールバックエラーが他のショートカットに影響しない 🟡
    });
  });

  describe('境界値テスト', () => {
    it('同じキーの重複登録で両方のコールバックが順次実行される', () => {
      // 【テスト目的】: ショートカット配列の完全走査を確認 🔵
      // 【テスト内容】: 同一キーの重複登録時に両方のコールバックが実行されることを検証 🔵
      // 【期待される動作】: 配列の順序通りに両方のコールバックが実行される 🔵
      // 🔵 信頼性レベル: 要件定義書のエッジケースEDGE-002に基づく

      // 【テストデータ準備】: 同一キーの重複ショートカット 🔵
      // 【初期条件設定】: 配列走査の完全性を検証（早期returnがないことを確認） 🔵
      const mockCallback1 = vi.fn();
      const mockCallback2 = vi.fn();

      const shortcuts: KeyboardShortcut[] = [
        {
          key: 's',
          ctrlKey: true,
          callback: mockCallback1,
          description: 'Save 1',
        },
        {
          key: 's',
          ctrlKey: true,
          callback: mockCallback2,
          description: 'Save 2',
        },
      ];

      renderHook(() => useKeyboardShortcuts(shortcuts));

      // 【Ctrl+S押下テスト】: 同一キーイベントで両方実行されることを確認 🔵
      const ctrlSEvent = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
      });

      act(() => {
        window.dispatchEvent(ctrlSEvent);
      });

      // 【結果検証】: 両方のコールバックが実行される 🔵
      expect(mockCallback1).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenCalledTimes(1);
      // 【確認内容】: 重複登録時にすべてのコールバックが確実に実行される 🔵
    });

    it('F1キーやTabキーなどの特殊キーが正しく動作する', () => {
      // 【テスト目的】: 特殊キーの動作確認とKeyboardEvent.keyの網羅性 🟡
      // 【テスト内容】: アルファベット以外の特殊キーが正しくハンドリングされることを検証 🟡
      // 【期待される動作】: F1, Tab, Spaceなどの特殊キーでもコールバックが実行される 🟡
      // 🟡 信頼性レベル: 一般的なキーボードショートカットパターンから推測

      // 【テストデータ準備】: 特殊キーのショートカット 🟡
      // 【初期条件設定】: KeyboardEvent.keyのすべての値タイプに対応することを確認 🟡
      const mockF1Callback = vi.fn();
      const mockTabCallback = vi.fn();
      const mockSpaceCallback = vi.fn();

      const shortcuts: KeyboardShortcut[] = [
        { key: 'F1', callback: mockF1Callback, description: 'Help' },
        { key: 'Tab', callback: mockTabCallback, description: 'Tab' },
        { key: ' ', callback: mockSpaceCallback, description: 'Space' },
      ];

      renderHook(() => useKeyboardShortcuts(shortcuts));

      // 【F1キー押下テスト】: F1キーでコールバック実行 🟡
      const f1Event = new KeyboardEvent('keydown', { key: 'F1', bubbles: true });
      act(() => {
        window.dispatchEvent(f1Event);
      });
      expect(mockF1Callback).toHaveBeenCalledTimes(1);
      // 【確認内容】: F1キーが正しく認識される 🟡

      // 【Tabキー押下テスト】: Tabキーでコールバック実行 🟡
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      act(() => {
        window.dispatchEvent(tabEvent);
      });
      expect(mockTabCallback).toHaveBeenCalledTimes(1);
      // 【確認内容】: Tabキーが正しく認識される 🟡

      // 【Spaceキー押下テスト】: Spaceキーでコールバック実行 🟡
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      act(() => {
        window.dispatchEvent(spaceEvent);
      });
      expect(mockSpaceCallback).toHaveBeenCalledTimes(1);
      // 【確認内容】: Spaceキー（文字列としてスペース）が正しく認識される 🟡
    });
  });

  describe('ライフサイクルテスト', () => {
    it('useKeyboardShortcuts呼び出し時にwindow.addEventListenerが実行される', () => {
      // 【テスト目的】: useEffectによるイベントリスナー登録を確認 🔵
      // 【テスト内容】: フックマウント時にkeydownイベントリスナーが追加されることを検証 🔵
      // 【期待される動作】: window.addEventListener('keydown', ...)が呼ばれる 🔵
      // 🔵 信頼性レベル: React Hooksの標準パターンに基づく

      // 【テストデータ準備】: 最小構成のショートカット 🔵
      // 【初期条件設定】: ライフサイクルテストはショートカット内容に依存しない 🔵
      const shortcuts: KeyboardShortcut[] = [
        { key: 'a', callback: vi.fn(), description: 'Test' },
      ];

      // 【フックレンダリング】: useKeyboardShortcutsを呼び出す 🔵
      renderHook(() => useKeyboardShortcuts(shortcuts));

      // 【結果検証】: window.addEventListenerが正しく呼ばれていることを確認 🔵
      expect(window.addEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
      // 【確認内容】: useEffectの副作用が正しく実行され、イベントリスナーが登録される 🔵
    });

    it('アンマウント時にwindow.removeEventListenerが実行される', () => {
      // 【テスト目的】: useEffectのクリーンアップ関数が正しく動作するか確認 🔵
      // 【テスト内容】: コンポーネントアンマウント時にイベントリスナーが削除されることを検証 🔵
      // 【期待される動作】: window.removeEventListener('keydown', ...)が呼ばれる 🔵
      // 🔵 信頼性レベル: 要件定義書のエッジケースEDGE-003に基づく

      // 【テストデータ準備】: 最小構成のショートカット 🔵
      const shortcuts: KeyboardShortcut[] = [
        { key: 'a', callback: vi.fn(), description: 'Test' },
      ];

      // 【フックレンダリング】: useKeyboardShortcutsを呼び出す 🔵
      const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));

      // 【アンマウント実行】: コンポーネントをアンマウント 🔵
      // 【処理内容】: useEffectのreturn関数（クリーンアップ）が実行される 🔵
      unmount();

      // 【結果検証】: window.removeEventListenerが正しく呼ばれていることを確認 🔵
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
      // 【確認内容】: メモリリーク防止のため、イベントリスナーが確実に削除される 🔵
    });

    it('shortcuts配列が変更されたときにイベントリスナーが更新される', () => {
      // 【テスト目的】: useEffectの依存配列による再実行を確認 🔵
      // 【テスト内容】: shortcuts変更時に古いリスナーが削除され、新しいリスナーが登録されることを検証 🔵
      // 【期待される動作】: shortcuts更新前後で動作が切り替わる 🔵
      // 🔵 信頼性レベル: 要件定義書のエッジケースEDGE-004に基づく

      // 【初期テストデータ準備】: 最初のショートカット構成 🔵
      // 【初期条件設定】: 'a'キーのショートカットを登録 🔵
      const mockCallback1 = vi.fn();
      const initialShortcuts: KeyboardShortcut[] = [
        { key: 'a', callback: mockCallback1, description: 'Test 1' },
      ];

      // 【フックレンダリング】: 初期ショートカットでフックを実行 🔵
      const { rerender } = renderHook(
        ({ shortcuts }) => useKeyboardShortcuts(shortcuts),
        { initialProps: { shortcuts: initialShortcuts } }
      );

      // 【初期動作確認】: 'a'キー押下でmockCallback1が実行される 🔵
      const aKeyEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
      act(() => {
        window.dispatchEvent(aKeyEvent);
      });
      expect(mockCallback1).toHaveBeenCalledTimes(1);
      // 【確認内容】: 初期ショートカットが正しく動作する 🔵

      // 【ショートカット更新】: 'b'キーのショートカットに変更 🔵
      // 【処理内容】: useEffectが再実行され、イベントリスナーが更新される 🔵
      const mockCallback2 = vi.fn();
      const updatedShortcuts: KeyboardShortcut[] = [
        { key: 'b', callback: mockCallback2, description: 'Test 2' },
      ];

      rerender({ shortcuts: updatedShortcuts });

      // 【更新後動作確認】: 'a'キー押下で何も実行されない 🔵
      mockCallback1.mockClear();
      act(() => {
        window.dispatchEvent(aKeyEvent);
      });
      expect(mockCallback1).not.toHaveBeenCalled();
      // 【確認内容】: 古いショートカット('a')が無効化されている 🔵

      // 【新ショートカット確認】: 'b'キー押下でmockCallback2が実行される 🔵
      const bKeyEvent = new KeyboardEvent('keydown', { key: 'b', bubbles: true });
      act(() => {
        window.dispatchEvent(bKeyEvent);
      });
      expect(mockCallback2).toHaveBeenCalledTimes(1);
      // 【確認内容】: 新しいショートカット('b')が正しく動作する 🔵
    });
  });

  // Note: 統合テストは実際のコンポーネント（DisplayPage）実装後に追加予定
  // 現時点ではフックの単体テストに焦点を当てる
});
