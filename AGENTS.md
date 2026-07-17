# AGENTS.md

## Toolchain

- **pnpm only** — `packageManager: "pnpm@9.10.0"` and Volta enforce it. No npm/yarn.
- **Node >= 24.18.0** (see `.nvmrc`, `engines`, and Volta config).
- **Biome** handles both linting and formatting (no ESLint/Prettier). Config: `biome.json`.
- **TypeScript 6** — `tsconfig.json` uses `ignoreDeprecations: "6.0"`.
- **Tailwind 4** — PostCSS-based (`@tailwindcss/postcss`), not the v3 CLI.
- Path alias `@/*` → `./src/*` (`tsconfig.json`, `vitest.config.ts`).

## Environment

Copy `.env.example` to `.env.local` before running anything locally.

- `EMAIL_PROVIDER` — `local` (Mailpit via nodemailer) or `live` (Resend, needs `RESEND_API_KEY`). Defaults to `live` if unset.
- `NEXT_PUBLIC_KEYSTATIC_STORAGE` — `local` (filesystem) or `github` (GitHub API, production). **Must** be `NEXT_PUBLIC_`-prefixed, not just `KEYSTATIC_STORAGE` — it's read in Keystatic's client bundle, and a server-only var silently falls back to `local` mode there. This exact bug shipped once already (see `72bc35a`); don't rename it back.
- `VERCEL_OIDC_TOKEN` — provided by Vercel, not needed for local dev.

## Commands

Primary quality command is `pnpm check` (Biome lint + format check), not `pnpm lint`.

```sh
pnpm check       # Biome lint + format (use this, not `pnpm lint`)
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest run
pnpm build       # next build
pnpm dev         # next dev at localhost:3000
pnpm dev:mail    # next dev + Mailpit on :1025 for local email testing
```

CI runs `typecheck → check → test → build` in that order (.github/workflows/ci.yml).
Pre-commit hooks (Husky + lint-staged) run `biome check --write` on staged files.

## Architecture

### Keystatic CMS

Content is stored as files under `content/` and managed via Keystatic's git-based CMS.
Two storage modes, selected by `NEXT_PUBLIC_KEYSTATIC_STORAGE`:
- `local` (default) — filesystem reads, used locally and in CI
- `github` — reads from the GitHub API (production)

Content types are defined in `keystatic.config.ts` at the repo root:
- Collections: `tags`, `navLinks`, `posts`
- Singletons: `home`, `about`, `writing`, `featureFlags`, `contact`

The admin UI lives at `/keystatic/[[...params]]` with an API at `/api/keystatic/[...params]`.
Client code reads content via Effect-based `ContentService` (`src/lib/effect/content-service.ts`).

`next.config.ts` sets `allowedDevOrigins: ["127.0.0.1"]` to silence a Next.js
cross-origin dev warning triggered by the Keystatic admin UI — don't remove it.

### Effect patterns

Data access uses Effect's service/context pattern:
- `src/lib/effect/content-service.ts` — `ContentServiceLive` reads Keystatic content
- `src/lib/effect/email-service.ts` — `EmailServiceLocal` (Mailpit) / `EmailServiceLive` (Resend)
- `src/lib/effect/runtime.ts` — `MainLive` merges both layers
- `src/lib/effect/retry.ts` — exponential backoff policy (200ms, 3 retries)
- `src/lib/effect/errors.ts` — `ContentNotFoundError`, `ContentReadError`, `EmailSendError`

Server components call `Effect.runPromise(program.pipe(Effect.provide(ContentServiceLive)))`.
Errors from nullable content are caught with `.pipe(Effect.catchAll(...))` to provide fallbacks.

### Email provider switching

`EMAIL_PROVIDER=local` → nodemailer → localhost:1025 (Mailpit via `pnpm dev:mail`)
`EMAIL_PROVIDER=live`  → Resend API (needs `RESEND_API_KEY`)

### Feature flags

`showWriting` and `showContact` are Keystatic-managed booleans in `content/feature-flags/`.
They gate entire page sections — check `src/app/page.tsx` for usage pattern.

### MDX writing pages

Posts use MDX rendered via `next-mdx-remote-client` in RSC mode (`src/lib/mdx.tsx`).
Plugins: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`.

## Testing

- **Vitest** with `environment: "node"`, test files at `src/**/*.test.ts`
- Effect tests use `TestClock.adjust(...)` to simulate time passage for retry policies
- Dynamic `await import(...)` is used in test files for Effect modules (`content-service`, `errors`) — do not convert these to static imports

## UI / Components

- shadcn/ui + `@base-ui/react` as a headless primitive layer
- `src/components/ui/` contains hand-maintained components (`badge`, `button`, `input`, `label`, `textarea`). Do not regenerate with `shadcn` CLI.
- `src/lib/utils.ts` exports the standard `cn()` helper (clsx + tailwind-merge)
- Fonts: IBM Plex Sans + IBM Plex Mono via `next/font/google` in the root layout
