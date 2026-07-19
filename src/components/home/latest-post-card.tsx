import Image from "next/image";
import Link from "next/link";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import type { Post } from "@/types/content/collections";

export function LatestPostCard({ post }: { post: Post }) {
  return (
    <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
      <SectionEyebrow>03 / LATEST POST</SectionEyebrow>
      <Link
        href="/writing"
        className="group block overflow-hidden rounded-[10px] border border-white/10 transition-all duration-150 hover:border-primary hover:-translate-y-0.5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-[10px] p-[22px] lg:gap-[14px] lg:p-9">
            <div className="font-sans text-lg font-semibold leading-[1.3] text-foreground lg:text-[22px]">
              {post.title}
            </div>
            <div className="text-sm leading-relaxed text-text-tertiary">{post.summary}</div>
            <div className="mt-1 font-mono text-[13px] font-semibold text-primary lg:mt-[6px]">
              Read the post &rarr;
            </div>
          </div>
          <div className="hidden lg:block">
            {post.cardImage ? (
              <Image
                src={post.cardImage}
                alt=""
                width={400}
                height={280}
                className="h-full w-full object-cover"
              />
            ) : (
              <svg viewBox="0 0 400 280" className="block h-full w-full bg-card">
                <title>Diagram placeholder</title>
                <defs>
                  <pattern
                    id="stripeHome"
                    width="14"
                    height="14"
                    patternTransform="rotate(45)"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="14" height="14" fill="#0e1117" />
                    <rect width="7" height="14" fill="rgba(255,255,255,.04)" />
                  </pattern>
                </defs>
                <rect width="400" height="280" fill="url(#stripeHome)" />
                <text
                  x="200"
                  y="132"
                  textAnchor="middle"
                  fill="#7a8494"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="12"
                >
                  DIAGRAM PLACEHOLDER
                </text>
                <text
                  x="200"
                  y="152"
                  textAnchor="middle"
                  fill="#545c6b"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="11"
                >
                  diagram — idempotent write path
                </text>
              </svg>
            )}
          </div>
        </div>
      </Link>
    </section>
  );
}
