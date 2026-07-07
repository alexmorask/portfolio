import { Effect } from "effect";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SiteContainer } from "@/components/layout/site-container";
import { TerminalCard } from "@/components/mock/terminal-card";
import type { HomeContent } from "@/lib/effect/content-service";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";

function fallbackHome(): HomeContent {
  return {
    hero: {
      eyebrow: "",
      heading: "Alex Morask",
      introParagraph: "",
      secondaryParagraph: "",
    },
    focusAreas: { heading: "", items: [] },
    experience: { heading: "", items: [] },
  };
}

export default async function Home() {
  const data = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;

      const [navLinks, posts] = yield* Effect.all([service.listNavLinks(), service.listPosts()]);

      const home = yield* service
        .readHome()
        .pipe(Effect.catchAll(() => Effect.succeed(fallbackHome())));

      const latestPost = posts
        .filter((p) => p.publishedAt)
        .sort(
          (a, b) =>
            new Date(b.publishedAt as string).getTime() -
            new Date(a.publishedAt as string).getTime(),
        )[0];

      return { home, navLinks, latestPost };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { home, navLinks, latestPost } = data;

  return (
    <SiteContainer>
      <Nav links={navLinks} />

      <section className="grid grid-cols-1 items-start gap-14 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-[72px]">
        <div>
          <div className="mb-5 font-mono text-xs font-medium tracking-[0.1em] text-primary lg:mb-[20px]">
            {home.hero.eyebrow}
          </div>
          <h1 className="mb-[22px] font-sans text-4xl font-bold leading-[1.08] tracking-tight lg:text-5xl">
            {home.hero.heading}
          </h1>
          <p className="mb-5 max-w-[520px] text-lg leading-relaxed text-text-secondary">
            {home.hero.introParagraph}
          </p>
          <p className="mb-9 max-w-[520px] text-[15px] leading-[1.7] text-muted-foreground">
            {home.hero.secondaryParagraph}
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-[14px]">
            {latestPost && (
              <Link
                href="/mock/write-up"
                className="rounded-md bg-primary px-[22px] py-3 text-center font-sans text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-px"
              >
                Read the latest post &rarr;
              </Link>
            )}
            <Link
              href="/mock/contact"
              className="rounded-md border border-white/[0.16] px-[22px] py-3 text-center font-sans text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-white/[0.04]"
            >
              Get in touch
            </Link>
          </div>
        </div>

        <TerminalCard />
      </section>

      {home.focusAreas.items.length > 0 && (
        <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
          <SectionEyebrow>{home.focusAreas.heading}</SectionEyebrow>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {home.focusAreas.items.map((area, i) => (
              <div
                key={area}
                className="flex items-center gap-[14px] rounded-lg border border-white/10 p-4 transition-all duration-150 hover:border-primary hover:-translate-y-0.5 hover:bg-white/[0.02] lg:block lg:gap-0 lg:p-[22px]"
              >
                <div className="font-mono text-[11px] font-medium text-text-faint lg:mb-[10px]">
                  {(i + 1).toString().padStart(2, "0")}
                </div>
                <div className="font-sans text-sm font-semibold text-foreground lg:text-[15px]">
                  {area}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {home.experience.items.length > 0 && (
        <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
          <SectionEyebrow>{home.experience.heading}</SectionEyebrow>
          <div className="relative pl-[22px] lg:pl-7">
            <div className="absolute left-1 top-[6px] bottom-[6px] w-px bg-white/[0.12]" />

            {home.experience.items.map((item, i) => (
              <div
                key={item.date}
                className={`relative ${i < home.experience.items.length - 1 ? "pb-6 lg:pb-9" : ""}`}
              >
                <div
                  className={`absolute left-[-22px] top-1 h-2 w-2 rounded-full lg:left-[-28px] lg:h-[9px] lg:w-[9px] ${
                    i === 0 ? "bg-primary" : "bg-white/[0.3]"
                  }`}
                />
                <div className="grid grid-cols-1 gap-1 lg:grid-cols-[140px_1fr] lg:gap-6">
                  <div className="font-mono text-[11px] font-medium text-muted-foreground lg:text-xs">
                    {item.date}
                  </div>
                  <div>
                    <div className="mb-1 font-sans text-[15px] font-semibold text-foreground lg:mb-1 lg:text-base">
                      {item.title}
                    </div>
                    <div className="mb-0 font-mono text-xs font-medium text-text-faint lg:mb-[10px] lg:text-[13px]">
                      {item.company}
                    </div>
                    {item.description && (
                      <div className="hidden font-sans text-sm leading-relaxed text-text-tertiary lg:block lg:max-w-[640px]">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {latestPost && (
        <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
          <SectionEyebrow>03 / LATEST POST</SectionEyebrow>
          <Link
            href="/mock/write-up"
            className="group block overflow-hidden rounded-[10px] border border-white/10 transition-all duration-150 hover:border-primary hover:-translate-y-0.5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-center gap-[10px] p-[22px] lg:gap-[14px] lg:p-9">
                <div className="font-sans text-lg font-semibold leading-[1.3] text-foreground lg:text-[22px]">
                  {latestPost.title}
                </div>
                <div className="text-sm leading-relaxed text-text-tertiary">
                  {latestPost.summary}
                </div>
                <div className="mt-1 font-mono text-[13px] font-semibold text-primary lg:mt-[6px]">
                  Read the post &rarr;
                </div>
              </div>
              <div className="hidden lg:block">
                <svg viewBox="0 0 400 280" className="block h-full w-full bg-card">
                  <title>Diagram placeholder</title>
                  <defs>
                    <pattern
                      id="stripeHome"
                      width="14"
                      height="14"
                      patternTransform="rotate(45)"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect width="14" height="14" fill="#0e1117" />
                      <rect width="7" height="14" fill="rgba(255,255,255,.04)" />
                    </pattern>
                  </defs>
                  <rect width="400" height="280" fill="url(#stripeHome)" />
                  <text
                    x="200"
                    y="132"
                    textAnchor="middle"
                    fill="#7a8494"
                    fontFamily="IBM Plex Mono, monospace"
                    fontSize="12"
                  >
                    DIAGRAM PLACEHOLDER
                  </text>
                  <text
                    x="200"
                    y="152"
                    textAnchor="middle"
                    fill="#545c6b"
                    fontFamily="IBM Plex Mono, monospace"
                    fontSize="11"
                  >
                    diagram — idempotent write path
                  </text>
                </svg>
              </div>
            </div>
          </Link>
        </section>
      )}

      <Footer>
        <div className="flex flex-col gap-[10px] lg:flex-row lg:gap-6">
          <Link
            href="mailto:alex@alexmorask.com"
            className="font-mono text-xs font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
          >
            alex@alexmorask.com
          </Link>
          <Link
            href="https://github.com/alexmorask"
            className="font-mono text-xs font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
          >
            github.com/alexmorask
          </Link>
          <Link
            href="https://linkedin.com/in/alexmorask"
            className="font-mono text-xs font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
          >
            linkedin.com/in/alexmorask
          </Link>
        </div>
      </Footer>
    </SiteContainer>
  );
}
