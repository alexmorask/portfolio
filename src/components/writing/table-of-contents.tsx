"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/table-of-contents";
import { cn } from "@/lib/utils";

export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        for (const observerEntry of observerEntries) {
          if (observerEntry.isIntersecting) {
            setActiveId(observerEntry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );

    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <div className="sticky top-6 border-l border-border pl-6">
      <div className="mb-5 font-mono text-xs font-medium tracking-[0.1em] text-text-faint">
        ON THIS PAGE
      </div>
      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <a
            key={entry.id}
            href={`#${entry.id}`}
            className={cn(
              "font-mono text-[13px] font-medium leading-snug transition-colors",
              entry.id === activeId ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            {entry.title}
          </a>
        ))}
      </div>
    </div>
  );
}
