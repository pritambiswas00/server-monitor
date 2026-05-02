# Server Monitor

A full-stack server monitoring platform built as a **Turborepo monorepo**. It provides a REST API backend for managing remote servers, log sources, and log analysis jobs, alongside a Next.js web frontend.

## Monorepo Structure

### Apps

| App | Description |
|-----|-------------|
| `apps/monitor` | NestJS REST API backend (main application) |
| `apps/web` | Next.js web frontend |
| `apps/docs` | Next.js documentation site |

### Shared Packages

| Package | Description |
|---------|-------------|
| `packages/ui` | Shared React component library (`Button`, `Card`, `Code`) |
| `packages/eslint-config` | Shared ESLint configurations for Next.js and NestJS |
| `packages/typescript-config` | Shared `tsconfig.json` presets |

---

## Backend — `apps/monitor`

A [NestJS](https://nestjs.com/) API with [TypeORM](https://typeorm.io/) and a [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) database. Business logic uses [fp-ts](https://gcanti.github.io/fp-ts/) for functional, type-safe error handling.

### API Modules

- **Users** — CRUD for user accounts (`/users`)
- **Auth** — Global authentication guard protecting all routes (`/auth`)
- **Remote Servers** — Manage remote servers per user (`/remote-server`)
- **Log Sources** — Configure log sources attached to remote servers (`/log-source`)
- **Log Analysis Jobs** — Define and run log analysis jobs (`/log-analysis-job`)

### API Docs

Swagger UI is available at `http://localhost:3000/docs` when the server is running.

### Tech Stack

- [NestJS](https://nestjs.com/) v11
- [TypeORM](https://typeorm.io/) + better-sqlite3
- [class-validator](https://github.com/typestack/class-validator) + [class-transformer](https://github.com/typestack/class-transformer) for DTO validation
- [fp-ts](https://gcanti.github.io/fp-ts/) for functional error handling
- [Vitest](https://vitest.dev/) for unit testing

---

## Getting Started

### Prerequisites

- Node.js >= 18
- [pnpm](https://pnpm.io/) 9.x

### Install dependencies

```sh
pnpm install
```

### Run the API in development

```sh
cd apps/monitor
pnpm start:dev
```

The API will be available at `http://localhost:3000`.

### Run the web frontend

```sh
cd apps/web
pnpm dev
```

### Run all apps in parallel (from repo root)

```sh
pnpm dev
```

### Build all apps

```sh
pnpm build
pnpm dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=docs
```

Without global `turbo`:

```sh
npx turbo build --filter=docs
pnpm exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
pnpm exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
pnpm exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
pnpm exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
pnpm exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
