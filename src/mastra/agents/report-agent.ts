import { Agent } from "@mastra/core/agent";
import { reportTool } from "../tools/report-tool";
import { Memory } from "@mastra/memory";

export const reportAgent = new Agent({
    id: "report-agent",
    name: "report-agent",

    instructions: `
        Generate final issue report with severity.
        `,
    tools: {
        reportTool
    },
    model: 'mistral/mistral-medium-2508',
    memory: new Memory(),
});