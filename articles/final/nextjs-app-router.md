# Next.js App Router 完全ガイド：仕組みと実装手順

## 概要（3-5行）

- **対象読者:** React の基本（コンポーネント・フック・非同期処理）を理解していて、Next.js の App Router を学びたい開発者
- **この記事で得られること:**
  - App Router の設計思想とファイルシステムルーティングの仕組み
  - Server Components と Client Components の使い分け
  - `fetch` を使ったサーバーサイドデータフェッチの実装パターン
  - Streaming（`loading.js` / `<Suspense>`）による UX 向上手法

---

## 背景と課題

Next.js は長年 `pages/` ディレクトリをベースとした Pages Router を提供してきた。しかし以下の課題があった。

- **データフェッチがページ境界に縛られる**：`getServerSideProps` や `getStaticProps` はページトップレベルにしか置けず、コンポーネントが必要なデータを自分で取得できない。
- **レイアウトの再利用が煩雑**：共有レイアウトを実現するために `_app.tsx` や独自ラッパーが必要だった。
- **クライアント JS の肥大化**：デフォルトで全コンポーネントがクライアントにバンドルされるため、初回ロードが重くなりやすかった。

Next.js 13（2022年）で導入され、15（2024年）でさらに洗練された **App Router** は、React Server Components（RSC）を中心に据え、これらの課題を根本から解決している。

---

## 本論

### 1. App Router の仕組み：ファイルシステムルーティング

App Router では `app/` ディレクトリをルートとして、**フォルダ構造が URL パスに直結**する。

```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── blog/
│   ├── page.tsx          → /blog
│   └── [slug]/
│       └── page.tsx      → /blog/:slug
└── (marketing)/          → URLに影響しないルートグループ
    └── pricing/
        └── page.tsx      → /pricing
```

#### 特殊ファイル

| ファイル名       | 役割                                   |
|-----------------|----------------------------------------|
| `page.tsx`      | ルートに対応する UI（公開エンドポイント）|
| `layout.tsx`    | 子ルートに共有されるレイアウト          |
| `loading.tsx`   | ストリーミング中のローディング UI       |
| `error.tsx`     | エラーバウンダリ                       |
| `route.ts`      | API エンドポイント（Route Handler）    |
| `not-found.tsx` | 404 ページ                             |

#### ルートグループ

`(フォルダ名)` のように括弧で囲むと URL に影響しないグループを作れる。異なるレイアウトを共有するページをまとめるのに便利だ。

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-layout">
      <header>マーケティングサイト共通ヘッダー</header>
      {children}
    </div>
  );
}
```

---

### 2. 手順 / 実装例

#### ステップ 1: プロジェクト作成

```bash
npx create-next-app@latest my-app --typescript --app
cd my-app
```

`--app` フラグを付けると App Router が有効になる（Next.js 13.4 以降はデフォルト）。

---

#### ステップ 2: 基本ページと共有レイアウト

```tsx
// app/layout.tsx（ルートレイアウト：必須）
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function Home() {
  return <h1>トップページ</h1>;
}
```

---

#### ステップ 3: Server Components でデータフェッチ

App Router のデフォルトはすべて **Server Component**。`async/await` を直接使ってデータを取得できる。

```tsx
// app/posts/page.tsx
type Post = { id: number; title: string; body: string };

export default async function PostsPage() {
  // サーバー上で直接 fetch — クライアントに JS コードは送られない
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', {
    next: { revalidate: 60 }, // 60 秒ごとに ISR 再検証
  });
  const posts: Post[] = await res.json();

  return (
    <main>
      <h1>投稿一覧</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

`fetch` オプションでキャッシュ戦略を指定できる：

| オプション                     | 動作                              |
|-------------------------------|-----------------------------------|
| `cache: 'force-cache'`        | 静的キャッシュ（デフォルト相当）    |
| `cache: 'no-store'`           | キャッシュなし（毎リクエスト取得）  |
| `next: { revalidate: N }`     | N 秒ごとに再検証（ISR 相当）       |

---

#### ステップ 4: 動的ルートの実装

```tsx
// app/posts/[slug]/page.tsx
type Props = { params: Promise<{ slug: string }> };

export default async function PostDetail({ params }: Props) {
  const { slug } = await params;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${slug}`);

  if (!res.ok) {
    // not-found.tsx が表示される
    return <p>投稿が見つかりません</p>;
  }

  const post = await res.json();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

---

#### ステップ 5: Client Component の導入

インタラクティブな UI（状態管理、イベントハンドラ、ブラウザ API）が必要な場合のみ `"use client"` を宣言する。

```tsx
// app/components/LikeButton.tsx
"use client"; // ← これ以下はクライアントバンドルに含まれる

import { useState } from "react";

export default function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? "❤️ いいね済み" : "🤍 いいね"}
    </button>
  );
}
```

Server Component の中で Client Component を呼び出せる：

```tsx
// app/posts/[slug]/page.tsx（Server Component）
import LikeButton from "@/app/components/LikeButton";

export default async function PostDetail({ params }: Props) {
  // ... fetch ...
  return (
    <article>
      <h1>{post.title}</h1>
      <LikeButton /> {/* Client Component を子として配置 */}
    </article>
  );
}
```

