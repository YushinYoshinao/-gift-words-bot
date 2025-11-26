# データフロー図

## 概要

このドキュメントは贈る言葉BOTのデータフロー全体を可視化します。

**【信頼性レベル】**: 🔵 要件定義書とユーザストーリーに基づいて作成

## システム全体のデータフロー

```mermaid
graph TB
    U[ユーザー] -->|1. アクセス| HP[HomePage]
    HP -->|2. 言葉入力| IF[InputForm]
    IF -->|3. バリデーション| V[Validation]
    V -->|OK| ENC[URL Encoder]
    V -->|NG| ERR1[Error Message]
    ERR1 --> IF

    ENC -->|4. Base64 URL生成| SM[ShareModal]
    SM -->|5. URLコピー| CB[Clipboard]
    CB -->|6. 共有| U

    U -->|7. 共有URL<br/>アクセス| DP[DisplayPage]
    DP -->|8. URLデコード| DEC[URL Decoder]
    DEC -->|9a. 成功| TD[TextDisplay]
    DEC -->|9b. 失敗| ERR2[Error Page]

    TD -->|10. タイプライター<br/>アニメーション| A[Animation]
    A -->|11. 完了| BTN[ActionButtons]

    BTN -->|12a. 画像保存| H2C[html2canvas]
    H2C -->|13. PNG生成| DL[Download]
    DL --> U

    BTN -->|12b. 新規作成| HP
```

## ユーザージャーニー別データフロー

### ジャーニー1: 言葉を作成して共有する 🔵

```mermaid
sequenceDiagram
    actor User as ユーザー（送信者）
    participant HP as HomePage
    participant TM as TutorialModal
    participant IF as InputForm
    participant Val as Validation
    participant Enc as URLEncoder
    participant SM as ShareModal
    participant CB as Clipboard API

    User->>HP: トップページアクセス
    HP->>HP: LocalStorage確認
    alt 初回訪問
        HP->>TM: チュートリアル表示
        TM-->>User: 使い方説明
        User->>TM: 「閉じる」クリック
        TM->>HP: LocalStorage更新
    end

    HP->>IF: 入力フォーム表示
    User->>IF: 言葉入力
    User->>IF: 意味入力

    IF->>Val: リアルタイムバリデーション
    alt バリデーションエラー
        Val-->>IF: エラーメッセージ表示
        IF-->>User: 赤枠 + エラー表示
    else バリデーション成功
        Val-->>IF: 送信ボタン有効化
    end

    User->>IF: 送信ボタンクリック
    IF->>Val: 最終バリデーション
    Val->>Enc: データ渡し
    Enc->>Enc: JSON.stringify()
    Enc->>Enc: encodeURIComponent()
    Enc->>Enc: btoa() (Base64)
    Enc->>SM: 共有URL生成

    SM-->>User: URLとコピーボタン表示
    User->>SM: コピーボタンクリック
    SM->>CB: navigator.clipboard.writeText()
    alt クリップボードAPI成功
        CB-->>SM: 成功
        SM-->>User: トースト「コピーしました」
    else クリップボードAPI失敗
        SM->>SM: URL選択状態
        SM-->>User: 手動コピー促すメッセージ
    end
```

### ジャーニー2: 贈られた言葉を見る 🔵

```mermaid
sequenceDiagram
    actor User as ユーザー（受信者）
    participant Browser as ブラウザ
    participant DP as DisplayPage
    participant Dec as URLDecoder
    participant Val as Validation
    participant TD as TextDisplay
    participant Anim as TypewriterAnimation
    participant Btn as ActionButtons
    participant H2C as html2canvas

    User->>Browser: 共有URLをタップ/クリック
    Browser->>DP: ページ読み込み
    DP->>Dec: URLパラメータ取得
    Dec->>Dec: atob() (Base64デコード)
    Dec->>Dec: decodeURIComponent()
    Dec->>Dec: JSON.parse()

    alt デコード成功
        Dec->>Val: デ���タ検証
        alt データ有効
            Val->>TD: 言葉と意味を渡す
            TD->>TD: 武田鉄矢画像表示
            TD->>Anim: アニメーション開始

            loop 各文字
                Anim->>Anim: 100ms待機
                Anim-->>User: 1文字表示
            end

            Anim-->>User: アニメーション完了

            alt ユーザーがクリック
                User->>Anim: クリック
                Anim->>TD: 全文即座表示
            end

            TD->>Btn: アクションボタン表示
        else データ無効
            Val->>DP: エラー表示
            DP-->>User: 「不正なURLです」
        end
    else デコード失敗
        Dec->>DP: エラー表示
        DP-->>User: 「URLが壊れています」
    end

    alt 画像保存
        User->>Btn: 保存ボタンクリック
        Btn->>H2C: 画像化リクエスト
        H2C->>H2C: DOM→Canvas変換
        H2C->>H2C: Canvas→PNG変換
        alt 画像生成成功
            H2C-->>Browser: 画像ダウンロード
            Browser-->>User: ファイル保存ダイアログ
        else 画像生成失敗
            H2C->>DP: エラー通知
            DP-->>User: トースト「保存に失敗しました」
        end
    end

    alt 新しい言葉を作成
        User->>Btn: 「新しい言葉を贈る」クリック
        Btn->>Browser: ルーティング変更
        Browser->>HP: トップページへ遷移
    end
```

