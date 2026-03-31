/**
 * MCP App UI ロジック（ブラウザ側）
 *
 * @modelcontextprotocol/ext-apps の App クラスが
 * ホスト（Claude等）との通信を担当する。
 */

import { App } from "@modelcontextprotocol/ext-apps";

const serverTimeEl = document.getElementById("server-time")!;
const getTimeBtn = document.getElementById("get-time-btn")!;

// ① App インスタンスを作成してホストに接続
const app = new App({ name: "Get Time App", version: "1.0.0" });
app.connect();

// ② ホストからツール結果がプッシュされてきたときのコールバック
//    （ホストがツールを実行した直後に自動で呼ばれる）
app.ontoolresult = (result) => {
  const time = result.content?.find((c) => c.type === "text")?.text;
  serverTimeEl.textContent = time ?? "[エラー]";
};

// ③ ボタンを押したときにUI側からツールを呼び出す
//    app.callServerTool でサーバーの get-time を直接叩ける
getTimeBtn.addEventListener("click", async () => {
  serverTimeEl.textContent = "取得中...";
  const result = await app.callServerTool({
    name: "get-time",
    arguments: {},
  });
  const time = result.content?.find((c) => c.type === "text")?.text;
  serverTimeEl.textContent = time ?? "[エラー]";
});
