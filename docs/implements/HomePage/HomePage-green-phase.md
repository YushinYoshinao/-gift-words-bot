# HomePage コンポーネント - Green Phase 実装書

## 生成情報
- **生成日**: 2025-01-21
- **生成ツール**: /tsumiki:tdd-green
- **機能名**: HomePage コンポーネント
- **フェーズ**: Green（最小実装）

---

## 実装概要

HomePageコンポーネントの最小実装を完了し、Phase 1（P0 Critical）の全7個のテストケースを成功させました。

### テスト実行結果

```
Test Files  1 passed (1)
     Tests  7 passed (7)
  Duration  1.43s
```

**✅ すべてのテストが成功**

---

## 実装コード

### ファイル: `src/pages/HomePage/HomePage.tsx`

```tsx
/**
 * HomePage - 言葉入力フォームページ
 *
 * F-001: 言葉入力フォーム 🔵
 * REQ-001: 「贈りたい言葉」入力欄
 * REQ-002: 「その意味」入力欄
 * REQ-003: 「共有リンクを生成」ボタン
 * REQ-004: 初回訪問時チュートリアル表示
 * REQ-104: 共有リンク表示モーダル
 */

import { useState } from 'react';
import InputForm from '../../components/InputForm/InputForm';
import TutorialModal from '../../components/common/TutorialModal/TutorialModal';
import ShareModal from '../../components/common/ShareModal/ShareModal';
import { useTutorial } from '../../context/TutorialContext';
import styles from './HomePage.module.css';

/**
 * 【機能概要】: HomePageコンポーネント - トップページ（言葉入力フォーム）
 * 【実装方針】: 必要なコンポーネントを統合し、状態管理で条件付きレンダリング
 * 【テスト対応】: TC-HP-001~TC-HP-042の7個のテストケースを通すための実装
 * 🔵 信頼性レベル: EARS要件定義書に基づく実装
 */
const HomePage = () => {
  // 【Context取得】: チュートリアル表示状態の管理 🔵
  // 【EARS要件】: REQ-004（初回訪問時チュートリアル表示）
  const { showTutorial, closeTutorial } = useTutorial();

  // 【State管理】: 共有URL生成後の状態管理 🔵
  // 【EARS要件】: REQ-104（共有リンク表示モーダル）
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  /**
   * 【機能概要】: InputFormからのコールバック - 共有URL生成成功時
   * 【実装方針】: URL受け取り→State更新→ShareModal表示
   * 【テスト対応】: TC-HP-031, TC-HP-032, TC-HP-041を通すための実装
   * 🔵 信頼性レベル: REQ-101, REQ-104に基づく
   *
   * @param {string} url - 生成された共有URL
   *
   * 【UX改善】: チュートリアル表示中に共有リンク生成した場合、チュートリアルを自動で閉じる
   * 【理由】: モーダルの重複表示を防ぎ、UXを向上させる 🟡
   */
  const handleShareUrlGenerated = (url: string) => {
    // 【処理内容】: チュートリアル表示中なら閉じる（モーダル重複を防ぐ） 🟡
    if (showTutorial) {
      closeTutorial();
    }

    // 【State更新】: 共有URLを保存し、ShareModalを表示 🔵
    setShareUrl(url);
    setShowShareModal(true);
  };

  /**
   * 【機能概要】: ShareModalを閉じる処理
   * 【実装方針】: Stateをリセットしてモーダルを非表示に
   * 【テスト対応】: TC-HP-042を通すための実装
   * 🔵 信頼性レベル: REQ-104に基づく
   */
  const handleCloseShareModal = () => {
    // 【State更新】: モーダル非表示とURLクリア 🔵
    // 【理由】: 次回の共有リンク生成時に古いURLが残らないようにする
    setShowShareModal(false);
    setShareUrl(null);
  };

  return (
    // 【セマンティックHTML】: メインコンテンツ領域 🔵
    // 【EARS要件】: NFR-201（アクセシビリティ要件）
    // 【テスト対応】: TC-HP-001を通すために<main>タグを使用
    <main className={styles.homePage} role="main">
      <div className={styles.container}>
        {/* 【タイトル表示】: アプリケーション名 🔵 */}
        <h1 className={styles.title}>贈る言葉BOT</h1>

        {/* 【サブタイトル】: 使い方の簡単な説明 🔵 */}
        <p className={styles.subtitle}>
          友達に贈る言葉を作成して、リンクで共有しましょう
        </p>

        {/* 【InputForm統合】: 言葉入力フォームコンポーネント 🔵 */}
        {/* 【EARS要件】: REQ-001, REQ-002, REQ-003 */}
        {/* 【テスト対応】: TC-HP-002, TC-HP-031, TC-HP-032を通すために配置 */}
        <InputForm onShareUrlGenerated={handleShareUrlGenerated} />
      </div>

      {/* 【条件付きレンダリング】: チュートリアルモーダル 🔵 */}
      {/* 【EARS要件】: REQ-004（初回訪問時のみ表示） */}
      {/* 【表示条件】: showTutorial === true */}
      {showTutorial && <TutorialModal />}

      {/* 【条件付きレンダリング】: 共有モーダル 🔵 */}
      {/* 【EARS要件】: REQ-104（URL生成成功時に表示） */}
      {/* 【表示条件】: shareUrl !== null && showShareModal === true */}
      {/* 【テスト対応】: TC-HP-032, TC-HP-041, TC-HP-042を通すために配置 */}
      {shareUrl && showShareModal && (
        <ShareModal url={shareUrl} onClose={handleCloseShareModal} />
      )}
    </main>
  );
};

export default HomePage;
```

