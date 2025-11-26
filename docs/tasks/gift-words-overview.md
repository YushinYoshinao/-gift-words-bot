# 贈る言葉BOT プロジェクトタスク概要

## 📋 生成情報
- **生成日**: 2025-01-20
- **生成ツール**: Claude Code
- **プロジェクト名**: 贈る言葉BOT（武田鉄矢版）
- **プロジェクトタイプ**: Webアプリケーション（静的サイト）

---

## 🎯 プロジェクト概要

### プロジェクト説明
友達同士でオリジナルの言葉とその意味を贈り合うWebアプリケーション。武田鉄矢が黒板の前で言葉を贈ってくれる画像を生成し、共有リンクとして送ることができる。

### 技術スタック
- **フロントエンド**: React 18.3+ + TypeScript 5.0+ + Vite 5.x
- **状態管理**: React Context API
- **スタイリング**: CSS Modules + 標準CSS
- **画像処理**: html2canvas v1.4.1+
- **デプロイ**: GitHub Pages
- **データ永続化**: URLパラメータ（Base64エンコード）+ LocalStorage（チュートリアルフラグのみ）

### プロジェクト制約
- ✅ クライアントサイドのみ（バックエンド不可）
- ✅ データベース不使用
- ✅ URLパラメータベースのデータ永続化
- ✅ GitHub Pages静的ホスティング
- ✅ モダンブラウザのみサポート（Chrome, Firefox, Edge, Safari最新版）

### プロジェクト期間・工数
- **全体期間**: 4フェーズ、約20日間（営業日）
- **総見積工数**: 約160時間
- **目標完了日**: 2025-02-15（約4週間後）
- **開発体制**: 個人開発
- **1日あたり工数**: 8時間想定

---

## 📊 全体進捗

### フェーズ完了状況
- [ ] Phase 1: プロジェクト基盤構築（5日間、40時間）
- [ ] Phase 2: コアコンポーネント・状態管理（5日間、40時間）
- [ ] Phase 3: 表示・アニメーション機能（5日間、40時間）
- [ ] Phase 4: 画像エクスポート・仕上げ（5日間、40時間）

### 進捗メトリクス
- **完了フェーズ**: 0 / 4（0%）
- **完了タスク**: 0 / 予定（各フェーズのタスクファイル参照）
- **総見積工数**: 160時間
- **消化工数**: 0時間
- **残工数**: 160時間

---

## 🗂️ フェーズ構造一覧表

| フェーズ | 期間（日） | 見積工数 | 主要成果物 | タスク数 | タスクファイル |
|---------|-----------|---------|-----------|---------|---------------|
| **Phase 1**<br>プロジェクト基盤構築 | 5日 | 40時間 | • Vite+React+TypeScript環境<br>• 基本ディレクトリ構造<br>• ルーティング設定<br>• 共通型定義<br>• 開発環境設定<br>• GitHub Pages CI/CD | 約10-12 | [gift-words-phase1.md](./gift-words-phase1.md) |
| **Phase 2**<br>コアコンポーネント・状態管理 | 5日 | 40時間 | • InputFormコンポーネント<br>• バリデーション機能<br>• URLエンコーダー/デコーダー<br>• Context API状態管理<br>• チュートリアルモーダル<br>• 共有モーダル | 約10-12 | [gift-words-phase2.md](./gift-words-phase2.md) |
| **Phase 3**<br>表示・アニメーション機能 | 5日 | 40時間 | • DisplayPageコンポーネント<br>• 縦書きテキスト表示<br>• タイプライターアニメーション<br>• 武田鉄矢画像レイアウト<br>• 辞書風デザイン<br>• レスポンシブ対応 | 約10-12 | [gift-words-phase3.md](./gift-words-phase3.md) |
| **Phase 4**<br>画像エクスポート・仕上げ | 5日 | 40時間 | • html2canvas統合<br>• 画像ダウンロード機能<br>• エラーハンドリング<br>• パフォーマンス最適化<br>• アクセシビリティ対応<br>• 本番デプロイ | 約10-12 | [gift-words-phase4.md](./gift-words-phase4.md) |

---

## 🎯 各フェーズのマイルストーン定義