## データ構造とフロー

### 入力データフロー 🔵

```mermaid
graph LR
    A[ユーザー入力] -->|1| B[InputForm State]
    B -->|2| C[Validation]
    C -->|3a OK| D[GiftWordData]
    C -->|3b NG| E[ValidationErrors]
    E --> B
    D -->|4| F[JSON.stringify]
    F -->|5| G[encodeURIComponent]
    G -->|6| H[btoa Base64]
    H -->|7| I[URL Parameter]
```

**データ変換例**:
```
Step 1: ユーザー入力
{
  word: "ありがとう",
  meaning: "いつも支えてくれてありがとう"
}

Step 2: JSON文字列化
'{"word":"ありがとう","meaning":"いつも支えてくれてありがとう"}'

Step 3: URIエンコード
'%7B%22word%22%3A%22%E3%81%82%E3%82%8A%E3%81%8C%E3%81%A8%E3%81%86%22...'

Step 4: Base64エンコード
'eyJ3b3JkIjoi44GC44KK44GM44Go44GGIiwibWVhbmluZyI6Iuato...'

Step 5: URL
'/display?data=eyJ3b3JkIjoi44GC44KK44GM44Go44GGIiwibWVhbmluZyI6Iuato...'
```

### 出力データフロー 🔵

```mermaid
graph LR
    A[URL Parameter] -->|1| B[atob Base64]
    B -->|2| C[decodeURIComponent]
    C -->|3| D[JSON.parse]
    D -->|4a Success| E[GiftWordData]
    D -->|4b Fail| F[ErrorState]
    E -->|5| G[TextDisplay]
    G -->|6| H[TypewriterAnimation]
    H -->|7| I[Rendered UI]
```

## 状態管理フロー

### Context Stateフロー 🔵

```mermaid
graph TB
    subgraph "AppContext"
        TS[TutorialState]
        TOS[ToastState]
    end

    subgraph "HomePage"
        HP[HomePage Component]
        IF[InputForm Component]
    end

    subgraph "DisplayPage"
        DP[DisplayPage Component]
        TD[TextDisplay Component]
    end

    TS -->|読み取り| HP
    HP -->|更新| TS

    TOS -->|読み取り| HP
    TOS -->|読み取り| DP
    IF -->|更新 トースト表示| TOS
    TD -->|更新 エラートースト| TOS
```

### ローカルストレージフロー 🔵

```mermaid
sequenceDiagram
    participant HP as HomePage
    participant LS as localStorage
    participant TM as TutorialModal

    HP->>LS: getItem('tutorial_shown')
    alt 初回訪問 (null)
        LS-->>HP: null
        HP->>TM: 表示
        TM->>LS: setItem('tutorial_shown', 'true')
    else 2回目以降 ('true')
        LS-->>HP: 'true'
        HP->>HP: チュートリアルスキップ
    end
```

## バリデーションフロー 🔵

```mermaid
graph TB
    A[ユーザー入力] -->|onChange| B{リアルタイム<br/>バリデーション}

    B -->|言葉| C{空文字?}
    C -->|Yes| D[エラー: 必須項目]
    C -->|No| E{50文字超?}
    E -->|Yes| F[エラー: 文字数制限]
    E -->|No| G[OK]

    B -->|意味| H{空文字?}
    H -->|Yes| I[エラー: 必須項目]
    H -->|No| J{300文字超?}
    J -->|Yes| K[エラー: 文字数制限]
    J -->|No| L[OK]

    D --> M[送信ボタン無効]
    F --> M
    I --> M
    K --> M

    G --> N{すべてOK?}
    L --> N
    N -->|Yes| O[送信ボタン有効]
    N -->|No| M
```

## アニメーションフロー 🔵

### タイプライターアニメーション 🔵

