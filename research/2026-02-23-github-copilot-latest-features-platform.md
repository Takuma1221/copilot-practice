# GitHub Copilot 最新機能調査（モデル選択・プラットフォーム対応・管理機能）

調査日: 2026-02-23

## 最新時点（公開日が明示された公式更新）

- 2026-02-20: Organization-level Copilot usage metrics dashboard が Public Preview で公開。
- 2026-02-19: Copilot coding agent の model picker が Copilot Business / Enterprise 向けに改善。
- 2026-02-19: 一部の Anthropic / OpenAI モデルが deprecated 化。
- 2026-02-09: GPT-5.3-Codex が GitHub Copilot で Generally Available。

出典: GitHub Changelog（Copilotラベル）
- https://github.blog/changelog/label/copilot/
- https://github.blog/changelog/

## 1) モデル選択（利用可能モデル）

- Copilot auto model selection は、Copilot Chat では全プランで利用可能。Copilot coding agent での Auto は Pro / Pro+ 向け。
- Auto model selection は、モデル可用性に基づき選択し、対象モデルは時間とともに変化し得る。
- Copilot Chat での Auto は VS Code で GA。Visual Studio / Eclipse / JetBrains / Xcode は Public Preview。
- Copilot Chat / coding agent いずれも、Auto選択を手動モデル選択で上書き可能。
- Copilot CLI の既定モデルは Claude Sonnet 4.5。`/model` または `--model` で変更可能。[^1]
- 公式変数定義上、Copilotのモデル識別子には GPT-4.1, GPT-5 mini, GPT-5.2-Codex, GPT-5.3-Codex, Claude Sonnet 4.5 などが含まれる。

主な出典:
- https://github.com/github/docs/blob/main/content/copilot/concepts/auto-model-selection.md
- https://github.com/github/docs/blob/main/content/copilot/reference/ai-models/supported-models.md
- https://github.com/github/docs/blob/main/content/copilot/concepts/agents/copilot-cli/about-copilot-cli.md
- https://raw.githubusercontent.com/github/docs/main/data/variables/copilot.yml

## 2) プラットフォーム対応（IDE / モバイル / CLI）

- IDE対応は「Copilot feature matrix」で管理され、最新IDE版を前提に機能ごとの対応（✓/✗/P）を提示。対象IDEは VS Code / Visual Studio / JetBrains / Eclipse / Xcode / NeoVim。
- GitHub Mobile では Copilot Chat を利用可能（一般質問、リポジトリ文脈、ファイル文脈、EnterpriseではPR/Issue/Discussion文脈の質問を含む）。
- モバイルでは premium request 上限到達時に free non-premium model へ自動フォールバックする。[^2]
- GitHub Copilot CLI の対応OSは Linux / macOS / Windows（PowerShell と WSL 内）。
- 旧「GitHub CLI Copilot extension」は retired で、新しい Copilot CLI に置換済み。

主な出典:
- https://github.com/github/docs/blob/main/content/copilot/reference/copilot-feature-matrix.md
- https://github.com/github/docs/blob/main/content/copilot/how-tos/chat-with-copilot/chat-in-mobile.md
- https://github.com/github/docs/blob/main/content/copilot/concepts/agents/copilot-cli/about-copilot-cli.md
- https://github.com/github/docs/blob/main/content/copilot/how-tos/use-copilot-for-common-tasks/use-copilot-in-the-cli.md

## 3) 管理機能（Enterprise管理ポリシー・データ利用設定）

### Enterprise / Organization のポリシー管理

- Copilotポリシーは Feature policy / Privacy policy / Models policy の3系統で定義。
- Enterprise owner は enterprise全体にポリシーを定義するか、organization owner に委譲できる。
- enterprise 側で明示設定されたポリシーは organization 側で上書き不可。[^3]
- Organization 設定では「Policies」で機能とプライバシー影響を制御し、「Models」で basic models 以外の利用可否（追加コスト発生可能性あり）を制御。
- Organizationでは third-party coding agents（Anthropic Claude / OpenAI Codex）の有効化制御が可能（機能提供フェーズ条件あり）。

主な出典:
- https://github.com/github/docs/blob/main/content/copilot/concepts/policies.md
- https://github.com/github/docs/blob/main/content/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies.md
- https://github.com/github/docs/blob/main/content/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies.md
- https://github.com/github/docs/blob/main/data/reusables/organizations/copilot-policy-ent-overrides-org.md

### データ利用設定（公式ドキュメント上の制御点）

- 「Copilot in GitHub.com」を有効化した Business / Enterprise では、追加オプションとして「ユーザーフィードバック収集へのオプトイン」と「プレビュー機能へのオプトイン」を設定できる。[^4]
- Privacy policy は「Allowed / Blocked」で表現され、機密性が関わる操作の可否を制御する。
- Content exclusion は repository / organization / enterprise で設定可能で、Copilotが参照しないコンテンツ範囲を指定可能。
- enterprise レベルの content exclusion は enterprise 内の全Copilotユーザーに適用され、organization レベルは当該organizationが割り当てたseatのユーザーに適用。[^5]
- ただし content exclusion は Copilot CLI / Copilot coding agent / IDEのAgent mode では未サポート。[^6]

主な出典:
- https://github.com/github/docs/blob/main/data/reusables/copilot/policies-for-dotcom.md
- https://github.com/github/docs/blob/main/content/copilot/concepts/policies.md
- https://github.com/github/docs/blob/main/content/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot.md

---

## 脚注

[^1]: `about-copilot-cli.md` の「Model usage」に、既定モデル（Claude Sonnet 4.5）と `/model` / `--model` による変更方法が記載。
[^2]: `chat-in-mobile.md` の「Limitations」に、premium request 上限到達時の free non-premium model への自動フォールバックが記載。
[^3]: `copilot-policy-ent-overrides-org.md` に、enterpriseで明示設定済みポリシーはorganizationで上書きできない旨が記載。
[^4]: `policies-for-dotcom.md` に、フィードバック収集オプトイン / プレビュー機能オプトインの2項目が定義。
[^5]: `exclude-content-from-copilot.md` の enterprise 設定説明に、enterprise適用範囲と organization適用範囲の差分が明記。
[^6]: `exclude-content-from-copilot.md` の注記に、Copilot CLI / coding agent / IDE Agent mode が content exclusion 非対応と明記。