# TDD Redフェーズ: ErrorBoundary コンポーネント

## 概要

- **タスクID**: TASK-0040
- **機能名**: ErrorBoundary（Reactエラーバウンダリ）
- **実装日**: 2025-11-22
- **現在のフェーズ**: Red（失敗するテスト作成完了）

## 関連ファイル

- **元タスクファイル**: `docs/tasks/gift-words-phase4.md`
- **要件定義**: `docs/implements/gift-words/TASK-0040/ErrorBoundary-requirements.md`
- **テストケース定義**: `docs/implements/gift-words/TASK-0040/ErrorBoundary-testcases.md`
- **テストファイル**: `src/components/common/ErrorBoundary/__tests__/ErrorBoundary.test.tsx` (作成済み)
- **実装ファイル**: `src/components/common/ErrorBoundary/ErrorBoundary.tsx` (未作成)
- **スタイルファイル**: `src/components/common/ErrorBoundary/ErrorBoundary.module.css` (未作成)

## Redフェーズ（失敗するテスト作成）

### 作成日時

2025-11-22 21:24

### テストケース

テストケース定義書に基づき、8個のテストケースを実装しました：

#### 1. 正常系テストケース（2個）
1. **エラーがない場合は子要素を表示する**: ErrorBoundaryが正常時に子要素を透過的に表示することを確認
2. **ErrorBoundaryが正しくレンダリングされる**: コンポーネント自体が正常にマウントされることを確認

#### 2. 異常系テストケース（3個）
1. **子コンポーネントでエラー発生時にフォールバックUIを表示する**: エラーキャッチとフォールバックUI表示の主要機能を確認
2. **エラー発生時にコンソールログが出力される**: componentDidCatchでのエラーログ出力を確認
3. **リセットボタンでトップページに戻る**: リセット機能とwindow.location.href遷移を確認

#### 3. カスタムフォールバックUIテストケース（1個）
1. **カスタムfallback propsが指定されている場合はそれを表示する**: fallback propsの優先表示を確認

#### 4. エッジケーステストケース（2個）
1. **複数のエラー発生後もフォールバックUIが正しく表示される**: State管理の堅牢性を確認
2. **エラー詳細が展開可能な<details>要素で表示される**: `<details>`タグでのエラー詳細表示を確認

### テストコード

ファイル: `src/components/common/ErrorBoundary/__tests__/ErrorBoundary.test.tsx`

**主な特徴**:
- **日本語コメント**: 全テストケースに詳細な日本語コメントを記載
- **Given-When-Then形式**: わかりやすいテスト構造
- **信頼性レベル表示**: 🔵（高信頼）、🟡（中信頼）マーカーで情報源を明示
- **モック戦略**:
  - `console.error`: Reactの内部エラーログを抑制
  - `window.location`: リダイレクト動作をテスト環境でモック化
- **アクセシビリティ対応**: セマンティックHTML（`<details>`タグ）のテストを含む
- **Class Component対応**: React Error Boundary APIの仕様に準拠

### 期待される失敗

#### テスト実行結果

```bash
npm test -- ErrorBoundary --run
```

**エラーメッセージ**:
```
Error: Failed to resolve import "../ErrorBoundary" from "src/components/common/ErrorBoundary/__tests__/ErrorBoundary.test.tsx". Does the file exist?
```

**失敗の理由**:
- `src/components/common/ErrorBoundary/ErrorBoundary.tsx` ファイルがまだ存在しない
- これはRedフェーズの期待される動作

### 次のフェーズへの要求事項

Greenフェーズで実装すべき内容:

1. **コンポーネント実装** (`ErrorBoundary.tsx`):
   - **Class Component必須**: React Error Boundary APIはClass Componentでのみ実装可能
   - **Props型定義**: `ErrorBoundaryProps` (children, fallback?)
   - **State型定義**: `ErrorBoundaryState` (hasError, error, errorInfo)
   - **getDerivedStateFromError()**: エラーキャッチ時にStateを更新
   - **componentDidCatch()**: エラーログをconsole.errorに出力
   - **render()**:
     - 正常時: children表示
     - エラー時（カスタムfallbackなし）: デフォルトフォールバックUI
     - エラー時（カスタムfallback指定）: カスタムフォールバックUI
   - **handleReset()**: `window.location.href = '/'`でトップページ遷移
   - **フォールバックUI構成**:
     - タイトル: 「エラーが発生しました」
     - メッセージ: 「申し訳ございません。アプリケーションでエラーが発生しました。」
     - エラー詳細: `<details><summary>エラー詳細</summary><pre>{error.toString()}</pre></details>`
     - リセットボタン: 「トップページに戻る」（onClick={handleReset}）