---

## 実装の説明

### 1. セマンティックHTML対応 🔵

**実装内容**:
```tsx
<main className={styles.homePage} role="main">
```

**理由**:
- アクセシビリティ要件（NFR-201）に準拠
- スクリーンリーダーがメインコンテンツを認識できる
- TC-HP-001のテスト（`getByRole('main')`）を通すために必須

**信頼性**: 🔵（EARS要件に基づく）

---

### 2. Context統合 🔵

**実装内容**:
```tsx
const { showTutorial, closeTutorial } = useTutorial();
```

**理由**:
- REQ-004（初回訪問時チュートリアル表示）の要件に対応
- TutorialContextから状態を取得し、条件付きレンダリングに使用
- `closeTutorial`はUX改善のために使用（モーダル重複防止）

**信頼性**: 🔵（REQ-004に基づく）

---

### 3. State管理 🔵

**実装内容**:
```tsx
const [shareUrl, setShareUrl] = useState<string | null>(null);
const [showShareModal, setShowShareModal] = useState(false);
```

**理由**:
- REQ-104（共有リンク表示モーダル）の要件に対応
- `shareUrl`: 生成されたURLを保持
- `showShareModal`: ShareModalの表示/非表示を制御
- 初期値は`null`と`false`でモーダル非表示（TC-HP-041を通す）

**信頼性**: 🔵（REQ-104に基づく）

---

### 4. InputForm統合 🔵

**実装内容**:
```tsx
<InputForm onShareUrlGenerated={handleShareUrlGenerated} />
```

**理由**:
- REQ-001, REQ-002, REQ-003（入力フォーム要件）に対応
- TC-HP-002のテスト（InputFormの要素が表示される）を通す
- `onShareUrlGenerated`コールバックでURL生成を受け取る

**信頼性**: 🔵（REQ-001~003に基づく）

---

### 5. イベントハンドラ実装 🔵

#### handleShareUrlGenerated

**実装内容**:
```tsx
const handleShareUrlGenerated = (url: string) => {
  if (showTutorial) {
    closeTutorial();
  }
  setShareUrl(url);
  setShowShareModal(true);
};
```

**理由**:
- InputFormからのコールバックを受け取り、ShareModalを表示
- TC-HP-031, TC-HP-032, TC-HP-041を通すために必須
- チュートリアル自動クローズはUX改善（モーダル重複防止） 🟡

**信頼性**:
- 基本機能: 🔵（REQ-101, REQ-104に基づく）
- チュートリアル自動クローズ: 🟡（UX改善のための妥当な推測）

#### handleCloseShareModal

