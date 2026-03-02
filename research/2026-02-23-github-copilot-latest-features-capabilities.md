# GitHub Copilot 最新機能調査（開発体験別）

調査日: 2026-02-23

## 前提
- 根拠は GitHub 公式情報（GitHub Docs / GitHub Blog Changelog）のみ。
- 以下は、取得できた公式ページに明示された事実のみを整理。

## 1) IDE補完
- **主要機能**: インライン補完（コード提案）、代替候補、部分受け入れ、次編集提案（Next edit suggestions）。
- **可用性（プラン）**:
  - インライン補完: Free は月 2000 completions、Pro/Pro+/Business/Enterprise は利用可（上限設計はプラン表に準拠）。[^1]
  - Next edit suggestions: 全プランで利用可。[^1]
- **対応IDE（公式明記）**:
  - インライン補完: VS Code / Visual Studio / JetBrains / Azure Data Studio / Xcode / Vim/Neovim / Eclipse。[^1]
  - Next edit suggestions（公開プレビュー）: VS Code / Xcode / Eclipse。[^2]
- **必要条件・制約**:
  - 例として VS Code では Copilot Free もしくは有料プランでアクセス可能。初回セットアップ時は必要拡張が自動導入される。[^3]

## 2) チャット（IDE・GitHub.com ほか）
- **主要機能**: Copilot Chat（質問応答、対話的支援）。
- **提供面**: GitHub Web、GitHub Mobile、対応IDE（VS Code / Visual Studio / JetBrains / Eclipse / Xcode）、Windows Terminal。[^2]
- **可用性（プラン）**:
  - IDE上の Copilot Chat: Free は月 50 メッセージ、他プランは無制限（included models 範囲）。[^1]
  - Chat skills in IDEs: Free では未提供、Pro 以上で提供。[^1]
- **最新動向（Changelog）**:
  - GitHub Web の Copilot Chat で「ツール呼び出し表示」「JSON/Markdownエクスポート」が追加。[^4]

## 3) エージェント / 自律実行
- **主要機能**: Copilot coding agent（非同期・クラウド上で作業し、PR作成まで実行）。[^5]
- **可用性（プラン）**:
  - Coding agent: Free 以外（Pro / Pro+ / Business / Enterprise）で利用可。[^1]
  - Agent mode: 全プランで提供。[^1]
- **必要条件・制約**:
  - Business/Enterprise は管理者によるポリシー有効化が必要。[^5]
  - Visual Studio から委譲する場合は Visual Studio 2026 の所定更新以上（Dec Update 18.1.0 以上）かつプレビュー設定有効化が必要。[^5]
- **最新動向（Changelog）**:
  - Business/Enterprise でも coding agent のモデル選択が利用可能化。管理者が対象モデルを有効化していない場合、モデルピッカーは表示されず Claude Sonnet 4.6 が自動選択される。[^6]
  - Windows project 対応、code referencing 対応など改善が継続。[^7]

## 4) CLI
- **主要機能**: Copilot CLI（コマンドラインから質問、ローカル変更支援、GitHub操作の一部）。
- **可用性（プラン）**: Copilot CLI は全プランで提供。[^1]
- **提供状態**: GitHub Docs の機能一覧では Copilot CLI は Public preview として記載。[^2]

## 5) PRレビュー / コードレビュー連携
- **主要機能**:
  - Copilot code review（AIレビュー提案）
  - Copilot pull request summaries（PR変更要約）
- **可用性（プラン）**:
  - Code review: Free は VS Code の「Review selection」のみ。Pro 以上は提供。[^1]
  - PR summaries: Free では未提供、Pro 以上で提供。[^1]
- **制約**: code review 関連の一部ツールは Public preview（変更される可能性あり）。[^2]

## 6) テスト生成
- **公式上の位置づけ**:
  - 収集できた最新の機能比較（Plans/Features）では、**テスト生成が独立した課金機能としては明示されていない**。
  - 実務上は Copilot Chat/IDE補完を通じたテスト作成支援として扱われる構成。[^1][^2]
- **可用性・制約（読み替え）**:
  - 追加の専用エンタイトルメント要件は、少なくとも比較表には記載なし（Chat/IDE補完の利用条件に従う）。[^1]

## 7) ドキュメント生成
- **公式上の位置づけ**:
  - 収集できた最新の機能比較（Plans/Features）では、**ドキュメント生成が独立した課金機能としては明示されていない**。
  - Copilot Chatの利用シナリオとして実施する構成。
- **関連する最新事実（Changelog）**:
  - Visual Studio 2026 更新で、Copilot Chat 生成Markdownのプレビュー・編集導線（Preview）がStableで提供。[^8]
  - Web版Copilot Chatで会話をMarkdown/JSONへエクスポート可能。[^4]

## 付記（可用性の横断制約）
- Copilot は GitHub Enterprise Server では利用不可。[^1]
- 2026-02 時点の一部モデル・機能は Preview または段階提供（例: Claude Opus 4.6 fast mode preview、モデル追加/廃止）。[^9]

---

## 出典
[^1]: GitHub Docs, Plans for GitHub Copilot — https://docs.github.com/en/copilot/get-started/plans-for-github-copilot
[^2]: GitHub Docs（source）, GitHub Copilot features — https://raw.githubusercontent.com/github/docs/main/content/copilot/get-started/features.md
[^3]: GitHub Docs, Getting code suggestions in your IDE with GitHub Copilot — https://docs.github.com/en/copilot/using-github-copilot/getting-code-suggestions-in-your-ide-with-github-copilot
[^4]: GitHub Changelog, Showing tool calls and other improvements to Copilot chat on the web (2026-02-04) — https://github.blog/changelog/2026-02-04-showing-tool-calls-and-other-improvements-to-copilot-chat-on-the-web
[^5]: GitHub Changelog, Delegate tasks to Copilot coding agent from Visual Studio (2026-02-17) — https://github.blog/changelog/2026-02-17-delegate-tasks-to-copilot-coding-agent-from-visual-studio
[^6]: GitHub Changelog, Copilot coding agent model picker for Copilot Business and Enterprise (2026-02-19) — https://github.blog/changelog/2026-02-19-model-picker-for-copilot-coding-agent-for-copilot-business-and-enterprise-users
[^7]: GitHub Changelog index（Copilot項目、2026-02-18付近）— https://github.blog/changelog/
[^8]: GitHub Changelog, GitHub Copilot in Visual Studio — January update (2026-02-04) — https://github.blog/changelog/2026-02-04-github-copilot-in-visual-studio-january-update
[^9]: GitHub Changelog（例: GPT-5.3-Codex GA / Claude Opus 4.6 fast mode preview / model deprecations）— https://github.blog/changelog/
