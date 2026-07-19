# Contributing

This is Alex Morask's personal portfolio site. It's not really open to outside
contributions, but this doc exists as the standard workflow for anyone (including
future-me, or an AI agent) making changes in this repo.

## Setup

```sh
pnpm install
cp .env.example .env.local   # fill in as needed, see AGENTS.md § Environment
pnpm dev                     # http://localhost:3000
```

Content — pages, nav links, tags, and posts — is edited through the Keystatic admin UI
at `/keystatic`, not by hand-writing files under `content/`, though hand-editing works
too since it's all just git-tracked YAML/MDX.

## Making a change

1. Branch off `main`.
2. Make your change. If you're touching architecture, conventions, or anything a future
   contributor (human or agent) would need to know to avoid re-breaking something,
   update [AGENTS.md](./AGENTS.md) in the same change — it's meant to stay current, not
   describe a past state of the repo.
3. Before opening a PR, run the full local quality gate (same steps CI runs, in order):

   ```sh
   pnpm typecheck
   pnpm check      # Biome lint + format — not `pnpm lint`, which only lints
   pnpm test
   pnpm build
   ```

   Pre-commit hooks (Husky + lint-staged) already run `biome check --write` on staged
   files, but that doesn't catch type errors, test failures, or build breakage — run the
   full gate yourself before pushing.

4. For anything with a visible UI surface, actually look at it in a browser before
   calling it done — `tsc`/`biome`/tests verify correctness, not that the feature looks
   or behaves right.

## Commit messages

This repo loosely follows [Conventional Commits](https://www.conventionalcommits.org/):
`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `ci:`, `docs:`, `revert:`. Look at
`git log` for examples. Prefer a new commit over amending once a change has been pushed
anywhere shared; amending is fine for a branch only you're working on.

## Pull requests

CI (`.github/workflows/ci.yml`) runs `typecheck → check → test → build` on every push
and PR to `main` — all four must pass before merging. There's no separate staging
environment; Vercel builds a preview deployment per PR.

## Content-only changes

If you're only editing copy/content (not code) via the Keystatic admin UI in `github`
storage mode, Keystatic commits directly to the branch you're editing on — you don't
need to run the local quality gate for a pure content change, but it still goes through
the same CI checks and PR review before landing on `main`.
