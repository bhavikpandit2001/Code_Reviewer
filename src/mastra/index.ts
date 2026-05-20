
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { DuckDBStore } from "@mastra/duckdb";
import { MastraCompositeStore } from '@mastra/core/storage';
import { Observability, MastraStorageExporter, MastraPlatformExporter, SensitiveDataFilter } from '@mastra/observability';
import { githubTool } from './tools/github-tool.js';
import { reportTool } from './tools/report-tool.js';
import { scanTool } from './tools/scan-tool.js';
import { semgrepTool } from './tools/semgrep-tool.js';
import { weatherTool } from './tools/weather-tool.js';
import { reviewWorkflow } from './workflows/review-workflow.js';
import { repoAgent } from './agents/repo-agent.js';


export const mastra = new Mastra({
  workflows: { reviewWorkflow },
  agents: {
    repoAgent,
  },
  tools: {
    githubTool,
    reportTool,
    scanTool,
    semgrepTool,
    weatherTool,
  },
  scorers: { },
  storage: new MastraCompositeStore({
    id: 'composite-storage',
    default: new LibSQLStore({
      id: "mastra-storage",
      url: "file:./mastra.db",
    }),
    domains: {
      observability: await new DuckDBStore().getStore('observability'),
    }
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'mastra',
        exporters: [
          new MastraStorageExporter(), // Persists observability events to Mastra Storage
          new MastraPlatformExporter(), // Sends observability events to Mastra Platform (if MASTRA_PLATFORM_ACCESS_TOKEN is set)
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
        ],
      },
    },
  }),
});
