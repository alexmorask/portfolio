import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SiteContainer } from "@/components/layout/site-container";

export default function MockAboutPage() {
  {
    /* TODO: replace placeholder personal content (origin story, hobbies) with real content */
  }
  return (
    <SiteContainer>
      <Nav />

      <section className="grid grid-cols-1 items-start gap-14 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-[72px]">
        <div>
          <SectionEyebrow>01 / ABOUT</SectionEyebrow>
          <h1 className="mb-[22px] font-sans text-3xl font-bold leading-[1.15] tracking-tight lg:text-5xl">
            Hi, I&apos;m Alex.
          </h1>
          <p className="mb-5 max-w-[520px] text-lg leading-relaxed text-text-secondary">
            I&apos;m a staff software engineer who&apos;s spent the last decade inside the parts of
            the stack most engineers avoid: billing engines, payment ledgers, and the pricing logic
            that decides what customers actually owe.
          </p>
          <p className="max-w-[520px] text-[15px] leading-[1.7] text-muted-foreground">
            I started out building CRUD apps like everyone else, but a production incident involving
            a double-charged customer changed my trajectory — I&apos;ve been obsessed with
            correctness in money-moving systems ever since.
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

      <section className="max-w-[760px] px-5 pb-16 lg:px-14 lg:pb-[64px]">
        <SectionEyebrow>02 / BACKGROUND</SectionEyebrow>
        <p className="mb-5 text-base leading-[1.8] text-text-secondary">
          My career has followed the money — literally. I&apos;ve built billing platforms for a B2B
          SaaS company scaling into enterprise contracts, rebuilt the payment ledger for a global
          marketplace processing billions in annual volume, and now lead the re-architecture of a
          fintech&apos;s core billing engine as it expands into hybrid usage and subscription
          pricing.
        </p>
        <p className="text-base leading-[1.8] text-text-secondary">
          What keeps me in this corner of engineering is the stakes: get a payments system wrong and
          it&apos;s not a bad UX, it&apos;s a customer&apos;s money. That constraint makes for some
          of the most interesting distributed-systems problems I&apos;ve come across — idempotency,
          reconciliation, exactly-once semantics in a world where &quot;exactly once&quot; is a
          polite fiction.
        </p>
      </section>

      <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
        <SectionEyebrow>03 / HOW I WORK</SectionEyebrow>
        <div className="flex flex-col gap-[14px] max-w-[760px]">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[13px] font-medium text-primary">&rarr;</span>
            <span className="text-base leading-relaxed text-text-secondary">
              Correctness first — in billing, a fast wrong answer is worse than a slow right one.
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[13px] font-medium text-primary">&rarr;</span>
            <span className="text-base leading-relaxed text-text-secondary">
              Design for retries and failure from day one — networks drop packets, and your ledger
              has to assume they will.
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[13px] font-medium text-primary">&rarr;</span>
            <span className="text-base leading-relaxed text-text-secondary">
              Write it down — the write-ups on this site are the same docs I&apos;d hand a new hire
              on day one.
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-14 lg:pb-20">
        <div className="mb-4 font-mono text-xs font-medium tracking-widest text-primary lg:mb-4">
          04 / BEYOND THE LEDGER
        </div>
        <p className="max-w-[640px] text-base leading-[1.7] text-text-tertiary">
          Outside of work I&apos;m usually rock climbing, tinkering with home espresso, or arguing
          that the CAP theorem applies to more of life than it should.
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
