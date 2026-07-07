import { SectionEyebrow } from "@/components/layout/section-eyebrow";

export function FocusAreas({ heading, items }: { heading: string; items: readonly string[] }) {
  if (items.length === 0) return null;

  return (
    <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
      <SectionEyebrow>{heading}</SectionEyebrow>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {items.map((area, i) => (
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
  );
}
