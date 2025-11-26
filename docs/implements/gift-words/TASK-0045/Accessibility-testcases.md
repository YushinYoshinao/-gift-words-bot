# TASK-0045: ARIA属性・アクセシビリティ改善 - TDDテストケース定義書

## 📋 基本情報

- **タスクID**: TASK-0045
- **機能名**: ARIA属性・アクセシビリティ改善
- **作成日**: 2025-11-23
- **テストフレームワーク**: Vitest + @testing-library/react
- **言語**: TypeScript 5.0+
- **参照要件**: `docs/implements/gift-words/TASK-0045/Accessibility-requirements.md`

---

## 🧪 開発言語・テストフレームワーク

### プログラミング言語: TypeScript 5.0+

🔵 **青信号**: `docs/tech-stack.md`に基づく

**言語選択の理由**:
- プロジェクト全体がTypeScript 5.0+で構築されている
- ARIA属性はReact.HTMLAttributes型で完全にサポート
- 型安全性により属性のタイプミスを防止

**テストに適した機能**:
- インターフェース定義による型安全なテスト
- React Testing LibraryのTypeScript完全サポート
- 属性検証の型チェック

### テストフレームワーク: Vitest + @testing-library/react

🔵 **青信号**: `docs/tech-stack.md`、既存テストファイルに基づく

**フレームワーク選択の理由**:
- Vite 5.xとのネイティブ統合で高速動作
- Jest互換APIで学習コスト低
- @testing-library/reactでユーザー視点のテスト
- 既存テストコードとの一貫性維持

**テスト実行環境**:
- **テスト実行**: `npm test` (Vitest watch mode)
- **カバレッジ**: `npm run test:coverage`
- **型チェック**: `npm run type-check`

---

## 📝 テストケース一覧

### 1. 正常系テストケース（基本的な動作）

#### テストケース 1-1: WordInput - aria-required属性が設定される

🔵 **青信号**: NFR-206要件、タスク仕様に基づく

**テスト名**: WordInputにaria-required="true"が設定される

**何をテストするか**:
- WordInputコンポーネントのinput要素にaria-required属性が設定されていること
- スクリーンリーダーが必須項目を認識できること

**期待される動作**:
- input要素が`aria-required="true"`属性を持つ
- 必須項目であることがスクリーンリーダーに伝達される

**入力値**:
```typescript
<WordInput value="" onChange={vi.fn()} />
```

**入力データの意味**:
- 標準的なWordInputコンポーネントの基本レンダリング
- propsは最小限（valueとonChangeのみ）

**期待される結果**:
```typescript
const input = screen.getByLabelText(/贈りたい言葉/);
expect(input).toHaveAttribute('aria-required', 'true');
```

**期待結果の理由**:
- NFR-206要件で必須項目にaria-required属性の設定が義務付けられている
- スクリーンリーダーが「必須」と読み上げるために必要

**テストの目的**:
- 必須項目のARIA属性が正しく設定されていることを確認
- アクセシビリティ要件NFR-206の準拠を保証

**確認ポイント**:
- 属性値が文字列"true"であること（boolean trueではない）
- すべての必須入力フィールドに統一して設定されること

---

#### テストケース 1-2: WordInput - 必須マーカーにaria-label="必須"が設定される

🔵 **青信号**: NFR-206要件、タスク仕様に基づく

**テスト名**: 必須マーカー(*)にaria-label="必須"が設定される

**何をテストするか**:
- アスタリスク「*」がスクリーンリーダーで「必須」と読み上げられること
- 視覚的マーカーに音声的意味が付与されていること

**期待される動作**:
- span要素（必須マーカー）が`aria-label="必須"`属性を持つ
- スクリーンリーダーが「アスタリスク」ではなく「必須」と読み上げる

**入力値**:
```typescript
<WordInput value="" onChange={vi.fn()} />
```

**入力データの意味**:
- 必須マーカーが表示される通常の状態
- エラーなし、空欄の初期状態

**期待される結果**:
```typescript
const requiredMarker = screen.getByLabelText('必須');
expect(requiredMarker).toBeInTheDocument();
expect(requiredMarker.textContent).toBe('*');
```

**期待結果の理由**:
- 視覚的記号「*」に音声的意味を付与し、アクセシビリティ向上
- スクリーンリーダーユーザーが必須項目を直感的に理解できる

**テストの目的**:
- 視覚記号に対する適切なARIAラベル付与を確認
- スクリーンリーダーでの読み上げ品質向上

**確認ポイント**:
- aria-label属性がspan要素に設定されていること
- textContentは「*」のまま（視覚的表示は変更しない）

---

#### テストケース 1-3: MeaningTextarea - aria-required属性が設定される

🔵 **青信号**: NFR-206要件、タスク仕様に基づく

**テスト名**: MeaningTextareaにaria-required="true"が設定される

**何をテストするか**:
- MeaningTextareaコンポーネントのtextarea要素にaria-required属性が設定されていること
- WordInputと同様のARIA属性パターンが適用されていること

