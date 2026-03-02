# GitHub Copilot 最新機能調査

- 調査日: 2026-02-23
- 取得時点: 2026-02-23（JST）
- 最終確認日: 2026-02-23（JST）
- 情報源: GitHub公式（GitHub Docs / GitHub Blog Changelog / GitHub公式Pricing・Plans）

## 1. 直近の主要アップデート（2025-12〜2026-02）

- 2026-02-20: 組織レベルの Copilot 利用メトリクスダッシュボードが Public Preview で提供開始。[^1]
- 2026-02-19: Copilot coding agent のモデル選択が Copilot Business/Enterprise でも利用可能。[^2]
- 2026-02-19: 一部の Anthropic / OpenAI モデルが deprecated（Retired）として告知。[^24]
- 2026-02-19: GitHub Copilot が Zed で Generally Available。[^3]
- 2026-02-19: Gemini 3.1 Pro が GitHub Copilot で Public Preview。[^4]
- 2026-02-18: Copilot coding agent が Windows プロジェクト対応（GitHub Actionsベース）。[^25]
- 2026-02-18: Copilot coding agent が code referencing に対応。[^26]
- 2026-02-18: Claude Opus 4.6 が Visual Studio / JetBrains / Xcode / Eclipse でも利用可能化。[^27]
- 2026-02-17: Claude Sonnet 4.6 が GitHub Copilot で GA。[^5]
- 2026-02-17: Eclipse 向け Copilot で MCP Registry 関連改善。[^28]
- 2026-02-09: GPT-5.3-Codex が GitHub Copilot で GA。[^6]
- 2026-02-07: Claude Opus 4.6 Fast mode が Preview として提供。[^31]
- 2026-02-05: Claude Opus 4.6 が GitHub Copilot で GA。[^29]
- 2026-02-04: Claude/Codex エージェントが GitHub で Public Preview。[^30]
- 2026-02-04: Web版 Copilot Chat で tool calls 表示と JSON/Markdown エクスポートが追加。[^7]
- 2025-12-19: Copilot memory early access（Pro/Pro+）が案内。[^32]
- 2025-12-18: Agent Skills が GitHub Copilot でサポート開始。[^8]
- 2025-12-17: Gemini 3 Flash が Public Preview。[^33]
- 2025-12-11: GPT-5.2 が Public Preview。[^34]
- 2025-12-10: VS Code の Copilot で Auto model selection が GA。[^9]
- 2025-12-08: Pro/Pro+ 向けに coding agent の model picker が提供。[^35]
- 2025-12-01: Copilot Spaces の public spaces / sharing / code view support が提供。[^36]

## 2. 機能カテゴリ別の現況（公式記載ベース）

### IDE補完
- インライン補完、候補切替、部分受け入れ、次編集提案（Next edit suggestions）が提供される。[^10]
- Next edit suggestions は全プランで利用可能と記載される。[^11]

### Copilot Chat
- Copilot Chat は IDE、GitHub.com、GitHub Mobile、Windows Terminal 等で提供される。[^10]
- Free は月50メッセージ、Pro/Pro+/Business/Enterprise は included models 範囲で無制限と記載される。[^11]
- 同時に premium requests やモデル別提供状況、Preview 状態などの条件差分がある。[^11][^19]

### エージェント機能
- Copilot coding agent は Free 以外のプラン（Pro/Pro+/Business/Enterprise）で提供される。[^11]
- Business/Enterprise では管理者ポリシー有効化が前提となる機能がある。[^12]

### CLI
- Copilot CLI は Linux/macOS/Windows（PowerShell・WSL）をサポート。[^13]
- 旧 GitHub CLI Copilot extension は retired とされ、新しい Copilot CLI への移行が示される。[^13]

### PR/レビュー
- Copilot code review、PR summaries が機能一覧に含まれる。[^10][^11]
- 一部機能は Public Preview の記載があり、提供条件が変更される可能性がある。[^10]

## 3. モデル・対応環境・管理ポリシー

