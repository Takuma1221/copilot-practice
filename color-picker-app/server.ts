/**
 * Color Picker MCP App サーバー
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
  name: "Color Picker App Server",
  version: "1.0.0",
});

// UIリソースのURI
const resourceUri = "ui://color-picker/color-picker.html";

// ② ツール登録
registerAppTool(
  server,
  "color-picker",
  {
    title: "Color Picker",
    description: "カラーピッカーUIを表示します",
    inputSchema: {},
    _meta: { ui: { resourceUri } },
  },
  async () => {
    console.error("[color-picker] ツール呼び出し");
    return {
      content: [{ type: "text", text: "#3b82f6" }],
    };
  }
);

// ③ UIリソース登録
registerAppResource(
  server,
  resourceUri,
  resourceUri,
  { mimeType: RESOURCE_MIME_TYPE },
  async () => {
    console.error(`[color-picker] UIリソース要求: ${resourceUri}`);
    const html = await fs.readFile(
      path.join(import.meta.dirname, "dist", "color-picker.html"),
      "utf-8"
    );
    return {
      contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
    };
  }
);

// ④ Expressサーバーで HTTP /mcp エンドポイントを公開
const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

expressApp.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

expressApp.listen(3002, () => {
  console.error("Color Picker App サーバー起動: http://localhost:3002/mcp");
});
