# AGENTS.md

## Toolchain (get these wrong & nothing works)

- **Package manager:** `pnpm@9.10.0` (locked via `package.json` `packageManager` field)
- **Node:** `20.17.0` (`.nvmrc` + Volta in `package.json`)
- **Formatting:** Biome, line width `100`, double quotes, semicolons, trailing commas
- **TypeScript:** strict + `noUncheckedIndexedAccess` (every index access includes `| undefined`) + `exactOptionalPropertyTypes` (no passing `undefined` to optional fields)

## Commands

```sh
pnpm dev              # dev server (localhost:3000)
pnpm typecheck        # tsc --noEmit
pnpm lint             # biome lint
pnpm test             # vitest run (node env, no DOM — React component tests need polyfills)
pnpm build            # production build
pnpm check            # biome check (lint + format validation, no write)
```

CI runs `typecheck` → `lint` → `test` → `build`. Pre-commit runs `biome check --write` via lint-staged.

## Architecture

```
src/app/           # Next.js App Router pages (server components)
src/components/    # UI components (both server and "use client")
src/lib/effect/    # Effect services (server-only — never imported by client components)
content/           # Keystatic CMS content (YAML + MDX in posts/)
keystatic.config.ts  # CMS schema + GitHub storage config
```

- **Keystatic admin:** `/keystatic` (SPA, OAuth via GitHub App) — edits commit directly to the repo in production
- **Content service:** `src/lib/effect/content-service.ts` — typed reader pattern (`Context.Tag`) with `ContentNotFoundError` | `ContentReadError`
- **Email:** `src/lib/effect/email-service.ts` — Resend via Effect (with retry policy). Server action in `src/app/contact/actions.ts`
- **Feature flags:** `content/feature-flags/` controls `showWriting` and `showContact`

## Type conventions

- Singletons return `type ContentError = ContentNotFoundError | ContentReadError`
- Collections (list methods) swallow errors → empty arrays (with `console.error` logging)
- Read all singletons/collections via `ContentService`, never directly from the filesystem
- `src/types/content/` mirrors the Keystatic schema — update both when changing a content model

## Design system (dark-only, no light mode)

- Tailwind v4 with shadcn/ui (Base UI primitives)
- Fonts: IBM Plex Sans (body/headings), IBM Plex Mono (labels/nav/code) — loaded via `next/font/google`
- Primary accent: warm amber `oklch(75% 0.15 70)` — mapped to Tailwind `--primary`
- Background: `#0b0d12` with a dot-grid overlay (22px grid, radial-gradient on `body`)
- Cards: `#0e1117`, borders: `rgba(255,255,255,.08–.18)`
- No light mode exists, no toggle. All `:root` and `.dark` CSS blocks are identical
- Body background image is intentional branding — do not remove

## Content changes

Content edits go through Keystatic admin or directly editing YAML files in `content/`. Schema defined in `keystatic.config.ts`. When adding a new field:
1. Add it to the Keystatic schema
2. Add it to the corresponding type in `src/types/content/singletons.ts`
3. Handle it in the content service mapping (`src/lib/effect/content-service.ts`)
4. Update the component that consumes it
5. Add the field to the YAML content file

## Vercel deployment

- Domains: `alexmorask.dev` (primary), `alexmorask.com` (redirect)
- Env vars in Vercel: `RESEND_API_KEY`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`
- DNS: managed by Vercel (domains purchased there)
