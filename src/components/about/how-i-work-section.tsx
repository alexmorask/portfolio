import { SectionEyebrow } from "@/components/layout/section-eyebrow";

export function HowIWorkSection({ heading, items }: { heading: string; items: readonly string[] }) {
  if (items.length === 0) return null;

  return (
    <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
      <SectionEyebrow>{heading}</SectionEyebrow>
      <div className="flex max-w-[760px] flex-col gap-[14px]">
        {items.map((bullet) => (
          <div key={bullet} className="flex items-baseline gap-3">
            <span className="font-mono text-[13px] font-medium text-primary">&rarr;</span>
            <span className="text-base leading-relaxed text-text-secondary">{bullet}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
