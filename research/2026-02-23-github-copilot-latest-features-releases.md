# GitHub Copilot 最新機能（公式リリース調査）

- 調査日: 2026-02-23
- 対象期間: 2025-12-01 〜 2026-02-20（直近中心）
- 情報源方針: GitHub公式（Changelog / GitHub Blog / GitHub Docs）の一次情報のみ

## 直近の新機能一覧（2025-2026）

| 日付 | 機能名 | 提供状況 | 対応環境 | 一次情報 |
|---|---|---|---|---|
| 2026-02-20 | Organization-level Copilot usage metrics dashboard | Public Preview | GitHub（組織レベル指標） | https://github.blog/changelog/2026-02-20-organization-level-copilot-usage-metrics-dashboard-available-in-public-preview |
| 2026-02-19 | GitHub Copilot support in Zed | GA | Zed | https://github.blog/changelog/2026-02-19-github-copilot-support-in-zed-generally-available |
| 2026-02-19 | Gemini 3.1 Pro in GitHub Copilot | Public Preview | VS Code / Visual Studio / github.com / GitHub Mobile | https://github.blog/changelog/2026-02-19-gemini-3-1-pro-is-now-in-public-preview-in-github-copilot |
| 2026-02-19 | Copilot coding agent model picker（Business/Enterprise） | 一般提供（明示ステータス記載なし） | github.com / Agents tab / Agents panel / GitHub Mobile / Raycast | https://github.blog/changelog/2026-02-19-model-picker-for-copilot-coding-agent-for-copilot-business-and-enterprise-users |
| 2026-02-18 | Claude Opus 4.6 availability expansion | GA | github.com / GitHub Mobile / VS Code / Visual Studio / JetBrains IDEs / Xcode / Eclipse | https://github.blog/changelog/2026-02-18-claude-opus-4-6-is-now-available-in-visual-studio-jetbrains-ides-xcode-and-eclipse |
| 2026-02-18 | Copilot coding agent supports Windows projects | 一般提供（明示ステータス記載なし） | Copilot coding agent（Windows 実行環境） | https://github.blog/changelog/2026-02-18-use-copilot-coding-agent-with-windows-projects |
| 2026-02-18 | Copilot coding agent supports code referencing | 一般提供（明示ステータス記載なし） | Copilot coding agent session logs | https://github.blog/changelog/2026-02-18-copilot-coding-agent-supports-code-referencing |
| 2026-02-17 | Claude Sonnet 4.6 in GitHub Copilot | GA | VS Code / Visual Studio / github.com / GitHub Mobile / Copilot CLI / Copilot coding agent | https://github.blog/changelog/2026-02-17-claude-sonnet-4-6-is-now-generally-available-in-github-copilot |
| 2026-02-17 | Delegate tasks to Copilot coding agent from Visual Studio | Release | Visual Studio 2026（18.1.0+）[^n1] | https://github.blog/changelog/2026-02-17-delegate-tasks-to-copilot-coding-agent-from-visual-studio |
| 2026-02-09 | GPT-5.3-Codex in GitHub Copilot | GA | VS Code / GitHub Mobile / Copilot CLI / Copilot coding agent | https://github.blog/changelog/2026-02-09-gpt-5-3-codex-is-now-generally-available-for-github-copilot |
| 2026-02-07 | Fast mode for Claude Opus 4.6 | Public Preview（本文で research preview 記載あり）[^n2] | VS Code / Copilot CLI | https://github.blog/changelog/2026-02-07-claude-opus-4-6-fast-is-now-in-public-preview-for-github-copilot |
| 2026-02-04 | Claude and Codex coding agents on GitHub | Public Preview | github.com / GitHub Mobile / VS Code | https://github.blog/changelog/2026-02-04-claude-and-codex-are-now-available-in-public-preview-on-github |
| 2026-02-04 | Copilot Chat on the web: tool calls表示・JSON/Markdownエクスポート | Release（Improvementカテゴリ） | github.com（Copilot Chat） | https://github.blog/changelog/2026-02-04-showing-tool-calls-and-other-improvements-to-copilot-chat-on-the-web |
| 2025-12-19 | Copilot memory early access for Pro/Pro+ | Public Preview（early access表現） | Copilot coding agent / Copilot code review（Pro/Pro+） | https://github.blog/changelog/2025-12-19-copilot-memory-early-access-for-pro-and-pro |
| 2025-12-18 | GitHub Copilot now supports Agent Skills | Release | Copilot coding agent / Copilot CLI / VS Code Insiders agent mode[^n3] | https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills |
| 2025-12-17 | Gemini 3 Flash in GitHub Copilot | Public Preview | VS Code / github.com / GitHub Mobile | https://github.blog/changelog/2025-12-17-gemini-3-flash-is-now-in-public-preview-for-github-copilot |
| 2025-12-11 | OpenAI GPT-5.2 in GitHub Copilot | Public Preview | VS Code（1.104.1+）/ github.com / GitHub Mobile / Copilot CLI | https://github.blog/changelog/2025-12-11-openais-gpt-5-2-is-now-in-public-preview-for-github-copilot |
| 2025-12-10 | Auto model selection in GitHub Copilot for VS Code | GA | Visual Studio Code（全Copilotプラン） | https://github.blog/changelog/2025-12-10-auto-model-selection-is-generally-available-in-github-copilot-in-visual-studio-code |
| 2025-12-08 | Model picker for Copilot coding agent（Pro/Pro+） | Release | github.com / Raycast /（後続でVS Code・GitHub Mobile対応予定と記載）[^n4] | https://github.blog/changelog/2025-12-08-model-picker-for-copilot-coding-agent-for-copilot-pro-and-pro-subscribers |
| 2025-12-01 | Copilot Spaces: public spaces / individual sharing / code view support | Release | GitHub Copilot Spaces（github.com） | https://github.blog/changelog/2025-12-01-copilot-spaces-public-spaces-and-code-view-support |

## 公式ドキュメント（機能概念・設定）

- Copilot ドキュメントトップ: https://docs.github.com/en/copilot
- Agent Skills: https://docs.github.com/copilot/concepts/agents/about-agent-skills
- Copilot coding agent: https://docs.github.com/copilot/concepts/agents/coding-agent/about-coding-agent
- Copilot対応モデル: https://docs.github.com/copilot/reference/ai-models/supported-models
- Auto model selection: https://docs.github.com/copilot/concepts/auto-model-selection

## 脚注（一般的でない事実）

[^n1]: Visual StudioからのCopilot coding agent実行には、Changelog本文で「Visual Studio 2026 December Update 18.1.0以上」および preview 設定有効化が必要と記載。
[^n2]: 2026-02-07の同一記事で、タイトルは public preview、本文は research preview と記載。
[^n3]: Agent Skillsは公開時点で VS Code Insiders の agent mode に対応、stable は「early January」予定と記載。
[^n4]: 2025-12-08記事では model picker の対象は Pro/Pro+、Business/Enterprise は「coming soon」と記載（後に 2026-02-19 で展開）。