### Phase 1: プロジェクト基盤構築（TASK-0001 〜 TASK-0012）
**目標**: 開発可能な基盤環境の構築と基本的なページ遷移の実装

**主要マイルストーン**:
- ✅ M1-1: Vite + React + TypeScript プロジェクトが正常に起動する
- ✅ M1-2: ルーティング（`/`, `/display`）が動作する
- ✅ M1-3: TypeScript型定義ファイルがエラーなくコンパイルできる
- ✅ M1-4: ESLint、Prettier、Vitestが設定済みで実行可能
- ✅ M1-5: GitHub Pages自動デプロイワークフローが動作する
- ✅ M1-6: 基本的なディレクトリ構造が完成している

**成果物確認基準**:
- `npm run dev` で開発サーバーが起動する
- `npm run build` でエラーなくビルドできる
- `npm run test` でテストが実行される
- GitHub Actionsでデプロイが成功する

---

### Phase 2: コアコンポーネント・状態管理（TASK-0013 〜 TASK-0024）
**目標**: 入力フォームと共有リンク生成機能の完全実装

**主要マイルストーン**:
- ✅ M2-1: InputFormコンポーネントが正常に動作する
- ✅ M2-2: バリデーション（空欄、文字数制限）が機能する
- ✅ M2-3: URLエンコーダー/デコーダーがBase64で正常動作する
- ✅ M2-4: Context APIで状態管理が実装されている
- ✅ M2-5: チュートリアルモーダルが初回訪問時に表示される
- ✅ M2-6: 共有リンクがコピーできてトーストメッセージが表示される

**成果物確認基準**:
- フォームに入力して送信ボタンを押すと共有URLが生成される
- バリデーションエラー時に適切なエラーメッセージが表示される
- 生成されたURLをコピーできる
- チュートリアルが初回のみ表示され、2回目以降は表示されない

---

### Phase 3: 表示・アニメーション機能（TASK-0025 〜 TASK-0036）
**目標**: 言葉表示ページとタイプライターアニメーションの完全実装

**主要マイルストーン**:
- ✅ M3-1: DisplayPageコンポーネントが正常にレンダリングされる
- ✅ M3-2: 武田鉄矢の画像が右側〜中央に正しく配置される
- ✅ M3-3: 縦書きテキスト（CSS `writing-mode: vertical-rl`）が正しく表示される
- ✅ M3-4: タイプライターアニメーション（100ms/文字）が動作する
- ✅ M3-5: 辞書風デザイン（見出し語、意味）が実装される
- ✅ M3-6: レスポンシブデザイン（スマホ、タブレット、PC）が動作する

**成果物確認基準**:
- 共有URLにアクセスすると言葉が1文字ずつ表示される
- 縦書きが正しく表示され、読みやすいデザインになっている
- スマートフォンでも適切に表示される
- アニメーションが60fps以上でスムーズに動作する

---

### Phase 4: 画像エクスポート・仕上げ（TASK-0037 〜 TASK-0048）
**目標**: 画像ダウンロード機能と品質保証の完了、本番リリース

**主要マイルストーン**:
- ✅ M4-1: html2canvasが正常に統合され画像生成できる
- ✅ M4-2: PNG画像がダウンロードできる（ファイル名: `gift-words-YYYYMMDD.png`）
- ✅ M4-3: エラーハンドリングが全ページで実装されている
- ✅ M4-4: パフォーマンス最適化（バンドルサイズ500KB以下、Lighthouse 90+点）
- ✅ M4-5: アクセシビリティ対応（キーボード操作、ARIA属性）
- ✅ M4-6: 本番環境（GitHub Pages）で全機能が動作する

**成果物確認基準**:
- 画像保存ボタンで正しくPNG画像がダウンロードされる
- エラー発生時に適切なトーストメッセージが表示される
- Lighthouse Performance スコアが90点以上
- GitHub Pagesで公開され、全機能が正常動作する

---

## 🔢 タスク番号体系

