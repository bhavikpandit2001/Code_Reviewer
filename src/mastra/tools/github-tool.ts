import { createTool } from "@mastra/core/tools";
import { simpleGit } from "simple-git";
import fs from "fs-extra";
import { z } from "zod";

export const githubTool = createTool({
  id: "github-tool",
  description: "Clone a GitHub repository into the local workspace and check out its default branch.",
  inputSchema: z.object({
    url: z.string().url().describe("Git repository URL to clone"),
  }),
  outputSchema: z.object({
    path: z.string(),
    branch: z.string(),
  }),

  execute: async ({ url }) => {
    const repoName = url.split("/").pop()?.replace(".git", "") || "repo";
    const path = `./workspace/${repoName}`;

    await fs.remove(path);

    const git = simpleGit();
    await git.clone(url, path);

    const repoGit = simpleGit(path);

    const branches = await repoGit.branch();

    const branch =
      branches.all.includes("main")
        ? "main"
        : branches.all.includes("master")
        ? "master"
        : branches.current;

    await repoGit.checkout(branch);

    return {
      path,
      branch
    };
  }
});
