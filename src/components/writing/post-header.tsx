import { tagLabel } from "@/lib/posts";

interface MetaProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly date: string;
  readonly readTime: string;
  readonly tags: readonly string[];
}

export function PostHeader({ eyebrow, title, date, readTime, tags }: MetaProps) {
  return (
    <>
      <div className="mb-[18px] font-mono text-xs font-medium tracking-[0.1em] text-primary">
        {eyebrow}
      </div>
      <h1 className="mb-5 font-sans text-2xl font-bold leading-[1.2] tracking-tight lg:text-[40px]">
        {title}
      </h1>
      <div className="mb-[14px] flex flex-wrap items-center gap-[10px] lg:gap-4">
        <span className="font-mono text-xs font-medium text-text-tertiary">Alex Morask</span>
        <span className="text-[#3a4150]">&middot;</span>
        <span className="font-mono text-xs font-medium text-muted-foreground">{date}</span>
        <span className="text-[#3a4150]">&middot;</span>
        <span className="font-mono text-xs font-medium text-muted-foreground">{readTime}</span>
      </div>
      <div className="mb-10 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-[5px] border border-white/[0.14] px-[10px] py-[5px] font-mono text-[11px] font-medium text-text-tertiary"
          >
            {tagLabel(tag)}
          </span>
        ))}
      </div>
    </>
  );
}
