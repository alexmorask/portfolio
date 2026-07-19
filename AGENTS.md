# AGENTS.md

## Toolchain

- **pnpm only** — `packageManager: "pnpm@9.10.0"` and Volta enforce it. No npm/yarn.
- **Node >= 24.18.0** (see `.nvmrc`, `engines`, and Volta config).
- **Biome** handles both linting and formatting (no ESLint/Prettier). Config: `biome.json`.
- **TypeScript 6** — `tsconfig.json` uses `ignoreDeprecations: "6.0"` and turns on
  `noUncheckedIndexedAccess`, so `array[i]` types as `T | undefined`, not `T`. Narrow it
  (a guard, a typed accessor, `.at()` with a check) rather than asserting past it with `!`.
- **Tailwind 4** — PostCSS-based (`@tailwindcss/postcss`), not the v3 CLI.
- Path alias `@/*` → `./src/*` (`tsconfig.json`, `vitest.config.ts`).

## Environment

Copy `.env.example` to `.env.local` before running anything locally.

- `EMAIL_PROVIDER` — `local` (Mailpit via nodemailer) or `live` (Resend, needs `RESEND_API_KEY`). Defaults to `live` if unset.
- `NEXT_PUBLIC_KEYSTATIC_STORAGE` — `local` (filesystem) or `github` (GitHub API, production). **Must** be `NEXT_PUBLIC_`-prefixed, not just `KEYSTATIC_STORAGE` — it's read in Keystatic's client bundle, and a server-only var silently falls back to `local` mode there. This exact bug shipped once already (see `72bc35a`); don't rename it back.
- `VERCEL_OIDC_TOKEN` — provided by Vercel, not needed for local dev.

The production site URL (`https://alexmorask.dev`) is a hardcoded constant in
`src/lib/site.ts` (`SITE_URL`), not an env var — it's used by `metadataBase`,
`sitemap.ts`, `robots.ts`, and the OG image alt text. Update it there if the domain
ever changes.

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
- Singletons: `home`, `about`, `writing`, `contact`

The `posts` collection's `cardImage` field (`fields.image`, optional) is the thumbnail
shown on the Writing page's featured/list cards and the home page's latest-post card —
see `src/components/writing/featured-post-card.tsx`, `post-list-item.tsx`, and
`src/components/home/latest-post-card.tsx`. All three fall back to a striped SVG
placeholder when unset; none of them should ever render a hardcoded placeholder for a
post that actually has a `cardImage` — check that fallback branch stays wired up if you
touch these.

The admin UI lives at `/keystatic/[[...params]]` with an API at `/api/keystatic/[...params]`.
Client code reads content via Effect-based `ContentService` (`src/lib/effect/content-service.ts`).
`ContentService.listPosts()` awaits each post's MDX body — the Keystatic reader's
`.all()` returns it as a lazy `() => Promise<string>`, not an eager string.

`next.config.ts` sets `allowedDevOrigins: ["127.0.0.1"]` to silence a Next.js
cross-origin dev warning triggered by the Keystatic admin UI — don't remove it.

There is no feature-flag system in this repo. All pages/sections (Writing, Contact,
etc.) are always shown; don't reintroduce a flags singleton to gate them.

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

### MDX writing pages

Posts use MDX rendered via `next-mdx-remote-client` in RSC mode (`src/lib/mdx.tsx`).
Plugins: `remark-gfm`; `rehype-pretty-code` (Shiki, `github-dark-default` theme,
`keepBackground: false`) for fenced code block syntax highlighting; `rehype-slug` +
`rehype-autolink-headings` for heading anchors.

Interactive diagrams (sequence/flow/table components used inside post bodies) are
registered once in `src/lib/diagrams.ts`'s `diagramRegistry` and consumed two ways:
- `getKeystaticComponents()` → wired into the `posts.body` `fields.mdx({ components })`
  so editors can insert them from the Keystatic MDX toolbar
- `getMdxComponents()` → wired into `MDXContent`'s `components` prop so they render on
  the actual page

