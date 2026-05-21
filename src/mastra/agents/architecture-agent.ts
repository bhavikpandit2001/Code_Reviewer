import { Agent } from "@mastra/core/agent";
import { githubTool } from "../tools/github-tool";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

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
  memory: new Memory({
    storage: new LibSQLStore({
      id: "architecture-agent-memory",
      url: "file:./mastra.db"
    })
  }),
});