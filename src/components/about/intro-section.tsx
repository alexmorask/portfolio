import Image from "next/image";
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
        <Image
          src="/images/headshot.jpg"
          alt="Alex Morask"
          width={2048}
          height={1367}
          className="block h-auto w-full"
          priority
        />
      </div>
    </section>
  );
}
