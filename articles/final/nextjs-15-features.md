# Next.js 15 最新機能と運用ガイド：Turbopack 安定化・PPR・キャッシュ刷新

## 概要（3-5行）

- 対象読者: Next.js を既に使っており、v15 の変更点を実務に取り込みたい中〜上級者
- この記事で得られること: Next.js 15 の主要新機能（Turbopack 安定化・Partial Prerendering・非同期リクエスト API・キャッシュ刷新）の概要と、実際のアプリへの適用手順・移行時の注意点

## 背景と課題

Next.js は React エコシステムを代表するフレームワークとして進化し続けており、2024 年 10 月 21 日に **Next.js 15** が正式リリースされた。

v14 では App Router・Server Actions・Partial Prerendering（実験的）が導入されたが、以下の課題が残っていた。

- **ビルド・開発サーバーの遅さ**: 大規模プロジェクトで Webpack ベースのコールドスタートが 45〜60 秒に達するケースがあった
- **キャッシュの暗黙挙動**: `fetch` や GET Route Handler が黙ってキャッシュされ、予期しない古いデータが返る問題が多発
- **同期 API の限界**: `cookies()` や `params` が同期処理前提のため、将来の最適化（PPR など）の障壁になっていた
- **React 19 との統合**: React 19 の新機能（Server Components 改善・組み込みフォームなど）を安全に使う経路が整っていなかった

Next.js 15 はこれらをまとめて解消した「安定化リリース」と位置づけられている。

## 本論

### 1. 要点

#### 1-1. Turbopack 開発サーバーの安定化

Rust 製バンドラ **Turbopack** が `next dev` で **stable** になった。主な改善数値は次のとおり。

| 指標 | Webpack（v14） | Turbopack（v15） |
|------|--------------|----------------|
| 中規模プロジェクト（50+ routes）コールドスタート | 12〜15 秒 | 1.5〜2 秒（約 8〜10x） |
| 大規模モノレポ（200+ routes）コールドスタート | 45〜60 秒 | 5〜10 秒（約 6〜10x） |
| Fast Refresh（コード変更時の再ビルド） | 数秒 | ほぼ瞬時（最大 96.3% 短縮） |

Turbopack が高速な理由は主に 3 つ。

1. **インクリメンタルコンパイル（関数レベルキャッシュ）**: ファイル単位ではなく、変更された関数とその依存のみを再コンパイル
2. **Rust による並列処理**: CPUコアを最大限に利用（Webpack は基本シングルスレッド）
3. **ファイルシステムキャッシュ（beta）**: セッションをまたいだキャッシュ永続化で、再起動後のスタートアップも劇的に短縮

> **注意**: `next build`（本番ビルド）の Turbopack 対応は v15 時点でまだ進行中（96% テスト通過）。本番ビルドへの切り替えは v15.x の将来アップデートを待つのが安全。

#### 1-2. Partial Prerendering（PPR）の段階的採用

PPR は「一つのルートで静的シェルと動的コンテンツを混在させる」新しいレンダリングモデル。

```
静的シェル（ナビ・ヘッダ等） → Edge からほぼ瞬時に配信
     ↕
動的部分（カート・ユーザー情報） → サーバーから非同期ストリーミング
```

v15 では `ppr: 'incremental'` オプションが追加され、**ルート単位で段階的に採用**できるようになった。

```js
// next.config.js
module.exports = {
  experimental: {
    ppr: 'incremental',
  },
};
```

PPR を有効にしたいルートの先頭に `export const experimental_ppr = true` を追加するだけで、そのルートのみ PPR が適用される。

#### 1-3. 非同期リクエスト API（破壊的変更）

`cookies()`・`headers()`・`params`・`searchParams` など、リクエスト依存のサーバーサイド API が **async 関数** に変更された。

**変更前（v14）**
```ts
import { cookies } from 'next/headers';

export async function AdminPanel() {
  const cookieStore = cookies();           // 同期
  const token = cookieStore.get('token');
  // ...
}
```

