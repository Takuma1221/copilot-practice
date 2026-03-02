# AGENTS

## 一覧

- `article.orchestrator` (🧭): テーマ受領、並列執筆依頼、レビュー反復、最終報告。
- `article.writer` (✍️): MCP検索、テンプレ準拠執筆、出典付き下書き作成。
- `article.publisher` (📝): askQuestionsで最終確認後、Notionへ記事公開。

## ワークフロー

1. `article.orchestrator` がテーマ受領。
2. `article-main-skill` に従い `article.writer` を並列起動。
3. 下書きを `article-review-skill` で採点。
4. 未達記事のみ再度 `article.writer` へ修正依頼。
5. 全記事合格後、`askQuestions` でNotion公開可否を確認。
6. 承認時のみ `article.publisher` がNotionへ公開。
7. 最終概要とNotion URL一覧をユーザー報告。

## 成果物

- 下書き: `articles/drafts/`
- 完成稿: `articles/final/`
- 公開先: Notion（任意）
- 参照テンプレ: `TEMPLATE.md`

## 受け入れ基準

- 各記事 85/100 以上。
- 出典URLと更新日が記載済み。
- テンプレート構成を維持。
- Notion公開前にユーザー確認済み。
