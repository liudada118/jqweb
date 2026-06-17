# Architecture

Last updated: 2026-04-01

## Overview

`guiqiao-payload` is a Next.js 16 application with Payload CMS 3.
It serves a public website from the App Router and embeds the Payload admin panel and APIs in the same app.
The project uses SQLite by default for local development.

## Stack

| Area | Technology | Notes |
| --- | --- | --- |
| Frontend | Next.js 16.2.1 | App Router, Turbopack in dev |
| CMS | Payload 3.80.0 | Admin, Local API, GraphQL |
| Database | SQLite | Default local file: `file:./guiqiao-payload.db` |
| Language | TypeScript | React 19.2.4 |
| Styling | CSS, SCSS, Tailwind | Custom SCSS is used in a few components |
| Package manager | pnpm 10 | Lockfile present |

## Directory Structure

```text
src/
  access/        Access control helpers
  app/           Next.js frontend, admin, and API routes
  blocks/        Payload content blocks
  collections/   Payload collections
  components/    Shared React and admin-facing components
  endpoints/     Custom Payload endpoints
  fields/        Field configs and editors
  Footer/        Footer global config and components
  Header/        Header global config and components
  hooks/         Payload hooks
  plugins/       Payload plugin setup
  providers/     React providers
  search/        Search helpers
  utilities/     Shared utilities
tests/           Integration and e2e tests
public/          Static assets
```

## Runtime Layout

| Area | Path | Purpose |
| --- | --- | --- |
| Frontend home | `src/app/(frontend)/page.tsx` | Public homepage |
| Dynamic content pages | `src/app/(frontend)/[slug]/page.tsx` | CMS-driven pages |
| Posts listing/detail | `src/app/(frontend)/posts/**` | Blog pages |
| Search | `src/app/(frontend)/search/page.tsx` | Frontend search |
| Admin app | `src/app/(payload)/admin/[[...segments]]/page.tsx` | Payload admin panel |
| REST API passthrough | `src/app/(payload)/api/[...slug]/route.ts` | Payload REST API |
| GraphQL API | `src/app/(payload)/api/graphql/route.ts` | Payload GraphQL |
| GraphQL Playground | `src/app/(payload)/api/graphql-playground/route.ts` | Dev GraphQL UI |
| Preview controls | `src/app/(frontend)/next/preview/route.ts` | Preview mode entry |
| Exit preview | `src/app/(frontend)/next/exit-preview/route.ts` | Preview mode exit |
| Seed route | `src/app/(frontend)/next/seed/route.ts` | Seed local content |
| Sitemap routes | `src/app/(frontend)/(sitemaps)/**` | XML sitemap output |

## Payload Configuration

Main config: `src/payload.config.ts`

Key points:

- Uses `sqliteAdapter` with `process.env.SQLITE_URL || 'file:./guiqiao-payload.db'`
- Registers collections: `Pages`, `Posts`, `Media`, `Categories`, `Users`
- Registers globals: `Header`, `Footer`
- Uses `defaultLexical` as the editor
- Exposes custom admin components such as `BeforeLogin` and `BeforeDashboard`

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `PAYLOAD_SECRET` | Payload auth and token signing secret |
| `NEXT_PUBLIC_SERVER_URL` | Base server URL used by frontend/admin helpers |
| `CRON_SECRET` | Authorization for background job execution |
| `PREVIEW_SECRET` | Preview request validation |
| `SQLITE_URL` | Optional override for local SQLite database location |

## Current Progress

| Date | Completed work | Notes |
| --- | --- | --- |
| 2026-04-01 | Local project startup | Installed dependencies, created local `.env`, and ran the dev server |
| 2026-04-01 | SCSS startup fix | Removed dependency on `@payloadcms/ui/scss` from two custom component styles to avoid Sass import failures in dev |

## Change Log

| Date | Change type | Description |
| --- | --- | --- |
| 2026-04-01 | Initial | Created the project architecture document |
| 2026-04-01 | Bug fix | Fixed dev startup by simplifying custom SCSS in `src/components/AdminBar/index.scss` and `src/components/BeforeDashboard/index.scss` |
