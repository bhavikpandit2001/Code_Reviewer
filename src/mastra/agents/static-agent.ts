import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { scanTool } from "../tools/scan-tool";
import { semgrepTool } from "../tools/semgrep-tool";

export const staticAgent = new Agent({
    id: "static-agent",
    name: "static-agent",
    instructions:
    "Analyze source files and detect coding issues.",
    model: 'mistral/mistral-medium-2508',
    tools: {
        scanTool,
        semgrepTool
    },
    memory: new Memory(),
});