# Copilot SDK Article Review Tool 解説

## これは何か

このディレクトリは、Copilot SDK を理解するために作った最小の検証用プロジェクトです。

目的は 3 つあります。

- Copilot SDK の最小利用形を知る
- streaming 応答の扱い方を知る
- 実際のリポジトリを題材に、read-only のレビュー処理を完成品として見る

このプロジェクトは、Copilot CLI のログイン状態を前提にして、Node.js / TypeScript から Copilot SDK を呼び出しています。

## 何を作ったか

### 1. 最初の 1 メッセージ送信

[src/first-message.ts](src/first-message.ts)

これは最小サンプルです。
`CopilotClient` を作り、セッションを張り、1 回プロンプトを投げて、応答を表示して終了します。

ここで見るポイント:

- `CopilotClient` の作り方
- `createSession()` の呼び方
- `sendAndWait()` で同期的に結果を受ける形
- `approveAll` を `onPermissionRequest` に渡す必要があること

### 2. streaming 応答の確認

[src/streaming-demo.ts](src/streaming-demo.ts)

これは SDK のイベント駆動を見るためのサンプルです。
`streaming: true` を付け、`assistant.message_delta` を購読して、途中の文字列を順次表示しています。

ここで見るポイント:

- 完成文ではなく、生成途中の断片を受け取れること
- `session.on(...)` でイベントを監視すること
- `session.idle` で処理完了の区切りを取ること

### 3. 記事レビューの完成版

[src/review.ts](src/review.ts)

これが今回のメインです。
`articles/final/` 配下の Markdown 記事を読み、Copilot SDK にファイルごとのレビューをさせ、最終的に JSON にまとめて返します。

ここで見るポイント:

- リポジトリ内のファイルを TypeScript 側で読む部分
- モデルへのプロンプト生成部分
- 1 ファイルずつ短いセッションで処理する設計
- モデルの壊れた JSON に対する修復リトライ
- 最後にローカルで集計して `summary` を作る部分

## ディレクトリ構成

```text
sdk-lab/article-review-tool/
├── EXPLANATION.md
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
└── src/
    ├── config.ts
    ├── first-message.ts
    ├── review.ts
    ├── streaming-demo.ts
    ├── types.ts
    └── utils.ts
```

## 各ファイルの役割

### [package.json](package.json)

依存関係と実行コマンドを持ちます。

- `npm run first-message`
- `npm run stream-demo`
- `npm run review`

### [src/config.ts](src/config.ts)

レビュー対象ディレクトリ、テンプレートパス、モデル名などの初期設定です。
まずここを見れば、「どこをレビューするツールなのか」がわかります。

### [src/types.ts](src/types.ts)

レビュー結果の JSON スキーマです。
Zod を使って、モデルが返した JSON を検証しています。

このファイルを見ると、最終的にどういう出力を正としているかがわかります。

### [src/utils.ts](src/utils.ts)

ファイル列挙、ファイル読込、相対パス変換、JSON 抽出などの補助関数です。
ここは SDK そのものではなく、普通の TypeScript 側の下支えです。

### [src/review.ts](src/review.ts)

このツールの本体です。

処理の流れは次の通りです。

1. `articles/final/` の Markdown 一覧を集める
2. `TEMPLATE.md` とレビュー基準を読む
3. 各ファイルを 1 件ずつ SDK に渡す
4. JSON をパースしてスキーマ検証する
5. 全ファイル結果を集計して最終 JSON を出す

## どこが SDK 部分か

このプロジェクトを読むときは、「SDK 部分」と「普通の TypeScript 部分」を分けて見ると理解しやすいです。

### SDK 部分

- `new CopilotClient(...)`
- `client.createSession(...)`
- `session.on(...)`
- `session.sendAndWait(...)`
- `session.disconnect()`
- `client.stop()`

### 普通の TypeScript 部分

- Markdown ファイルを列挙する
- プロンプト文字列を組み立てる
- JSON をパースする
- Zod で検証する
- 複数ファイル結果を集計する

この切り分けができると、「SDK が何を担当していて、自分のコードが何を担当しているか」が見やすくなります。

## 使い方

前提:

- Node.js 18 以上
- `copilot --version` が通る
- Copilot CLI にログイン済み

インストール:

```bash
cd sdk-lab/article-review-tool
npm install
```

最小サンプル:

```bash
npm run first-message
```

streaming デモ:

```bash
npm run stream-demo
```

記事レビュー:

```bash
npm run review
```

review を streaming 付きで見たい場合:

```bash
COPILOT_STREAMING=true npm run review
```

## 今回の実装上の判断

### 1. read-only に限定している

最初の SDK 題材としては、編集や Git 操作を入れない方が理解しやすいからです。

### 2. 1 ファイルずつレビューしている

3 記事を一度に流すとプロンプトが長くなり、タイムアウトしやすかったためです。
そのため、各ファイルを短いセッションでレビューし、最後にローカルで集計しています。

### 3. JSON 修復リトライを入れている

モデル出力はたまに不正な JSON になります。
教材として毎回壊れると学びにくいので、1 回だけ JSON 修復用の再問い合わせを入れています。

## どこから読むのがよいか

理解の順番としては次が自然です。

1. [src/first-message.ts](src/first-message.ts)
2. [src/streaming-demo.ts](src/streaming-demo.ts)
3. [src/types.ts](src/types.ts)
4. [src/review.ts](src/review.ts)
5. [src/utils.ts](src/utils.ts)

## 次にやると良いこと

この完成品を理解したあとに、次に進むなら次のどちらかです。

1. `review.ts` の一部をローカルロジックに寄せて、モデル依存を減らす
2. 同じ構造で TEMPLATE 準拠チェック専用ツールを作る