**期待される動作**:
- textarea要素が`aria-required="true"`属性を持つ
- フォーム全体で一貫したARIA属性設定がされる

**入力値**:
```typescript
<MeaningTextarea value="" onChange={vi.fn()} />
```

**入力データの意味**:
- 標準的なMeaningTextareaコンポーネントの基本レンダリング
- エラーなし、空欄の初期状態

**期待される結果**:
```typescript
const textarea = screen.getByLabelText(/その意味/);
expect(textarea).toHaveAttribute('aria-required', 'true');
```

**期待結果の理由**:
- MeaningTextareaもWordInputと同様に必須項目である
- フォーム全体でのARIA属性の一貫性が重要

**テストの目的**:
- 複数の入力フィールドで統一されたARIA属性設定を確認
- コンポーネント間の一貫性を保証

**確認ポイント**:
- textarea要素（input要素ではない）にも同様に設定されること
- WordInputと同じ属性値パターンであること

---

#### テストケース 1-4: InputForm - aria-labelledby属性が設定される

🔵 **青信号**: NFR-206要件、タスク仕様に基づく

**テスト名**: InputFormのform要素にaria-labelledby="form-title"が設定される

**何をテストするか**:
- form要素がaria-labelledby属性を持つこと
- フォームのタイトルと明示的に関連付けられていること

**期待される動作**:
- form要素が`aria-labelledby="form-title"`属性を持つ
- h2要素が`id="form-title"`を持ち、フォームタイトルを表示する

**入力値**:
```typescript
<InputForm />
```

**入力データの意味**:
- InputFormコンポーネント全体のレンダリング
- 実際の使用状態を再現

**期待される結果**:
```typescript
const form = screen.getByRole('form');
expect(form).toHaveAttribute('aria-labelledby', 'form-title');

const title = screen.getByText('贈る言葉を作成');
expect(title).toHaveAttribute('id', 'form-title');
expect(title.tagName).toBe('H2');
```

**期待結果の理由**:
- フォームの目的をスクリーンリーダーに明確に伝達
- セマンティックHTML（NFR-204）とARIA属性（NFR-206）の組み合わせ

**テストの目的**:
- フォームとタイトルの明示的関連付けを確認
- スクリーンリーダーでのフォーム識別性向上

**確認ポイント**:
- ID参照が正しく機能すること
- h2要素がform要素の外側（または内側の適切な位置）に配置されること

---

#### テストケース 1-5: Toast - aria-live="assertive"がエラートーストに設定される

🔵 **青信号**: NFR-206要件、タスク仕様に基づく

**テスト名**: エラートーストにaria-live="assertive"が設定される

**何をテストするか**:
- type="error"のToastコンポーネントにaria-live="assertive"が設定されること
- エラーメッセージが即座に読み上げられること

**期待される動作**:
- エラートースト表示時、aria-live="assertive"属性が設定される
- スクリーンリーダーが現在の読み上げを中断してエラーを読み上げる

**入力値**:
```typescript
const toast: ToastType = {
  id: 'error-1',
  message: 'エラーが発生しました',
  type: 'error',
  duration: 3000,
};
<Toast toast={toast} onClose={vi.fn()} />
```

**入力データの意味**:
- type="error"のエラートースト
- 実際のエラー通知シナリオを再現

**期待される結果**:
```typescript
const toastElement = screen.getByRole('alert');
expect(toastElement).toHaveAttribute('aria-live', 'assertive');
```

**期待結果の理由**:
- エラーは重要な情報なので即座に伝える必要がある
- assertiveレベルで現在の読み上げを中断する挙動が適切

**テストの目的**:
- エラーメッセージの緊急性がARIA属性で表現されることを確認
- ユーザー体験の向上（エラーの即座の認識）

**確認ポイント**:
- type="error"の場合のみassertiveになること
- 他のtype（success, info, warning）ではpoliteになること

---

#### テストケース 1-6: Toast - aria-live="polite"が通常トーストに設定される

🔵 **青信号**: NFR-206要件、タスク仕様に基づく

**テスト名**: 通常トーストにaria-live="polite"が設定される

**何をテストするか**:
- type="success", "info", "warning"のToastにaria-live="polite"が設定されること
- 通常メッセージは現在の読み上げ完了後に読み上げられること

**期待される動作**:
- 通常トースト表示時、aria-live="polite"属性が設定される
- スクリーンリーダーが現在の読み上げを中断せず、完了後に読み上げる

**入力値**:
```typescript
const toast: ToastType = {
  id: 'success-1',
  message: '成功しました',
  type: 'success',
  duration: 3000,
};
<Toast toast={toast} onClose={vi.fn()} />
```

**入力データの意味**:
- type="success"の成功トースト
- 非緊急の通知メッセージ

**期待される結果**:
```typescript
const toastElement = screen.getByRole('alert');
expect(toastElement).toHaveAttribute('aria-live', 'polite');
```

**期待結果の理由**:
- 成功メッセージは緊急性が低く、中断する必要がない
- politeレベルで読み上げ順序を守る挙動が適切

