import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ReviewConfig } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "../../..");

export const defaultReviewConfig: ReviewConfig = {
  workspaceRoot,
  targetDir: path.join(workspaceRoot, "articles/final"),
  templatePath: path.join(workspaceRoot, "TEMPLATE.md"),
  reviewCriteriaPath: path.join(workspaceRoot, ".github/skills/article-review/SKILL.md"),
  maxFindingsPerFile: 5,
  model: process.env.COPILOT_MODEL ?? "gpt-5",
  streaming: process.env.COPILOT_STREAMING === "true",
};