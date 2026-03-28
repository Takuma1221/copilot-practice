import { CopilotClient, approveAll } from "@github/copilot-sdk";
import { defaultReviewConfig } from "./config.js";
import { resultSchema, reviewOutputSchema, type ReviewOutput } from "./types.js";
import { extractJsonObject, listMarkdownFiles, readText, toWorkspaceRelative } from "./utils.js";

const buildSystemPrompt = (maxFindingsPerFile: number): string =>
  // システムプロンプトでは、レビュアーの役割と出力ルールを固定する。
  [
    "You are a strict Markdown article reviewer.",
    "Respond with JSON only.",
    "Do not wrap the response in markdown unless forced.",
    "Review each file against the provided template and review criteria.",
    "Use these category names exactly: facts, freshness, structure, template, practicality.",
    "Use these severity values exactly: high, medium, low.",
    "Use these verdict values exactly: pass, conditional-pass, fail.",
    `Return at most ${maxFindingsPerFile} findings per file.`,
    "Keep issue, reason, suggestion, and evidence concise and concrete.",
    "If a file looks strong, findings may be an empty array.",
  ].join(" ");

const buildUserPrompt = (input: {
  template: string;
  reviewCriteria: string;
  file: { path: string; content: string };
}): string =>
  // ユーザープロンプトには、テンプレート、採点基準、対象記事本文をまとめて渡す。
  [
    "Review the following article.",
    "Score the file out of 100 using the provided category weights.",
    "Be conservative and concrete.",
    "Return JSON matching this shape for one file only:",
    JSON.stringify(
      {
        file: "articles/final/example.md",
        score: 0,
        verdict: "pass",
        categoryScores: {
          facts: 0,
          freshness: 0,
          structure: 0,
          template: 0,
          practicality: 0,
        },
        findings: [
          {
            severity: "medium",
            category: "template",
            issue: "short issue",
            reason: "why it matters",
            suggestion: "smallest fix",
            evidence: "quote or summary",
          },
        ],
      },
      null,
      2,
    ),
    "Template:",
    input.template,
    "Review criteria:",
    input.reviewCriteria,
    "Article:",
    `## FILE: ${input.file.path}`,
    input.file.content,
  ].join("\n\n");

const buildSummary = (results: ReviewOutput["results"]): ReviewOutput["summary"] => ({
  filesReviewed: results.length,
  totalFindings: results.reduce((sum, result) => sum + result.findings.length, 0),
  passCount: results.filter((result) => result.verdict === "pass").length,
  conditionalPassCount: results.filter((result) => result.verdict === "conditional-pass").length,
  failCount: results.filter((result) => result.verdict === "fail").length,
});

const repairJsonResponse = async (client: CopilotClient, rawContent: string): Promise<string> => {
  // モデルが崩れた JSON を返したときだけ、JSON 修復専用セッションに投げ直す。
  const session = await client.createSession({
    model: defaultReviewConfig.model,
    onPermissionRequest: approveAll,
    availableTools: [],
    systemMessage: {
      mode: "replace",
      content: [
        "You repair malformed JSON.",
        "Return valid JSON only.",
        "Do not add markdown fences.",
        "Do not change field names or meaning.",
      ].join(" "),
    },
  });

  try {
    const response = await session.sendAndWait({
      prompt: [
        "Convert the following malformed JSON-like text into valid JSON.",
        "Return only the repaired JSON object.",
        rawContent,
      ].join("\n\n"),
    });

    const content = response?.data.content;
    if (!content) {
      throw new Error("JSON 修復用レスポンスを受け取れませんでした。");
    }

    return extractJsonObject(content);
  } finally {
    await session.disconnect();
  }
};

const parseReviewResult = async (client: CopilotClient, rawContent: string) => {
  try {
    // まずはそのまま JSON として読めるかを試す。
    return resultSchema.parse(JSON.parse(extractJsonObject(rawContent)));
  } catch {
    // モデル出力が壊れたときだけ、JSON 修復用の軽い再問い合わせを1回行う。
    const repairedJson = await repairJsonResponse(client, rawContent);
    return resultSchema.parse(JSON.parse(repairedJson));
  }
};

const reviewSingleFile = async (client: CopilotClient, input: {
  template: string;
  reviewCriteria: string;
  file: { path: string; content: string };
}) => {
  // 各ファイルごとに独立したセッションを作り、レビュー文脈が混ざらないようにする。
  const session = await client.createSession({
    model: defaultReviewConfig.model,
    streaming: defaultReviewConfig.streaming,
    onPermissionRequest: approveAll,
    availableTools: [],
    systemMessage: {
      mode: "replace",
      content: buildSystemPrompt(defaultReviewConfig.maxFindingsPerFile),
    },
  });

  try {
    if (defaultReviewConfig.streaming) {
      // review でも streaming を有効化した場合は、生成途中の文字列を stderr に流す。
      session.on("assistant.message_delta", (event) => {
        process.stderr.write(event.data.deltaContent ?? "");
      });
      session.on("session.idle", () => {
        process.stderr.write("\n");
      });
    }

    // 1ファイルずつ短いセッションで処理し、長文プロンプトによるタイムアウトを避ける。
    const response = await session.sendAndWait({
      prompt: buildUserPrompt(input),
    });

    const content = response?.data.content;
    if (!content) {
      throw new Error(`${input.file.path} のレビュー結果を受け取れませんでした。`);
    }

    return parseReviewResult(client, content);
  } finally {
    await session.disconnect();
  }
};

const main = async () => {
  // 1. レビュー対象の Markdown を列挙する。
  const markdownFiles = await listMarkdownFiles(defaultReviewConfig.targetDir);

  // 2. モデルへ渡しやすいように、相対パスと本文をセットにした配列へ変換する。
  const filePayload = await Promise.all(
    markdownFiles.map(async (filePath) => ({
      path: toWorkspaceRelative(filePath, defaultReviewConfig.workspaceRoot),
      content: await readText(filePath),
    })),
  );

  // 3. 全ファイル共通で使うテンプレートとレビュー基準を読む。
  const [template, reviewCriteria] = await Promise.all([
    readText(defaultReviewConfig.templatePath),
    readText(defaultReviewConfig.reviewCriteriaPath),
  ]);

  // 4. Copilot SDK クライアントを作る。ここから各レビュー用セッションを生成する。
  const client = new CopilotClient({
    ...(process.env.COPILOT_CLI_PATH ? { cliPath: process.env.COPILOT_CLI_PATH } : {}),
    ...(process.env.GITHUB_TOKEN ? { githubToken: process.env.GITHUB_TOKEN } : {}),
  });

  try {
    const results: ReviewOutput["results"] = [];

    // 5. ファイルを1本ずつレビューする。
    //    ここでは逐次実行しているため、各レビューの完了を待ってから次へ進む。
    //    セッションは reviewSingleFile 内で毎回作り直しているので、文脈は分離される。
    for (const file of filePayload) {
      const result = await reviewSingleFile(client, {
        template,
        reviewCriteria,
        file,
      });
      results.push(result);
    }

    // 6. ファイル単位の結果をローカルで集計し、最終出力の形に整える。
    const validated = reviewOutputSchema.parse({
      summary: buildSummary(results),
      results,
    });

    // 7. 最終結果を JSON として標準出力へ出す。
    process.stdout.write(`${JSON.stringify(validated, null, 2)}\n`);
  } finally {
    // 8. 途中で失敗しても、SDK クライアントは必ず停止する。
    await client.stop();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});