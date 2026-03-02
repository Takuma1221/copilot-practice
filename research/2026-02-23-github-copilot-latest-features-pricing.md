# GitHub Copilot 最新機能・料金プラン・提供形態・利用制限（公式情報調査）

**調査日:** 2026-02-23  
**取得時点:** 2026-02-23（JST）

## 調査対象（公式一次情報）
- GitHub Copilot 公式ページ: https://github.com/features/copilot
- GitHub Copilot Plans（個人向け表示）: https://github.com/features/copilot/plans
- GitHub Copilot Plans（法人向け表示）: https://github.com/features/copilot/plans?plans=business&locale=en-US
- GitHub Pricing: https://github.com/pricing
- Copilot Pro登録ページ: https://github.com/github-copilot/pro

## 料金プラン（取得時点の表示）

### Individual
| プラン | 価格表示 | Trial/無料 | 公式記載の主な提供内容（抜粋） | 主な利用制限（抜粋） |
|---|---|---|---|---|
| Free | $0 USD | 無料（クレジットカード不要） | Haiku 4.5 / GPT-5 mini 等へのアクセス | 50 agent mode or chat requests/月、2,000 completions/月 |
| Pro | $10 USD/月 または $100 USD/年 | 30日無料トライアル | coding agent、code review、複数モデル（Anthropic/Google/OpenAI等） | premium requests 300/月、追加購入オプションあり[^1]、高負荷時の応答遅延・レート制限可能性[^2] |
| Pro+ | $39 USD/月 または $390 USD/年 | （同ページ上で個別Trial明記は未確認） | Proの内容に加え、より広いモデルアクセス、GitHub Sparkアクセス | 「Proの5倍のpremium requests」記載（追加購入オプションあり）[^1] |

### Business / Enterprise
| プラン | 価格表示 | Trial/無料 | 公式記載の主な提供内容（抜粋） | 主な利用制限（抜粋） |
|---|---|---|---|---|
| Business | $19 USD/ユーザー/月 | （Plans上でCopilot単体Trial明記は未確認） | coding agent、code review、モデルアクセス、ユーザー管理/利用メトリクス、IP indemnity / data privacy | premium requests 300/ユーザー/月、追加購入オプションあり[^1]、高負荷時の応答遅延・レート制限可能性[^2] |
| Enterprise | $39 USD/ユーザー/月 | （Plans上でCopilot単体Trial明記は未確認） | Businessの内容＋Claude/Codex、全モデルアクセス、GitHub Sparkアクセス | Business比でpremium requests増加（3.33x表記）[^1] |

## Trial / 提供形態に関する事実
- `github.com/github-copilot/pro` に「Try Copilot Pro for 30 days free」の明記あり。
- `github.com/pricing` に「GitHub Enterprise + Copilot + Advanced Security を含む30日無料トライアル」の明記あり（プラットフォーム全体のtrial文言）。
- `github.com/features/copilot/plans` は「For individuals / For businesses」の表示切替があり、表示プランが分かれる（Individual: Free/Pro/Pro+、Business view: Business/Enterprise）。

## 最新機能（料金ページ上で確認できる範囲）
- coding agent
- code review
- 複数LLMアクセス（Anthropic / Google / OpenAI 等）
- GitHub Spark（上位プラン）
- Claude / Codex（上位プラン）

## 価格・条件の変動可能性（取得時点明記）
- 本メモは **2026-02-23（JST）時点の公式ページ表示** を記録したもの。
- 価格・プラン構成・上限値・対象モデルは、公式ページ更新により変更され得るため、契約時は各公式ページの最新表示を確認する必要がある。

## 補足（取得制限）
- docs.github.com の一部ページ取得は、調査時に HTTP 429（レート制限）で本文取得不可だったため、同時点で取得可能な GitHub公式Pricing/Plansページを優先して整理した。

---

[^1]: `https://github.com/features/copilot/plans` の脚注: 「追加premium requests購入オプションは、iOS/AndroidのGitHub Mobile経由でPro/Pro+を契約した（または契約していた）ユーザーには提供されない」。
[^2]: `https://github.com/features/copilot/plans` の脚注: 「高負荷時は応答時間が変動し、リクエストはレート制限の対象となる可能性がある」。
