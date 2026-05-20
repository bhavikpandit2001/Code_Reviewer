import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { repoAgent } from "../agents/repo-agent";
import { staticAgent } from "../agents/static-agent";
import { architectureAgent } from "../agents/architecture-agent";
import { reportAgent } from "../agents/report-agent";

// ─── Step 1: Fetch Repo ───────────────────────────────────────────────────────

const fetchRepoStep = createStep({
  id: "fetch-repo",
  inputSchema: z.object({
    githubUrl: z.string(),
  }),
  outputSchema: z.object({
    repoData: z.string(),
  }),
  execute: async ({ inputData }) => {
    const response = await repoAgent.generate(inputData.githubUrl);
    return { repoData: response.text };
  },
});

// ─── Step 2a: Static Analysis ─────────────────────────────────────────────────

const staticAnalysisStep = createStep({
  id: "static-analysis",
  inputSchema: z.object({
    repoData: z.string(),
  }),
  outputSchema: z.object({
    repoData: z.string(),
    staticReport: z.string(),
  }),
  execute: async ({ inputData }) => {
    const response = await staticAgent.generate(inputData.repoData);
    return {
      repoData: inputData.repoData,
      staticReport: response.text,
    };
  },
});

// ─── Step 2b: Architecture Analysis ──────────────────────────────────────────

const architectureStep = createStep({
  id: "architecture-analysis",
  inputSchema: z.object({
    repoData: z.string(),
  }),
  outputSchema: z.object({
    archReport: z.string(),
  }),
  execute: async ({ inputData }) => {
    const response = await architectureAgent.generate(inputData.repoData);
    return { archReport: response.text };
  },
});

// ─── Step 3: Final Report ─────────────────────────────────────────────────────
// After .parallel(), inputData is keyed by each step's id — not a flat object.

const finalReportStep = createStep({
  id: "final-report",
  inputSchema: z.object({
    "static-analysis": z.object({
      repoData: z.string(),
      staticReport: z.string(),
    }),
    "architecture-analysis": z.object({
      archReport: z.string(),
    }),
  }),
  outputSchema: z.object({
    report: z.string(),
  }),
  execute: async ({ inputData }) => {
    const staticReport = inputData["static-analysis"].staticReport;
    const archReport = inputData["architecture-analysis"].archReport;

    const response = await reportAgent.generate(
      JSON.stringify({ staticReport, archReport })
    );
    return { report: response.text };
  },
});

// ─── Workflow ─────────────────────────────────────────────────────────────────

export const reviewWorkflow = createWorkflow({
  id: "github-review",
  inputSchema: z.object({
    githubUrl: z.string(),
  }),
  outputSchema: z.object({
    report: z.string(),
  }),
})
  .then(fetchRepoStep)
  .parallel([staticAnalysisStep, architectureStep])
  .then(finalReportStep)
  .commit();