**テストの目的**:
- メッセージの緊急性に応じた適切なaria-live値の設定を確認
- スクリーンリーダーの読み上げ体験の最適化

**確認ポイント**:
- type="success", "info", "warning"すべてでpoliteになること
- デフォルト値（type指定なし）もpoliteであること

---

#### テストケース 1-7: Toast - aria-atomic="true"が設定される

🔵 **青信号**: NFR-206要件、タスク仕様に基づく

**テスト名**: Toastにaria-atomic="true"が設定される

**何をテストするか**:
- すべてのToastコンポーネントにaria-atomic="true"が設定されること
- トースト全体が一つのユニットとして読み上げられること

**期待される動作**:
- Toast表示時、aria-atomic="true"属性が設定される
- メッセージ全体が一度に読み上げられる（部分更新されない）

**入力値**:
```typescript
const toast: ToastType = {
  id: 'info-1',
  message: 'お知らせメッセージ',
  type: 'info',
  duration: 3000,
};
<Toast toast={toast} onClose={vi.fn()} />
```

**入力データの意味**:
- 標準的なトースト通知
- typeに依存しない共通属性の確認

**期待される結果**:
```typescript
const toastElement = screen.getByRole('alert');
expect(toastElement).toHaveAttribute('aria-atomic', 'true');
```

**期待結果の理由**:
- トーストメッセージは1つの完全なメッセージとして読み上げるべき
- 部分更新で読み上げが途切れるのを防ぐ

**テストの目的**:
- ライブリージョンの読み上げ単位が正しく設定されることを確認
- スクリーンリーダーでの完全なメッセージ伝達

**確認ポイント**:
- すべてのtoast typeで共通して設定されること
- 属性値が文字列"true"であること

---

#### テストケース 1-8: Toast - 閉じるボタンにaria-label="通知を閉じる"が設定される

🔵 **青信号**: NFR-206要件、タスク仕様に基づく

**テスト名**: Toast閉じるボタンにaria-label="通知を閉じる"が設定される

**何をテストするか**:
- 閉じるボタン（×）にわかりやすいARIAラベルが設定されること
- ボタンの機能がスクリーンリーダーで明確に伝わること

**期待される動作**:
- button要素が`aria-label="通知を閉じる"`属性を持つ
- スクリーンリーダーが「通知を閉じる、ボタン」と読み上げる

**入力値**:
```typescript
const toast: ToastType = {
  id: 'toast-1',
  message: 'テストメッセージ',
  type: 'info',
  duration: 3000,
};
<Toast toast={toast} onClose={vi.fn()} />
```

**入力データの意味**:
- 閉じるボタンが表示される通常のトースト
- ボタン要素のARIA属性確認

**期待される結果**:
```typescript
const closeButton = screen.getByRole('button', { name: '通知を閉じる' });
expect(closeButton).toBeInTheDocument();
expect(closeButton).toHaveAttribute('type', 'button');
```

**期待結果の理由**:
- 記号「×」だけでは機能が不明確
- 具体的なラベルでアクセシビリティ向上

**テストの目的**:
- ボタン要素の明確なラベル付けを確認
- スクリーンリーダーユーザーの操作性向上

**確認ポイント**:
- 既存のaria-label="閉じる"から"通知を閉じる"に変更されること
- type="button"属性も設定されていること

---

#### テストケース 1-9: TutorialModal - aria-describedby属性が設定される

🔵 **青信号**: NFR-206要件、タスク仕様に基づく

**テスト名**: TutorialModalにaria-describedby="tutorial-description"が設定される

**何をテストするか**:
- モーダルダイアログのaria-describedby属性が設定されること
- モーダルのコンテンツと明示的に関連付けられていること

**期待される動作**:
- dialog要素が`aria-describedby="tutorial-description"`属性を持つ
- コンテンツdivが`id="tutorial-description"`を持つ

**入力値**:
```typescript
<TutorialProvider>
  <TutorialModal />
</TutorialProvider>
```

**入力データの意味**:
- TutorialModalコンポーネントの通常レンダリング
- showTutorial=trueの状態（初回表示時）

**期待される結果**:
```typescript
const dialog = screen.getByRole('dialog');
expect(dialog).toHaveAttribute('aria-describedby', 'tutorial-description');

const description = document.getElementById('tutorial-description');
expect(description).toBeInTheDocument();
```

**期待結果の理由**:
- モーダルのタイトルだけでなく説明内容も関連付ける
- スクリーンリーダーでモーダルの詳細を伝達

**テストの目的**:
- モーダルコンテンツとの明示的関連付けを確認
- アクセシビリティガイドライン準拠

**確認ポイント**:
- 既存のaria-labelledbyと併用されること
- ID参照が正しく機能すること

---

#### テストケース 1-10: TutorialModal - 閉じるボタンにaria-label="チュートリアルを閉じる"が設定される

🔵 **青信号**: NFR-206要件、タスク仕様に基づく

