# 贈る言葉BOT 技術設計書

## 概要

このディレクトリには贈る言葉BOTの包括的な技術設計文書が含まれています。

**生成日**: 2025-01-20
**生成ツール**: /tsumiki:kairo-design

## 設計文書一覧

### 1. [architecture.md](./architecture.md) - アーキテクチャ設計

システム全体のアーキテクチャ、技術選択、設計パターンを記載。

**主な内容**:
- システム概要とアーキテクチャパターン
- コンポーネント構成（フロントエンド、状態管理）
- ルーティング設計
- セキュリティアーキテクチャ
- パフォーマンス最適化戦略
- デプロイアーキテクチャ
- エラーハンドリング
- 拡張性設計

**対象読者**: アーキテクト、テックリード、実装エンジニア

### 2. [dataflow.md](./dataflow.md) - データフロー図

システム内のデータの流れ、ユーザージャーニー、状態遷移を可視化。

**主な内容**:
- システム全体のデータフロー
- ユーザージャーニー別フロー（送信者・受信者）
- データ構造と変換フロー
- 状態管理フロー（Context、LocalStorage）
- バリデーションフロー
- アニメーションフロー
- 画像生成フロー
- エラーハンドリングフロー

**対象読者**: 全エンジニア、QAエンジニア、デザイナー

### 3. [interfaces.ts](./interfaces.ts) - TypeScript型定義

プロジェクト全体で使用されるTypeScript型定義の完全なセット。

**主な内容**:
- エンティティ型定義（GiftWordData、ValidationErrors、ToastMessage等）
- コンポーネントProps型定義
- カスタムフック型定義
- Context型定義
- ユーティリティ型定義
- エラー型定義
- 定数定義
- 型ガード関数

**対象読者**: TypeScript実装エンジニア

**使用方法**:
```bash
# 実装時にsrc/types/index.tsにコピー
cp docs/design/gift-words/interfaces.ts src/types/index.ts
```

### 4. [component-design.md](./component-design.md) - コンポーネント設計

Reactコンポーネントの詳細設計、実装例、カスタムフック設計。

**主な内容**:
- コンポーネント階層とディレクトリ構造
- ページコンポーネント詳細（HomePage、DisplayPage）
- UIコンポーネント詳細（InputForm、VerticalTextDisplay等）
- カスタムフック詳細（useTypewriter、useImageExport等）
- 実装コード例（TypeScript + CSS）

**対象読者**: React実装エンジニア、フロントエンドエンジニア

## 設計の信頼性レベル

各設計項目には信頼性レベルを示しています：

- 🔵 **青信号**: 要件定義書・技術スタック定義に基づく確実な設計
- 🟡 **黄信号**: 要件から妥当な推測による設計
- 🔴 **赤信号**: 将来の拡張可能性として記載（現バージョンスコープ外）

## 主要な設計決定事項

### アーキテクチャ

1. **Client-Side Only Architecture**
   - バックエンドサーバー不要
   - データベース不要
   - GitHub Pages静的ホスティング
   - 理由: コスト最小化、シンプル化、制約条件（CONST-001, CONST-002）

2. **React + TypeScript + Vite**
   - モダンなフロントエンド構成
   - 型安全性の確保
   - 高速な開発サーバー
   - 理由: 将来の拡張性、開発効率、パフォーマンス

3. **Context API for State Management**
   - Reduxなど重いライブラリ不使用
   - 理由: 軽量プロジェクトに最適、学習コスト低

### データ永続化

1. **URLパラメータ方式**
   - Base64エンコード
   - 最大500文字制限
   - 理由: サーバー不要、シンプル、共有しやすい

2. **LocalStorage使用**
   - チュートリアル表示フラグのみ
   - 理由: ユーザー体験向上、最小限の永続化

### パフォーマンス最適化

1. **Code Splitting**
   - ルート単位での分割
   - html2canvas動的インポート
   - 理由: 初回読み込み高速化、500KB以下目標（NFR-003）

2. **CSS Animations優先**
   - GPU加速活用
   - 理由: 60fps維持（NFR-002）

### セキュリティ

1. **XSS対策**
   - Reactデフォルトエスケープ活用
   - dangerouslySetInnerHTML禁止
   - 理由: 基本的なWebセキュリティ確保（NFR-101/102/103）

2. **URL難読化**
   - Base64エンコード
   - 理由: 基本的なセキュリティ、簡単な改ざん防止（NFR-104）

## 技術制約

### 必須制約 🔵

- **バックエンド不可**: サーバーサイド処理不可（CONST-001）
- **DB不可**: データベース使用不可（CONST-002）
- **URL永続化のみ**: URLパラメータのみでデータ渡し（CONST-003）
- **GitHub Pages**: 静的ホスティングのみ（CONST-201）
- **モダンブラウザのみ**: Chrome, Firefox, Edge, Safari最新版（NFR-301）

### パフォーマンス制約 🔵

- **ページ読み込み**: 3秒以内（NFR-001）
- **アニメーションFPS**: 60fps以上（NFR-002）
- **バンドルサイズ**: 500KB以下（gzip圧縮後）（NFR-003）
- **Lighthouseスコア**: Performance 90+点（NFR-004）

### 機能制約 🔵

- **言葉**: 最大50文字（REQ-013）
- **意味**: 最大300文字（REQ-014）
- **URL**: 最大500文字（REQ-111）
- **タイプライター速度**: 100ms/文字（REQ-231）

