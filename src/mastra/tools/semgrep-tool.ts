import { createTool } from "@mastra/core/tools";
import { execa } from "execa";
import { z } from "zod";

export const semgrepTool = createTool({
  id: "semgrep-tool",
  description: "Run Semgrep against a repository path and return the JSON scan results.",
  inputSchema: z.object({
    path: z.string().describe("Repository path to scan with Semgrep"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    exitCode: z.number(),
    results: z.unknown().optional(),
    error: z.string().optional(),
  }),

  execute: async ({ path }) => {
    const { stdout } = await execa("semgrep", [
      "--config=auto",
      path,
      "--json"
    ], {
      reject: false,
    });

    try {
      return {
        success: true,
        exitCode: 0,
        results: JSON.parse(stdout),
      };
    } catch {
      return {
        success: false,
        exitCode: 1,
        error: stdout || "Semgrep did not return valid JSON output.",
      };
    }
  }
}); 
