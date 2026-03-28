# SDK 記事レビュー補助ツール設計

## 目的

Copilot SDK の最初の題材として、`articles/final/` 配下の Markdown 記事を read-only でレビューし、構造化された指摘を返すツールを作る。

このツールは、既存の [TEMPLATE.md](TEMPLATE.md) と [.github/skills/article-review/SKILL.md](.github/skills/article-review/SKILL.md) を前提にする。

最初の目的は、自動修正ではなく、レビュー結果を JSON で安定して返すこと。

## この題材を選ぶ理由

- 既存リポジトリのワークフローと直接つながる
- read-only で成立する
- テンプレートと評価観点がすでに定義済み
- SDK の入出力設計を学ぶ題材として小さい

## スコープ

このツールがやること:

- 対象ディレクトリ内の Markdown 記事を読む
- テンプレート欠落を検出する
- レビュー観点に沿って指摘を返す
- 機械可読な JSON を返す

このツールがやらないこと:

- ファイルの自動修正
- 記事の自動再執筆
- Notion 公開
- Git 操作
- Web 検索による事実検証の自動実行

## 入力

最初のバージョンでは入力を最小限にする。

### 必須入力

- `targetDir`: レビュー対象ディレクトリ

### 任意入力

- `templatePath`: テンプレートファイルのパス
- `reviewCriteriaPath`: レビュー基準ファイルのパス
- `maxFindingsPerFile`: 1ファイルあたりの指摘件数上限
- `focus`: 特に重視する観点の配列

## 入力の初期値

このリポジトリ用の初期値は次の通り。

```json
{
  "targetDir": "articles/final",
  "templatePath": "TEMPLATE.md",
  "reviewCriteriaPath": ".github/skills/article-review/SKILL.md",
  "maxFindingsPerFile": 5,
  "focus": ["facts", "freshness", "structure", "template", "practicality"]
}
```

## 出力

出力は JSON のみを正とする。人間向けの文章要約は後回しでよい。

### 出力トップレベル

- `summary`: 全体サマリー
- `results`: ファイルごとのレビュー結果配列

### `summary`

- `filesReviewed`: レビューしたファイル数
- `totalFindings`: 指摘総数
- `passCount`: 合格件数
- `conditionalPassCount`: 条件付き合格件数
- `failCount`: 不合格件数

### `results[]`

- `file`: 対象ファイル
- `score`: 100 点換算の総合点
- `verdict`: `pass` | `conditional-pass` | `fail`
- `categoryScores`: 観点別スコア
- `findings`: 指摘配列

### `categoryScores`

- `facts`
- `freshness`
- `structure`
- `template`
- `practicality`

### `findings[]`

- `severity`: `high` | `medium` | `low`
- `category`: `facts` | `freshness` | `structure` | `template` | `practicality`
- `issue`: 問題の短い要約
- `reason`: なぜ問題か
- `suggestion`: 最小の改善案
- `evidence`: 問題箇所の抜粋または根拠

## 出力例

```json
{
  "summary": {
    "filesReviewed": 3,
    "totalFindings": 4,
    "passCount": 2,
    "conditionalPassCount": 1,
    "failCount": 0
  },
  "results": [
    {
      "file": "articles/final/nextjs-overview.md",
      "score": 88,
      "verdict": "pass",
      "categoryScores": {
        "facts": 26,
        "freshness": 18,
        "structure": 18,
        "template": 18,
        "practicality": 8
      },
      "findings": [
        {
          "severity": "medium",
          "category": "freshness",
          "issue": "一部のバージョン情報が将来更新で古くなる可能性が高い",
          "reason": "リリース系の情報は変化が早く、本文に更新条件がないと陳腐化しやすい",
          "suggestion": "更新前提の注記を入れるか、変更が多い情報は要点だけに絞る",
          "evidence": "2026年2月時点のバージョン状況を本文中で詳しく列挙している"
        }
      ]
    }
  ]
}
```

## 判定ルール

既存のレビュー基準に合わせる。

- 85 点以上: `pass`
- 70 から 84 点: `conditional-pass`
- 69 点以下: `fail`

観点別の配点は次を引き継ぐ。

- `facts`: 30
- `freshness`: 20
- `structure`: 20
- `template`: 20
- `practicality`: 10

## 最初の実装で見る観点

最初のバージョンでは、全部を深くやらない。検出しやすいものから始める。

### `template`

- タイトルがあるか
- 概要があるか
- 背景と課題があるか
- 本論があるか
- まとめがあるか
- 参考情報があるか
- 情報更新日があるか

### `freshness`

- 情報更新日があるか
- 更新日の形式が `YYYY-MM-DD` か

### `structure`

- 見出し構成がテンプレートから大きく崩れていないか
- 導入に対象読者と得られることがあるか

### `practicality`

- 手順または実装例に相当する節があるか
- 注意点 / 落とし穴があるか

### `facts`

最初のバージョンでは厳密な真偽判定まではやらない。
代わりに、根拠 URL があるか、断定調の記述が多いのに根拠節が弱くないかを軽く見る。

## 最初のバージョンで避けること

- Web 検索による一次情報照合
- セマンティックな真偽判定の自動化
- 記事本文の自動修正提案をそのままパッチ化すること
- 長い自然文だけを返して、構造化データを崩すこと

## 実装時の最低要件

- read-only であること
- 対象は Markdown のみであること
- 出力が毎回ほぼ同じ形になること
- 1ファイル失敗しても全体処理が止まりにくいこと

## この設計で次にやること

1. 検証ディレクトリ名を決める
2. SDK の最小サンプルを作る
3. 上記 JSON 形式を返す雛形を作る
4. その後で `articles/final/` に対して実行する