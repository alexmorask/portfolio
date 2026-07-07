import { SectionEyebrow } from "@/components/layout/section-eyebrow";

export function BeyondTheLedgerSection({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="px-5 pb-20 lg:px-14 lg:pb-20">
      <SectionEyebrow>{heading}</SectionEyebrow>
      <p className="max-w-[640px] text-base leading-[1.7] text-text-tertiary">{body}</p>
    </section>
  );
}