**変更後（v15）**
```ts
import { cookies } from 'next/headers';

export async function AdminPanel() {
  const cookieStore = await cookies();     // 非同期（await 必須）
  const token = cookieStore.get('token');
  // ...
}
```

影響を受ける API 一覧:

- `cookies` / `headers` / `draftMode`
- `params`（`layout.js` / `page.js` / `route.js` / `default.js` / `generateMetadata` / `generateViewport`）
- `searchParams`（`page.js`）

v15 では後方互換のため同期アクセスも一時的に動作するが、開発・本番環境で警告が表示され、**次のメジャーバージョンで削除予定**。自動移行 codemod が用意されている。

```bash
npx @next/codemod@canary next-async-request-api .
```

#### 1-4. キャッシュのデフォルト変更

v14 までは `fetch` リクエスト・GET Route Handler・クライアントルーターキャッシュがデフォルトでキャッシュされていたが、v15 では **デフォルト uncached** に変更された。

| 対象 | v14 デフォルト | v15 デフォルト |
|------|-------------|-------------|
| `fetch` | `cache: 'force-cache'`（キャッシュあり） | キャッシュなし（`no-store` 相当） |
| GET Route Handler | キャッシュあり | キャッシュなし |
| Client Router Cache | キャッシュあり | キャッシュなし |

キャッシュを維持したい場合は明示的にオプトイン。

```ts
// fetch でキャッシュを有効化
const res = await fetch('/api/data', { cache: 'force-cache' });

// GET Route Handler でキャッシュを有効化
export const dynamic = 'force-static';
```

また実験的な `'use cache'` ディレクティブと `dynamicIO` モードも追加され、関数・コンポーネント単位でキャッシュを宣言的に制御できる。

```ts
// use cache ディレクティブの例
async function getProducts() {
  'use cache';
  const res = await fetch('https://api.example.com/products');
  return res.json();
}
```

#### 1-5. その他の主要変更

| 機能 | 概要 |
|------|------|
| **`next/form` コンポーネント** | 標準 `<form>` を拡張。プリフェッチ・クライアントサイドナビゲーション・プログレッシブエンハンスメント内蔵 |
| **React 19 サポート** | App Router で React 19 RC を正式サポート。Pages Router は React 18 後方互換を維持 |
| **React Compiler（stable）** | 自動メモ化によるパフォーマンス最適化。手動 `useMemo` / `useCallback` が不要になる |
| **Static Route Indicator** | 開発環境でルートが静的か動的かを視覚的に表示 |
| **TypeScript 対応 `next.config.ts`** | 設定ファイルを TypeScript で記述可能に |
| **`@next/codemod` CLI 強化** | `npx @next/codemod@canary upgrade latest` で主要な移行を自動化 |
| **Server Functions（旧 Server Actions）** | 将来の拡張（HTTP メソッド追加等）を見越してリネーム |

---

### 2. 手順 / 実装例

#### v14 → v15 へのアップグレード手順

**Step 1: codemod を使って自動アップグレード**

```bash
npx @next/codemod@canary upgrade latest
```

依存パッケージの更新と主要な破壊的変更のコード修正を自動で行う。

**Step 2: 非同期 API の移行を確認**

codemod 実行後、以下のパターンが自動修正されていることを確認。

```bash
# 手動で残りを修正する場合
npx @next/codemod@canary next-async-request-api .
```

**Step 3: キャッシュ挙動の監査**

v14 でデフォルトキャッシュに依存していた箇所を洗い出す。ステージング環境でデータの鮮度を確認し、必要箇所に `cache: 'force-cache'` または `'use cache'` を明示する。

**Step 4: Turbopack を開発環境で有効化**

```bash
next dev --turbo
```

または `package.json` の `dev` スクリプトに追加。

```json
{
  "scripts": {
    "dev": "next dev --turbo"
  }
}
```

