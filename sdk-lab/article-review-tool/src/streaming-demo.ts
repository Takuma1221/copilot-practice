import { CopilotClient, approveAll } from "@github/copilot-sdk";

const main = async () => {
  const client = new CopilotClient({
    ...(process.env.COPILOT_CLI_PATH ? { cliPath: process.env.COPILOT_CLI_PATH } : {}),
    ...(process.env.GITHUB_TOKEN ? { githubToken: process.env.GITHUB_TOKEN } : {}),
  });

  try {
    const session = await client.createSession({
      model: process.env.COPILOT_MODEL ?? "gpt-5",
      streaming: true,
      onPermissionRequest: approveAll,
      availableTools: [],
      systemMessage: {
        mode: "replace",
        content: "You are a concise assistant. Answer in Japanese.",
      },
    });

    let chunkCount = 0;
    // streaming では delta イベントを拾うと、生成途中の文字列をそのまま観察できる。
    session.on("assistant.message_delta", (event) => {
      chunkCount += 1;
      process.stdout.write(event.data.deltaContent ?? "");
    });
    session.on("session.idle", () => {
      process.stdout.write("\n");
    });

    await session.sendAndWait({
      prompt: "streaming 応答の利点を 3 つ、箇条書きで短く説明して。",
    });

    console.error(`Streaming chunks received: ${chunkCount}`);
    await session.disconnect();
  } finally {
    await client.stop();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});