2. **スタイル実装** (`ErrorBoundary.module.css`):
   - `.container`: フォールバックUIのコンテナスタイル
   - `.content`: コンテンツエリアのスタイル
   - レスポンシブデザイン（@media (max-width: 768px)）
   - アクセシビリティ対応（フォーカス可能なボタンスタイル）

3. **依存関係**:
   - React Class Component: `React.Component<Props, State>`
   - React types: `ErrorInfo`, `ReactNode`
   - CSS Modules: `ErrorBoundary.module.css`

### テスト実装の詳細

#### モック戦略

**1. console.error モック**:
```typescript
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
```
- **理由**: Reactがエラー発生時に内部でconsole.errorを呼ぶため、テストログを汚さない
- **検証方法**: `expect(consoleErrorSpy).toHaveBeenCalled()`でログ出力を確認

**2. window.location モック**:
```typescript
delete (window as any).location;
window.location = { href: '' } as any;
```
- **理由**: `handleReset()`で`window.location.href = '/'`を実行するため
- **検証方法**: `expect(window.location.href).toBe('/')`で遷移を確認

#### エラー発生コンポーネントのパターン

```typescript
const BrokenComponent = () => {
  throw new Error('Test error');
};
```
- **使用箇所**: 異常系テスト、カスタムfallbackテスト、エッジケーステスト
- **目的**: React Error Boundaryがエラーをキャッチする動作を検証

### 要件網羅性

| 要件ID | 要件内容 | 対応テストケース |
|--------|---------|----------------|
| REQ-311 | エラー通知 | テスト2-1（フォールバックUI表示） |
| NFR-101 | XSS対策 | テスト1-1, 2-1（Reactエスケープ） |
| NFR-205 | キーボード操作 | テスト2-3（ボタンクリック） |
| NFR-301 | ブラウザ対応 | 全テスト（React 16+） |
| EDGE-001 | エラーメッセージ | テスト2-1（分かりやすいメッセージ） |

### 品質指標

- **テストケース数**: 8個
- **要件網羅率**: 100% (全5要件カバー)
- **信頼性レベル分布**:
  - 🔵 高信頼: 75% (6テストケース)
  - 🟡 中信頼: 25% (2テストケース)
  - 🔴 低信頼: 0%
- **カテゴリ分散**: 正常系(2)、異常系(3)、カスタムUI(1)、エッジケース(2)

### TDD原則の遵守

✅ **Red-Green-Refactorサイクル**:
- ✅ Red: 失敗するテストを作成（完了）
- ⏳ Green: 最小実装でテストを通す（次のフェーズ）
- ⏳ Refactor: コード品質改善（次のフェーズ）

✅ **テストファースト**:
- 実装前にテストを書く原則を遵守
- テストケース定義書に基づく計画的なテスト作成

✅ **最小実装の準備**:
- テストが明確に定義されており、必要最小限の実装が特定可能

### 次のステップ

**推奨**: `/tsumiki:tdd-green` でGreenフェーズ（最小実装）を開始

**Greenフェーズで実施すべきこと**:
1. `src/components/common/ErrorBoundary/ErrorBoundary.tsx` を作成
2. `src/components/common/ErrorBoundary/ErrorBoundary.module.css` を作成
3. 全8テストケースを通す最小実装を行う
4. テスト実行: `npm test -- ErrorBoundary --run`
5. 全テスト成功を確認

---

**作成日**: 2025-11-22
**作成者**: Claude Code (TDD Red Phase)
**テスト総数**: 8テストケース
**期待される結果**: 全テスト失敗（実装ファイル未作成のため）
