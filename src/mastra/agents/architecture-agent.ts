import { Agent } from "@mastra/core/agent";
import { githubTool } from "../tools/github-tool";
import { Memory } from "@mastra/memory";

export const architectureAgent = new Agent({
    id: "architecture-agent",
    name: "architecture-agent",
      instructions: `
        Analyze:
        - structure
        - module boundaries
        - bad design
        - scalability
        - maintainability
        `,
    model: 'mistral/mistral-medium-2508',
    memory: new Memory(),
});