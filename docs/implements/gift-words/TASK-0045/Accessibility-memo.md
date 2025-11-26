# TDD開発メモ: ARIA属性・アクセシビリティ改善

## 概要

- **機能名**: ARIA属性・アクセシビリティ改善
- **タスクID**: TASK-0045
- **開発開始**: 2025-11-23
- **現在のフェーズ**: Red（失敗テスト作成完了）

## 関連ファイル

- **元タスクファイル**: `docs/tasks/gift-words-phase4.md` (行1517-1729)
- **要件定義**: `docs/implements/gift-words/TASK-0045/Accessibility-requirements.md`
- **テストケース定義**: `docs/implements/gift-words/TASK-0045/Accessibility-testcases.md`
- **実装ファイル**:
  - `src/components/InputForm/WordInput.tsx`
  - `src/components/InputForm/MeaningTextarea.tsx`
  - `src/components/common/Toast/Toast.tsx`
  - `src/components/common/TutorialModal/TutorialModal.tsx`
  - `src/hooks/usePageTitle.ts` (未作成)
- **テストファイル**:
  - `src/components/InputForm/__tests__/WordInput.test.tsx`
  - `src/components/InputForm/__tests__/MeaningTextarea.test.tsx`
  - `src/components/common/Toast/__tests__/Toast.test.tsx`
  - `src/hooks/__tests__/usePageTitle.test.tsx` (新規作成)

---

## Redフェーズ（失敗するテスト作成）

### 作成日時

2025-11-23 16:27

### テストケース

**追加したテスト数**: 11テストケース

#### 1. WordInput.test.tsx (2テストケース追加)
- ✅ `WordInputにaria-required="true"が設定される`
- ✅ `必須マーカー(*)にaria-label="必須"が設定される`

#### 2. MeaningTextarea.test.tsx (2テストケース追加)
- ✅ `MeaningTextareaにaria-required="true"が設定される`
- ✅ `必須マーカー(*)にaria-label="必須"が設定される`

#### 3. Toast.test.tsx (4テストケース追加)
- ✅ `エラートーストにaria-live="assertive"が設定される`
- ✅ `通常トースト(success/info/warning)にaria-live="polite"が設定される`
- ✅ `Toastにaria-atomic="true"が設定される`
- ✅ `閉じるボタンにaria-label="通知を閉じる"が設定される`

#### 4. usePageTitle.test.tsx (5テストケース - 新規ファイル)
- ✅ `ページタイトルが動的に更新される`
- ✅ `アンマウント時にタイトルが復元される`
- ✅ `タイトル変更時に前のタイトルが復元される`
- ✅ `空文字列タイトルでもエラーが発生しない` (境界値)
- ✅ `非常に長いタイトル（200文字）でもエラーが発生しない` (境界値)

### テストコード

すべてのテストコードには以下の特徴を含む：

1. **詳細な日本語コメント**:
   - `【テスト目的】`: テストの意図を明確化
   - `【テスト内容】`: 具体的な検証内容
   - `【期待される動作】`: 成功時の挙動
   - `🔵🟡🔴 信頼性レベル`: 要件定義書との照合状況

2. **Given-When-Thenパターン**:
   - `【テストデータ準備】`: Given - 初期条件設定
   - `【実際の処理実行】`: When - 処理実行
   - `【結果検証】`: Then - 期待結果確認

3. **各expectステートメントにコメント**:
   - `【確認内容】`: 何を検証しているか明示

### 期待される失敗

#### WordInput.test.tsx
```
❌ FAIL: WordInputにaria-required="true"が設定される
Expected the element to have attribute:
  aria-required="true"
Received:
  null

❌ FAIL: 必須マーカー(*)にaria-label="必須"が設定される
Unable to find a label with the text of: 必須
```

#### MeaningTextarea.test.tsx
```
❌ FAIL: MeaningTextareaにaria-required="true"が設定される
Expected the element to have attribute:
  aria-required="true"
Received:
  null

❌ FAIL: 必須マーカー(*)にaria-label="必須"が設定される
Unable to find a label with the text of: 必須
```

#### Toast.test.tsx
```
❌ FAIL: エラートーストにaria-live="assertive"が設定される
Expected the element to have attribute:
  aria-live="assertive"
Received:
  aria-live="polite"

❌ FAIL: Toastにaria-atomic="true"が設定される
Expected the element to have attribute:
  aria-atomic="true"
Received:
  null

❌ FAIL: 閉じるボタンにaria-label="通知を閉じる"が設定される
Unable to find a role="button" with accessible name "通知を閉じる"
Found: "閉じる"
```

