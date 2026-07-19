"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface StatusRow {
  id: string;
  status: string;
  response: string;
  detail: string;
}

const ROWS: StatusRow[] = [
  {
    id: "unseen",
    status: "(no row yet)",
    response: "202 Accepted",
    detail:
      "No row exists for this key — a new row is inserted, the job is enqueued, and the client is told to check back.",
  },
  {
    id: "in_progress",
    status: "in_progress",
    response: "200 OK",
    detail:
      "The operation hasn't finished. The client is told to keep waiting — no new work is triggered.",
  },
  {
    id: "completed",
    status: "completed",
    response: "200 OK",
    detail:
      "The original result is fetched and replayed verbatim — no side effects run a second time.",
  },
  {
    id: "failed",
    status: "failed",
    response: "200 OK",
    detail:
      "The client gets a failure response without the request being retried against the provider.",
  },
];

export function StatusResponseTable() {
  const [selectedId, setSelectedId] = useState<string | null>(ROWS[0]?.id ?? null);
  const selectedRow = ROWS.find((row) => row.id === selectedId);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-3 font-mono text-[11px] font-medium tracking-[0.1em] text-text-faint">
        idempotent_requests.status → RESPONSE
      </div>

      <div className="divide-y divide-border">
        {ROWS.map((row) => {
          const isSelected = row.id === selectedId;
          return (
            <button
              type="button"
              key={row.id}
              onClick={() => setSelectedId((prev) => (prev === row.id ? null : row.id))}
              className={cn(
                "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
                isSelected ? "bg-primary/10" : "hover:bg-muted",
              )}
            >
              <span
                className={cn("font-mono text-sm", isSelected ? "text-primary" : "text-foreground")}
              >
                {row.status}
              </span>
              <span className="font-mono text-sm text-muted-foreground">{row.response}</span>
            </button>
          );
        })}
      </div>

      <p className="border-t border-border px-5 py-4 text-center font-mono text-sm text-muted-foreground">
        {selectedRow?.detail}
      </p>
    </div>
  );
}
