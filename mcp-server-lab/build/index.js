/**
 * はじめてのMCPサーバー（学習用）
 *
 * このサーバーは2つのツールを提供します:
 *   - greet: 名前を受け取り挨拶を返す（一番シンプルなツール）
 *   - add:   2つの数値を足し算して返す
 *
 * MCPサーバーの基本構造を学ぶためのサンプルです。
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// ① サーバーインスタンスを作成
//    name: このサーバーの識別名（Claude Desktopなどに表示される）
//    version: バージョン
const server = new McpServer({
    name: "my-first-mcp-server",
    version: "1.0.0",
});
// ② ツールを登録: greet
//    - Zodでinputのスキーマを定義（型チェック・バリデーション）
//    - handlerがツールの本体ロジック
server.registerTool("greet", {
    description: "名前を渡すと挨拶を返すツール",
    inputSchema: {
        name: z.string().describe("挨拶したい相手の名前"),
    },
}, async ({ name }) => {
    console.error(`[greet] ツール呼び出し: name="${name}"`);
    const result = `こんにちは、${name}さん！MCPサーバーから挨拶です👋`;
    console.error(`[greet] 応答: ${result}`);
    return {
        content: [
            {
                type: "text",
                text: result,
            },
        ],
    };
});
// ③ ツールを登録: add
server.registerTool("add", {
    description: "2つの整数を足し算して返すツール",
    inputSchema: {
        a: z.number().int().describe("1つ目の数値"),
        b: z.number().int().describe("2つ目の数値"),
    },
}, async ({ a, b }) => {
    console.error(`[add] ツール呼び出し: a=${a}, b=${b}`);
    const result = a + b;
    console.error(`[add] 応答: ${a} + ${b} = ${result}`);
    return {
        content: [
            {
                type: "text",
                text: `${a} + ${b} = ${result}`,
            },
        ],
    };
});
// ④ stdio トランスポートでサーバーを起動
//    StdioServerTransport = 標準入出力経由でMCPクライアント（Claude等）と通信する
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCPサーバーが起動しました"); // stderrに出力（stdoutはMCPプロトコル用）
}
main().catch((err) => {
    console.error("起動エラー:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map