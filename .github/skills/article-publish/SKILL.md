---
name: article-publish
description: Notion公開前確認とアップロード手順を定義するスキル
---

# Article Publish Skill

## 目的

完成記事をユーザー確認後にNotionへ安全に公開する。

## 手順

1. `articles/final/` の対象記事を列挙する。
2. `vscode/askQuestions` で以下を確認する。
   - 公開可否（はい/いいえ）
   - 公開先（親ページIDまたはデータソース）
   - 新規作成か既存更新か
3. Notion MCPで本文をアップロードする。
4. NotionページURL一覧を返却する。

## 受け入れ基準

- 公開前にユーザー確認済み。
- 記事タイトルと本文構成が元記事と一致。
- NotionページURLが返却される。
```