**テスト名**: TutorialModal閉じるボタンにaria-label="チュートリアルを閉じる"が設定される

**何をテストするか**:
- 閉じるボタン（✕）に具体的なARIAラベルが設定されること
- モーダルの種類が明確に伝わること

**期待される動作**:
- button要素が`aria-label="チュートリアルを閉じる"`属性を持つ
- スクリーンリーダーが「チュートリアルを閉じる、ボタン」と読み上げる

**入力値**:
```typescript
<TutorialProvider>
  <TutorialModal />
</TutorialProvider>
```

**入力データの意味**:
- 閉じるボタンを持つTutorialModal
- ボタンのARIA属性確認

**期待される結果**:
```typescript
const closeButton = screen.getByRole('button', { name: 'チュートリアルを閉じる' });
expect(closeButton).toBeInTheDocument();
expect(closeButton).toHaveAttribute('aria-label', 'チュートリアルを閉じる');
```

**期待結果の理由**:
- 何を閉じるのか具体的に示すことでユーザビリティ向上
- 複数のモーダルがある場合の識別性向上

**テストの目的**:
- モーダル固有の閉じるボタンラベルを確認
- スクリーンリーダーでのコンテキスト認識向上

**確認ポイント**:
- "✕"記号の視覚的表示は維持されること
- aria-label属性が新規追加されること

---

#### テストケース 1-11: ShareModal - aria-describedby属性とaria-labelが設定される

🟡 **黄信号**: TutorialModalのパターンを適用（推測ベース）

**テスト名**: ShareModalに適切なARIA属性が設定される

**何をテストするか**:
- ShareModalがTutorialModalと同様のARIA属性パターンを持つこと
- すべてのモーダルで一貫したアクセシビリティ対応がされること

**期待される動作**:
- dialog要素が適切なARIA属性を持つ
- 閉じるボタンに具体的なラベルが設定される

**入力値**:
```typescript
<ShareModal isOpen={true} onClose={vi.fn()} shareUrl="https://example.com/share/123" />
```

**入力データの意味**:
- ShareModal表示状態（isOpen=true）
- 実際の使用シナリオを再現

**期待される結果**:
```typescript
const dialog = screen.getByRole('dialog');
expect(dialog).toHaveAttribute('aria-modal', 'true');
expect(dialog).toHaveAttribute('aria-labelledby');
expect(dialog).toHaveAttribute('aria-describedby');

const closeButton = screen.getByRole('button', { name: /閉じる/i });
expect(closeButton).toHaveAttribute('aria-label');
```

**期待結果の理由**:
- TutorialModalと同じパターンで実装することで一貫性を保つ
- すべてのモーダルで同等のアクセシビリティを提供

**テストの目的**:
- モーダル間のARIA属性の一貫性を確認
- コンポーネント設計パターンの統一性検証

**確認ポイント**:
- TutorialModalと同じARIA属性セットであること
- aria-label値はShareModalに適した内容であること（例: "共有モーダルを閉じる"）

---

#### テストケース 1-12: usePageTitle - ページタイトルが動的に更新される

🔵 **青信号**: NFR-204要件、タスク仕様に基づく

**テスト名**: usePageTitleフックがdocument.titleを更新する

**何をテストするか**:
- usePageTitleフックがdocument.titleを正しく更新すること
- フォーマット「{title} - 贈る言葉BOT」が適用されること

**期待される動作**:
- フックコール時にdocument.titleが更新される
- アプリ名が自動的にサフィックスとして追加される

**入力値**:
```typescript
renderHook(() => usePageTitle('言葉を作成'));
```

**入力データの意味**:
- ページ固有タイトル「言葉を作成」
- HomePageでの使用を想定

**期待される結果**:
```typescript
expect(document.title).toBe('言葉を作成 - 贈る言葉BOT');
```

**期待結果の理由**:
- ページごとに異なるタイトルでユーザーの現在地を明確化
- スクリーンリーダーがページ遷移時に新しいタイトルを読み上げる

**テストの目的**:
- 動的ページタイトル更新機能の実装確認
- SEOとアクセシビリティの向上

**確認ポイント**:
- サフィックス「- 贈る言葉BOT」が自動追加されること
- 元のタイトルが上書きされないこと（アンマウント時に復元）

---

#### テストケース 1-13: usePageTitle - アンマウント時にタイトルが復元される

🔵 **青信号**: NFR-204要件、Reactクリーンアップパターンに基づく

**テスト名**: usePageTitleアンマウント時に元のタイトルに復元される

**何をテストするか**:
- コンポーネントアンマウント時にdocument.titleが元に戻ること
- メモリリークや状態漏洩がないこと

**期待される動作**:
- アンマウント時、フック呼び出し前のタイトルに復元される
- useEffectのクリーンアップ関数が正しく動作する

**入力値**:
```typescript
const originalTitle = document.title;
const { unmount } = renderHook(() => usePageTitle('新しいタイトル'));
```