**実装内容**:
```tsx
const handleCloseShareModal = () => {
  setShowShareModal(false);
  setShareUrl(null);
};
```

**理由**:
- ShareModalを閉じてStateをリセット
- TC-HP-042のテスト（モーダルクローズ動作）を通すために必須
- `shareUrl`をnullにすることで、次回生成時に古いURLが残らない

**信頼性**: 🔵（REQ-104に基づく）

---

### 6. 条件付きレンダリング 🔵

#### TutorialModal

**実装内容**:
```tsx
{showTutorial && <TutorialModal />}
```

**理由**:
- REQ-004（初回訪問時のみチュートリアル表示）に対応
- `showTutorial`がtrueの場合のみレンダリング
- LocalStorageの状態によって自動制御（TutorialContext実装済み）

**信頼性**: 🔵（REQ-004に基づく）

#### ShareModal

**実装内容**:
```tsx
{shareUrl && showShareModal && (
  <ShareModal url={shareUrl} onClose={handleCloseShareModal} />
)}
```

**理由**:
- REQ-104（URL生成成功時に表示）に対応
- 両方の条件が満たされた場合のみレンダリング
- TC-HP-041（初期状態で非表示）とTC-HP-032（生成後に表示）を通す

**信頼性**: 🔵（REQ-104に基づく）

---

## テスト修正内容

### TC-HP-041の修正

**修正箇所**: `src/pages/HomePage/__tests__/HomePage.test.tsx`

**修正前**:
```tsx
it('TC-HP-041: ShareModal初期状態では表示されない', () => {
  renderHomePage();

  // 初期状態ではShareModalは表示されない
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(
    screen.queryByText(/共有リンクを生成しました/i)
  ).not.toBeInTheDocument();
});
```

**修正後**:
```tsx
it('TC-HP-041: ShareModal初期状態では表示されない', () => {
  // 【テスト前準備】: チュートリアルを既読にしてTutorialModalが表示されないようにする 🔵
  // 【理由】: このテストはShareModalの初期状態のみを検証するため、TutorialModalの影響を排除
  localStorage.setItem('tutorial_shown', 'true');

  renderHomePage();

  // 【確認内容】: 初期状態ではShareModalは表示されない 🔵
  // TutorialModalも表示されないため、どのdialogも存在しない
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(
    screen.queryByText(/共有リンクを生成しました/i)
  ).not.toBeInTheDocument();
});
```

**修正理由**:
- `beforeEach`で`localStorage.clear()`が実行されるため、初回訪問扱いになる
- 初回訪問時は`TutorialModal`（role="dialog"）が表示される
- このテストは「ShareModalが初期状態で非表示」を検証するため、TutorialModalの影響を排除
- `localStorage.setItem('tutorial_shown', 'true')`でチュートリアルを既読にする

**信頼性**: 🔵（テストケース定義に基づく適切な修正）

---

## ファイルサイズチェック

### HomePage.tsx

**行数**: 74行

**状態**: ✅ 問題なし（800行制限の9%）

**評価**:
- 適切なサイズで可読性が高い
- 分割の必要なし

---

## モック使用確認

### ✅ 実装コードにモック・スタブは含まれていない

**確認結果**:
- テストコード: モック使用あり（TutorialProvider, ToastProviderで統合テスト）
- 実装コード: モック使用なし（すべて実際のロジックを実装）

**評価**: TDDガイドラインに準拠

---

## 課題の特定（Refactorフェーズ対象）

### 1. チュートリアル自動クローズのロジック 🟡

**現在の実装**:
```tsx
if (showTutorial) {
  closeTutorial();
}
```

**課題**:
- この動作はEARS要件に明記されていない（妥当な推測）
- ユーザーがチュートリアルを読んでいる途中で共有リンク生成した場合、突然閉じる

**改善案**:
- チュートリアルとShareModalを両方表示可能にする
- または、チュートリアル表示中は共有リンク生成を無効化する
- ユーザーテストで最適な挙動を決定

**優先度**: 低（現在の実装でもUX上の大きな問題はない）

---

### 2. CSS Modulesの詳細化

