import { createTool } from "@mastra/core/tools";
import { glob } from "glob";
import fs from "fs-extra";
import { z } from "zod";

export const scanTool = createTool({
  id: "scan-tool",
  description: "Read source files from a repository path for code review.",
  inputSchema: z.object({
    path: z.string().describe("Repository path to scan"),
  }),
  outputSchema: z.array(
    z.object({
      file: z.string(),
      content: z.string(),
    }),
  ),

  execute: async ({ path }) => {
    const files = await glob(`${path}/**/*.{js,ts,tsx,jsx,java,py}`, {
      ignore: ["**/node_modules/**", "**/.git/**"],
      nodir: true,
    });

    const result = [];

    for (const file of files) {
      const content = await fs.readFile(file, "utf8");

      result.push({
        file,
        content
      });
    }

    return result;
  }
});
