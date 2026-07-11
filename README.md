# portfolio

Personal portfolio and system design write-ups — [alexmorask.dev](https://alexmorask.dev)

Staff Software Engineer specializing in Billing & Payments. This site hosts original
system design write-ups alongside an about/resume page and contact form.

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Effect](https://effect.website/) — typed errors, retry policies, dependency injection
- [Keystatic](https://keystatic.com/) — git-based CMS with GitHub OAuth authentication
- [Resend](https://resend.com/) — contact form email delivery
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Biome](https://biomejs.dev/) — lint & format
- [Vitest](https://vitest.dev/) — testing
- Deployed on [Vercel](https://vercel.com/)

## Development

```sh
pnpm install
pnpm dev
```

Visit `http://localhost:3000`. The Keystatic admin panel is at `/keystatic`.

### Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | Biome lint & format |
| `pnpm test` | Run Vitest tests |

### Environment

Copy `.env.example` and fill in the required values:

- `RESEND_API_KEY` — API key for sending contact form emails

## CI

GitHub Actions runs `typecheck`, `lint`, `test`, and `build` on every push to `main`
and every pull request.

## License

MIT — see [LICENSE](./LICENSE).