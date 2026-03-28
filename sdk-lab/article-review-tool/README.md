# Copilot SDK Article Review Tool

Copilot SDK の最小構成を理解するための検証ディレクトリです。

## 含まれるもの

- `src/first-message.ts`: 最初の 1 メッセージ送信サンプル
- `src/streaming-demo.ts`: streaming 応答の確認サンプル
- `src/review.ts`: `articles/final/` を対象にした read-only 記事レビュー実装

## 前提

- Node.js 18 以上
- `copilot --version` が通る
- Copilot CLI へログイン済み

## セットアップ

```bash
npm install
```

## 実行

最初のメッセージ送信:

```bash
npm run first-message
```

streaming の確認:

```bash
npm run stream-demo
```

記事レビュー:

```bash
npm run review
```

必要なら review でも streaming を有効化できます。

```bash
COPILOT_STREAMING=true npm run review
```

## 実装方針

- 既存の `TEMPLATE.md` と `.github/skills/article-review/SKILL.md` を入力として読む
- ファイル変更や Git 操作はしない
- 出力は JSON を正とする
- 最初の版では真偽判定を厳密にやらず、構成、更新日、根拠 URL、実用性を先に見る