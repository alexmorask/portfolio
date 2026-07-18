import Image from "next/image";
import Link from "next/link";
import { calculateReadTime } from "@/lib/posts";
import type { Post } from "@/types/content/collections";

function FeaturedDiagramPlaceholder() {
  return (
    <svg viewBox="0 0 400 320" className="block h-full w-full bg-card">
      <title>Diagram placeholder</title>
      <defs>
        <pattern
          id="stripeFeatured"
          width="14"
          height="14"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="14" height="14" fill="#0e1117" />
          <rect width="7" height="14" fill="rgba(255,255,255,.04)" />
        </pattern>
      </defs>
      <rect width="400" height="320" fill="url(#stripeFeatured)" />
      <text
        x="200"
        y="152"
        textAnchor="middle"
        fill="#7a8494"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="12"
      >
        DIAGRAM PLACEHOLDER
      </text>
      <text
        x="200"
        y="172"
        textAnchor="middle"
        fill="#545c6b"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="11"
      >
        diagram — idempotent write path
      </text>
    </svg>
  );
}

export function FeaturedPostCard({ post, dateLabel }: { post: Post; dateLabel: string }) {
  const readTime = calculateReadTime(post.body || post.summary);

  return (
    <div className="px-5 pb-14 lg:px-14 lg:pb-14">
      <Link
        href={`/writing/${post.slug}`}
        className="grid grid-cols-1 overflow-hidden rounded-[10px] border border-white/10 transition-all duration-150 hover:border-primary hover:-translate-y-0.5 lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center gap-4 p-[40px]">
          <div className="font-mono text-[11px] font-medium tracking-[0.1em] text-primary">
            FEATURED
          </div>
          <div className="font-sans text-[26px] font-semibold leading-[1.3] text-foreground">
            {post.title}
          </div>
          <div className="text-[15px] leading-[1.65] text-[#9aa3b2]">{post.summary}</div>
          <div className="mt-1 flex items-center gap-[14px]">
            <span className="font-mono text-xs font-medium text-[#7a8494]">{dateLabel}</span>
            <span className="text-[#3a4150]">·</span>
            <span className="font-mono text-xs font-medium text-[#7a8494]">{readTime}</span>
          </div>
          <div className="mt-2 font-mono text-[13px] font-semibold text-primary">
            Read the post &rarr;
          </div>
        </div>
        {post.cardImage ? (
          <Image
            src={post.cardImage}
            alt=""
            width={400}
            height={320}
            className="h-full w-full object-cover"
          />
        ) : (
          <FeaturedDiagramPlaceholder />
        )}
      </Link>
    </div>
  );
}