**現在の実装**:
```tsx
<main className={styles.homePage} role="main">
  <div className={styles.container}>
    <h1 className={styles.title}>贈る言葉BOT</h1>
    <p className={styles.subtitle}>...</p>
```

**課題**:
- スタイルが適用されているか未確認
- レスポンシブデザイン未実装

**改善案**:
- `HomePage.module.css`の実装を完成させる
- モバイル/タブレット/デスクトップでのレイアウト調整
- NFR-001（ページ読み込み3秒以内）の検証

**優先度**: 中（機能的には問題ないが、UX向上のため）

---

### 3. エラーハンドリングの追加

**現在の実装**:
```tsx
const handleShareUrlGenerated = (url: string) => {
  // エラーチェックなし
  setShareUrl(url);
  setShowShareModal(true);
};
```

**課題**:
- 空文字列URLが渡された場合の処理がない（TC-HP-052で検証予定）
- InputFormのバリデーションで防いでいるが、防御的実装がない

**改善案**:
```tsx
const handleShareUrlGenerated = (url: string) => {
  if (!url || url.trim() === '') {
    console.error('Invalid URL received');
    return;
  }
  // ... 既存処理
};
```

**優先度**: 低（InputFormで既にバリデーション済み）

---

## 品質判定

### ✅ 高品質

**テスト結果**:
- ✅ Taskツールによる実行で全7テストが成功
- ✅ 実行時間: 1.43s（十分に高速）

**実装品質**:
- ✅ シンプルで理解しやすい実装
- ✅ EARS要件に忠実に対応
- ✅ 日本語コメントで意図が明確

**リファクタ箇所**:
- ✅ 3つの改善候補を特定
- ✅ 優先度を明確化

**機能的問題**:
- ✅ なし

**コンパイルエラー**:
- ✅ なし

**ファイルサイズ**:
- ✅ 74行（800行以下）

**モック使用**:
- ✅ 実装コードにモック・スタブなし

---

## 信頼性レベル分布

### 実装全体

- 🔵 **青信号（高信頼）**: 95% - EARS要件に基づく実装
- 🟡 **黄信号（中信頼）**: 5% - チュートリアル自動クローズのUX改善
- 🔴 **赤信号（低信頼）**: 0% - 推測による要件なし

### 詳細内訳

| 機能 | 信頼性レベル | 理由 |
|------|--------------|------|
| セマンティックHTML | 🔵 | NFR-201に基づく |
| Context統合 | 🔵 | REQ-004に基づく |
| State管理 | 🔵 | REQ-104に基づく |
| InputForm統合 | 🔵 | REQ-001~003に基づく |
| handleShareUrlGenerated（基本機能） | 🔵 | REQ-101, REQ-104に基づく |
| handleShareUrlGenerated（チュートリアル自動クローズ） | 🟡 | UX改善のための妥当な推測 |
| handleCloseShareModal | 🔵 | REQ-104に基づく |
| TutorialModal条件付きレンダリング | 🔵 | REQ-004に基づく |
| ShareModal条件付きレンダリング | 🔵 | REQ-104に基づく |

---

## 次のステップ

### 推奨コマンド

```bash
/tsumiki:tdd-refactor
```

### Refactorフェーズの目標

1. **チュートリアル自動クローズの改善検討**
   - ユーザーテストで最適な挙動を決定
   - または、現在の実装を維持（問題なしと判断）

2. **CSS Modulesの完成**
   - レスポンシブデザイン実装
   - アクセシビリティ向上（フォーカス表示など）

3. **エラーハンドリングの追加検討**
   - 防御的実装の追加
   - または、現在の実装を維持（InputFormで十分と判断）

4. **コードの可読性向上**
   - コメントの整理
   - 変数名の再検討

5. **パフォーマンス最適化**
   - React DevTools Profilerでレンダリング回数確認
   - 不要な再レンダリング防止（必要に応じて）

---

## 更新履歴

- 2025-01-21: 初回作成（/tsumiki:tdd-green により生成）
  - 全7個のテストが成功
  - HomePage.tsxの最小実装完了
  - TC-HP-041のテスト修正（localStorage設定追加）