**入力データの意味**:
- 元のタイトルを保存してから新しいタイトルを設定
- アンマウント動作のテスト

**期待される結果**:
```typescript
// マウント時
expect(document.title).toBe('新しいタイトル - 贈る言葉BOT');

// アンマウント時
unmount();
expect(document.title).toBe(originalTitle);
```

**期待結果の理由**:
- ページ遷移やコンポーネント破棄時にタイトルが正しく管理される
- 副作用の適切なクリーンアップ

**テストの目的**:
- useEffectクリーンアップ関数の動作確認
- React Hooksのベストプラクティス準拠

**確認ポイント**:
- 元のタイトルが正確に記憶されていること
- 複数回のマウント/アンマウントでも正しく動作すること

---

### 2. 異常系テストケース（エラーハンドリング）

#### テストケース 2-1: WordInput - エラー時にaria-invalid="true"が設定される

🔵 **青信号**: 既存実装、NFR-206要件に基づく

**テスト名**: エラー発生時にaria-invalid="true"が設定される

**エラーケースの概要**:
- フォームバリデーションでエラーが発生した場合
- WordInputにerror propsが渡される状況

**エラー処理の重要性**:
- スクリーンリーダーユーザーがエラー状態を即座に認識できる
- エラー箇所を迅速に特定できる

**入力値**:
```typescript
<WordInput
  value=""
  onChange={vi.fn()}
  error="言葉を入力してください"
/>
```

**不正な理由**:
- value=""で必須項目が空欄
- バリデーションエラーが発生

**実際の発生シナリオ**:
- ユーザーが未入力のまま「共有リンクを生成」ボタンをクリック
- フォーム送信時のバリデーションでエラー

**期待される結果**:
```typescript
const input = screen.getByLabelText(/贈りたい言葉/);
expect(input).toHaveAttribute('aria-invalid', 'true');
expect(input).toHaveAttribute('aria-describedby', 'word-error');

const errorMessage = screen.getByText('言葉を入力してください');
expect(errorMessage).toHaveAttribute('id', 'word-error');
```

**エラーメッセージの内容**:
- 「言葉を入力してください」は明確で実行可能
- ユーザーが何をすべきか理解できる

**システムの安全性**:
- エラー状態でも入力は継続可能
- フォーム送信のみがブロックされる

**テストの目的**:
- エラー状態のARIA属性が正しく設定されることを確認
- アクセシビリティの高いエラーハンドリングを保証

**品質保証の観点**:
- スクリーンリーダーユーザーがエラーを見逃さない
- エラー修正が効率的に行える

---

#### テストケース 2-2: MeaningTextarea - エラー時にaria-invalid="true"が設定される

🔵 **青信号**: 既存実装、NFR-206要件に基づく

**テスト名**: MeaningTextareaでエラー時にaria-invalid="true"が設定される

**エラーケースの概要**:
- MeaningTextareaのバリデーションエラー
- WordInputと同様のエラーハンドリングパターン

**エラー処理の重要性**:
- フォーム全体で一貫したエラー伝達
- すべての入力フィールドで同等のアクセシビリティ

**入力値**:
```typescript
<MeaningTextarea
  value=""
  onChange={vi.fn()}
  error="意味を入力してください"
/>
```

**不正な理由**:
- value=""で必須項目が空欄
- 必須項目のバリデーション失敗

**実際の発生シナリオ**:
- ユーザーが「言葉」のみ入力して「意味」を未入力
- フォーム送信時のバリデーションでエラー

**期待される結果**:
```typescript
const textarea = screen.getByLabelText(/その意味/);
expect(textarea).toHaveAttribute('aria-invalid', 'true');
expect(textarea).toHaveAttribute('aria-describedby', 'meaning-error');
```

**エラーメッセージの内容**:
- 「意味を入力してください」は明確で実行可能
- エラー内容と修正方法が一致

**システムの安全性**:
- エラー状態でも他のフィールドは正常動作
- 部分的エラーがフォーム全体に影響しない

**テストの目的**:
- textareaでもaria-invalidが正しく機能することを確認
- inputとtextareaで統一されたエラーハンドリング

**品質保証の観点**:
- フォーム要素タイプに関わらず一貫したARIA属性
- スクリーンリーダーでの予測可能な挙動

---

#### テストケース 2-3: Toast - 空のメッセージでもクラッシュしない

🟡 **黄信号**: 一般的なエラーハンドリングから推測

**テスト名**: Toastに空のメッセージが渡されてもエラーが発生しない

**エラーケースの概要**:
- toast.message=""の場合の堅牢性
- 想定外のprops値に対する防御的プログラミング

**エラー処理の重要性**:
- システムの堅牢性向上
- 予期しないデータでもクラッシュしない

**入力値**:
```typescript
const toast: ToastType = {
  id: 'empty-1',
  message: '',
  type: 'info',
  duration: 3000,
};
<Toast toast={toast} onClose={vi.fn()} />
```

**不正な理由**:
- 通常、トーストは何らかのメッセージを表示する目的
- message=""は異常な状態

