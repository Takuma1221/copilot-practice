import { CopilotClient, approveAll } from "@github/copilot-sdk";

const main = async () => {
  const client = new CopilotClient({
    ...(process.env.COPILOT_CLI_PATH ? { cliPath: process.env.COPILOT_CLI_PATH } : {}),
    ...(process.env.GITHUB_TOKEN ? { githubToken: process.env.GITHUB_TOKEN } : {}),
  });

  try {
    // 最小構成ではツールを持たないセッションを作り、メッセージ送受信だけを見る。
    const session = await client.createSession({
      model: process.env.COPILOT_MODEL ?? "gpt-5",
      onPermissionRequest: approveAll,
      availableTools: [],
      systemMessage: {
        mode: "replace",
        content: "You are a concise assistant. Answer in Japanese in 2 short sentences.",
      },
    });

    const response = await session.sendAndWait({
      prompt: "Copilot SDK と Copilot CLI の違いを 2 文で説明して。",
    });

    console.log(response?.data.content ?? "No response received.");
    await session.disconnect();
  } finally {
    await client.stop();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});