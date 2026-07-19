import { type FlowStep, StepFlowDiagram } from "@/components/diagrams/step-flow-diagram";

const STEPS: FlowStep[] = [
  {
    id: "submit",
    lines: ["Client Submits Payment"],
    detail: "The client sends a charge request and gets a 202 Accepted back immediately.",
    boundary: true,
  },
  {
    id: "enqueue",
    lines: ["Server Enqueues Job"],
    detail: "The payment is handed off to a background job instead of processed inline.",
  },
  {
    id: "attempt-1",
    lines: ["Worker Calls Provider", "— Attempt 1"],
    detail: "The worker asks the payment provider to charge the customer's card.",
  },
  {
    id: "timeout",
    lines: ["Response Times Out"],
    detail:
      "The provider charges the card, but the response never makes it back. The job fails even though the charge succeeded.",
  },
  {
    id: "retry",
    lines: ["Queue Retries the Job"],
    detail: "The failed job is redelivered to the worker, same as any other failure.",
  },
  {
    id: "attempt-2",
    lines: ["Worker Calls Provider", "— Attempt 2"],
    detail: "The worker calls the provider again, with no way to know attempt 1 already succeeded.",
  },
  {
    id: "created",
    lines: ["201 Created —", "Charge Recorded"],
    detail: "This attempt completes cleanly, so the worker writes the charge to the database.",
  },
  {
    id: "result",
    lines: ["Result: Customer", "Charged Twice"],
    detail:
      "Two successful charges exist for one purchase — and nothing in this flow ever noticed.",
    boundary: true,
  },
];

export function RetryDoubleChargeDiagram() {
  return (
    <StepFlowDiagram
      steps={STEPS}
      ariaLabel="Sequence diagram: a timed-out retry causes a duplicate charge"
    />
  );
}
