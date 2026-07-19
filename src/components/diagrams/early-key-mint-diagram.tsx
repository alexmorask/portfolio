import { type FlowStep, StepFlowDiagram } from "@/components/diagrams/step-flow-diagram";

const STEPS: FlowStep[] = [
  {
    id: "mint-a",
    lines: ["Worker Mints Key A"],
    detail: "A fresh UUID is generated inside the job run — this attempt's idempotency key.",
    boundary: true,
  },
  {
    id: "charge-a",
    lines: ["Charge Sent", "with Key A"],
    detail: "The provider charges the card and associates the charge with key A.",
  },
  {
    id: "lost",
    lines: ["Response Lost —", "Job Fails"],
    detail: "The worker never receives confirmation, even though the charge already succeeded.",
  },
  {
    id: "retry",
    lines: ["Queue Retries the Job"],
    detail: "A brand-new job run starts from scratch — with no memory of key A.",
  },
  {
    id: "mint-b",
    lines: ["Worker Mints Key B"],
    detail: "A new UUID is generated. The provider has never seen this key before.",
  },
  {
    id: "charge-b",
    lines: ["Charge Sent", "with Key B"],
    detail: "The provider treats this as an unrelated request — and charges the card again.",
    boundary: true,
  },
];

export function EarlyKeyMintDiagram() {
  return (
    <StepFlowDiagram
      steps={STEPS}
      ariaLabel="Sequence diagram: minting a new idempotency key on every retry causes a duplicate charge"
    />
  );
}