#### usePageTitle.test.tsx
```
❌ FAIL: ページタイトルが動的に更新される
Cannot find module '../usePageTitle' from 'src/hooks/__tests__/usePageTitle.test.tsx'

（その他のテストも同様にモジュール未作成でエラー）
```

### 次のフェーズへの要求事項

**Greenフェーズで実装すべき内容**:

#### 1. WordInput.tsx の修正
```typescript
// input要素にaria-required属性を追加
<input
  id="word"
  type="text"
  aria-required="true"  // 🆕 追加
  aria-invalid={!!error}
  aria-describedby={error ? 'word-error' : undefined}
  // ... その他の属性
/>

// 必須マーカーにaria-label属性を追加
<span className={styles.required} aria-label="必須">*</span>  // 🆕 追加
```

#### 2. MeaningTextarea.tsx の修正
```typescript
// textarea要素にaria-required属性を追加
<textarea
  id="meaning"
  aria-required="true"  // 🆕 追加
  aria-invalid={!!error}
  aria-describedby={error ? 'meaning-error' : undefined}
  // ... その他の属性
/>

// 必須マーカーにaria-label属性を追加
<span className={styles.required} aria-label="必須">*</span>  // 🆕 追加
```

#### 3. Toast.tsx の修正
```typescript
// aria-liveを動的に設定（error時はassertive、それ以外はpolite）
<div
  className={`${styles.toast} ${styles[toast.type]}`}
  role="alert"
  aria-live={toast.type === 'error' ? 'assertive' : 'polite'}  // 🆕 変更
  aria-atomic="true"  // 🆕 追加
>
  {/* ... */}
  <button
    className={styles.closeButton}
    onClick={() => onClose(toast.id)}
    aria-label="通知を閉じる"  // 🆕 変更（「閉じる」から変更）
    type="button"
  >
    ×
  </button>
</div>
```

#### 4. usePageTitle.ts の新規作成
```typescript
/**
 * ページタイトルを動的に更新するカスタムフック
 * TASK-0045: NFR-204 セマンティックHTML対応
 */

import { useEffect } from 'react';

/**
 * ページタイトルを動的に更新し、アンマウント時に復元するフック
 *
 * @param title - ページ固有のタイトル（例: "言葉を作成"）
 *
 * @example
 * ```tsx
 * function HomePage() {
 *   usePageTitle('言葉を作成');
 *   return <div>...</div>;
 * }
 * ```
 */
export const usePageTitle = (title: string): void => {
  useEffect(() => {
    // 【タイトル保存】: 元のタイトルを保存
    const prevTitle = document.title;

    // 【タイトル更新】: 新しいタイトルを設定（フォーマット: "{title} - 贈る言葉BOT"）
    document.title = `${title} - 贈る言葉BOT`;

    // 【クリーンアップ】: アンマウント時に元のタイトルに復元
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
```

---

## Greenフェーズ（最小実装）

### 実装日時

2025-11-23 16:32

### 実装内容

**実装したファイル**: 4ファイル

#### 1. usePageTitle.ts (新規作成)
- ページタイトルを動的に更新するカスタムフック
- useEffectでdocument.titleを更新
- アンマウント時に元のタイトルに復元
- 実装行数: 12行（コメント除く）

#### 2. WordInput.tsx (ARIA属性追加)
- input要素に`aria-required="true"`を追加
- 必須マーカー(*)に`aria-label="必須"`を追加

#### 3. MeaningTextarea.tsx (ARIA属性追加)
- textarea要素に`aria-required="true"`を追加
- 必須マーカー(*)に`aria-label="必須"`を追加

#### 4. Toast.tsx (動的ARIA属性)
- `aria-live`を動的に設定（error時はassertive、それ以外はpolite）
- `aria-atomic="true"`を追加
- 閉じるボタンのaria-labelを「通知を閉じる」に変更

### テスト結果

**すべてのテストが成功**: ✅

- usePageTitle.test.tsx: 5 passed (5)
- WordInput.test.tsx: 16 passed (16) - うち新規2テスト
- MeaningTextarea.test.tsx: 18 passed (18) - うち新規2テスト
- Toast.test.tsx: 13 passed (13) - うち新規4テスト

**合計**: 11個の新規テストすべてが成功

### 詳細レポート

`docs/implements/gift-words/TASK-0045/Accessibility-green-phase.md`

---

## Refactorフェーズ（品質改善）

### リファクタ日時

（未実施）

### 改善内容

（Refactorフェーズで記載）

---

**作成日**: 2025-11-23
**作成者**: Claude Code (TDD Red/Green Phase)
**ステータス**: ✅ Greenフェーズ完了（最小実装完了）
