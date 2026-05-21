import { Agent } from "@mastra/core/agent";
import { githubTool } from "../tools/github-tool";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

export const repoAgent = new Agent({
    id: "repo-agent",
    name: "repo-agent",
    instructions:
        "Clone repository and detect branch.",
    model: 'mistral/mistral-medium-2508',
    tools: {
        githubTool
    },
    memory: new Memory({
        storage: new LibSQLStore({
            id: "repo-agent-memory",
            url: "file:./mastra.db"
        })
    }),
});