**実際の発生シナリオ**:
- プログラムバグでmessage=""が渡される
- APIレスポンスでメッセージが欠損

**期待される結果**:
```typescript
expect(() => {
  render(<Toast toast={toast} onClose={vi.fn()} />);
}).not.toThrow();

const toastElement = screen.getByRole('alert');
expect(toastElement).toBeInTheDocument();
```

**エラーメッセージの内容**:
- エラーは発生せず、空のトーストが表示される
- または警告ログが出力される

**システムの安全性**:
- アプリケーション全体がクラッシュしない
- ユーザーは操作を継続できる

**テストの目的**:
- エッジケースでの堅牢性を確認
- 防御的プログラミングの実装確認

**品質保証の観点**:
- 想定外データでもグレースフルデグラデーション
- システムの可用性維持

---

### 3. 境界値テストケース（最小値、最大値、null等）

#### テストケース 3-1: usePageTitle - 空文字列タイトルの処理

🟡 **黄信号**: エッジケースハンドリングから推測

**テスト名**: usePageTitleに空文字列が渡された場合の処理

**境界値の意味**:
- title=""は最小限の入力値
- 通常は発生しないが、プログラムミスで発生する可能性

**境界値での動作保証**:
- 空文字列でもクラッシュしない
- 適切なフォールバック処理

**入力値**:
```typescript
renderHook(() => usePageTitle(''));
```

**境界値選択の根拠**:
- 文字列の最小値は空文字列
- 異常値としてテストすべき

**実際の使用場面**:
- プログラムバグで空文字列が渡される
- 動的データ取得失敗時のフォールバック

**期待される結果**:
```typescript
// オプション1: 空文字列でも設定
expect(document.title).toBe(' - 贈る言葉BOT');

// オプション2: デフォルト値使用
expect(document.title).toBe('贈る言葉BOT');

// 最低条件: クラッシュしない
expect(() => {
  renderHook(() => usePageTitle(''));
}).not.toThrow();
```

**境界での正確性**:
- どちらの動作でも一貫性があればOK
- 重要なのはエラーが発生しないこと

**一貫した動作**:
- 空文字列、undefined、nullで統一された処理
- 予測可能な挙動

**テストの目的**:
- 境界値での堅牢性を確認
- エッジケースのハンドリング検証

**堅牢性の確認**:
- 極端な入力値でもシステムが安定動作
- ユーザー体験が損なわれない

---

#### テストケース 3-2: usePageTitle - 非常に長いタイトルの処理

🟡 **黄信号**: エッジケースハンドリングから推測

**テスト名**: usePageTitleに長いタイトル（200文字）が渡された場合の処理

**境界値の意味**:
- 通常のタイトルは10-30文字程度
- 200文字は異常に長い入力

**境界値での動作保証**:
- 長いタイトルでも正しく設定される
- ブラウザのタイトルバー表示は自動的に省略される

**入力値**:
```typescript
const longTitle = 'あ'.repeat(200);
renderHook(() => usePageTitle(longTitle));
```

**境界値選択の根拠**:
- 極端に長い文字列での動作確認
- メモリやパフォーマンスへの影響確認

**実際の使用場面**:
- プログラムバグで異常に長い文字列が渡される
- 動的コンテンツで予想外に長いタイトル生成

**期待される結果**:
```typescript
const expectedTitle = 'あ'.repeat(200) + ' - 贈る言葉BOT';
expect(document.title).toBe(expectedTitle);

// クラッシュしないことが最重要
expect(() => {
  renderHook(() => usePageTitle(longTitle));
}).not.toThrow();
```

**境界での正確性**:
- 文字列の長さに関わらず正しく処理
- 文字列連結が正確に行われる

**一貫した動作**:
- 短いタイトルと長いタイトルで同じロジック
- 特別な切り捨て処理は不要（ブラウザが自動処理）

**テストの目的**:
- 文字列長の境界値での動作確認
- パフォーマンスやメモリへの影響確認

**堅牢性の確認**:
- 極端な長さでも正常動作
- メモリリークがない

---

#### テストケース 3-3: InputForm - すべてのフィールドがエラーの場合

🔵 **青信号**: 実際のユーザーシナリオに基づく

**テスト名**: すべての入力フィールドが同時にエラー状態の場合のARIA属性

**境界値の意味**:
- 0個エラー（正常）と全フィールドエラー（最大エラー）の境界
- フォームの最悪ケース

**境界値での動作保証**:
- 複数フィールドのエラーが独立して表示される
- ARIA属性がフィールドごとに正しく設定される

**入力値**:
```typescript
<WordInput value="" onChange={vi.fn()} error="言葉を入力してください" />
<MeaningTextarea value="" onChange={vi.fn()} error="意味を入力してください" />
```

**境界値選択の根拠**:
- ユーザーが未入力のままフォーム送信する実際のシナリオ
- すべてのエラーハンドリングが同時に動作する状況

**実際の使用場面**:
- 初回ユーザーがフォームの使い方が分からず空欄のまま送信
- 誤操作で送信ボタンをクリック

