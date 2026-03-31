import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// viteSingleFile: JS/CSSをHTMLに全部インライン化して1ファイルにする
// → MCPサーバーがHTMLを1つのテキストとして返せるようになる
export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    outDir: "dist",
    rollupOptions: {
      // npm run build 時に環境変数 INPUT でビルド対象HTMLを指定する
      input: process.env.INPUT,
    },
  },
});