> **重要**: Client Component から Server Component を `import` することはできない（逆は可能）。

---

#### ステップ 6: Streaming で UX を向上させる

重いデータフェッチがある場合、`<Suspense>` で部分的なストリーミングを実現する。

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import RevenueChart from "./RevenueChart";
import StatsCards from "./StatsCards";

export default function Dashboard() {
  return (
    <main>
      {/* 軽いコンポーネントはすぐ表示 */}
      <StatsCards />

      {/* 重いコンポーネントはロード中にフォールバックを表示 */}
      <Suspense fallback={<p>グラフを読み込み中...</p>}>
        <RevenueChart />
      </Suspense>
    </main>
  );
}
```

```tsx
// app/dashboard/RevenueChart.tsx（Server Component）
async function fetchRevenue() {
  await new Promise((r) => setTimeout(r, 2000)); // 重い処理を模擬
  return [{ month: "Jan", amount: 100 }];
}

export default async function RevenueChart() {
  const data = await fetchRevenue();
  return <div>{/* チャート描画 */}</div>;
}
```

ルート全体のローディング UI には `loading.tsx` を配置するだけで自動的に `<Suspense>` が適用される：

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div className="skeleton">読み込み中...</div>;
}
```

---

#### ステップ 7: Route Handler（API エンドポイント）

`route.ts` で REST API エンドポイントを定義できる。複数の HTTP メソッドを一つのファイルで扱える点が Pages Router の `pages/api/` と異なる。

```ts
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const users = [{ id: 1, name: "Alice" }];
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // DB処理など...
  return NextResponse.json({ created: body }, { status: 201 });
}
```

---

### 3. 注意点 / 落とし穴

#### Server Component と Client Component の境界を意識する

Server Component はデフォルトだが、`useState` や `useEffect`、ブラウザ API（`window`, `localStorage`）を使う場合は必ず `"use client"` が必要。**エラーメッセージが出た場合の第一確認ポイント**。

#### `params` と `searchParams` は Promise（Next.js 15 以降）

Next.js 15 から `params` と `searchParams` が非同期（`Promise`）になった。`await params` を忘れると型エラーになる。

```tsx
// NG（Next.js 15 以降）
export default function Page({ params }: { params: { slug: string } }) { ... }

// OK
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}
```

#### データフェッチの重複を避ける

同じデータを複数のコンポーネントで使う場合、それぞれで `fetch` しても React が**自動的にリクエストを重複排除（メモ化）**する。ただし、これはレンダリング中の同一 URL に対してのみ有効。

#### 並列データフェッチ

複数のデータが独立している場合、`Promise.all` で並列に取得してウォーターフォールを防ぐ：

```tsx
export default async function Page() {
  const [user, posts] = await Promise.all([
    fetch('/api/user').then((r) => r.json()),
    fetch('/api/posts').then((r) => r.json()),
  ]);
  return (/* ... */);
}
```

#### `"use client"` 境界はできるだけ末端に

Client Component はそれ以下のすべての子コンポーネントもクライアント扱いになる。`"use client"` の宣言は**ツリーの末端（葉に近い部分）**に留め、Server Component の恩恵（バンドルサイズ削減）を最大化する。

---

## まとめ

| 項目                    | App Router                              |
|-------------------------|-----------------------------------------|
| ルーティング             | `app/` フォルダ構造が URL に直結         |
| デフォルトレンダリング   | Server Component（クライアント JS なし） |
| データフェッチ           | `async/await` + `fetch` をコンポーネント内で直接使用 |
| インタラクション         | `"use client"` を持つ Client Component  |
| ローディング UI          | `loading.tsx` / `<Suspense>` で部分ストリーミング |
| API エンドポイント       | `route.ts` で HTTP メソッドごとに定義   |

App Router は「デフォルトでサーバー側で動く」という設計原則を持つ。**クライアント JS を必要な部分だけに絞る**ことで、パフォーマンスと開発体験の両方が向上する。まずは小さな Server Component でデータフェッチを試し、インタラクティブな部分のみ `"use client"` で切り出すアプローチで学習を進めると理解が深まる。

---

## 参考情報

- URL: https://nextjs.org/docs/app/building-your-application/routing  
  Next.js 公式ドキュメント — Layouts and Pages（App Router ルーティング基礎）
- URL: https://nextjs.org/docs/app/building-your-application/data-fetching  
  Next.js 公式ドキュメント — Fetching Data（Server Components のデータフェッチ）
- URL: https://vercel.com/blog/nextjs-app-router-data-fetching  
  Vercel ブログ — Fetching data faster with the Next.js 13 App Router
- URL: https://nextjs.org/docs/14/app/building-your-application/data-fetching/patterns  
  Next.js 公式ドキュメント v14 — Data Fetching Patterns and Best Practices
- URL: https://www.startupbricks.in/blog/nextjs-app-router-best-practices-2025  
  Next.js App Router Best Practices 2025

---

## 情報更新日

- 2026-02-23
