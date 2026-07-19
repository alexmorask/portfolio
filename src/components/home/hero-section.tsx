import Link from "next/link";
import { AnimatedTerminalCard } from "@/components/home/animated-terminal-card";
import type { Post } from "@/types/content/collections";

export function HeroSection({
  home,
  latestPost,
}: {
  home: {
    hero: { eyebrow: string; heading: string; introParagraph: string; secondaryParagraph: string };
  };
  latestPost: Post | undefined;
}) {
  return (
    <section className="grid grid-cols-1 items-start gap-14 px-5 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-[72px]">
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
              href="/writing"
              className="rounded-md bg-primary px-[22px] py-3 text-center font-sans text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-px"
            >
              Read the latest post &rarr;
            </Link>
          )}
          <Link
            href="/contact"
            className="rounded-md border border-white/[0.16] px-[22px] py-3 text-center font-sans text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-white/[0.04]"
          >
            Get in touch
          </Link>
        </div>
      </div>

      <AnimatedTerminalCard />
    </section>
  );
}
