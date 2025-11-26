/**
 * TutorialContext
 *
 * チュートリアル表示の状態管理
 * REQ-004: チュートリアル表示対応
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

interface TutorialContextType {
  isFirstVisit: boolean;
  setFirstVisit: (value: boolean) => void;
  showTutorial: boolean;
  closeTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined
);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // REQ-004: 初回訪問時のチュートリアル表示判定
    const hasSeenTutorial = localStorage.getItem(STORAGE_KEYS.TUTORIAL_SHOWN);
    const firstVisit = !hasSeenTutorial;
    setIsFirstVisit(firstVisit);
    setShowTutorial(firstVisit);
  }, []);

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem(STORAGE_KEYS.TUTORIAL_SHOWN, 'true');
    setIsFirstVisit(false);
  };

  const value: TutorialContextType = {
    isFirstVisit,
    setFirstVisit: setIsFirstVisit,
    showTutorial,
    closeTutorial,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = (): TutorialContextType => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
};
