import fs from "node:fs/promises";
import path from "node:path";

export const listMarkdownFiles = async (dirPath: string): Promise<string[]> => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return listMarkdownFiles(fullPath);
      }
      return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
    }),
  );
  return files.flat().sort();
};

export const readText = async (filePath: string): Promise<string> => fs.readFile(filePath, "utf8");

export const toWorkspaceRelative = (filePath: string, workspaceRoot: string): string =>
  path.relative(workspaceRoot, filePath).replaceAll(path.sep, "/");

export const extractJsonObject = (rawText: string): string => {
  // SDK の応答が ```json フェンス付きでも素の JSON でも扱えるようにする。
  const fencedMatch = rawText.match(/```json\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return rawText.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("JSON オブジェクトを応答から抽出できませんでした。");
};