import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';
import { ToastProvider } from './context/ToastContext';
import { TutorialProvider } from './context/TutorialContext';
import ToastContainer from './components/common/Toast/ToastContainer';
import './styles/global.css';

/**
 * コード分割によるページの遅延読み込み
 * NFR-001: ページ読み込み時間3秒以内
 * NFR-003: バンドルサイズ500KB以下(gzip圧縮後)
 */
const HomePage = lazy(() => import('./pages/HomePage'));
const DisplayPage = lazy(() => import('./pages/DisplayPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

/**
 * メインアプリケーションコンポーネント
 *
 * React Routerを使用してページルーティングを管理します。
 * React.lazyとSuspenseによるコード分割でパフォーマンスを最適化。
 *
 * - F-001: 言葉入力フォーム(HomePage)🔵
 * - F-003: 贈る言葉表示ページ(DisplayPage)🔵
 * - NFR-001: ページ読み込み3秒以内(コード分割)🔵
 * - NFR-003: バンドルサイズ500KB以下(コード分割)🔵
 */
function App() {
  return (
    <ToastProvider>
      <TutorialProvider>
        <Router>
          <div className="app">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* F-001: ホームページ(入力フォーム) 🔵 */}
                <Route path="/" element={<HomePage />} />

                {/* F-003: 表示ページ 🔵 */}
                <Route path="/display" element={<DisplayPage />} />

                {/* 404エラーページ 🟡 */}
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Suspense>
            <ToastContainer />
          </div>
        </Router>
      </TutorialProvider>
    </ToastProvider>
  );
}

export default App;
