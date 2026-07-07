import Link from "next/link";
import { calculateReadTime } from "@/lib/posts";
import type { Post } from "@/types/content/collections";

function DiagramPlaceholder({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 160 140" className="block h-full w-full bg-card">
      <title>Diagram placeholder</title>
      <defs>
        <pattern
          id={`stripe-${title.replace(/\s+/g, "-")}`}
          width="14"
          height="14"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="14" height="14" fill="#0e1117" />
          <rect width="7" height="14" fill="rgba(255,255,255,.04)" />
        </pattern>
      </defs>
      <rect width="160" height="140" fill={`url(#stripe-${title.replace(/\s+/g, "-")})`} />
    </svg>
  );
}

export function PostListItem({
  post,
  tagLabel,
  dateLabel,
}: {
  post: Post;
  tagLabel: string;
  dateLabel: string;
}) {
  const readTime = calculateReadTime(post.body || post.summary);

  return (
    <Link
      href={`/writing/${post.slug}`}
      className="grid grid-cols-1 items-stretch gap-6 overflow-hidden rounded-[10px] border border-white/10 transition-all duration-150 hover:border-primary hover:-translate-y-0.5 lg:grid-cols-[1fr_160px]"
    >
      <div className="flex flex-col justify-center gap-[10px] p-[26px]">
        <div className="font-sans text-lg font-semibold leading-[1.3] text-foreground">
          {post.title}
        </div>
        <div className="text-sm leading-relaxed text-[#9aa3b2]">{post.summary}</div>
        <div className="mt-[2px] flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] font-medium text-[#7a8494]">{dateLabel}</span>
          <span className="text-[#3a4150]">·</span>
          <span className="font-mono text-[11px] font-medium text-[#7a8494]">{readTime}</span>
          <span className="text-[#3a4150]">·</span>
          <span className="font-mono text-[11px] font-medium text-[#545c6b]">{tagLabel}</span>
        </div>
      </div>
      <DiagramPlaceholder title={post.title} />
    </Link>
  );
}
