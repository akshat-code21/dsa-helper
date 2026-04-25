# Chatbot

A full-stack chat application built with [Next.js](https://nextjs.org) (App Router), streaming AI responses through [OpenRouter](https://openrouter.ai) and the [Vercel AI SDK](https://ai-sdk.dev), with authentication via [Better Auth](https://www.better-auth.com) and persistence in PostgreSQL using [Prisma](https://www.prisma.io).

## Features

- **Chat UI** with conversation history, titles, and server-side message storage
- **Auth** — email/password and optional GitHub OAuth
- **Models** — configured via OpenRouter (see `app/api/chat/route.ts` for the active model)
- **Database** — users, sessions, and per-user conversations/messages

## Requirements

- Node.js 20+
- PostgreSQL database
- An [OpenRouter](https://openrouter.ai) API key
- (Optional) GitHub OAuth app credentials if you use GitHub sign-in

## Environment variables

Create a `.env` file in the project root. Typical variables:


| Variable               | Purpose                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string (used by Prisma and the auth layer)                                           |
| `OPENROUTER_API_KEY`   | API key for OpenRouter (server-side)                                                                       |
| `NEXT_PUBLIC_API_URL`  | Public base URL of the app, used for client/server API calls (e.g. `http://localhost:3000` in development) |
| `BETTER_AUTH_URL`      | Base URL passed to the Better Auth client (usually matches your app URL)                                   |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID (if using GitHub login)                                                             |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret (if using GitHub login)                                                         |


If Better Auth or your deployment needs additional secrets (for example a signing secret), add them as required by your [Better Auth](https://www.better-auth.com/docs) setup.

## Setup

1. **Install dependencies**
  ```bash
   npm install
  ```
   `postinstall` runs `prisma generate` so the Prisma client is created automatically.
2. **Configure the database**
  Set `DATABASE_URL`, then create and apply migrations:
3. **Run the development server**
  ```bash
   npm run dev
  ```
4. Open [http://localhost:3000](http://localhost:3000). Unauthenticated users are sent to the sign-in flow.

## Scripts


| Command         | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start Next.js in development            |
| `npm run build` | Production build                        |
| `npm start`     | Start production server (after `build`) |
| `npm run lint`  | Run ESLint                              |


## Project structure (high level)

- `app/` — App Router pages, API routes (e.g. `app/api/chat`), and UI
- `lib/` — Auth server/client setup and shared utilities
- `prisma/` — Schema and migrations
- `prompts/` — System and helper prompts for the model

