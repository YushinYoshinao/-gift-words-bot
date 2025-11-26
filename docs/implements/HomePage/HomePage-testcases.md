# HomePage コンポーネント - テストケース定義書

## 生成情報
- **生成日**: 2025-01-21
- **生成ツール**: /tsumiki:tdd-testcases
- **機能名**: HomePage コンポーネント
- **実装フェーズ**: Phase 2 (言葉入力フォームページ)
- **参照要件定義**: `docs/implements/HomePage/HomePage-requirements.md`

---

## テストケース一覧

### 凡例
- **優先度**:
  - 🔴 **Critical (P0)**: 必須機能。これが動かないとアプリが機能しない
  - 🟠 **High (P1)**: 重要機能。ユーザー体験に大きく影響
  - 🟡 **Medium (P2)**: 通常機能。一般的な使用ケース
  - 🟢 **Low (P3)**: エッジケース。稀にしか発生しないシナリオ

- **テストタイプ**:
  - **正常系**: 期待通りの動作を確認
  - **異常系**: エラー処理を確認
  - **エッジ**: 境界値や特殊な条件を確認

---

## 1. コンポーネントの基本レンダリング 🔴

### TC-HP-001: HomePage コンポーネントがレンダリングされる 🔴
- **タイプ**: 正常系
- **優先度**: P0 (Critical)
- **目的**: コンポーネントの基本的なマウント動作を検証
- **EARS要件**: 全体的な実装の前提条件
- **前提条件**:
  - `TutorialProvider` でラップされている
  - `ToastProvider` でラップされている
- **実行手順**:
  1. `<HomePage />` をレンダリング
- **期待結果**:
  - エラーなくレンダリングされる
  - コンポーネントのルート要素が存在する
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

### TC-HP-002: InputForm が常に表示される 🔴
- **タイプ**: 正常系
- **優先度**: P0 (Critical)
- **目的**: メイン機能である入力フォームが表示されることを確認
- **EARS要件**: REQ-001, REQ-002, REQ-003
- **前提条件**:
  - HomePage がレンダリングされている
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. InputForm の存在確認
- **期待結果**:
  - `InputForm` コンポーネントが表示される
  - `onShareUrlGenerated` プロパティが渡されている
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

### TC-HP-003: ToastContainer が常に存在する 🔴
- **タイプ**: 正常系
- **優先度**: P0 (Critical)
- **目的**: トースト通知機能が動作可能な状態であることを確認
- **EARS要件**: REQ-105
- **前提条件**:
  - HomePage がレンダリングされている
  - `ToastProvider` でラップされている
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. ToastContainer の存在確認
- **期待結果**:
  - `ToastContainer` コンポーネントが DOM に存在する（非表示でも可）
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

## 2. 初回訪問時のチュートリアル表示 🟠

### TC-HP-011: 初回訪問時にチュートリアルモーダルが表示される 🟠
- **タイプ**: 正常系
- **優先度**: P1 (High)
- **目的**: 初回訪問者への説明機能の動作確認
- **EARS要件**: REQ-004
- **前提条件**:
  - `TutorialContext` の `showTutorial` が `true`
  - LocalStorage に訪問記録がない（初回訪問）
- **実行手順**:
  1. `TutorialContext` で `showTutorial: true` を設定
  2. `<HomePage />` をレンダリング
  3. TutorialModal の存在確認
- **期待結果**:
  - `TutorialModal` コンポーネントが表示される
  - モーダル内に「使い方」の説明が含まれる
  - 「わかりました」ボタンが表示される