- Copilot Chat の Auto model selection は全プラン対象。coding agent 側の Auto は Pro/Pro+ が対象。[^14]
- Auto model selection は手動モデル選択で上書き可能。[^14]
- Copilot CLI の既定モデルは Claude Sonnet 4.5、`/model` または `--model` で切替可能。[^13][^15]
- Enterprise/Organization では Feature policy・Privacy policy・Models policy の管理が可能。[^16]
- Enterprise レベルで明示設定されたポリシーは Organization で上書き不可。[^17]
- Content exclusion は repository/organization/enterprise で設定可能だが、Copilot CLI・coding agent・IDE Agent mode は非対応。[^18]
- 2026-02-18時点で coding agent の code referencing では、公開コード一致時にセッションログへ参照元リンクとライセンス関連情報が表示される。[^26]

## 4. 料金プラン・提供形態（2026-02-23時点の表示）

- Individual: Free（$0）、Pro（$10/月 or $100/年）、Pro+（$39/月 or $390/年）。[^19]
- Business: $19/ユーザー/月、Enterprise: $39/ユーザー/月。[^19][^20]
- Pro は 30日無料トライアルが明記される。[^21]
- 追加 premium requests 購入オプションは、GitHub Mobile（iOS/Android）経由で Pro/Pro+ を契約したユーザーには提供されない旨が脚注で明記される。[^22]
- 高負荷時は応答時間変動・レート制限対象となる可能性が脚注で明記される。[^23]
- [^22][^23] は同一ページ内脚注の要旨であり、取得時点表示に基づく。[^19]
- [^22] の要旨: 追加 premium requests 購入は、iOS/Android の GitHub Mobile 経由で Pro/Pro+ を契約した（または契約していた）ユーザーは対象外。[^19]
- [^23] の要旨: 高負荷時には応答遅延やリクエスト制限が発生する可能性。[^19]

## 5. 出典

