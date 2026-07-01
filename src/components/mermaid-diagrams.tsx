"use client";

import { useEffect } from "react";

export function MermaidDiagrams() {
  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    void import("mermaid").then(({ default: mermaid }) => {
      if (cancelled) return;
      mermaid.initialize({ startOnLoad: false, theme: "dark" });

      const run = () => void mermaid.run({ querySelector: ".mermaid" });

      run();

      observer = new MutationObserver(() => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(run, 50);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return null;
}