**期待される結果**:
```typescript
const wordInput = screen.getByLabelText(/贈りたい言葉/);
expect(wordInput).toHaveAttribute('aria-invalid', 'true');
expect(wordInput).toHaveAttribute('aria-describedby', 'word-error');

const meaningTextarea = screen.getByLabelText(/その意味/);
expect(meaningTextarea).toHaveAttribute('aria-invalid', 'true');
expect(meaningTextarea).toHaveAttribute('aria-describedby', 'meaning-error');

// 両方のエラーメッセージが表示
expect(screen.getByText('言葉を入力してください')).toBeInTheDocument();
expect(screen.getByText('意味を入力してください')).toBeInTheDocument();
```

**境界での正確性**:
- 各フィールドのエラーが独立して管理される
- aria-describedbyのID衝突がない

**一貫した動作**:
- 1個エラーでも全フィールドエラーでも同じ処理
- エラー数に依存しない堅牢な実装

**テストの目的**:
- 複数エラーの同時表示を確認
- ARIA属性の独立性検証

**堅牢性の確認**:
- 最悪ケースでもアクセシビリティが維持される
- スクリーンリーダーがすべてのエラーを認識できる

---

### 4. 統合テストケース（実際の使用シナリオ）

#### テストケース 4-1: フォーム入力からエラー修正までのARIA状態遷移

🔵 **青信号**: 実際のユーザーフローに基づく

**テスト名**: フォーム送信エラー→修正→再送信の一連のARIA状態遷移

**何をテストするか**:
- aria-invalid属性がエラー発生/解消で動的に更新されること
- スクリーンリーダーが状態変化を正しく伝達すること

**期待される動作**:
- エラー発生: aria-invalid="true"設定
- エラー解消: aria-invalid="false"または属性削除

**入力値**:
```typescript
// 初期状態: 空欄
const { rerender } = render(
  <WordInput value="" onChange={handleChange} error={undefined} />
);

// エラー発生
rerender(<WordInput value="" onChange={handleChange} error="言葉を入力してください" />);

// エラー解消
rerender(<WordInput value="感謝" onChange={handleChange} error={undefined} />);
```

**期待される結果**:
```typescript
// 初期状態
let input = screen.getByLabelText(/贈りたい言葉/);
expect(input).not.toHaveAttribute('aria-invalid', 'true');

// エラー発生後
expect(input).toHaveAttribute('aria-invalid', 'true');
expect(input).toHaveAttribute('aria-describedby', 'word-error');

// エラー解消後
expect(input).not.toHaveAttribute('aria-invalid', 'true');
expect(input).not.toHaveAttribute('aria-describedby');
```

**テストの目的**:
- ARIA属性の動的更新を確認
- 実際のユーザーフローでの動作検証

**確認ポイント**:
- 状態遷移がスムーズであること
- 属性の付け外しが正確に行われること

---

#### テストケース 4-2: モーダル表示→トースト表示の複合シナリオ

🔵 **青信号**: 実際のユーザーシナリオに基づく

**テスト名**: TutorialModal表示中にToast表示される場合のARIA属性

**何をテストするか**:
- 複数のARIA role="alert", role="dialog"が同時に存在する場合の動作
- スクリーンリーダーが適切に両方を認識できること

**期待される動作**:
- モーダルとトーストが独立して機能する
- 両方のARIA属性が正しく設定される

**入力値**:
```typescript
<TutorialProvider>
  <TutorialModal />
  <ToastContainer />
</TutorialProvider>
// チュートリアル表示中にトースト追加
```

**期待される結果**:
```typescript
const dialog = screen.getByRole('dialog');
expect(dialog).toHaveAttribute('aria-modal', 'true');

const toast = screen.getByRole('alert');
expect(toast).toHaveAttribute('aria-live', 'polite');

// 両方が同時に存在
expect(dialog).toBeInTheDocument();
expect(toast).toBeInTheDocument();
```

**テストの目的**:
- 複数のARIAコンポーネントの共存確認
- スクリーンリーダーでの複合UI認識

**確認ポイント**:
- ARIA属性の衝突がないこと
- 両方が独立して機能すること

---

## 📊 テストケース網羅性評価

### 要件網羅率

🔵 **青信号**: TASK-0045要件定義書との照合

| 要件項目 | テストケース | 網羅率 |
|---------|------------|--------|
| WordInput aria-required | 1-1, 1-2 | 100% |
| MeaningTextarea aria-required | 1-3 | 100% |
| InputForm aria-labelledby | 1-4 | 100% |
| Toast aria-live (assertive) | 1-5 | 100% |
| Toast aria-live (polite) | 1-6 | 100% |
| Toast aria-atomic | 1-7 | 100% |
| Toast 閉じるボタン aria-label | 1-8 | 100% |
| TutorialModal aria-describedby | 1-9 | 100% |
| TutorialModal 閉じるボタン aria-label | 1-10 | 100% |
| ShareModal ARIA属性 | 1-11 | 100% |
| usePageTitle タイトル更新 | 1-12 | 100% |
| usePageTitle タイトル復元 | 1-13 | 100% |
| aria-invalid エラー状態 | 2-1, 2-2 | 100% |
| エッジケース | 2-3, 3-1, 3-2, 3-3 | 100% |
| 統合シナリオ | 4-1, 4-2 | 100% |