[^1]: GitHub Changelog, 2026-02-20, Organization-level Copilot usage metrics dashboard (Public Preview): https://github.blog/changelog/2026-02-20-organization-level-copilot-usage-metrics-dashboard-available-in-public-preview
[^2]: GitHub Changelog, 2026-02-19, Model picker for Copilot coding agent for Business/Enterprise: https://github.blog/changelog/2026-02-19-model-picker-for-copilot-coding-agent-for-copilot-business-and-enterprise-users
[^3]: GitHub Changelog, 2026-02-19, GitHub Copilot support in Zed GA: https://github.blog/changelog/2026-02-19-github-copilot-support-in-zed-generally-available
[^4]: GitHub Changelog, 2026-02-19, Gemini 3.1 Pro in Public Preview: https://github.blog/changelog/2026-02-19-gemini-3-1-pro-is-now-in-public-preview-in-github-copilot
[^5]: GitHub Changelog, 2026-02-17, Claude Sonnet 4.6 GA: https://github.blog/changelog/2026-02-17-claude-sonnet-4-6-is-now-generally-available-in-github-copilot
[^6]: GitHub Changelog, 2026-02-09, GPT-5.3-Codex GA: https://github.blog/changelog/2026-02-09-gpt-5-3-codex-is-now-generally-available-for-github-copilot
[^7]: GitHub Changelog, 2026-02-04, Copilot chat on the web improvements: https://github.blog/changelog/2026-02-04-showing-tool-calls-and-other-improvements-to-copilot-chat-on-the-web
[^8]: GitHub Changelog, 2025-12-18, Agent Skills support: https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills
[^9]: GitHub Changelog, 2025-12-10, Auto model selection GA in VS Code: https://github.blog/changelog/2025-12-10-auto-model-selection-is-generally-available-in-github-copilot-in-visual-studio-code
[^10]: GitHub Docs（source）, Copilot features: https://raw.githubusercontent.com/github/docs/main/content/copilot/get-started/features.md
[^11]: GitHub Docs, Plans for GitHub Copilot: https://docs.github.com/en/copilot/get-started/plans-for-github-copilot
[^12]: GitHub Docs, About coding agent: https://docs.github.com/copilot/concepts/agents/coding-agent/about-coding-agent
[^13]: GitHub Docs（source）, About Copilot CLI: https://github.com/github/docs/blob/main/content/copilot/concepts/agents/copilot-cli/about-copilot-cli.md
[^14]: GitHub Docs（source）, Auto model selection: https://github.com/github/docs/blob/main/content/copilot/concepts/auto-model-selection.md
[^15]: GitHub Docs（source）, Supported models: https://github.com/github/docs/blob/main/content/copilot/reference/ai-models/supported-models.md
[^16]: GitHub Docs（source）, Copilot policies concepts: https://github.com/github/docs/blob/main/content/copilot/concepts/policies.md
[^17]: GitHub Docs（source）, Enterprise-overrides-organization reusable: https://github.com/github/docs/blob/main/data/reusables/organizations/copilot-policy-ent-overrides-org.md
[^18]: GitHub Docs（source）, Exclude content from Copilot: https://github.com/github/docs/blob/main/content/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot.md
[^19]: GitHub Copilot plans (individual/business views): https://github.com/features/copilot/plans
[^20]: GitHub Pricing: https://github.com/pricing
[^21]: GitHub Copilot Pro page (30-day trial): https://github.com/github-copilot/pro
[^22]: GitHub Copilot plans footnote, premium requests add-on restriction for mobile-contracted users: https://github.com/features/copilot/plans
[^23]: GitHub Copilot plans footnote, possible response variability/rate limits at peak times: https://github.com/features/copilot/plans
[^24]: GitHub Changelog, 2026-02-19, Selected Anthropic and OpenAI models are now deprecated: https://github.blog/changelog/2026-02-19-selected-anthropic-and-openai-models-are-now-deprecated
[^25]: GitHub Changelog, 2026-02-18, Use Copilot coding agent with Windows projects: https://github.blog/changelog/2026-02-18-use-copilot-coding-agent-with-windows-projects
[^26]: GitHub Changelog, 2026-02-18, Copilot coding agent supports code referencing: https://github.blog/changelog/2026-02-18-copilot-coding-agent-supports-code-referencing
[^27]: GitHub Changelog, 2026-02-18, Claude Opus 4.6 in Visual Studio/JetBrains/Xcode/Eclipse: https://github.blog/changelog/2026-02-18-claude-opus-4-6-is-now-available-in-visual-studio-jetbrains-ides-xcode-and-eclipse
[^28]: GitHub Changelog, 2026-02-17, MCP Registry improvements in Copilot in Eclipse: https://github.blog/changelog/2026-02-17-mcp-registry-and-more-improvements-in-copilot-in-eclipse
[^29]: GitHub Changelog, 2026-02-05, Claude Opus 4.6 GA for GitHub Copilot: https://github.blog/changelog/2026-02-05-claude-opus-4-6-is-now-generally-available-for-github-copilot
[^30]: GitHub Changelog, 2026-02-04, Claude and Codex in public preview on GitHub: https://github.blog/changelog/2026-02-04-claude-and-codex-are-now-available-in-public-preview-on-github
[^31]: GitHub Changelog, 2026-02-07, Fast mode for Claude Opus 4.6 in preview: https://github.blog/changelog/2026-02-07-claude-opus-4-6-fast-is-now-in-public-preview-for-github-copilot
[^32]: GitHub Changelog, 2025-12-19, Copilot memory early access for Pro and Pro+: https://github.blog/changelog/2025-12-19-copilot-memory-early-access-for-pro-and-pro
[^33]: GitHub Changelog, 2025-12-17, Gemini 3 Flash in public preview: https://github.blog/changelog/2025-12-17-gemini-3-flash-is-now-in-public-preview-for-github-copilot
[^34]: GitHub Changelog, 2025-12-11, OpenAI GPT-5.2 in public preview: https://github.blog/changelog/2025-12-11-openais-gpt-5-2-is-now-in-public-preview-for-github-copilot
[^35]: GitHub Changelog, 2025-12-08, Model picker for coding agent for Pro/Pro+: https://github.blog/changelog/2025-12-08-model-picker-for-copilot-coding-agent-for-copilot-pro-and-pro-subscribers
[^36]: GitHub Changelog, 2025-12-01, Copilot Spaces updates: https://github.blog/changelog/2025-12-01-copilot-spaces-public-spaces-and-code-view-support
