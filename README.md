# portfolio

Personal portfolio and system design write-ups — [alexmorask.dev](https://alexmorask.dev)

Staff Software Engineer specializing in Billing, Payments, and Monetization.
This site hosts original system design write-ups (personal projects and
generalized case studies) alongside an about/resume page.

## Stack

- [Next.js](https://nextjs.org/) (App Router) — dynamic sitemap, robots, and per-post
  Open Graph images via Next's built-in file conventions
- [Effect](https://effect.website/) — server-side data/resilience layer
- [Keystatic](https://keystatic.com/) — git-based CMS
- MDX write-ups via `next-mdx-remote-client`, with `rehype-pretty-code` (Shiki) syntax
  highlighting and interactive diagram components embeddable straight in content
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- [Resend](https://resend.com/) + [Nodemailer](https://nodemailer.com/) — contact form email
- [Vercel Analytics](https://vercel.com/analytics)
- [Vitest](https://vitest.dev/) — unit testing
- [Biome](https://biomejs.dev/) — lint & format
- CI via [GitHub Actions](https://github.com/features/actions)
- Deployed on [Vercel](https://vercel.com/)

## Development

Requires [Node >= 24](.nvmrc) and [pnpm](https://pnpm.io/).

```sh
pnpm install      # install dependencies
pnpm dev          # dev server at localhost:3000
pnpm dev:mail     # dev server + Mailpit for email testing
```

`pnpm dev:mail` requires [Mailpit](https://mailpit.axllent.org/) installed locally
(e.g. `brew install mailpit`) — it captures contact form emails in dev instead of
sending them via Resend.

Content (pages, nav links, tags, and posts) is managed through the Keystatic admin UI
at `/keystatic` while running the dev server locally.

### Quality

```sh
pnpm typecheck    # TypeScript type checking
pnpm check        # Biome lint + format check
pnpm test         # Vitest
pnpm build        # production build
```

Pre-commit hooks (Husky + lint-staged) run `biome check` on staged files.
CI (GitHub Actions) runs the full quality pipeline on every push/PR to `main`.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the contribution workflow and
[AGENTS.md](./AGENTS.md) for architecture notes and conventions.

## License

MIT — see [LICENSE](./LICENSE).
