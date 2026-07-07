import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { IdempotentWritePathDiagram } from "@/components/mock/idempotent-write-path-diagram";

export default function MockWriteUpPage() {
  return (
    <SiteContainer>
      <Nav />

      <div className="px-5 pt-[18px] lg:px-14">
        <Link
          href="/"
          className="font-mono text-xs text-text-faint transition-colors duration-150 hover:text-primary"
        >
          Home
        </Link>
        <span className="font-mono text-xs text-text-faint"> / </span>
        <span className="hidden lg:inline">
          <Link
            href="/#writing"
            className="font-mono text-xs text-text-faint transition-colors duration-150 hover:text-primary"
          >
            Writing
          </Link>
          <span className="font-mono text-xs text-text-faint"> / </span>
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          <span className="hidden lg:inline">Designing an Idempotent Payment Ledger</span>
          <span className="lg:hidden">Idempotent Payment Ledger</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-12 px-5 py-9 lg:grid-cols-[1fr_260px] lg:px-14 lg:pb-20">
        <article className="max-w-[760px]">
          <div className="mb-[18px] font-mono text-xs font-medium tracking-[0.1em] text-primary">
            SYSTEM DESIGN WRITE-UP
          </div>
          <h1 className="mb-5 font-sans text-2xl font-bold leading-[1.2] tracking-tight lg:text-[40px]">
            Designing an Idempotent Payment Ledger
          </h1>
          <div className="mb-[14px] flex flex-wrap items-center gap-[10px] lg:gap-4">
            <span className="font-mono text-xs font-medium text-text-tertiary">Alex Morask</span>
            <span className="text-[#3a4150]">&middot;</span>
            <span className="font-mono text-xs font-medium text-muted-foreground">June 2026</span>
            <span className="text-[#3a4150]">&middot;</span>
            <span className="font-mono text-xs font-medium text-muted-foreground">12 min read</span>
          </div>
          <div className="mb-10 flex flex-wrap gap-2">
            {["Payments", "Distributed Systems", "Reliability"].map((tag) => (
              <span
                key={tag}
                className="rounded-[5px] border border-white/[0.14] px-[10px] py-[5px] font-mono text-[11px] font-medium text-text-tertiary"
              >
                {tag}
              </span>
            ))}
          </div>

          <section id="s-intro">
            <h2 className="mb-[14px] font-sans text-[19px] font-semibold text-foreground lg:text-[22px]">
              Introduction
            </h2>
            <p className="mb-7 text-base leading-[1.75] text-text-secondary">
              Every payment API eventually faces the same failure: a client sends a charge request,
              the network drops the response, and the client — not knowing whether the charge
              succeeded — retries. Without a way to distinguish &quot;the same request,
              retried&quot; from &quot;a new request,&quot; that retry becomes a duplicate charge.
            </p>
          </section>

          <section id="s-problem">
            <h2 className="mb-[14px] font-sans text-[19px] font-semibold text-foreground lg:text-[22px]">
              The Problem with Retries
            </h2>
            <p className="mb-7 text-base leading-[1.75] text-text-secondary">
              Retries are unavoidable — timeouts, load balancer failovers, and mobile networks all
              guarantee that some requests will be sent more than once. The ledger has to make
              &quot;retry&quot; a safe, first-class case rather than an edge case, or every
              uncertain network hiccup becomes a support ticket.
            </p>
          </section>

          <section id="s-keys">
            <h2 className="mb-[14px] font-sans text-[19px] font-semibold text-foreground lg:text-[22px]">
              Idempotency Keys
            </h2>
            <p className="mb-5 text-base leading-[1.75] text-text-secondary">
              A client generates a unique key per logical action — not per HTTP call — and sends it
              with every attempt of that action. The server uses the key to look up whether it has
              already processed this exact request, and if so, replays the original response instead
              of charging again.
            </p>
            <div className="mb-8 rounded-r-md border-l-[3px] border-primary bg-primary/[0.08] px-5 py-4">
              <div className="mb-2 font-mono text-[11px] font-semibold tracking-wider text-primary">
                NOTE
              </div>
              <p className="text-sm leading-relaxed text-text-secondary">
                Idempotency keys must be scoped per-endpoint and stored durably before any
                side-effecting call — generating the key client-side (e.g. a UUID per user action)
                is what makes retries safe.
              </p>
            </div>
          </section>

          <section id="s-path">
            <h2 className="mb-[14px] font-sans text-[19px] font-semibold text-foreground lg:text-[22px]">
              The Write Path
            </h2>
            <p className="mb-6 text-base leading-[1.75] text-text-secondary">
              The diagram below traces a single charge request from the moment it arrives to the
              moment the client sees a response — including the branch where a retried request
              short-circuits straight to a cached result.
            </p>

            <div className="mb-3 rounded-lg border border-white/10 bg-card p-5">
              <IdempotentWritePathDiagram />
            </div>
            <div className="mb-8 text-center font-mono text-xs text-text-faint">
              fig 1 — idempotent write path
            </div>

            <div className="mb-8 overflow-hidden rounded-lg border border-white/10 bg-card">
              <div className="border-b border-white/8 px-4 py-2.5 font-mono text-[10.5px] font-medium tracking-wider text-muted-foreground">
                charge.py
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.8] text-text-tertiary">
                <code>
                  def charge(request):{"\n"}
                  {"    "}key = request.idempotency_key{"\n"}
                  {"    "}cached = ledger.lookup(key){"\n"}
                  {"    "}if cached:{"\n"}
                  {"        "}
                  <span className="text-text-faint"># replay, no side effects</span>
                  {"\n"}
                  {"        "}return cached.response{"\n\n"}
                  {"    "}with ledger.lock(key):{"\n"}
                  {"        "}entry = ledger.append(request){"\n"}
                  {"        "}response = gateway.charge(entry){"\n"}
                  {"        "}ledger.cache(key, response){"\n"}
                  {"        "}return response
                </code>
              </pre>
            </div>
          </section>

          <section id="s-recon">
            <h2 className="mb-[14px] font-sans text-[19px] font-semibold text-foreground lg:text-[22px]">
              Reconciliation Loop
            </h2>
            <p className="mb-7 text-base leading-[1.75] text-text-secondary">
              Idempotency keys prevent duplicate charges at the API layer, but they don&apos;t
              guarantee the ledger and the payment processor agree on every entry. A background
              reconciliation job compares ledger entries against processor records on a fixed
              interval, flagging mismatches — a charge the processor confirms but the ledger never
              recorded, or vice versa — for manual review before they surface as customer-facing
              discrepancies.
            </p>
          </section>

          <section id="s-failure">
            <h2 className="mb-[14px] font-sans text-[19px] font-semibold text-foreground lg:text-[22px]">
              Failure Modes
            </h2>
            <div className="mb-8 flex flex-col gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] font-medium text-primary">&rarr;</span>
                <span className="text-[15px] leading-relaxed text-text-secondary">
                  Client retries with a new key by mistake — a duplicate charge slips through.
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] font-medium text-primary">&rarr;</span>
                <span className="text-[15px] leading-relaxed text-text-secondary">
                  Ledger write succeeds but response caching fails, so the client retries into a
                  fresh charge attempt.
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] font-medium text-primary">&rarr;</span>
                <span className="text-[15px] leading-relaxed text-text-secondary">
                  Lock contention under high concurrency — retries pile up faster than the ledger
                  can drain them.
                </span>
              </div>
            </div>
          </section>

          <section id="s-takeaways">
            <h2 className="mb-[14px] font-sans text-[19px] font-semibold text-foreground lg:text-[22px]">
              Takeaways
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] font-medium text-primary">&rarr;</span>
                <span className="text-[15px] leading-relaxed text-text-secondary">
                  Idempotency keys close the gap between &quot;the request succeeded&quot; and
                  &quot;the client knows it succeeded.&quot;
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] font-medium text-primary">&rarr;</span>
                <span className="text-[15px] leading-relaxed text-text-secondary">
                  Treat the ledger as the source of truth — cache responses, never re-derive them.
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] font-medium text-primary">&rarr;</span>
                <span className="text-[15px] leading-relaxed text-text-secondary">
                  Reconciliation is the safety net for the failure modes idempotency can&apos;t
                  fully prevent.
                </span>
              </div>
            </div>
          </section>
        </article>

        <aside className="sticky top-6 hidden border-l border-white/8 pl-5 lg:block">
          <div className="mb-4 font-mono text-[11px] font-medium tracking-[0.1em] text-text-faint">
            ON THIS PAGE
          </div>
          <div className="flex flex-col gap-3">
            <Link href="#s-intro" className="font-mono text-xs font-medium text-primary">
              Introduction
            </Link>
            <Link
              href="#s-problem"
              className="font-mono text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-primary"
            >
              The Problem with Retries
            </Link>
            <Link
              href="#s-keys"
              className="font-mono text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-primary"
            >
              Idempotency Keys
            </Link>
            <Link
              href="#s-path"
              className="font-mono text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-primary"
            >
              The Write Path
            </Link>
            <Link
              href="#s-recon"
              className="font-mono text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-primary"
            >
              Reconciliation Loop
            </Link>
            <Link
              href="#s-failure"
              className="font-mono text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-primary"
            >
              Failure Modes
            </Link>
            <Link
              href="#s-takeaways"
              className="font-mono text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-primary"
            >
              Takeaways
            </Link>
          </div>
        </aside>
      </div>

      <Footer />
    </SiteContainer>
  );
}