To add a new diagram: build the component under `src/components/diagrams/`, then add
one entry to `diagramRegistry` — both the editor and the renderer pick it up from there,
no other wiring needed. Several diagrams (`RetryDoubleChargeDiagram`,
`EarlyKeyMintDiagram`, `StuckInProgressDiagram`) are thin wrappers around the shared
`StepFlowDiagram` primitive (`src/components/diagrams/step-flow-diagram.tsx`), which
renders two separate `<svg>`s (one per breakpoint, toggled with `sm:hidden` /
`hidden sm:block`) with different node/font sizing — not one SVG scaled by CSS. An SVG
sized by its `viewBox` scales to fill its container, so shrinking `viewBox`-relative
dimensions for "mobile" doesn't reliably shrink the rendered result the way changing
plain CSS would; if you need to retune those sizes, adjust `DESKTOP_CONFIG` /
`MOBILE_CONFIG` in that file rather than fighting the scaling with container width.

The table of contents (`src/components/writing/table-of-contents.tsx`) is populated by
`extractToc` (`src/lib/table-of-contents.ts`), which parses the raw MDX with
`remark-parse` and slugs headings with `github-slugger` — the same slugger `rehype-slug`
uses — so ToC anchor ids stay in sync with the rendered heading ids without needing to
inspect the rendered HTML.

### Loading states

Every top-level route (`/`, `/about`, `/contact`, `/writing`, `/writing/[slug]`) has a
sibling `loading.tsx` that Next automatically wraps in a Suspense boundary. They're
built from the shared `Skeleton` primitive (`src/components/ui/skeleton.tsx`) and
mirror each real page's layout closely enough to avoid a layout shift on swap-in.

`ContactForm` is rendered for real (not skeletonized) in `contact/loading.tsx` because
it's static and has no data dependency — same reasoning does not extend to components
that render populated-looking content: the home page's `loading.tsx` skeletonizes its
terminal-card slot rather than rendering the real `AnimatedTerminalCard`, because a
fully "loaded"-looking animated component sitting next to gray skeleton bars for
everything else around it reads as broken, not fast. If you add a `loading.tsx` for a
new route, only substitute a real component for a skeleton block when that component
has zero data dependency *and* doesn't look like populated content on its own.

In dev mode, Turbopack recompiles a route on the first hit after any file edit under
that route's module graph — a multi-hundred-ms "stuck skeleton" on one navigation right
after saving a file is normal and not a loading-state bug; it disappears on the next
navigation once the route is warm, and doesn't happen in a production build.

### SEO & metadata

- `src/app/sitemap.ts` — lists static routes plus every published post (`publishedAt`
  set), reading through `ContentService.listPosts()`.
- `src/app/robots.ts` — disallows `/keystatic` and `/api/`, points at `/sitemap.xml`.
- `src/app/writing/[slug]/opengraph-image.tsx` — per-post OG image generated with
  `next/og`'s `ImageResponse` (Next's built-in successor to the standalone `@vercel/og`
  package — same Satori renderer, no extra dependency; see `src/app/icon.tsx` for the
  same pattern already in use for the favicon). Reads the post via `ContentService`,
  falls back to a generic image if the slug doesn't resolve.
- `writing/[slug]/page.tsx` exports `generateMetadata`, giving each post its own
  `title`/`description`/OpenGraph/Twitter tags instead of inheriting the root layout's
  generic ones — this is what makes the per-post OG image actually pair with correct
  share-card text.
- Root layout sets `metadataBase: new URL(SITE_URL)` so relative OG image URLs resolve
  correctly.

### Analytics

`@vercel/analytics`'s `<Analytics />` is mounted in the root layout (`src/app/layout.tsx`).
It's a no-op outside of a Vercel deployment, so it won't send anything in local dev.

## Testing

- **Vitest** with `environment: "node"`, test files at `src/**/*.test.ts`
- Effect tests use `TestClock.adjust(...)` to simulate time passage for retry policies
- Dynamic `await import(...)` is used in test files for Effect modules (`content-service`, `errors`) — do not convert these to static imports

## UI / Components

- shadcn/ui + `@base-ui/react` as a headless primitive layer
- `src/components/ui/` contains hand-maintained components (`badge`, `button`, `input`, `label`, `skeleton`, `textarea`). Do not regenerate with `shadcn` CLI.
- `src/lib/utils.ts` exports the standard `cn()` helper (clsx + tailwind-merge)
- Fonts: IBM Plex Sans + IBM Plex Mono via `next/font/google` in the root layout