```mermaid
stateDiagram-v2
    [*] --> Initializing: ページ読み込み
    Initializing --> AnimatingWord: アニメーション開始

    state AnimatingWord {
        [*] --> ShowChar
        ShowChar --> Wait: 文字表示
        Wait --> ShowChar: 100ms後、次の文字
        Wait --> [*]: 全文字表示完了
    }

    AnimatingWord --> AnimatingMeaning: 言葉完了

    state AnimatingMeaning {
        [*] --> ShowChar2
        ShowChar2 --> Wait2: 文字表示
        Wait2 --> ShowChar2: 100ms後、次の文字
        Wait2 --> [*]: 全文字表示完了
    }

    AnimatingMeaning --> Completed: 意味完了

    AnimatingWord --> Completed: クリックでスキップ
    AnimatingMeaning --> Completed: クリックでスキップ

    Completed --> [*]
```

## 画像生成フロー 🔵

```mermaid
graph TB
    A[画像保存ボタン<br/>クリック] -->|1| B{html2canvas<br/>ロード済み?}

    B -->|No| C[動的インポート<br/>import html2canvas]
    C --> D[html2canvas関数取得]

    B -->|Yes| D

    D -->|2| E[DOM要素取得<br/>.display-container]
    E -->|3| F[html2canvas実行]

    F -->|4| G{Canvas生成<br/>成功?}

    G -->|Yes| H[Canvas→DataURL変換<br/>toDataURL 'image/png']
    H -->|5| I[<a>要素作成]
    I -->|6| J[download属性設定<br/>gift-words-YYYYMMDD.png]
    J -->|7| K[href設定 DataURL]
    K -->|8| L[click イベント発火]
    L -->|9| M[ブラウザダウンロード]
    M --> N[成功<br/>ダウンロード完了]

    G -->|No| O[エラーハンドリング]
    O --> P[トースト表示<br/>「保存に失敗しました」]
```

## エラーハンドリングフロー 🔵

```mermaid
graph TB
    A[エラー発生] --> B{エラー種別}

    B -->|バリデーションエラー| C[ValidationError]
    C --> D[インラインメッセージ表示]
    D --> E[エラー箇所赤枠]
    E --> F[送信ボタン無効化]

    B -->|URLデコードエラー| G[DecodeError]
    G --> H[エラーページ表示]
    H --> I[「URLが不正です」メッセージ]
    I --> J[トップページへ戻るリンク]

    B -->|画像生成エラー| K[ImageExportError]
    K --> L[トースト表示]
    L --> M[「保存に失敗しました」]
    M --> N[再試行を促す]

    B -->|ネットワークエラー| O[NetworkError]
    O --> L

    B -->|ブラウザ非対応エラー| P[BrowserCompatError]
    P --> Q[警告メッセージ表示]
    Q --> R[代替手段提示]
```

## 非同期処理フロー

### 動的インポートフロー 🟡

```mermaid
sequenceDiagram
    participant User
    participant Btn as SaveButton
    participant Loader as Dynamic Loader
    participant H2C as html2canvas
    participant Browser

    User->>Btn: 保存ボタンクリック
    Btn->>Loader: import('html2canvas')

    alt 初回ロード
        Loader->>Browser: html2canvas.js フェッチ
        Browser-->>Loader: スクリプト取得
        Loader->>Loader: モジュール評価
        Loader-->>H2C: html2canvas関数
    else キャッシュ済み
        Loader-->>H2C: 即座に返却
    end

    H2C->>H2C: DOM→Canvas変換
    H2C-->>Btn: Canvas
    Btn->>Browser: ダウンロード実行
```

## レスポンシブフロー 🔵

### デバイス別レンダリングフロー

```mermaid
graph TB
    A[ページ読み込み] --> B{画面幅判定}

    B -->|< 768px| C[モバイル縦]
    C --> D[縦長レイアウト]
    D --> E[黒板上部<br/>テキスト下部]

    B -->|>= 769px<br/>横向き| F[モバイル横/タブレット]
    F --> G[PC版レイアウト]
    G --> H[武田鉄矢右側<br/>テキスト左側]

    B -->|>= 1024px| I[PC]
    I --> G

    E --> J[レンダリング]
    H --> J

    J --> K{画面回転?}
    K -->|Yes| B
    K -->|No| L[表示維持]
```

## パフォーマンス最適化フロー

### Code Splittingフロー 🟡

```mermaid
graph LR
    A[初回アクセス] --> B[メインバンドル読み込み]
    B --> C[App + HomePage]

    D[/displayへ遷移] --> E{DisplayPageロード済み?}
    E -->|No| F[DisplayPage chunk読み込み]
    F --> G[DisplayPage表示]
    E -->|Yes| G

    H[画像保存クリック] --> I{html2canvasロード済み?}
    I -->|No| J[html2canvas chunk読み込み]
    J --> K[画像生成実行]
    I -->|Yes| K
```

## 更新履歴

- 2025-01-20: 初回作成（/tsumiki:kairo-designにより生成）
