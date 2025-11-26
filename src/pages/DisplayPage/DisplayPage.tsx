/**
 * DisplayPage - 贈る言葉表示ページ
 * TASK-0025: DisplayPage基本構造実装
 *
 * 【機能概要】: URLパラメータから贈る言葉データをデコードして表示する
 * 【実装方針】: TDD Green phase - テストを通すための最小実装
 * 【テスト対応】: DisplayPage.test.tsx の11テストケースを全て通す
 * 🔵 信頼性レベル: F-003, REQ-201, REQ-206, REQ-212に基づく
 *
 * 関連要件:
 * - F-003: 贈る言葉表示ページ 🔵
 * - REQ-201: 武田鉄矢の画像を背景として表示 🔵
 * - REQ-206: 「新しい言葉を贈る」ボタン 🔵
 * - REQ-212: URLパラメータ不在時のリダイレクト 🔵
 */

import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { decodeGiftWordData } from '../../utils/urlEncoder';
import BackgroundImage from '../../components/DisplayPage/BackgroundImage';
import VerticalTextDisplay from '../../components/DisplayPage/VerticalTextDisplay';
import ErrorPage from '../ErrorPage';
import Button from '../../components/common/Button/Button';
import { GiftWordData } from '../../types';
import { useToast } from '../../context/ToastContext';
import styles from './DisplayPage.module.css';

/**
 * 【メインコンポーネント】: DisplayPage
 * 【機能概要】: 贈る言葉の表示ページ全体を管理する
 * 【実装方針】: URLパラメータのデコード、エラーハンドリング、ナビゲーション機能を実装
 * 【テスト対応】: 全11テストケースを通すための実装
 * 🔵 信頼性レベル: REQ-212, REQ-206に基づく確実な実装
 */
const DisplayPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast(); // 【TASK-0026】: Toast通知機能を追加 🔵
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 【状態管理】: データ、エラー、ローディング状態を管理
  // 【実装方針】: テストで期待される状態遷移を実現
  const [data, setData] = useState<GiftWordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [waitingForInteraction, setWaitingForInteraction] = useState(false);

  /**
   * 【音源事前読み込み - 最優先】: コンポーネントマウント直後に音源読み込み開始
   */
  useEffect(() => {
    console.log('=== Initial audio setup useEffect triggered ===');

    // audio要素を動的に作成して即座に読み込み開始
    const audio = new Audio('/贈る言葉音源.m4a');
    audio.volume = 0.7;
    audio.preload = 'metadata';
    audioRef.current = audio;

    console.log('Audio element created and assigned to ref');

    // 読み込み完了イベント
    const handleCanPlay = () => {
      console.log('Audio ready to play');
      setAudioReady(true);
    };

    // エラーハンドリング
    const handleError = (e: Event | string) => {
      console.error('Audio loading error:', e);
      // エラーでも続行
      setAudioReady(true);
    };

    // 最小限のデータが読み込まれたら開始
    const handleCanPlayThrough = () => {
      console.log('Audio can play through');
      setAudioReady(true);
    };

    // メタデータ読み込み完了でも開始
    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded');
      setAudioReady(true);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError as any);

    // 読み込み開始
    console.log('Starting audio.load()');
    audio.load();

    // タイムアウト: 500msで強制的に開始（より速く）
    const timeout = setTimeout(() => {
      console.log('Audio loading timeout - forcing start');
      setAudioReady(true);
    }, 500);

    return () => {
      clearTimeout(timeout);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError as any);
    };
  }, []);

  /**
   * 【副作用フック】: URLパラメータからデータをデコード
   * 【実装方針】: コンポーネントマウント時にURLパラメータを処理
   * 【テスト対応】: URLパラメータの有無、デコード成功/失敗、データバリデーションのテスト用
   * 🔵 信頼性レベル: REQ-212, REQ-213に基づく
   * 🔵 TASK-0026: Toast通知機能を統合
   */
  useEffect(() => {
    console.log('=== Data loading useEffect triggered ===');
    const encodedData = searchParams.get('data');
    console.log('encodedData:', encodedData);

    // 【REQ-212対応】: URLパラメータがnullの場合のみトップページにリダイレクト 🔵
    // 【TASK-0026修正】: 空文字列とnullを区別して処理 🔵
    // 【テスト対応】: TC-DECODE-012「URLパラメータがnullの場合はリダイレクトされる」
    if (encodedData === null) {
      console.log('No data parameter - redirecting to home');
      navigate('/', { replace: true });
      return;
    }

    // 【デコード処理】: Base64エンコードされたデータをGiftWordDataに変換
    // 【実装方針】: urlEncoder.tsのdecodeGiftWordData関数を使用
    // 【TASK-0026】: 空文字列も含めてdecodeGiftWordDataで処理 🔵
    // 【テスト対応】: デコード成功/失敗、データバリデーションのテスト用
    const result = decodeGiftWordData(encodedData);
    console.log('Decode result:', result);

    if (!result.success || !result.data) {
      // 【エラー処理】: デコード失敗またはデータが不正な場合
      // 【テスト対応】: 「不正なURLパラメータの場合はエラーページを表示」テスト用
      // 【REQ-213対応】: 分かりやすいエラーメッセージを表示 🔵
      // 【TASK-0026】: Toast通知機能を追加 🔵
      // 【テスト対応】: TC-DECODE-009「デコード失敗時にトーストメッセージが表示される」
      const errorMessage = result.error || 'データの読み込みに失敗しました';
      console.log('Setting error:', errorMessage);

      // 【Toast通知】: ユーザーにエラーを通知 🔵
      showToast(errorMessage, 'error');

      // 【エラーページ表示】: ErrorPageコンポーネントで詳細を表示 🔵
      setError(errorMessage);
    } else {
      // 【成功処理】: データをstateにセット
      // 【テスト対応】: 「デコード成功時にデータが表示される」テスト用
      console.log('Setting data:', result.data);
      setData(result.data);
    }

    // 【ローディング完了】: 処理が終わったらローディング状態を解除
    // 【テスト対応】: 「ローディング状態が表示される」テスト用
    console.log('Setting isLoading to false');
    setIsLoading(false);
  }, [searchParams, navigate, showToast]);


  /**
   * 【コンテンツ表示開始】: データと音源の両方が準備完了したら表示開始
   */
  useEffect(() => {
    console.log('=== Content start useEffect triggered ===');
    console.log('isLoading:', isLoading);
    console.log('data:', data);
    console.log('audioReady:', audioReady);
    console.log('showContent:', showContent);

    if (!isLoading && data && audioReady && !showContent) {
      console.log('Ready to start - waiting for user interaction');
      // 自動再生を試みる代わりに、ユーザーインタラクション待機画面を表示
      setWaitingForInteraction(true);
    }
  }, [isLoading, data, audioReady, showContent]);

  /**
   * 【ユーザーインタラクション処理】: クリック/タップで開始
   */
  const handleStartClick = async () => {
    console.log('User clicked to start');
    setWaitingForInteraction(false);
    setShowContent(true);

    // 音源再生開始
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        console.log('Audio playback started');
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }
  };

  /**
   * 【エラー表示】: デコード失敗またはデータ不正時のエラー画面
   * 【テスト対応】: 「不正なURLパラメータの場合はエラーページを表示」テスト用
   * 【テスト対応】: 「空のwordデータの場合はエラーを表示」テスト用
   * 【テスト対応】: 「空のmeaningデータの場合はエラーを表示」テスト用
   * 🔵 信頼性レベル: TASK-0027で詳細実装完了
   */
  if (error || !data) {
    console.log('=== Rendering error page ===');
    console.log('error:', error, 'data:', data);
    return <ErrorPage message={error || undefined} />;
  }

  /**
   * 【ユーザーインタラクション待機画面】: 音源再生のためのクリック/タップ待ち
   */
  if (waitingForInteraction) {
    console.log('=== Rendering interaction prompt ===');
    return (
      <div className={styles.interactionPrompt} onClick={handleStartClick}>
        <div className={styles.promptContent}>
          <p className={styles.promptText}>タップして開始</p>
          <p className={styles.promptSubtext}>音源付きで贈る言葉を表示します</p>
          <p className={styles.promptHint}>📱 スマホは横向きでご覧ください</p>
        </div>
      </div>
    );
  }

  /**
   * 【ローディング表示】: データ取得中または音源読み込み中の状態を表示
   * 【テスト対応】: 「ローディング状態が表示される」テスト用
   * 🟡 信頼性レベル: 一般的なUXパターンに基づく
   */
  if (isLoading || !audioReady || !showContent) {
    console.log('=== Rendering loading screen ===');
    console.log('isLoading:', isLoading, '!audioReady:', !audioReady, '!showContent:', !showContent);
    return (
      <div className={styles.loading}>
        <p>{isLoading ? 'データ読み込み中...' : '音源準備中...'}</p>
      </div>
    );
  }

  /**
   * 【メイン表示】: 正常にデータが取得できた場合のメイン画面
   * 【実装方針】: container > content > actions の構造でレイアウト
   * 【テスト対応】: 「正常にレンダリングされる」テスト用
   * 【テスト対応】: 「必要なコンポーネントが配置されている」テスト用
   * 【テスト対応】: 「日本語（ひらがな、カタカナ、漢字）が正しく表示される」テスト用
   * 🔵 信頼性レベル: TASK-0025仕様に基づく
   */
  console.log('=== Rendering main content ===');
  console.log('data:', data);
  return (
    <div className={styles.container}>
      {/* 【背景画像】: 武田鉄矢の画像（TASK-0028で詳細実装） */}
      {/* 【REQ-201対応】: 武田鉄矢の画像を背景として表示 🔵 */}
      <BackgroundImage />

      {/* 【コンテンツエリア】: 縦書きテキスト表示（TASK-0030で詳細実装） */}
      {/* 【REQ-203対応】: 黒板の左側に縦書きで表示 🔵 */}
      <div className={styles.content}>
        <VerticalTextDisplay word={data.word} meaning={data.meaning} />
      </div>

      {/* 【アクションエリア】: ナビゲーションボタン */}
      {/* 【REQ-206対応】: 「新しい言葉を贈る」ボタン 🔵 */}
      {/* 【テスト対応】: 「「新しい言葉を贈る」ボタンでトップページに戻る」テスト用 */}
      <div className={styles.actions}>
        <Button onClick={() => navigate('/')} variant="secondary">
          新しい言葉を贈る
        </Button>
      </div>
    </div>
  );
};

export default DisplayPage;
