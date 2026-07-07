import { SectionEyebrow } from "@/components/layout/section-eyebrow";

export function BackgroundSection({ body }: { body: string }) {
  const paragraphs = body.split("\n").filter((p) => p.trim());

  return (
    <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
      <div className="max-w-[760px]">
        <SectionEyebrow>02 / BACKGROUND</SectionEyebrow>
        {paragraphs.map((p, i) => (
          <p
            key={p.slice(0, 40)}
            className={i < paragraphs.length - 1 ? "mb-5" : ""}
            style={{ fontSize: "16px", lineHeight: 1.8, color: "#c3c9d4" }}
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
