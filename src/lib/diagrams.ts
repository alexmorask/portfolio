import type { ContentComponent } from "@keystatic/core/content-components";
import { block } from "@keystatic/core/content-components";
import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";
import { createElement } from "react";
import { ConcurrentRaceDiagram } from "@/components/diagrams/concurrent-race-diagram";
import { EarlyKeyMintDiagram } from "@/components/diagrams/early-key-mint-diagram";
import { RetryDoubleChargeDiagram } from "@/components/diagrams/retry-double-charge-diagram";
import { StatusResponseTable } from "@/components/diagrams/status-response-table";
import { StuckInProgressDiagram } from "@/components/diagrams/stuck-in-progress-diagram";

interface DiagramEntry {
  component: ComponentType;
  keystaticBlock: ContentComponent;
}

export const diagramRegistry: Record<string, DiagramEntry> = {
  RetryDoubleChargeDiagram: {
    component: RetryDoubleChargeDiagram,
    keystaticBlock: block({
      label: "Retry / Double-Charge Diagram",
      description:
        "Sequence diagram: a timed-out retry causes a duplicate charge. Click a step to inspect it.",
      schema: {},
      ContentView: () => createElement(RetryDoubleChargeDiagram),
    }),
  },
  EarlyKeyMintDiagram: {
    component: EarlyKeyMintDiagram,
    keystaticBlock: block({
      label: "Early Key Mint Diagram",
      description:
        "Sequence diagram: minting a new idempotency key on every retry causes a duplicate charge. Click a step to inspect it.",
      schema: {},
      ContentView: () => createElement(EarlyKeyMintDiagram),
    }),
  },
  StatusResponseTable: {
    component: StatusResponseTable,
    keystaticBlock: block({
      label: "Status → Response Table",
      description:
        "Interactive table mapping idempotent_requests.status to its 200 OK response. Click a row to inspect it.",
      schema: {},
      ContentView: () => createElement(StatusResponseTable),
    }),
  },
  ConcurrentRaceDiagram: {
    component: ConcurrentRaceDiagram,
    keystaticBlock: block({
      label: "Concurrent Insert Race Diagram",
      description:
        "Concurrency diagram: two simultaneous requests with the same idempotency key race an atomic insert. Click a step to inspect it.",
      schema: {},
      ContentView: () => createElement(ConcurrentRaceDiagram),
    }),
  },
  StuckInProgressDiagram: {
    component: StuckInProgressDiagram,
    keystaticBlock: block({
      label: "Stuck In-Progress Diagram",
      description:
        "Failure diagram: a worker dies before committing, leaving a request stuck in progress despite the charge succeeding. Click a step to inspect it.",
      schema: {},
      ContentView: () => createElement(StuckInProgressDiagram),
    }),
  },
};

export function getKeystaticComponents(): Record<string, ContentComponent> {
  return Object.fromEntries(
    Object.entries(diagramRegistry).map(([name, entry]) => [name, entry.keystaticBlock]),
  );
}

export function getMdxComponents(): MDXComponents {
  return Object.fromEntries(
    Object.entries(diagramRegistry).map(([name, entry]) => [name, entry.component]),
  );
}
