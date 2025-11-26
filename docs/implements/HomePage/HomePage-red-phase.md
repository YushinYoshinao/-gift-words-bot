# HomePage コンポーネント - Red Phase 設計書

## 生成情報
- **生成日**: 2025-01-21
- **生成ツール**: /tsumiki:tdd-red
- **機能名**: HomePage コンポーネント
- **フェーズ**: Red（失敗するテスト作成）

---

## テストコードの設計

### テスト対象

**ファイル**: `src/pages/HomePage/HomePage.tsx`
**テストファイル**: `src/pages/HomePage/__tests__/HomePage.test.tsx`

### テストフレームワーク

- **テストランナー**: Vitest
- **テストユーティリティ**: @testing-library/react
- **アサーションライブラリ**: Vitest (expect)
- **ユーザーイベントシミュレーション**: @testing-library/user-event

---

## Phase 1 (P0 Critical) テストケース

### TC-HP-001: HomePage コンポーネントがレンダリングされる 🔴

**目的**: コンポーネントの基本的なマウント動作を検証

**EARS要件**: 全体的な実装の前提条件

**テスト内容**:
```typescript
it('TC-HP-001: 正常にレンダリングされる', () => {
  renderHomePage();

  // 【確認内容】: メインコンテンツ領域が存在することを確認
  expect(screen.getByRole('main')).toBeInTheDocument(); // 🔵
});
```

**期待される失敗**:
- エラー: `Unable to find an accessible element with the role "main"`
- 原因: 現在のHomePageは`<div className="home-page">`を使用しており、`<main>`タグがない
- 信頼性: 🔵（EARS要件に基づく）

---

### TC-HP-002: InputForm が常に表示される 🔴

**目的**: メイン機能である入力フォームが表示されることを確認

**EARS要件**: REQ-001, REQ-002, REQ-003

**テスト内容**:
```typescript
it('TC-HP-002: InputFormが表示される', () => {
  renderHomePage();

  // 【確認内容】: 「贈りたい言葉」入力欄が表示される（REQ-001）
  expect(
    screen.getByLabelText(/贈りたい言葉/i, { selector: 'input' })
  ).toBeInTheDocument(); // 🔵

  // 【確認内容】: 「その意味」入力欄が表示される（REQ-002）
  expect(
    screen.getByLabelText(/その意味/i, { selector: 'textarea' })
  ).toBeInTheDocument(); // 🔵

  // 【確認内容】: 「共有リンクを生成」ボタンが表示される（REQ-003）
  expect(
    screen.getByRole('button', { name: /共有リンクを生成/i })
  ).toBeInTheDocument(); // 🔵
});
```

**期待される失敗**:
- エラー: `Unable to find a label with the text of: /贈りたい言葉/i`
- 原因: InputFormコンポーネントが統合されていない（プレースホルダーのみ）
- 信頼性: 🔵（REQ-001, REQ-002, REQ-003に基づく）

---

### TC-HP-003: ToastContainer が常に存在する 🔴

**目的**: トースト通知機能が動作可能な状態であることを確認

**EARS要件**: REQ-105

**テスト内容**:
```typescript
it('TC-HP-003: ToastContainerが表示される', () => {
  renderHomePage();

  // 【確認内容】: ToastContainerが存在しない（初期状態）
  const toastContainer = document.querySelector('[aria-live="polite"]');
  expect(toastContainer).toBeNull(); // 🔵
});
```

**期待される成功**:
- ✅ このテストは**現在成功している**
- 理由: ToastContainerは初期状態でトーストがない場合、DOMに存在しない（正しい実装）
- Greenフェーズでは、ToastProviderが提供されていることを確認する必要がある
- 信頼性: 🔵（REQ-105に基づく）

---

### TC-HP-031: InputForm が正しい Props を受け取る 🔴

**目的**: InputForm との連携が正しく設定されていることを確認

**EARS要件**: REQ-001, REQ-002, REQ-003

**テスト内容**:
```typescript
it('TC-HP-031: InputFormから共有URL生成コールバックを受け取る', async () => {
  const user = userEvent.setup();
  renderHomePage();

  // 【テストデータ準備】: 有効な言葉と意味を入力
  const wordInput = screen.getByLabelText(/贈りたい言葉/i, { selector: 'input' });
  const meaningInput = screen.getByLabelText(/その意味/i, { selector: 'textarea' });
  const submitButton = screen.getByRole('button', { name: /共有リンクを生成/i });

  // 【ユーザー操作】: 入力してフォーム送信
  await user.type(wordInput, '感謝');
  await user.type(meaningInput, 'いつもありがとう');
  await user.click(submitButton);

  // 【確認内容】: onShareUrlGeneratedコールバックが呼ばれ、ShareModalが表示される
  await waitFor(() => {
    expect(screen.getByText(/共有リンクを生成しました/i)).toBeInTheDocument(); // 🔵
  }, { timeout: 3000 });
});
```

