export function TerminalCard() {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-white/10 bg-card lg:block">
      <div className="border-b border-white/8 px-4 py-2.5 font-mono text-[10.5px] font-medium tracking-wider text-muted-foreground">
        REQUEST LOG
      </div>
      <pre className="whitespace-pre p-5 font-mono text-[13px] leading-[1.8] text-text-tertiary">
        <span className="text-primary">$</span> curl -X POST /v1/charges \{"\n"}-H
        &quot;Idempotency-Key: 8f14e45f...&quot; \{"\n"}-d amount=4900 -d currency=usd
        {"\n\n"}
        <span className="text-accent-green">&rarr; 200 OK</span>
        {"\n"}
        {"{"}
        {"\n"}
        {'  "id": "ch_1N3x9K2eZvKY",'}
        {"\n"}
        {'  "status": "succeeded",'}
        {"\n"}
        {'  "idempotent_replay": '}
        <span className="text-primary">false</span>
        {"\n"}
        {"}"}
      </pre>
    </div>
  );
}
