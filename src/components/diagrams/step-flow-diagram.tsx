"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface FlowStep {
  id: string;
  lines: string[];
  detail: string;
  boundary?: boolean;
}

interface StepFlowDiagramProps {
  steps: FlowStep[];
  ariaLabel: string;
  cols?: number;
}

const NODE_WIDTH = 210;
const GAP_X = 24;
const PADDING = 20;

interface SizeConfig {
  cols: number;
  nodeHeight: number;
  gapY: number;
  fontSizeClass: string;
  lineDy: number;
  lineOffsetFactor: number;
}

const DESKTOP_CONFIG: SizeConfig = {
  cols: 3,
  nodeHeight: 78,
  gapY: 46,
  fontSizeClass: "text-[14px]",
  lineDy: 18,
  lineOffsetFactor: 9,
};

const MOBILE_CONFIG: SizeConfig = {
  cols: 1,
  nodeHeight: 58,
  gapY: 30,
  fontSizeClass: "text-[11px]",
  lineDy: 14,
  lineOffsetFactor: 7,
};

interface Placement {
  row: number;
  col: number;
  x: number;
  y: number;
}

function placement(index: number, cols: number, nodeHeight: number, gapY: number): Placement {
  const row = Math.floor(index / cols);
  const colInRow = index % cols;
  const col = row % 2 === 0 ? colInRow : cols - 1 - colInRow;
  return {
    row,
    col,
    x: PADDING + col * (NODE_WIDTH + GAP_X),
    y: PADDING + row * (nodeHeight + gapY),
  };
}

export function StepFlowDiagram({
  steps,
  ariaLabel,
  cols = DESKTOP_CONFIG.cols,
}: StepFlowDiagramProps) {
  const markerIdBase = useId();
  const [selectedId, setSelectedId] = useState<string | null>(steps[0]?.id ?? null);
  const selectedIndex = selectedId ? steps.findIndex((s) => s.id === selectedId) : -1;
  const selectedStep = selectedIndex >= 0 ? steps[selectedIndex] : undefined;

  const isNodeActive = (index: number) =>
    selectedIndex === -1 || index === selectedIndex || Math.abs(index - selectedIndex) === 1;
  const isEdgeActive = (fromIndex: number) =>
    selectedIndex === -1 || fromIndex === selectedIndex || fromIndex + 1 === selectedIndex;

  function renderSvg(config: SizeConfig, keySuffix: string) {
    const {
      cols: effectiveCols,
      nodeHeight,
      gapY,
      fontSizeClass,
      lineDy,
      lineOffsetFactor,
    } = config;
    const markerId = `${markerIdBase}-${keySuffix}`;
    const viewWidth = effectiveCols * NODE_WIDTH + (effectiveCols - 1) * GAP_X + PADDING * 2;
    const rows = Math.ceil(steps.length / effectiveCols);
    const viewHeight = rows * nodeHeight + (rows - 1) * gapY + PADDING * 2;

    return (
      <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="mx-auto block h-auto w-full">
        <title>{ariaLabel}</title>
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

        {steps.slice(0, -1).map((step, index) => {
          const from = placement(index, effectiveCols, nodeHeight, gapY);
          const to = placement(index + 1, effectiveCols, nodeHeight, gapY);
          const active = isEdgeActive(index);
          const sameRow = from.row === to.row;
          const rowIsLeftToRight = from.row % 2 === 0;

          const x1 = sameRow
            ? from.x + (rowIsLeftToRight ? NODE_WIDTH : 0)
            : from.x + NODE_WIDTH / 2;
          const y1 = sameRow ? from.y + nodeHeight / 2 : from.y + nodeHeight;
          const x2 = sameRow ? to.x + (rowIsLeftToRight ? 0 : NODE_WIDTH) : to.x + NODE_WIDTH / 2;
          const y2 = sameRow ? to.y + nodeHeight / 2 : to.y;

          return (
            <line
              key={`${step.id}-edge`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={1.5}
              markerEnd={`url(#${markerId})`}
              className={active ? "stroke-primary" : "stroke-border"}
            />
          );
        })}

        {steps.map((step, index) => {
          const active = isNodeActive(index);
          const isSelected = step.id === selectedId;
          const { x, y } = placement(index, effectiveCols, nodeHeight, gapY);
          const cx = x + NODE_WIDTH / 2;
          const cy = y + nodeHeight / 2;
          const lineOffset = (step.lines.length - 1) * lineOffsetFactor;

          return (
            // biome-ignore lint/a11y/useSemanticElements: SVG group is the natural interactive element here
            <g
              key={step.id}
              role="button"
              tabIndex={0}
              className="cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              onClick={() => setSelectedId((prev) => (prev === step.id ? null : step.id))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedId((prev) => (prev === step.id ? null : step.id));
                }
              }}
            >
              <rect
                x={x}
                y={y}
                width={NODE_WIDTH}
                height={nodeHeight}
                rx={8}
                strokeWidth={isSelected ? 2 : 1.5}
                className={cn(
                  isSelected ? "fill-primary/10" : "fill-card",
                  isSelected || step.boundary ? "stroke-primary" : "stroke-border",
                  !active && "opacity-40",
                )}
              />
              <text
                x={cx}
                y={cy - lineOffset}
                textAnchor="middle"
                dominantBaseline="central"
                className={cn(
                  "font-mono",
                  fontSizeClass,
                  isSelected
                    ? "fill-primary"
                    : active
                      ? "fill-foreground"
                      : "fill-muted-foreground",
                )}
              >
                {step.lines.map((line, lineIndex) => (
                  <tspan key={line} x={cx} dy={lineIndex === 0 ? 0 : lineDy}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div className="not-prose my-8 rounded-lg border border-border bg-card p-5">
      <div className="sm:hidden">{renderSvg(MOBILE_CONFIG, "mobile")}</div>
      <div className="hidden sm:block">{renderSvg({ ...DESKTOP_CONFIG, cols }, "desktop")}</div>

      <p className="mt-4 text-center font-mono text-sm text-muted-foreground">
        {selectedStep?.detail}
      </p>
    </div>
  );
}