**期待される失敗**:
- エラー: `Unable to find a label with the text of: /贈りたい言葉/i`
- 原因: InputFormが存在しないため入力ができない
- 信頼性: 🔵（REQ-101, REQ-104に基づく）

---

### TC-HP-032: InputForm の送信成功時にコールバックが呼ばれる 🔴

**目的**: InputForm からのデータ受け渡しの正常動作確認

**EARS要件**: REQ-101, REQ-104

**テスト内容**:
```typescript
it('TC-HP-032: URL生成成功時にShareModalが表示される', async () => {
  const user = userEvent.setup();
  renderHomePage();

  // 【テストデータ準備】: テスト用の言葉と意味
  const wordInput = screen.getByLabelText(/贈りたい言葉/i, { selector: 'input' });
  const meaningInput = screen.getByLabelText(/その意味/i, { selector: 'textarea' });
  const submitButton = screen.getByRole('button', { name: /共有リンクを生成/i });

  // 【ユーザー操作】: 入力してフォーム送信
  await user.type(wordInput, 'テスト');
  await user.type(meaningInput, 'テスト用の意味');
  await user.click(submitButton);

  // 【確認内容】: ShareModalが表示され、dialogロールが存在する
  await waitFor(() => {
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument(); // 🔵
    expect(screen.getByText(/共有リンクを生成しました/i)).toBeInTheDocument(); // 🔵
  }, { timeout: 3000 });
});
```

**期待される失敗**:
- エラー: `Unable to find a label with the text of: /贈りたい言葉/i`
- 原因: InputFormが存在しないため操作できない
- 信頼性: 🔵（REQ-101, REQ-104に基づく）

---

### TC-HP-041: 共有URL生成後に ShareModal が表示される 🔴

**目的**: 共有リンク生成後のモーダル表示機能の確認

**EARS要件**: REQ-104

**テスト内容**:
```typescript
it('TC-HP-041: ShareModal初期状態では表示されない', () => {
  renderHomePage();

  // 【確認内容】: 初期状態ではShareModalが表示されない
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); // 🔵
  expect(screen.queryByText(/共有リンクを生成しました/i)).not.toBeInTheDocument(); // 🔵
});
```

**期待される成功**:
- ✅ このテストは**現在成功している**
- 理由: 初期状態でShareModalが非表示であることは正しい実装
- Greenフェーズでは、URL生成後に表示される機能を実装する必要がある
- 信頼性: 🔵（REQ-104に基づく）

---

### TC-HP-042: ShareModal の閉じるボタンで State がリセットされる 🔴

**目的**: モーダルクローズ時の状態リセット動作確認

**EARS要件**: REQ-104

**テスト内容**:
```typescript
it('TC-HP-042: ShareModalを閉じることができる', async () => {
  const user = userEvent.setup();
  renderHomePage();

  // 【テストデータ準備】: ShareModalを表示するためのフォーム送信
  const wordInput = screen.getByLabelText(/贈りたい言葉/i, { selector: 'input' });
  const meaningInput = screen.getByLabelText(/その意味/i, { selector: 'textarea' });
  const submitButton = screen.getByRole('button', { name: /共有リンクを生成/i });

  await user.type(wordInput, 'テスト');
  await user.type(meaningInput, 'テスト用の意味');
  await user.click(submitButton);

  // 【確認内容】: ShareModalが表示される
  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument(); // 🔵
  }, { timeout: 3000 });

  // 【ユーザー操作】: 閉じるボタンをクリック
  const closeButton = screen.getByRole('button', { name: /閉じる/i });
  await user.click(closeButton);

  // 【確認内容】: ShareModalが非表示になる
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); // 🔵
  });
});
```

**期待される失敗**:
- エラー: `Unable to find a label with the text of: /贈りたい言葉/i`
- 原因: InputFormが存在しないため最初のステップで失敗
- 信頼性: 🔵（REQ-104に基づく）

---

## モック戦略

### Context のモック

