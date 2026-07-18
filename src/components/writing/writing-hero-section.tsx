import type { WritingPage } from "@/types/content/singletons";

export function WritingHeroSection({ writingPage }: { writingPage: WritingPage }) {
  return (
    <section className="px-5 py-8 lg:px-14 lg:py-14">
      <div className="mb-[18px] font-mono text-xs font-medium tracking-[0.1em] text-primary">
        {writingPage.eyebrow}
      </div>
      <h1 className="mb-4 font-sans text-4xl font-bold leading-[1.15] tracking-tight lg:text-[44px]">
        {writingPage.title}
      </h1>
      <p className="max-w-[640px] text-base leading-[1.6] text-[#9aa3b2]">
        {writingPage.description}
      </p>
    </section>
  );
}
