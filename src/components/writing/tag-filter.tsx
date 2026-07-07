"use client";

import { useState } from "react";

export interface TagPill {
  readonly label: string;
  readonly active: boolean;
  readonly onClick: () => void;
}

export function TagFilter({ pills }: { pills: TagPill[] }) {
  return (
    <div className="flex flex-wrap gap-[10px] px-5 pb-10 lg:gap-2.5 lg:px-14 lg:pb-10">
      {pills.map((pill) => (
        <button
          type="button"
          key={pill.label}
          onClick={pill.onClick}
          className={
            pill.active
              ? "rounded-full border border-primary bg-primary/10 px-4 py-2 font-mono text-xs font-semibold tracking-[0.04em] text-primary"
              : "rounded-full border border-white/[0.14] bg-transparent px-4 py-2 font-mono text-xs font-medium tracking-[0.04em] text-[#9aa3b2]"
          }
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
}

export function useTagFilter(initialTag: string) {
  return useState(initialTag);
}
