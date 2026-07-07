import { Effect } from "effect";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SiteContainer } from "@/components/layout/site-container";
import type { AboutContent } from "@/lib/effect/content-service";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";

function fallbackAbout(): AboutContent {
  return {
    intro: {
      heading: "",
      introParagraph: "",
      secondaryParagraph: "",
    },
    background: {
      body: "",
    },
    howIWork: {
      heading: "",
      items: [],
    },
    beyondTheLedger: {
      heading: "",
      body: "",
    },
  };
}

export default async function About() {
  const data = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;

      const navLinks = yield* service.listNavLinks();

      const about = yield* service
        .readAbout()
        .pipe(Effect.catchAll(() => Effect.succeed(fallbackAbout())));

      return { about, navLinks };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { about, navLinks } = data;
  const backgroundParagraphs = about.background.body.split("\n").filter((p) => p.trim());

  return (
    <SiteContainer>
      <Nav links={navLinks} />

      <section className="grid grid-cols-1 items-start gap-14 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-[72px]">
        <div>
          <SectionEyebrow>01 / ABOUT</SectionEyebrow>
          <h1 className="mb-[22px] font-sans text-3xl font-bold leading-[1.15] tracking-tight lg:text-5xl">
            {about.intro.heading}
          </h1>
          <p className="mb-5 max-w-[520px] text-lg leading-relaxed text-text-secondary">
            {about.intro.introParagraph}
          </p>
          <p className="max-w-[520px] text-[15px] leading-[1.7] text-muted-foreground">
            {about.intro.secondaryParagraph}
          </p>
        </div>

        <div className="overflow-hidden rounded-[10px] border border-white/10 bg-card">
          <svg viewBox="0 0 480 560" className="block h-auto w-full">
            <title>Photo placeholder</title>
            <defs>
              <pattern
                id="stripeAbout"
                width="14"
                height="14"
                patternTransform="rotate(45)"
                patternUnits="userSpaceOnUse"
              >
                <rect width="14" height="14" fill="#0e1117" />
                <rect width="7" height="14" fill="rgba(255,255,255,.045)" />
              </pattern>
            </defs>
            <rect width="480" height="560" fill="url(#stripeAbout)" />
            <text
              x="240"
              y="270"
              textAnchor="middle"
              fill="#7a8494"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="13"
            >
              PHOTO PLACEHOLDER
            </text>
            <text
              x="240"
              y="292"
              textAnchor="middle"
              fill="#545c6b"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="11"
            >
              drop headshot here — 4:5 ratio
            </text>
          </svg>
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
        <div className="max-w-[760px]">
          <SectionEyebrow>02 / BACKGROUND</SectionEyebrow>
          {backgroundParagraphs.map((p, i) => (
            <p
              key={p.slice(0, 40)}
              className={i < backgroundParagraphs.length - 1 ? "mb-5" : ""}
              style={{ fontSize: "16px", lineHeight: 1.8, color: "#c3c9d4" }}
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {about.howIWork.items.length > 0 && (
        <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
          <SectionEyebrow>{about.howIWork.heading}</SectionEyebrow>
          <div className="flex max-w-[760px] flex-col gap-[14px]">
            {about.howIWork.items.map((bullet) => (
              <div key={bullet} className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] font-medium text-primary">&rarr;</span>
                <span className="text-base leading-relaxed text-text-secondary">{bullet}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-5 pb-20 lg:px-14 lg:pb-20">
        <SectionEyebrow>{about.beyondTheLedger.heading}</SectionEyebrow>
        <p className="max-w-[640px] text-base leading-[1.7] text-text-tertiary">
          {about.beyondTheLedger.body}
        </p>
      </section>

      <Footer>
        <Link
          href="/mock/contact"
          className="font-mono text-[13px] font-semibold text-primary transition-colors duration-150 hover:text-foreground"
        >
          Get in touch &rarr;
        </Link>
      </Footer>
    </SiteContainer>
  );
}