### タスクID命名規則
- **フォーマット**: `TASK-XXXX`（4桁、ゼロパディング）
- **範囲**: TASK-0001 〜 TASK-0100（予約範囲）
- **Phase 1**: TASK-0001 〜 TASK-0012
- **Phase 2**: TASK-0013 〜 TASK-0024
- **Phase 3**: TASK-0025 〜 TASK-0036
- **Phase 4**: TASK-0037 〜 TASK-0048
- **将来の拡張**: TASK-0049 〜 TASK-0100（予備）

### タスク優先度
- **P0（最優先）**: プロジェクト推進に必須、ブロッカー
- **P1（高）**: 主要機能、マイルストーン達成に必要
- **P2（中）**: 重要だが緊急ではない機能
- **P3（低）**: 改善項目、将来的な拡張

### タスク状態
- **TODO**: 未着手
- **IN_PROGRESS**: 作業中
- **IN_REVIEW**: レビュー待ち
- **DONE**: 完了
- **BLOCKED**: ブロック中（他タスクの完了待ち）

---

## 📚 技術スタック参照

### 設計文書
- [📘 tech-stack.md](../tech-stack.md) - 技術スタック定義
- [📋 gift-words-requirements.md](../spec/gift-words-requirements.md) - 機能要件・非機能要件
- [📖 gift-words-user-stories.md](../spec/gift-words-user-stories.md) - ユーザストーリー
- [✅ gift-words-acceptance-criteria.md](../spec/gift-words-acceptance-criteria.md) - 受け入れ基準

### 技術設計文書（`docs/design/gift-words/`）
- [🏗️ architecture.md](../design/gift-words/architecture.md) - アーキテクチャ設計
- [🔄 dataflow.md](../design/gift-words/dataflow.md) - データフロー図
- [🧩 component-design.md](../design/gift-words/component-design.md) - コンポーネント設計
- [📝 interfaces.ts](../design/gift-words/interfaces.ts) - TypeScript型定義
- [📄 README.md](../design/gift-words/README.md) - 設計文書概要

---

## 🛠️ タスク実行ガイドライン

### TDD（テスト駆動開発）プロセス
本プロジェクトでは、主要機能の実装にTDDを適用します。

#### TDDコマンド
1. **要件整理**: `/tsumiki:tdd-requirements` - 機能要件を明確化
2. **テストケース洗い出し**: `/tsumiki:tdd-testcases` - 包括的なテストケースを特定
3. **Red**: `/tsumiki:tdd-red` - 失敗するテストケースを作成
4. **Green**: `/tsumiki:tdd-green` - テストを通す実装
5. **Refactor**: `/tsumiki:tdd-refactor` - コード品質改善
6. **完了検証**: `/tsumiki:tdd-verify-complete` - 全テスト通過確認

#### TDD適用対象
- URLエンコーダー/デコーダー（`src/utils/urlEncoder.ts`）
- バリデーション機能（`src/utils/validation.ts`）
- カスタムフック（`useTypewriter`, `useImageExport`）
- 主要コンポーネント（InputForm, DisplayPage）

---

### DIRECTプロセス（設定・インフラ作業）
環境構築やCI/CD設定など、テストが不要な作業にはDIRECTプロセスを使用します。

#### DIRECTコマンド
1. **セットアップ**: `/tsumiki:direct-setup` - 設定作業実行
2. **動作検証**: `/tsumiki:direct-verify` - 設定が正しく動作することを確認

#### DIRECT適用対象
- Viteプロジェクトセットアップ
- ESLint/Prettier設定
- GitHub Actions CI/CD設定
- ディレクトリ構造作成

---

### デバッグプロセス
テストエラーが発生した場合の対応手順。

#### デバッグコマンド
- `/tsumiki:auto-debug` - テストエラーの自動デバッグ・修正

---

### 開発フロー例
```bash
# Phase 1 - TASK-0001: Viteプロジェクトセットアップ
/tsumiki:direct-setup
/tsumiki:direct-verify

# Phase 2 - TASK-0015: URLエンコーダー実装（TDD）
/tsumiki:tdd-requirements
/tsumiki:tdd-testcases
/tsumiki:tdd-red
/tsumiki:tdd-green
/tsumiki:tdd-refactor
/tsumiki:tdd-verify-complete

# エラーが発生した場合
/tsumiki:auto-debug
```

---

## 🎨 コーディング規約

