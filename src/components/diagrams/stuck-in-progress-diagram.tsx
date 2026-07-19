import { type FlowStep, StepFlowDiagram } from "@/components/diagrams/step-flow-diagram";

const STEPS: FlowStep[] = [
  {
    id: "charge-succeeds",
    lines: ["Provider Charge", "Succeeds"],
    detail: "The worker's call to provider.charge() completes — the customer's card is charged.",
    boundary: true,
  },
  {
    id: "starts-transaction",
    lines: ["Worker Starts", "DB Transaction"],
    detail:
      "The worker begins writing the charge row and marking idempotent_requests as completed, in one transaction.",
  },
  {
    id: "worker-dies",
    lines: ["Worker Process Dies"],
    detail:
      "The pod is OOM-killed, crashes, or the network partitions — before the transaction commits.",
  },
  {
    id: "never-commits",
    lines: ["Transaction Never", "Commits"],
    detail:
      "Neither the charge row nor the status update is persisted — the database rolls both back.",
  },
  {
    id: "stuck",
    lines: ["Row Stuck at", "in_progress"],
    detail:
      "The row still says in_progress, indefinitely. The charge succeeded, but nothing in the system knows it.",
    boundary: true,
  },
];

export function StuckInProgressDiagram() {
  return (
    <StepFlowDiagram
      steps={STEPS}
      ariaLabel="Failure diagram: a worker dies before committing, leaving a request stuck in progress despite the charge succeeding"
    />
  );
}
