/**
 * useTypewriter - タイプライターアニメーションフック
 * TASK-0033: useTypewriterフック実装
 *
 * 【機能概要】: 1文字ずつテキストを表示するアニメーション
 * 【実装方針】: REQ-205, REQ-231, NFR-002に基づく
 * 🔵 信頼性レベル: アニメーション要件に基づく
 *
 * 関連要件:
 * - REQ-205: タイプライターアニメーション 🔵
 * - REQ-231: 100ms/文字の速度 🔵
 * - NFR-002: 60fps維持 🔵
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const ANIMATION_CONFIG = {
  TYPEWRITER_DELAY: 100, // REQ-231: 100ms/文字
};

interface UseTypewriterOptions {
  /** 表示するテキスト */
  text: string;
  /** 1文字あたりの表示時間(ms) REQ-231: デフォルト100ms */
  delay?: number;
  /** アニメーション完了時のコールバック */
  onComplete?: () => void;
  /** アニメーションを有効にするか */
  enabled?: boolean;
}

interface UseTypewriterReturn {
  /** 現在表示中のテキスト */
  displayText: string;
  /** アニメーションが完了したか */
  isComplete: boolean;
  /** アニメーションをスキップ */
  skip: () => void;
  /** アニメーションをリセット */
  reset: () => void;
}

/**
 * タイプライターアニメーションフック
 * REQ-205, REQ-231, NFR-002
 */
const useTypewriter = ({
  text,
  delay = ANIMATION_CONFIG.TYPEWRITER_DELAY,
  onComplete,
  enabled = true,
}: UseTypewriterOptions): UseTypewriterReturn => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const currentIndexRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);

  const skip = useCallback(() => {
    setDisplayText(text);
    setIsComplete(true);
    currentIndexRef.current = text.length;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    onComplete?.();
  }, [text, onComplete]);

  const reset = useCallback(() => {
    setDisplayText('');
    setIsComplete(false);
    currentIndexRef.current = 0;
    lastUpdateTimeRef.current = 0;
  }, []);

  // onCompleteをrefに保存して依存配列の問題を回避
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    console.log('useTypewriter effect', { enabled, text, delay });

    if (!enabled || !text) {
      console.log('useTypewriter: disabled or no text', { enabled, text });
      return;
    }

    // リセット処理（resetを直接実行せず、ここで処理）
    setDisplayText('');
    setIsComplete(false);
    currentIndexRef.current = 0;
    lastUpdateTimeRef.current = 0;

    console.log('useTypewriter: starting animation', { text, delay });

    // REQ-231, NFR-002: requestAnimationFrameで60fps維持
    const animate = (timestamp: number) => {
      if (lastUpdateTimeRef.current === 0) {
        lastUpdateTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastUpdateTimeRef.current;

      if (elapsed >= delay) {
        currentIndexRef.current += 1;
        const newText = text.substring(0, currentIndexRef.current);
        console.log('useTypewriter: updating text', {
          currentIndex: currentIndexRef.current,
          newText,
          textLength: text.length
        });
        setDisplayText(newText);
        lastUpdateTimeRef.current = timestamp;

        if (currentIndexRef.current >= text.length) {
          console.log('useTypewriter: animation complete');
          setIsComplete(true);
          onCompleteRef.current?.();
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      console.log('useTypewriter: cleanup');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [text, delay, enabled]);

  return {
    displayText,
    isComplete,
    skip,
    reset,
  };
};

export default useTypewriter;