### TypeScript
- **Strict Mode**: 有効化（`tsconfig.json`）
- **ESLint**: エラー0件を維持
- **Prettier**: 全ファイルフォーマット済み
- **命名規則**:
  - コンポーネント: PascalCase（例: `InputForm.tsx`）
  - フック: camelCase + use接頭辞（例: `useTypewriter.ts`）
  - ユーティリティ: camelCase（例: `urlEncoder.ts`）
  - 型定義: PascalCase（例: `GiftWordData`）
  - 定数: UPPER_SNAKE_CASE（例: `MAX_WORD_LENGTH`）

### CSS
- **CSS Modules**: `.module.css` ファイルを使用
- **クラス名**: camelCase（例: `.displayContainer`）
- **グローバルスタイル**: `src/styles/global.css`
- **CSS変数**: `src/styles/variables.css`

### Git
- **ブランチ戦略**:
  - `main`: 本番環境
  - `develop`: 開発環境
  - `feature/TASK-XXXX-description`: フィーチャーブランチ
- **コミットメッセージ**: Conventional Commits形式
  ```
  feat(TASK-0001): Viteプロジェクトのセットアップを完了
  fix(TASK-0015): URLエンコーダーのバリデーションを修正
  docs(TASK-0020): READMEにセットアップ手順を追加
  ```

---

## 📈 品質基準

### コード品質
- ✅ TypeScript strict mode: 有効化
- ✅ ESLint: エラー0件
- ✅ Prettier: 全ファイルフォーマット済み
- ✅ テストカバレッジ: 主要機能60%以上

### パフォーマンス
- ✅ 初回読み込み: 3秒以内（NFR-001）
- ✅ アニメーション: 60fps維持（NFR-002）
- ✅ バンドルサイズ: 500KB以下（gzip圧縮後）（NFR-003）
- ✅ Lighthouse Performance: 90+点（NFR-004）

### アクセシビリティ
- ✅ セマンティックHTML: 適切なHTML5要素使用
- ✅ キーボード操作: 全機能をキーボードで操作可能
- ✅ ARIA属性: 必要な箇所に適用
- ✅ Lighthouse Accessibility: 90+点

---

## 🚀 デプロイフロー

### 開発環境
```bash
# 依存関係インストール
npm install

# 開発サーバー起動（http://localhost:5173）
npm run dev

# 型チェック
npm run type-check

# リント実行
npm run lint

# フォーマット実行
npm run format

# テスト実行
npm test
```

### 本番環境
```bash
# 本番ビルド
npm run build

# ビルドプレビュー
npm run preview

# GitHub Pagesデプロイ（自動化）
git push origin main
# → GitHub Actionsが自動デプロイ
```

---

## 📝 各フェーズのタスクファイル

各フェーズの詳細なタスク一覧は、以下のファイルを参照してください：

1. **Phase 1**: [gift-words-phase1.md](./gift-words-phase1.md) - プロジェクト基盤構築
2. **Phase 2**: [gift-words-phase2.md](./gift-words-phase2.md) - コアコンポーネント・状態管理
3. **Phase 3**: [gift-words-phase3.md](./gift-words-phase3.md) - 表示・アニメーション機能
4. **Phase 4**: [gift-words-phase4.md](./gift-words-phase4.md) - 画像エクスポート・仕上げ

---

## 🔄 更新履歴

- **2025-01-20**: 初回作成（Claude Codeにより生成）

---

## 📞 問い合わせ・サポート

プロジェクトに関する質問や問題がある場合は、以下を確認してください：

1. **設計文書**: `docs/design/gift-words/README.md`
2. **FAQ**: `docs/design/gift-words/README.md#よくある質問faq`
3. **トラブルシューティング**: `docs/design/gift-words/README.md#トラブルシューティング`

---

## 🎯 次のアクション

1. [ ] 各フェーズのタスクファイル（phase1〜phase4.md）を作成
2. [ ] Phase 1のタスク実行を開始
3. [ ] 開発環境のセットアップを完了
4. [ ] 最初のマイルストーン（M1-1）を達成

---

**📌 重要**: このファイルはプロジェクト全体の進捗管理のマスタードキュメントです。各フェーズ完了時にこのファイルのチェックボックスを更新してください。
