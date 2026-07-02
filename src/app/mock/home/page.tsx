import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SiteContainer } from "@/components/layout/site-container";
import { TerminalCard } from "@/components/mock/terminal-card";

export default function MockHomePage() {
  return (
    <SiteContainer>
      <Nav />

      <section className="grid grid-cols-1 items-start gap-14 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-[72px]">
        <div>
          <div className="mb-5 font-mono text-xs font-medium tracking-[0.1em] text-primary lg:mb-[20px]">
            STAFF SOFTWARE ENGINEER — BILLING, PAYMENTS &amp; MONETIZATION
          </div>
          <h1 className="mb-[22px] font-sans text-4xl font-bold leading-[1.08] tracking-tight lg:text-5xl">
            Alex Morask
          </h1>
          <p className="mb-5 max-w-[520px] text-lg leading-relaxed text-text-secondary">
            I design and build the systems that move money — billing engines, payment
            infrastructure, and monetization platforms that scale to millions of transactions.
          </p>
          <p className="mb-9 max-w-[520px] text-[15px] leading-[1.7] text-muted-foreground">
            Over the past decade I&apos;ve led billing and payments platforms at high-growth fintech
            and marketplace companies — from idempotent ledger design to usage-based pricing engines
            processing billions in GMV. I write about the hard, unglamorous problems in payment
            systems: reconciliation, correctness under failure, and pricing models that scale.
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-[14px]">
            <Link
              href="/mock/write-up"
              className="rounded-md bg-primary px-[22px] py-3 text-center font-sans text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-px"
            >
              Read the latest write-up &rarr;
            </Link>
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

      <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
        <SectionEyebrow>01 / FOCUS AREAS</SectionEyebrow>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            "Billing Systems",
            "Payment Infrastructure",
            "Monetization Strategy",
            "Usage-Based Pricing",
            "Ledger & Reconciliation",
            "Distributed Systems Design",
          ].map((area, i) => (
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

      <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
        <SectionEyebrow>02 / EXPERIENCE</SectionEyebrow>
        <div className="relative pl-[22px] lg:pl-7">
          <div className="absolute left-1 top-[6px] bottom-[6px] w-px bg-white/[0.12]" />

          {experience.map((item, i) => (
            <div
              key={item.date}
              className={`relative ${i < experience.length - 1 ? "pb-6 lg:pb-9" : ""}`}
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

      <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
        <SectionEyebrow>03 / LATEST WRITE-UP</SectionEyebrow>
        <Link
          href="/mock/write-up"
          className="group block overflow-hidden rounded-[10px] border border-white/10 transition-all duration-150 hover:border-primary hover:-translate-y-0.5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center gap-[10px] p-[22px] lg:gap-[14px] lg:p-9">
              <div className="font-sans text-lg font-semibold leading-[1.3] text-foreground lg:text-[22px]">
                Designing an Idempotent Payment Ledger
              </div>
              <div className="text-sm leading-relaxed text-text-tertiary">
                How to build a ledger that survives retries, network partitions, and double-charges
                — with a look at idempotency keys, event sourcing, and reconciliation loops.
              </div>
              <div className="mt-1 font-mono text-[13px] font-semibold text-primary lg:mt-[6px]">
                Read the write-up &rarr;
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

const experience = [
  {
    date: "2022 — Present",
    title: "Staff Software Engineer, Billing Platform",
    company: "Bitwarden",
    description:
      "Leading the billing and monetization infrastructure for an open-source security platform serving millions of users.",
  },
  {
    date: "2019 — 2022",
    title: "Senior Software Engineer, Payments Infrastructure",
    company: "—",
    description:
      "Built idempotent payment ledgers and reconciliation pipelines. (Placeholder — replace with real experience.)",
  },
  {
    date: "2016 — 2019",
    title: "Software Engineer, Growth & Monetization",
    company: "—",
    description:
      "Designed usage metering and invoicing systems. (Placeholder — replace with real experience.)",
  },
];