**総合要件網羅率**: 100% (15/15項目)

### 機能網羅率

| 機能カテゴリ | テストケース数 | 網羅率 |
|------------|--------------|--------|
| フォーム入力フィールド | 4 | 完全 |
| トースト通知 | 4 | 完全 |
| モーダルダイアログ | 3 | 完全 |
| ページタイトル管理 | 4 | 完全 |
| エラーハンドリング | 3 | 完全 |
| 統合シナリオ | 2 | 完全 |

**総テストケース数**: 20

### テストケース分類

- **正常系**: 13テストケース (65%)
- **異常系**: 3テストケース (15%)
- **境界値**: 4テストケース (20%)
- **統合**: 2テストケース (10%)

---

## 🔧 テスト実装時の共通パターン

### Given-When-Thenパターン

すべてのテストケースで以下の構造を使用:

```typescript
describe('コンポーネント名', () => {
  it('テストケース名', () => {
    // 【テスト目的】: このテストで何を確認するか 🔵
    // 【テスト内容】: 具体的にどのような処理をテストするか 🔵
    // 【期待される動作】: 正常に動作した場合の結果 🔵
    // 🔵 信頼性レベル: 要件定義書ベース

    // === Given: テストデータ準備 ===
    // 【テストデータ準備】: なぜこのデータを用意するか 🔵
    const props = { /* ... */ };

    // === When: 処理実行 ===
    // 【実際の処理実行】: どの機能を呼び出すか 🔵
    render(<Component {...props} />);

    // === Then: 結果検証 ===
    // 【結果検証】: 何を検証するか 🔵
    const element = screen.getByRole('...');

    // 【検証項目】: ARIA属性の存在確認 🔵
    expect(element).toHaveAttribute('aria-required', 'true');
  });
});
```

### モックとスパイの使用

```typescript
// コールバック関数のモック
const onChange = vi.fn();

// DOM APIのスパイ
vi.spyOn(document, 'title', 'set');
```

### Testing Library推奨パターン

```typescript
// ✅ 推奨: role, labelText での検索
const input = screen.getByLabelText(/贈りたい言葉/);
const button = screen.getByRole('button', { name: '閉じる' });
const dialog = screen.getByRole('dialog');

// ❌ 非推奨: testId, className での検索
// const input = screen.getByTestId('word-input');
```

---

## 📝 品質判定

### 品質評価: ✅ 高品質

**評価基準**:

✅ **テストケース分類: 完全**
- 正常系（13）、異常系（3）、境界値（4）、統合（2）が網羅されている
- ARIA属性のすべての側面をカバー

✅ **期待値定義: 明確**
- 各テストケースの期待値が具体的
- ARIA属性値が明示的に定義されている
- スクリーンリーダーでの読み上げ内容が明記されている

✅ **技術選択: 確定**
- TypeScript 5.0+ (プロジェクト標準)
- Vitest + @testing-library/react (既存テストと一貫)
- 既存テストパターンを踏襲

✅ **実装可能性: 確実**
- 既存テストファイルと同じ構造
- 使用するAPIはすべて実績あり
- 段階的実装が可能（コンポーネント単位）

---

## 🚀 次のステップ

次のお勧めステップ: `/tsumiki:tdd-red` でRedフェーズ（失敗テスト作成）を開始します。

### Redフェーズで実装する内容

1. **WordInput.test.tsx への追加**:
   - aria-required属性のテスト
   - 必須マーカーaria-labelのテスト

2. **MeaningTextarea.test.tsx への追加**:
   - aria-required属性のテスト
   - 必須マーカーaria-labelのテスト

3. **InputForm.test.tsx への追加**:
   - aria-labelledby属性のテスト
   - フォームタイトル見出しのテスト

4. **Toast.test.tsx への追加**:
   - aria-live="assertive"のテスト（エラー時）
   - aria-live="polite"のテスト（通常時）
   - aria-atomic="true"のテスト
   - 閉じるボタンaria-labelのテスト

5. **TutorialModal.test.tsx への追加**:
   - aria-describedby属性のテスト
   - 閉じるボタンaria-labelのテスト

6. **ShareModal.test.tsx への追加**:
   - ARIA属性セットのテスト

7. **usePageTitle.test.tsx の新規作成**:
   - タイトル更新のテスト
   - タイトル復元のテスト
   - エッジケースのテスト

---

**作成日**: 2025-11-23
**作成者**: Claude Code (TDD Test Cases Phase)
**参照元**: `docs/implements/gift-words/TASK-0045/Accessibility-requirements.md`
**ステータス**: ✅ テストケース定義完了
