import { SectionEyebrow } from "@/components/layout/section-eyebrow";

export function IntroSection({
  about,
}: {
  about: { intro: { heading: string; introParagraph: string; secondaryParagraph: string } };
}) {
  return (
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
  );
}
