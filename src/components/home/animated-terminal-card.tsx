"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Step {
  request: string;
  status: string;
  body: string;
}

const STEPS: Step[] = [
  {
    request:
      "curl -X POST /v1/payment_methods \\\n  -d type=card -d number=4242424242424242 \\\n  -d exp=12/28",
    status: "201 Created",
    body: '{\n  "id": "pm_1N3xTokenCard",\n  "type": "card",\n  "last4": "4242"\n}',
  },
  {
    request:
      "curl -X POST /v1/customers \\\n  -d email=jane@doe.com \\\n  -d payment_method=pm_1N3xTokenCard",
    status: "201 Created",
    body: '{\n  "id": "cus_9Kf82ImxD",\n  "email": "jane@doe.com",\n  "default_payment_method": "pm_1N3xTokenCard"\n}',
  },
  {
    request: "curl /v1/products?active=true",
    status: "200 OK",
    body: '[\n  { "id": "prod_basic", "name": "Starter", "price": 900 },\n  { "id": "prod_pro", "name": "Pro", "price": 2900 }\n]',
  },
  {
    request:
      "curl -X POST /v1/subscriptions \\\n  -d customer=cus_9Kf82ImxD \\\n  -d items[]=prod_pro",
    status: "201 Created",
    body: '{\n  "id": "sub_882KdVeeZ",\n  "customer": "cus_9Kf82ImxD",\n  "status": "active"\n}',
  },
];

function getStep(index: number): Step {
  const step = STEPS[index];
  if (!step) throw new Error(`Invalid step index: ${index}`);
  return step;
}

type Phase = "typing" | "response" | "clearing";

const TYPE_MS = 14;
const PRE_RESPONSE_DELAY_MS = 300;
const RESPONSE_HOLD_MS = 1700;
const CLEAR_MS = 320;

export function AnimatedTerminalCard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(getStep(0).request.length);
  const [phase, setPhase] = useState<Phase>("response");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const step = getStep(stepIndex);

  useEffect(() => {
    if (reducedMotion) return;

    if (phase === "typing") {
      if (typedLength < step.request.length) {
        const t = setTimeout(() => setTypedLength((l) => l + 1), TYPE_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("response"), PRE_RESPONSE_DELAY_MS);
      return () => clearTimeout(t);
    }

    if (phase === "response") {
      const t = setTimeout(() => setPhase("clearing"), RESPONSE_HOLD_MS);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
      setTypedLength(0);
      setPhase("typing");
    }, CLEAR_MS);
    return () => clearTimeout(t);
  }, [phase, typedLength, step.request.length, reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="hidden overflow-hidden rounded-lg border border-white/10 bg-card lg:block"
    >
      <div className="border-b border-white/8 px-5 py-3 font-mono text-xs font-medium tracking-wider text-muted-foreground">
        REQUEST LOG
      </div>
      <pre className="whitespace-pre p-6 font-mono text-[14px] leading-[1.9] text-text-tertiary">
        <span
          className={cn(
            "transition-opacity duration-300",
            phase === "clearing" ? "opacity-0" : "opacity-100",
          )}
        >
          <span className="text-primary">$</span>{" "}
          {reducedMotion ? step.request : step.request.slice(0, typedLength)}
          {!reducedMotion && phase === "typing" && (
            <span className="ml-0.5 inline-block h-[13px] w-[7px] animate-pulse bg-text-tertiary align-middle" />
          )}
        </span>
        {"\n\n"}
        <span
          className={cn(
            "block transition-all duration-300",
            reducedMotion || phase === "response"
              ? "translate-y-0 opacity-100"
              : "-translate-y-1 opacity-0",
          )}
        >
          <span className="text-accent-green">&rarr; {step.status}</span>
          {"\n"}
          {step.body}
        </span>
      </pre>
    </div>
  );
}
