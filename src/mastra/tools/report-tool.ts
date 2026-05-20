import { createTool } from "@mastra/core/tools";
import fs from "fs-extra";
import { z } from "zod";

export const reportTool = createTool({
  id: "report-tool",
  description: "Save a code review report as report.json.",
  inputSchema: z.object({
    data: z.unknown().describe("Report data to save"),
  }),
  outputSchema: z.object({
    saved: z.boolean(),
    path: z.string(),
  }),

  execute: async ({ data }) => {
    const path = "./report.json";
    await fs.writeJson(path, data, { spaces: 2 });

    return {
      saved: true,
      path
    };
  }
});