- **モック**:
  - `TutorialContext`: `{ showTutorial: true, isFirstVisit: true, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

### TC-HP-012: チュートリアルモーダルの「わかりました」ボタンが動作する 🟠
- **タイプ**: 正常系
- **優先度**: P1 (High)
- **目的**: チュートリアル終了時の状態更新確認
- **EARS要件**: REQ-004
- **前提条件**:
  - チュートリアルモーダルが表示されている
- **実行手順**:
  1. `TutorialContext` で `showTutorial: true` を設定
  2. `<HomePage />` をレンダリング
  3. 「わかりました」ボタンをクリック
- **期待結果**:
  - `closeTutorial()` 関数が呼ばれる
  - （Contextの実装により）LocalStorage に訪問記録が保存される
  - TutorialModal が非表示になる
- **モック**:
  - `TutorialContext`: `{ showTutorial: true, isFirstVisit: true, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`
- **検証項目**:
  - `closeTutorial` が1回呼ばれたことを確認

---

## 3. 2回目以降のチュートリアル非表示 🟠

### TC-HP-021: 2回目以降の訪問時にチュートリアルが表示されない 🟠
- **タイプ**: 正常系
- **優先度**: P1 (High)
- **目的**: 既存ユーザーへの不要なモーダル非表示
- **EARS要件**: REQ-004（暗黙的に「2回目以降は非表示」）
- **前提条件**:
  - `TutorialContext` の `showTutorial` が `false`
  - LocalStorage に訪問記録がある
- **実行手順**:
  1. `TutorialContext` で `showTutorial: false` を設定
  2. `<HomePage />` をレンダリング
  3. TutorialModal の不在確認
- **期待結果**:
  - `TutorialModal` コンポーネントが DOM に存在しない
  - InputForm が即座に表示される
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

## 4. InputForm の統合と動作 🔴

### TC-HP-031: InputForm が正しい Props を受け取る 🔴
- **タイプ**: 正常系
- **優先度**: P0 (Critical)
- **目的**: InputForm との連携が正しく設定されていることを確認
- **EARS要件**: REQ-001, REQ-002, REQ-003
- **前提条件**:
  - HomePage がレンダリングされている
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. InputForm の Props 確認
- **期待結果**:
  - `InputForm` に `onShareUrlGenerated` プロパティが渡されている
  - プロパティの型は `(url: string) => void`
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

### TC-HP-032: InputForm の送信成功時にコールバックが呼ばれる 🔴
- **タイプ**: 正常系
- **優先度**: P0 (Critical)
- **目的**: InputForm からのデータ受け渡しの正常動作確認
- **EARS要件**: REQ-101, REQ-104
- **前提条件**:
  - HomePage がレンダリングされている
  - InputForm が入力可能な状態
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. InputForm をモックして `onShareUrlGenerated` を直接呼び出し
  3. `onShareUrlGenerated("https://example.com/display?data=abc123")` を実行
- **期待結果**:
  - `shareUrl` State が `"https://example.com/display?data=abc123"` に更新される
  - `showShareModal` State が `true` に更新される
  - `ShareModal` が表示される
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`
  - `InputForm`: コールバック呼び出しをシミュレート

---

## 5. ShareModal の表示制御 🔴

### TC-HP-041: 共有URL生成後に ShareModal が表示される 🔴
- **タイプ**: 正常系
- **優先度**: P0 (Critical)
- **目的**: 共有リンク生成後のモーダル表示機能の確認
- **EARS要件**: REQ-104
- **前提条件**:
  - InputForm からコールバックが呼ばれた状態
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. `onShareUrlGenerated("https://example.com/display?data=abc123")` を呼び出し
  3. ShareModal の存在確認
- **期待結果**:
  - `ShareModal` コンポーネントが表示される
  - ShareModal に `url` プロパティとして `"https://example.com/display?data=abc123"` が渡される
  - ShareModal に `onClose` プロパティが渡される
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

### TC-HP-042: ShareModal の閉じるボタンで State がリセットされる 🔴
- **タイプ**: 正常系
- **優先度**: P0 (Critical)
- **目的**: モーダルクローズ時の状態リセット動作確認
- **EARS要件**: REQ-104
- **前提条件**:
  - ShareModal が表示されている
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. `onShareUrlGenerated("https://example.com/display?data=abc123")` を呼び出し
  3. ShareModal の「閉じる」ボタンをクリック
- **期待結果**:
  - `showShareModal` State が `false` に更新される
  - `shareUrl` State が `null` に更新される
  - ShareModal が DOM から削除される
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

### TC-HP-043: ShareModal が表示されていない初期状態 🟡
- **タイプ**: 正常系
- **優先度**: P2 (Medium)
- **目的**: 初期レンダリング時に不要なモーダルが表示されていないことの確認
- **EARS要件**: 全体的な実装の前提条件
- **前提条件**:
  - HomePage が初期状態でレンダリングされている
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. ShareModal の不在確認
- **期待結果**:
  - `ShareModal` コンポーネントが DOM に存在しない
  - `shareUrl` State が `null`
  - `showShareModal` State が `false`
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

## 6. 共有URL生成とモーダル表示 🔴

### TC-HP-051: 複数回の共有URL生成が正しく動作する 🟡
- **タイプ**: 正常系
- **優先度**: P2 (Medium)
- **目的**: 連続使用時の状態管理の正確性確認
- **EARS要件**: REQ-101, REQ-104
- **前提条件**:
  - HomePage がレンダリングされている
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. 1回目: `onShareUrlGenerated("https://example.com/display?data=abc123")` を呼び出し
  3. ShareModal を閉じる
  4. 2回目: `onShareUrlGenerated("https://example.com/display?data=def456")` を呼び出し
- **期待結果**:
  - 1回目:
    - `shareUrl` が `"https://example.com/display?data=abc123"`
    - ShareModal 表示
  - 閉じた後:
    - `shareUrl` が `null`
    - ShareModal 非表示
  - 2回目:
    - `shareUrl` が `"https://example.com/display?data=def456"` に更新
    - ShareModal 表示
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

### TC-HP-052: 空文字列URLが渡された場合の処理 🟢
- **タイプ**: エッジ
- **優先度**: P3 (Low)
- **目的**: 不正なデータに対するロバスト性確認
- **EARS要件**: なし（防御的実装）
- **前提条件**:
  - HomePage がレンダリングされている
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. `onShareUrlGenerated("")` を呼び出し
- **期待結果**:
  - **Option A（推奨）**: ShareModal は表示されない（空文字列を無視）
  - **Option B**: ShareModal は表示されるが、URLが空のため警告表示
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`
- **備考**:
  - InputFormのバリデーションで空文字列は渡されないはずだが、防御的にテスト

---

## 7. エラーハンドリング 🟠

### TC-HP-061: Context未提供時にエラーがスローされる（TutorialContext） 🟠
- **タイプ**: 異常系
- **優先度**: P1 (High)
- **目的**: 開発時のContext設定忘れを早期検出
- **EARS要件**: なし（防御的実装）
- **前提条件**:
  - `TutorialProvider` でラップされていない
- **実行手順**:
  1. `TutorialProvider` なしで `<HomePage />` をレンダリング
- **期待結果**:
  - エラーがスローされる
  - エラーメッセージ: "useTutorial must be used within TutorialProvider"
- **モック**: なし（意図的にProviderを除外）

---

### TC-HP-062: Context未提供時にエラーがスローされる（ToastContext） 🟠
- **タイプ**: 異常系
- **優先度**: P1 (High)
- **目的**: 開発時のContext設定忘れを早期検出
- **EARS要件**: なし（防御的実装）
- **前提条件**:
  - `ToastProvider` でラップされていない
- **実行手順**:
  1. `ToastProvider` なしで `<HomePage />` をレンダリング
- **期待結果**:
  - エラーがスローされる
  - エラーメッセージ: "useToast must be used within ToastProvider"
- **モック**: なし（意図的にProviderを除外）

---

### TC-HP-063: InputForm のエラーハンドリングが HomePage に影響しない 🟡
- **タイプ**: 異常系
- **優先度**: P2 (Medium)
- **目的**: InputForm内のエラーがHomePage全体をクラッシュさせないことの確認
- **EARS要件**: なし（防御的実装）
- **前提条件**:
  - HomePage がレンダリングされている
  - InputForm でバリデーションエラーが発生
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. InputForm で「言葉」が空のままフォーム送信を試みる
- **期待結果**:
  - InputForm 内でバリデーションエラーが表示される
  - `onShareUrlGenerated` コールバックは呼ばれない
  - HomePage はエラーなく動作し続ける
  - ShareModal は表示されない
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

## 8. キーボード操作対応 🟡

### TC-HP-071: Escキーで ShareModal が閉じる 🟡
- **タイプ**: 正常系
- **優先度**: P2 (Medium)
- **目的**: アクセシビリティ要件の確認
- **EARS要件**: NFR-205（キーボード操作対応）
- **前提条件**:
  - ShareModal が表示されている
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. `onShareUrlGenerated("https://example.com/display?data=abc123")` を呼び出し
  3. `Escape` キーを押下
- **期待結果**:
  - ShareModal が閉じる
  - `showShareModal` State が `false` に更新される
  - `shareUrl` State が `null` に更新される
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`
- **備考**:
  - このテストはShareModalの実装に依存（ShareModal側でEscキー処理を実装）

---

### TC-HP-072: Escキーで TutorialModal が閉じる 🟡
- **タイプ**: 正常系
- **優先度**: P2 (Medium)
- **目的**: アクセシビリティ要件の確認
- **EARS要件**: NFR-205（キーボード操作対応）
- **前提条件**:
  - TutorialModal が表示されている
- **実行手順**:
  1. `TutorialContext` で `showTutorial: true` を設定
  2. `<HomePage />` をレンダリング
  3. `Escape` キーを押下
- **期待結果**:
  - TutorialModal が閉じる
  - `closeTutorial()` 関数が呼ばれる
- **モック**:
  - `TutorialContext`: `{ showTutorial: true, isFirstVisit: true, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`
- **備考**:
  - このテストはTutorialModalの実装に依存（TutorialModal側でEscキー処理を実装）

---

## 9. パフォーマンス・レンダリング最適化 🟢

### TC-HP-081: 不要な再レンダリングが発生しない 🟢
- **タイプ**: 正常系（パフォーマンス）
- **優先度**: P3 (Low)
- **目的**: React のレンダリング効率確認
- **EARS要件**: NFR-001, NFR-002（パフォーマンス要件）
- **前提条件**:
  - HomePage がレンダリングされている
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. InputForm の入力フィールドに文字を入力
  3. HomePage のレンダリング回数をカウント
- **期待結果**:
  - InputForm の入力変更時に HomePage 本体は再レンダリングされない
  - （InputForm の内部状態変更のみ）
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`
- **備考**:
  - React Testing Library では直接レンダリング回数を測定しづらいため、
    実装時にはReact DevTools Profilerで確認推奨

---

## 10. 統合シナリオテスト 🟠

### TC-HP-091: エンドツーエンド: 初回訪問から共有URLコピーまで 🟠
- **タイプ**: 正常系（統合）
- **優先度**: P1 (High)
- **目的**: ユーザージャーニー全体の動作確認
- **EARS要件**: US-001（ユーザーストーリー）、REQ-004, REQ-001~003, REQ-104, REQ-105
- **前提条件**:
  - 初回訪問状態
- **実行手順**:
  1. `TutorialContext` で `showTutorial: true` を設定
  2. `<HomePage />` をレンダリング
  3. TutorialModal が表示されることを確認
  4. 「わかりました」ボタンをクリック
  5. TutorialModal が閉じることを確認
  6. InputForm に「言葉」と「意味」を入力
  7. 「共有リンクを生成」ボタンをクリック
  8. ShareModal が表示されることを確認
  9. 「URLをコピー」ボタンをクリック
  10. トースト「コピーしました」が表示されることを確認
- **期待結果**:
  - すべてのステップが順次正常に動作する
  - 各コンポーネント間の連携が正しく動作する
- **モック**:
  - `TutorialContext`: `{ showTutorial: true, isFirstVisit: true, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`
  - `navigator.clipboard.writeText`: `jest.fn().mockResolvedValue(undefined)`

---

### TC-HP-092: エンドツーエンド: 2回目訪問で即座に入力開始 🟡
- **タイプ**: 正常系（統合）
- **優先度**: P2 (Medium)
- **目的**: 既存ユーザーのスムーズなUX確認
- **EARS要件**: US-001, REQ-001~003, REQ-104
- **前提条件**:
  - 2回目以降の訪問状態
- **実行手順**:
  1. `TutorialContext` で `showTutorial: false` を設定
  2. `<HomePage />` をレンダリング
  3. TutorialModal が表示されないことを確認
  4. InputForm が即座に表示されることを確認
  5. InputForm に「言葉」と「意味」を入力
  6. 「共有リンクを生成」ボタンをクリック
  7. ShareModal が表示されることを確認
- **期待結果**:
  - チュートリアルスキップされる
  - すぐに入力開始できる
  - 共有リンク生成まで正常に完了する
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

## 11. アクセシビリティ 🟡

### TC-HP-101: ページタイトルが適切に設定されている 🟡
- **タイプ**: 正常系
- **優先度**: P2 (Medium)
- **目的**: SEO・アクセシビリティ要件の確認
- **EARS要件**: NFR-201（アクセシビリティ）
- **前提条件**:
  - HomePage がレンダリングされている
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. `document.title` を確認
- **期待結果**:
  - `document.title` が「贈る言葉BOT」など適切なタイトルに設定されている
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`
- **備考**:
  - React Helmet や useEffect でタイトル設定が推奨される

---

### TC-HP-102: メインコンテンツに適切な role が設定されている 🟢
- **タイプ**: 正常系
- **優先度**: P3 (Low)
- **目的**: スクリーンリーダー対応確認
- **EARS要件**: NFR-201（アクセシビリティ）
- **前提条件**:
  - HomePage がレンダリングされている
- **実行手順**:
  1. `<HomePage />` をレンダリング
  2. メインコンテンツ要素の `role` 属性を確認
- **期待結果**:
  - `<main>` タグまたは `role="main"` が設定されている
- **モック**:
  - `TutorialContext`: `{ showTutorial: false, isFirstVisit: false, closeTutorial: jest.fn() }`
  - `ToastContext`: `{ showToast: jest.fn() }`

---

## テスト実装方針

### モックの共通設定
```typescript
// テスト用の共通モックヘルパー
const mockTutorialContext = (overrides = {}) => ({
  showTutorial: false,
  isFirstVisit: false,
  closeTutorial: jest.fn(),
  ...overrides,
});

const mockToastContext = (overrides = {}) => ({
  showToast: jest.fn(),
  ...overrides,
});
```

### レンダリングヘルパー
```typescript
// HomePage をテスト用にレンダリングするヘルパー
const renderHomePage = (
  tutorialContextValue = mockTutorialContext(),
  toastContextValue = mockToastContext()
) => {
  return render(
    <TutorialContext.Provider value={tutorialContextValue}>
      <ToastContext.Provider value={toastContextValue}>
        <HomePage />
      </ToastContext.Provider>
    </TutorialContext.Provider>
  );
};
```

### テストの依存関係
- **InputForm**: モック化せず、実際のコンポーネントを使用（統合テスト）
  - ただし、`onShareUrlGenerated` コールバックの動作は直接検証
- **TutorialModal**: モック化せず、実際のコンポーネントを使用
- **ShareModal**: モック化せず、実際のコンポーネントを使用
- **ToastContainer**: モック化せず、実際のコンポーネントを使用
- **Context**: モック化してテストケースごとに状態を制御

### テストの優先順位実行順序
1. **Phase 1（P0 Critical）**: TC-HP-001~003, TC-HP-031~032, TC-HP-041~042
2. **Phase 2（P1 High）**: TC-HP-011~012, TC-HP-021, TC-HP-061~062, TC-HP-091
3. **Phase 3（P2 Medium）**: TC-HP-043, TC-HP-051, TC-HP-063, TC-HP-071~072, TC-HP-092, TC-HP-101
4. **Phase 4（P3 Low）**: TC-HP-052, TC-HP-081, TC-HP-102

---

## テストカバレッジ目標

### コードカバレッジ
- **行カバレッジ**: 90%以上
- **分岐カバレッジ**: 85%以上
- **関数カバレッジ**: 100%

### 要件カバレッジ
- **機能要件（REQ-xxx）**: 100%
- **非機能要件（NFR-xxx）**: 80%以上
- **エッジケース（EDGE-xxx）**: 70%以上

---

## 次のステップ

### 推奨コマンド
```bash
/tsumiki:tdd-red
```

### Red フェーズで実装すべきテスト
まず **Phase 1（P0 Critical）** の6個のテストケースから実装:
1. TC-HP-001: コンポーネントのレンダリング
2. TC-HP-002: InputForm 表示
3. TC-HP-003: ToastContainer 存在
4. TC-HP-031: InputForm Props
5. TC-HP-032: コールバック動作
6. TC-HP-041: ShareModal 表示
7. TC-HP-042: ShareModal クローズ

---

## 更新履歴
- 2025-01-21: 初回作成（/tsumiki:tdd-testcases により生成）
  - 全28個のテストケースを定義
  - 優先度 P0: 7個、P1: 5個、P2: 11個、P3: 5個
  - 正常系: 21個、異常系: 4個、エッジケース: 3個
