# Next.js 入門：概要・特徴・Reactとの違いを理解する

## 概要（3-5行）

- **対象読者:** React の基礎は理解しており、これから Next.js を学び始める Web 開発者
- **この記事で得られること:**
  - Next.js が何であるか・なぜ使われるかを理解できる
  - React との役割の違いを整理できる
  - App Router・SSR/SSG/ISR など主要機能の概要を把握できる
  - 実際のプロジェクト開始手順を把握できる

---

## 背景と課題

### React 単体の限界

React は「UI を構築するためのライブラリ」であり、コンポーネントベースで柔軟な開発が可能です。しかしその反面、実務で Web アプリを開発するためには以下を**自分で選定・設定する必要**があります。

- ルーティング（例: React Router）
- サーバーサイドレンダリング（SSR）の仕組み
- データ取得・キャッシュ戦略
- ビルドツール（Webpack / Vite など）
- SEO 対策（初期 HTML の生成）

React 単体ではデフォルトでクライアントサイドレンダリング（CSR）になるため、初期表示が遅く、検索エンジンにコンテンツが正しく認識されにくいという課題もあります。

Next.js はこれらの課題を解決するために生まれた、React ベースの**フルスタック Web フレームワーク**です。

---

## 本論

### 1. Next.js とは

Next.js は、Vercel 社が中心となって開発・メンテナンスしている **React フレームワーク**です。React の上に構築されており、ルーティング・レンダリング・データ取得・最適化などの機能を統一された設計思想で提供します。

| 観点 | React | Next.js |
|------|-------|---------|
| 種別 | UI ライブラリ | フルスタックフレームワーク |
| ルーティング | 別途ライブラリが必要 | ファイルベースルーティングを内蔵 |
| レンダリング方式 | 主に CSR | CSR / SSR / SSG / ISR を選択可能 |
| サーバー機能 | 別途サーバーが必要 | API Routes / Server Actions を内蔵 |
| SEO | 要追加対応 | SSR/SSG により標準でSEO対応しやすい |
| 初期設定コスト | 高い（構成を自分で組む） | 低い（1コマンドで開始可能） |

#### バージョン状況（2026年2月時点）

- **Next.js 15.5**（2025年8月リリース）: Turbopack ビルドの beta 提供、Node.js Middleware の安定化
- **Next.js 16 beta**（2025年10月リリース）: Turbopack がデフォルトバンドラに昇格、React 19.2 サポート、React Compiler 安定化

---

### 2. 主要機能と実装例

#### 2-1. ファイルベースルーティング（App Router）

`app/` ディレクトリ配下のフォルダ・ファイル構造がそのままURLルーティングになります。

```
app/
├── layout.tsx       # 全ページ共通レイアウト
├── page.tsx         # / (トップページ)
└── blog/
    ├── page.tsx     # /blog
    └── [slug]/
        └── page.tsx # /blog/:slug (動的ルート)
```

`app/blog/page.tsx` を作るだけで `/blog` が有効になり、React Router のような手動設定は不要です。`layout.tsx` は一度だけ読み込まれ、ページ遷移時に再レンダリングされないため、ヘッダー・ナビゲーションの状態を維持できます。

#### 2-2. 4種類のレンダリング方式

Next.js はページ・コンポーネントごとに最適なレンダリング方式を選択できます。

| 方式 | 生成タイミング | 特徴 | 向いている用途 |
|------|---------------|------|---------------|
| **CSR** | ブラウザ表示後 | 柔軟だが初期表示が遅い | 管理画面・SPA |
| **SSR** | リクエストごと | 常に最新データ / サーバー負荷あり | ユーザー別ページ |
| **SSG** | ビルド時 | 最速・CDNで配信可能 | ブログ・固定ページ |
| **ISR** | ビルド後＋一定間隔 | 速度と更新頻度のバランスが良い | ニュース・一覧ページ |

#### 2-3. Server Components と Client Components

App Router（Next.js 13以降）では、コンポーネントを **Server Component**（デフォルト）と **Client Component** に分けて使います。

```tsx
// Server Component（デフォルト）
// サーバーでのみ実行されるため、データベースアクセスや機密情報を扱える
export default async function UserList() {
  const users = await fetchUsersFromDB(); // サーバーで実行
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

```tsx
// Client Component（"use client" ディレクティブが必要）
"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

インタラクティブな要素（`useState`, `useEffect` など）には `"use client"` を付け、それ以外はサーバーで処理することでバンドルサイズを削減できます。

#### 2-4. プロジェクト作成（ワンコマンド）

```bash
npx create-next-app@latest my-app
# TypeScript, Tailwind CSS, App Router, Turbopack を選択すると推奨構成で開始できる
cd my-app
npm run dev  # http://localhost:3000 で開発サーバー起動
```

---

### 3. 注意点 / 落とし穴

#### 学習コストに注意

Next.js を使いこなすには、以下の知識が前提として求められます。

- React の基礎（コンポーネント / Props / State / Hooks）
- JavaScript / TypeScript の基礎
- クライアント・サーバーそれぞれの動作の違い

特に App Router 導入後（v13以降）は、**Server Components と Client Components の使い分け**という新概念が加わり、従来の React の感覚から一歩踏み込んだ理解が必要です。

→ **対策:** React 公式チュートリアルでベースを固めてから、Next.js の [公式 Foundations コース](https://nextjs.org/learn) を進めることを推奨します。

#### バージョンアップの頻度

Next.js は更新頻度が高く、v13 → v14 → v15 → v16 と短期間でメジャーアップデートが続いています。v15 では非同期 API への移行など破壊的変更も含まれています。

→ **対策:** 公式の [Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading) と Codemod ツールを活用して移行コストを抑えましょう。

#### Vercel 以外へのデプロイ

Next.js は Vercel（開発元）へのデプロイが最も簡単ですが、AWS・GCP・自前サーバーでも動作します。ただし SSR や Server Actions を使う場合は Node.js 実行環境が必要で、静的エクスポート（`output: 'export'`）のみを使う場合は制限があります。

---

## まとめ

Next.js は「React でできること」を拡張し、**フルスタック Web アプリを効率よく構築するためのフレームワーク**です。ファイルベースルーティング・SSR/SSG/ISR・Server Components・Image 最適化など、実務に必要な機能が最初からまとまっており、開発の立ち上がりを大幅に加速できます。

**要点まとめ:**

- React は UI ライブラリ、Next.js は React ベースのフルスタックフレームワーク
- 4種類のレンダリング（CSR/SSR/SSG/ISR）をページ単位で選択可能
- App Router によるファイルベースルーティングが標準
- Server Components でバンドルサイズ削減・セキュリティ向上
- `create-next-app` でワンコマンド即開始

React の基礎が固まったら、次のステップとして Next.js の公式チュートリアルから始めることをおすすめします。

---

## 参考情報

- URL: https://nextjs.org/docs（Next.js 公式ドキュメント）
- URL: https://nextjs.org/blog/next-15（Next.js 15 リリースノート）
- URL: https://nextjs.org/blog/next-16（Next.js 16 beta リリースノート）
- URL: https://liginc.co.jp/673035（【初心者向け】Next.jsのApp Routerと基本概念 - LIG）
- URL: https://gyou-ten.com/journals/detail/94（Next.jsとは？Reactとの違い・特徴・メリット・デメリット・始め方）
- URL: https://refine.dev/blog/next-js-vs-react/（Next.js vs React - A Beginner's Guide）

## 情報更新日

- 2026-02-23
