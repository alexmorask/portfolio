"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type LaneId = "a" | "b";
type NodeId = "a1" | "a2" | "a3" | "a4" | "b1" | "b2" | "b3" | "b4";

interface LaneNode {
  id: NodeId;
  lane: LaneId;
  row: number;
  lines: string[];
  detail: string;
  boundary?: boolean;
}

const NODES: LaneNode[] = [
  {
    id: "a1",
    lane: "a",
    row: 0,
    lines: ["Request A Arrives"],
    detail: "Client A sends a charge request carrying idempotency key K.",
    boundary: true,
  },
  {
    id: "b1",
    lane: "b",
    row: 0,
    lines: ["Request B Arrives"],
    detail:
      "Client B sends a charge request with the exact same key K, at nearly the same instant.",
    boundary: true,
  },
  {
    id: "a2",
    lane: "a",
    row: 1,
    lines: ["Attempts INSERT"],
    detail: "Tries to claim key K by inserting a new row into idempotent_requests.",
  },
  {
    id: "b2",
    lane: "b",
    row: 1,
    lines: ["Attempts INSERT"],
    detail: "Tries to claim the same key K — racing against A's insert.",
  },
  {
    id: "a3",
    lane: "a",
    row: 2,
    lines: ["Wins the Race"],
    detail: "The INSERT succeeds — A's row is now the source of truth for key K.",
  },
  {
    id: "b3",
    lane: "b",
    row: 2,
    lines: ["Unique Violation"],
    detail: "The primary key constraint rejects B's insert — A already claimed key K.",
  },
  {
    id: "a4",
    lane: "a",
    row: 3,
    lines: ["202 Accepted"],
    detail: "The job is enqueued and A gets the normal accepted response.",
    boundary: true,
  },
  {
    id: "b4",
    lane: "b",
    row: 3,
    lines: ["Replays A's Result"],
    detail:
      "B calls replayExisting() and returns whatever A's request produces — never enqueuing a second job.",
    boundary: true,
  },
];

const ROWS = 4;
const LANES: LaneId[] = ["a", "b"];

function nodeAt(lane: LaneId, row: number): LaneNode {
  const node = NODES.find((n) => n.lane === lane && n.row === row);
  if (!node) throw new Error(`No node for lane ${lane}, row ${row}`);
  return node;
}

const NODE_WIDTH = 230;
const NODE_HEIGHT = 58;
const GAP_X = 218;
const GAP_Y = 36;
const PADDING = 20;

const VIEW_WIDTH = NODE_WIDTH * 2 + GAP_X + PADDING * 2;
const VIEW_HEIGHT = ROWS * NODE_HEIGHT + (ROWS - 1) * GAP_Y + PADDING * 2;

function laneX(lane: LaneId): number {
  return lane === "a" ? PADDING : PADDING + NODE_WIDTH + GAP_X;
}

function rowY(row: number): number {
  return PADDING + row * (NODE_HEIGHT + GAP_Y);
}

export function ConcurrentRaceDiagram() {
  const markerId = useId();
  const [selectedRow, setSelectedRow] = useState<number | null>(0);

  const isRowActive = (row: number) => selectedRow === null || row === selectedRow;
  const isEdgeActive = (row: number) =>
    selectedRow === null || selectedRow === row || selectedRow === row + 1;

  return (
    <div className="not-prose my-8 rounded-lg border border-border bg-card p-5">
      <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="mx-auto block h-auto w-full">
        <title>
          Concurrency diagram: two simultaneous requests with the same idempotency key race an
          atomic insert
        </title>
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 Z" className="fill-primary" />
          </marker>
        </defs>

        {LANES.map((lane) =>
          [0, 1, 2].map((row) => {
            const x = laneX(lane) + NODE_WIDTH / 2;
            const y1 = rowY(row) + NODE_HEIGHT;
            const y2 = rowY(row + 1);
            const active = isEdgeActive(row);
            return (
              <line
                key={`${lane}-${row}-edge`}
                x1={x}
                y1={y1}
                x2={x}
                y2={y2}
                strokeWidth={1.5}
                markerEnd={`url(#${markerId})`}
                className={active ? "stroke-primary" : "stroke-border"}
              />
            );
          }),
        )}

        <text
          x={VIEW_WIDTH / 2}
          y={rowY(1) + NODE_HEIGHT / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-mono text-[10px] tracking-[0.08em] fill-muted-foreground"
        >
          vs
        </text>

        {NODES.map((node) => {
          const active = isRowActive(node.row);
          const isSelected = node.row === selectedRow;
          const x = laneX(node.lane);
          const y = rowY(node.row);
          const cx = x + NODE_WIDTH / 2;
          const cy = y + NODE_HEIGHT / 2;

          return (
            // biome-ignore lint/a11y/useSemanticElements: SVG group is the natural interactive element here
            <g
              key={node.id}
              role="button"
              tabIndex={0}
              className="cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              onClick={() => setSelectedRow((prev) => (prev === node.row ? null : node.row))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedRow((prev) => (prev === node.row ? null : node.row));
                }
              }}
            >
              <rect
                x={x}
                y={y}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx={8}
                strokeWidth={isSelected ? 2 : 1.5}
                className={cn(
                  isSelected ? "fill-primary/10" : "fill-card",
                  isSelected || node.boundary ? "stroke-primary" : "stroke-border",
                  !active && "opacity-40",
                )}
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                className={cn(
                  "font-mono text-[12px]",
                  isSelected
                    ? "fill-primary"
                    : active
                      ? "fill-foreground"
                      : "fill-muted-foreground",
                )}
              >
                {node.lines.map((line, lineIndex) => (
                  <tspan key={line} x={cx} dy={lineIndex === 0 ? 0 : 16}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
        {LANES.map((lane) => (
          <p key={lane} className="text-center font-mono text-sm text-muted-foreground">
            <span className="text-primary">{lane.toUpperCase()}:</span>{" "}
            {selectedRow === null ? null : nodeAt(lane, selectedRow).detail}
          </p>
        ))}
      </div>
    </div>
  );
}
