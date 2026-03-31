/**
 * MCP App サーバー（学習用）
 *
 * 通常のMCPサーバーとの違い:
 *   - StdioTransport ではなく StreamableHTTPServerTransport を使う
 *     → HTTP経由で通信するため、Expressで立てる
 *   - ツールに _meta.ui.resourceUri を付けることで「UIあり」と宣言する
 *   - registerAppResource でビルド済みHTMLをホストに返す
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import cors from "cors";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";

// ① MCPサーバー本体
const server = new McpServer({
  name: "My MCP App Server",
  version: "1.0.0",
});

// UIリソースのURI（ui:// スキームが MCP Apps の慣習）
const resourceUri = "ui://get-time/mcp-app.html";

// ② ツール登録（registerAppTool = 通常の registerTool + UIメタ情報）
//    _meta.ui.resourceUri を付けることで、このツールの結果にUIが紐づく
registerAppTool(
  server,
  "get-time",
  {
    title: "Get Time",
    description: "現在のサーバー時刻を表示するUIを返します",
    inputSchema: {},
    _meta: { ui: { resourceUri } },
  },
  async () => {
    const time = new Date().toISOString();
    console.error(`[get-time] ツール呼び出し: ${time}`);
    return {
      content: [{ type: "text", text: time }],
    };
  }
);

// ③ UIリソース登録（registerAppResource = ホストにHTMLを返す）
//    ホストが resourceUri を要求してきたとき、ビルド済みHTMLを返す
registerAppResource(
  server,
  resourceUri,
  resourceUri,
  { mimeType: RESOURCE_MIME_TYPE },
  async () => {
    console.error(`[get-time] UIリソース要求: ${resourceUri}`);
    const html = await fs.readFile(
      path.join(import.meta.dirname, "dist", "mcp-app.html"),
      "utf-8"
    );
    return {
      contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
    };
  }
);

// ④ Expressサーバーで HTTP /mcp エンドポイントを公開
//    StdioではなくHTTP経由になるため、毎リクエストごとにトランスポートを作る
const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

expressApp.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // ステートレスモード
    enableJsonResponse: true,
  });
  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

expressApp.listen(3001, () => {
  console.error("MCPアプリサーバー起動: http://localhost:3001/mcp");
});
