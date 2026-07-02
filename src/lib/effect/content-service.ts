import { Context, Effect, Layer } from "effect";
import { ContentNotFoundError } from "./errors";
import { retryPolicy } from "./retry";

export interface SystemDesignEntry {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly kind: "personal-project" | "case-study";
  readonly tags: readonly string[];
  readonly publishedAt: string;
  readonly body: string;
}

export class ContentService extends Context.Tag("ContentService")<
  ContentService,
  {
    /** Reads a single system-design entry by slug. */
    readonly readEntry: (slug: string) => Effect.Effect<SystemDesignEntry, ContentNotFoundError>;
    /** Lists all system-design entries. */
    readonly listEntries: () => Effect.Effect<readonly SystemDesignEntry[], never>;
  }
>() {}

/**
 * Stub Live layer — returns mock data.
 * Phase E (Keystatic) replaces this with a real filesystem reader and
 * adds Home/About singleton methods.
 */
export const ContentServiceLive = Layer.succeed(ContentService, {
  readEntry: (slug) =>
    Effect.gen(function* () {
      if (slug !== "mock-entry") {
        return yield* Effect.fail(new ContentNotFoundError({ slug }));
      }
      return {
        slug: "mock-entry",
        title: "Mock System Design",
        summary: "Placeholder — Phase E wires Keystatic.",
        kind: "personal-project" as const,
        tags: ["billing"],
        publishedAt: "2026-01-01",
        body: "# Mock\n\nPlaceholder.",
      } as const;
    }).pipe(Effect.retry(retryPolicy)),

  listEntries: () =>
    Effect.succeed([
      {
        slug: "mock-entry",
        title: "Mock System Design",
        summary: "Placeholder — Phase E wires Keystatic.",
        kind: "personal-project" as const,
        tags: ["billing"],
        publishedAt: "2026-01-01",
        body: "# Mock\n\nPlaceholder.",
      },
    ] as const),
});