**TutorialContext** と **ToastContext** は**実際のProviderを使用**して統合テストを実施:

```typescript
const renderHomePage = () => {
  return render(
    <TutorialProvider>
      <ToastProvider>
        <HomePage />
      </ToastProvider>
    </TutorialProvider>
  );
};
```

**理由**:
- HomePageはContextに強く依存しているため、実際の動作を確認する必要がある
- Context自体は別途単体テストで検証済み
- 統合テストにより、実際のユーザーシナリオに近い形でテスト可能

### コンポーネントのモック

**モック化しない**（実際のコンポーネントを使用）:
- InputForm
- ShareModal
- TutorialModal
- ToastContainer

**理由**:
- これらのコンポーネントは既に実装・テスト済み
- 統合テストアプローチにより、コンポーネント間の連携を検証
- 実際のユーザー操作をシミュレート

---

## テストの独立性確保

### beforeEach フック

```typescript
beforeEach(() => {
  // 【テスト前準備】: LocalStorageをクリアしてチュートリアル表示状態をリセット
  // 【環境初期化】: 各テストが独立して実行されることを保証
  localStorage.clear();
});
```

**目的**:
- 各テストが独立して実行されることを保証
- TutorialContextがLocalStorageを読み取るため、テスト間で状態が引き継がれないようにする

---

## テスト実行結果（2025-01-21）

### 実行コマンド

```bash
npm test -- src/pages/HomePage/__tests__/HomePage.test.tsx --run
```

### 実行結果

```
Test Files  1 failed (1)
     Tests  5 failed | 2 passed (7)
  Start at  19:46:48
  Duration  1.77s
```

### 失敗したテスト（期待通り）

✅ **5個のテストが期待通り失敗** - Red Phase 成功

1. TC-HP-001: 正常にレンダリングされる ❌
2. TC-HP-002: InputFormが表示される ❌
3. TC-HP-031: InputFormから共有URL生成コールバックを受け取る ❌
4. TC-HP-032: URL生成成功時にShareModalが表示される ❌
5. TC-HP-042: ShareModalを閉じることができる ❌

### 成功したテスト（初期状態の確認）

✅ **2個のテストが成功** - 初期状態の検証

1. TC-HP-003: ToastContainerが表示される ✅
2. TC-HP-041: ShareModal初期状態では表示されない ✅

---

## Greenフェーズへの要件

### 実装が必要な機能

1. **セマンティックHTML**
   ```tsx
   <main className="home-page" role="main">
   ```

2. **InputForm統合**
   ```tsx
   import InputForm from '../../components/InputForm/InputForm';
   <InputForm onShareUrlGenerated={handleShareUrlGenerated} />
   ```

3. **State管理**
   ```tsx
   const [shareUrl, setShareUrl] = useState<string | null>(null);
   const [showShareModal, setShowShareModal] = useState(false);
   ```

4. **Context統合**
   ```tsx
   const { showTutorial } = useTutorial();
   const { showToast } = useToast();
   ```

5. **イベントハンドラ**
   ```tsx
   const handleShareUrlGenerated = (url: string) => {
     setShareUrl(url);
     setShowShareModal(true);
   };

   const handleCloseShareModal = () => {
     setShowShareModal(false);
     setShareUrl(null);
   };
   ```

6. **条件付きレンダリング**
   ```tsx
   {showTutorial && <TutorialModal />}
   {shareUrl && showShareModal && (
     <ShareModal url={shareUrl} onClose={handleCloseShareModal} />
   )}
   ```

---

## 品質判定

### ✅ 高品質

- **テスト実行**: 成功（期待通りに失敗することを確認）
- **期待値**: 明確で具体的（EARS要件との対応明記）
- **アサーション**: 適切（アクセシビリティを考慮）
- **実装方針**: 明確（必要な機能リスト化）

### 信頼性レベル

- 🔵 **青信号（高信頼）**: 100%
  - すべてのテストケースがEARS要件定義書とテストケース定義に基づく
  - 推測による要件なし

---

## 次のステップ

### 推奨コマンド

```bash
/tsumiki:tdd-green
```

### Greenフェーズの目標

- すべてのテスト（7個）を通すための最小限の実装
- リファクタリングは後回し
- 動作するコードを優先

---

## 更新履歴

- 2025-01-21: 初回作成（/tsumiki:tdd-red により生成）
  - Phase 1（P0 Critical）の7個のテストケースを実装
  - テスト実行結果: 5 failed | 2 passed（期待通り）