## 実装ガイドライン

### 開発の開始

1. **プロジェクトセットアップ**
   ```bash
   npm create vite@latest gift-words-bot -- --template react-ts
   cd gift-words-bot
   npm install
   ```

2. **依存関係インストール**
   ```bash
   npm install react-router-dom html2canvas clsx
   npm install -D @types/node
   ```

3. **型定義コピー**
   ```bash
   mkdir src/types
   cp docs/design/gift-words/interfaces.ts src/types/index.ts
   ```

### ディレクトリ構造作成

```bash
mkdir -p src/{pages,components,hooks,contexts,utils,styles}
mkdir -p src/pages/{HomePage,DisplayPage,ErrorPage}
mkdir -p src/components/{InputForm,TutorialModal,ShareModal,DisplayContent,Toast,common}
```

### 実装順序

**Phase 1: 基本構造（Week 1）**
1. プロジェクトセットアップ
2. ルーティング設定（React Router）
3. 基本コンポーネント作成（HomePage、InputForm）
4. URLエンコーダー/デコーダー実装

**Phase 2: 表示機能（Week 2）**
1. DisplayPageレイアウト
2. 武田鉄矢画像配置
3. 縦書きテキスト表示
4. タイプライターアニメーション

**Phase 3: 画像保存（Week 3）**
1. html2canvas統合
2. 画像ダウンロード機能
3. レスポンシブデザイン調整

**Phase 4: 仕上げ（Week 4）**
1. エラーハンドリング
2. バリデーション強化
3. パフォーマンス最適化
4. GitHub Pagesデプロイ設定

詳細は [component-design.md](./component-design.md) を参照。

### テスト戦略

1. **単体テスト**: Vitest + @testing-library/react
   - ユーティリティ関数テスト
   - カスタムフックテスト
   - コンポーネントテスト

2. **統合テスト**: Vitest
   - ページ全体のフローテスト
   - URLエンコード/デコードのE2Eテスト

3. **E2Eテスト**: Playwright（オプション）
   - ユーザージャーニー全体のテスト

詳細は [gift-words-acceptance-criteria.md](../../spec/gift-words-acceptance-criteria.md) を参照。

## 関連文書

### 要件定義

- [📋 gift-words-requirements.md](../../spec/gift-words-requirements.md) - 機能要件・非機能要件
- [📖 gift-words-user-stories.md](../../spec/gift-words-user-stories.md) - ユーザストーリー
- [✅ gift-words-acceptance-criteria.md](../../spec/gift-words-acceptance-criteria.md) - 受け入れ基準

### 技術スタック

- [🔧 tech-stack.md](../../tech-stack.md) - 技術スタック定義

### プロジェクト全体

- [📘 CLAUDE.md](../../../CLAUDE.md) - プロジェクト概要・実装ガイド

## よくある質問（FAQ）

### Q1: なぜバックエンドを使わないのか？

**A**: 要件定義書の制約条件（CONST-001, CONST-002, CONST-003）により、バックエンドサーバーとデータベースを使用せず、URLパラメータのみでデータを渡す仕様となっています。これによりコスト最小化とデプロイの簡素化を実現しています。

### Q2: URLパラメータが長すぎる場合は？

**A**: URL長さは500文字（REQ-111）に制限されています。バリデーションで入力文字数を制限（言葉50文字、意味300文字）することで、Base64エンコード後も500文字以内に収まるよう設計されています。

### Q3: 画像の著作権・肖像権は？

**A**: 武田鉄矢の画像について適切な権利確認が必要です（CONST-101）。利用規約でプライベート使用限定を明記する必要があります（CONST-102）。

### Q4: 将来的にバックエンドを追加できるか？

**A**: 現在の設計は拡張性を考慮しているため、将来的にバックエンドAPIを追加することは可能です。その場合：
- URLパラメータ方式は維持（下位互換性）
- APIエンドポイント追加（履歴保存、認証等）
- データベース導入（過去の言葉保存等）

が考えられます。詳細は [architecture.md](./architecture.md) の「拡張性設計」セクションを参照。

### Q5: SEO対策は必要か？

**A**: 本プロジェクトは友達間で直接URLを共有する用途のため、SEO最適化は優先度が低いです。ただし、基本的なOGPタグ設定は推奨されます。

## トラブルシューティング

### 画像生成が失敗する

**原因**: html2canvasの互換性問題
**解決策**:
1. ブラウザがhtml2canvas v1.4.1+に対応しているか確認
2. 動的インポートが正しく機能しているか確認
3. CORSエラーがないか確認（武田鉄矢.png）

### タイプライターアニメーションがカクつく

**原因**: パフォーマンス問題
**解決策**:
1. `will-change: contents` を追加
2. CSS Animationsを優先使用
3. 長文の場合は速度調整（100ms → 80ms）

### URLが長すぎてエラーになる

**原因**: Base64エンコード後のURL長が500文字超過
**解決策**:
1. バリデーション設定を再確認
2. 文字数制限を厳格化（言葉40文字、意味250文字等）
3. エラーメッセージで分かりやすく通知

## 更新履歴

- 2025-01-20: 初回作成（/tsumiki:kairo-designにより生成）

## フィードバック

設計に関する質問や改善提案がある場合は、プロジェクトのIssueまたはPull Requestで連絡してください。