**Step 5: PPR を試験的に有効化（任意）**

```js
// next.config.js
module.exports = {
  experimental: {
    ppr: 'incremental',
  },
};
```

適用したいルートに `export const experimental_ppr = true` を追加して動作を確認。

---

#### `next/form` の実装例

```tsx
import Form from 'next/form';

export default function SearchPage() {
  return (
    <Form action="/search">
      <input name="query" placeholder="キーワードを入力" />
      <button type="submit">検索</button>
    </Form>
  );
}
```

- `action` に渡したルートのコンポーネントをプリフェッチ
- JavaScript 無効環境でも動作（プログレッシブエンハンスメント）
- サブミット後はクライアントサイドナビゲーションで遷移（フルリロードなし）

---

### 3. 注意点 / 落とし穴

#### 注意点 1: 非同期 API の移行漏れ

自動 codemod はほとんどのケースに対応しているが、動的に生成される `params` のアクセスや、ライブラリ内部でラップされているケースは手動確認が必要。本番デプロイ前に警告ログをゼロにすること。

#### 注意点 2: キャッシュ変更による動作差異

「デフォルト uncached」への変更は既存アプリに最も大きな影響を与える可能性がある。特に以下のシナリオに注意。

- 外部 API の呼び出しコストが増加する（毎リクエストでフェッチが走る）
- ビルド時 ISR を前提にしていたページが SSR 化してしまう

ステージング環境でのレスポンスタイムと API コール数を必ず計測すること。

#### 注意点 3: Turbopack の本番ビルド未対応

`next dev --turbo` は stable だが、`next build` での使用はまだ開発段階。CI/CD パイプラインで `next build` を使っている場合は Webpack のまま継続し、Turbopack の本番対応アップデートを待つこと。

#### 注意点 4: React 19 移行は Pages Router では任意

Pages Router を利用しているプロジェクトは React 18 のまま継続できる。ただし React 19 の新機能（`use` フック・Actions など）を使いたい場合は App Router への移行も検討する必要がある。

#### 注意点 5: `experimental_ppr` は実験的フラグ

PPR の `incremental` モードは v15 時点で実験的機能。本番環境への適用はリスク評価を行ったうえで実施し、Vercel の公式ドキュメントで最新の安定状況を確認すること。

## まとめ

Next.js 15 は「安定化と制御の回復」を主軸としたリリースと言える。

- **Turbopack** が開発サーバーで stable になり、大規模プロジェクトでも快適な HMR が実現した
- **キャッシュのデフォルト uncached** 化により、予期しないキャッシュ問題が解消されるが、既存コードの監査が必須
- **非同期リクエスト API** への移行は codemod でほぼ自動化できるが、漏れのないチェックが重要
- **PPR の段階的採用**が可能になったことで、既存アプリに少しずつ静的最適化を適用できる

アップグレードは以下の優先度で進めるとリスクが低い。

1. ステージング環境でキャッシュ挙動の差異を確認
2. codemod で非同期 API 移行を自動化
3. 開発者ローカル環境に Turbopack を導入
4. 本番対応後に PPR を段階的にロールアウト

## 参考情報

- URL: https://nextjs.org/blog/next-15 — Next.js 15 公式リリースノート（Vercel、2024年10月21日）
- URL: https://nextjs.org/docs/app/guides/upgrading/version-15 — Next.js 公式アップグレードガイド（v15）
- URL: https://nextjs.org/blog/next-15-rc2 — Next.js 15 RC 2 ブログ（Vercel）
- URL: https://medium.com/@dmostoller/next-js-15-new-features-breaking-changes-and-improvements-you-need-to-know-ac98fa6f0c2d — Next.js 15: New Features, Breaking Changes, and Improvements（David Mostoller、2024年11月9日）
- URL: https://makerkit.dev/blog/changelog/upgrade-nextjs-15 — Upgrading to Next.js 15（MakerKit）

## 情報更新日

- 2026-02-23
