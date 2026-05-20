# Code Reviewer

A Mastra TypeScript project for reviewing GitHub repositories with agents, tools, and a review workflow.

## Prerequisites

- Node.js `>=22.13.0`
- npm
- An OpenAI API key for the configured `openai/gpt-5-mini` model

## Project Setup

1. Install dependencies:

```shell
npm install
```

2. Create a local environment file:

```shell
copy .env.example .env
```

If `.env.example` is not present, create `.env` manually and add:

```shell
OPENAI_API_KEY=your_api_key_here
```

Do not commit `.env` or any secret values.

3. Start Mastra Studio:

```shell
npm run dev
```

On Windows PowerShell, if script execution is blocked, use:

```shell
npm.cmd run dev
```

4. Open Mastra Studio:

```text
http://localhost:4111
```

Use Studio to run and inspect the `github-review` workflow.

## Build

Stop the dev server before building so local database files are not locked, then run:

```shell
npm run build
```

On Windows PowerShell:

```shell
npm.cmd run build
```

## Development Notes

- Mastra code lives in `src/mastra`.
- Register new agents, tools, workflows, and scorers in `src/mastra/index.ts`.
- Keep API keys and secrets in environment variables.
- Do not edit `node_modules` or generated database files directly.
