import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import type { Experience } from "@/types/content/singletons";

export function ExperienceTimeline({
  heading,
  items,
}: {
  heading: string;
  items: readonly Experience[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
      <SectionEyebrow>{heading}</SectionEyebrow>
      <div className="relative pl-[22px] lg:pl-7">
        <div className="absolute left-1 top-[6px] bottom-[6px] w-px bg-white/[0.12]" />

        {items.map((item, i) => (
          <div key={item.date} className={`relative ${i < items.length - 1 ? "pb-6 lg:pb-9" : ""}`}>
            <div
              className={`absolute left-[-22px] top-1 h-2 w-2 rounded-full lg:left-[-28px] lg:h-[9px] lg:w-[9px] ${i === 0 ? "bg-primary" : "bg-white/[0.3]"}`}
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
  );
}
