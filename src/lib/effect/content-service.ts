import { createReader } from "@keystatic/core/reader";
import { Context, Effect, Layer } from "effect";
import keystaticConfig from "../../../keystatic.config";
import { ContentNotFoundError } from "./errors";

const reader = createReader(process.cwd(), keystaticConfig);

export interface WriteUpContent {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly kind: "personal-project" | "case-study";
  readonly tags: readonly string[];
  readonly publishedAt: string | null;
  readonly body: string;
}

export interface Experience {
  readonly title: string;
  readonly date: string;
  readonly company: string;
  readonly description: string;
  readonly sortOrder: number | null;
}

export interface HomeContent {
  readonly heroEyebrow: string;
  readonly heroHeading: string;
  readonly heroParagraph1: string;
  readonly heroParagraph2: string;
  readonly focusAreas: readonly string[];
  readonly experience: readonly Experience[];
}

export interface AboutContent {
  readonly heading: string;
  readonly introParagraph1: string;
  readonly introParagraph2: string;
  readonly backgroundParagraph1: string;
  readonly backgroundParagraph2: string;
  readonly howIWork: readonly string[];
  readonly beyondTheLedger: string;
}

export class ContentService extends Context.Tag("ContentService")<
  ContentService,
  {
    /** Reads a single write-up by slug. */
    readonly readWriteUp: (slug: string) => Effect.Effect<WriteUpContent, ContentNotFoundError>;
    /** Lists all write-ups. */
    readonly listWriteUps: () => Effect.Effect<readonly WriteUpContent[], never>;
    /** Reads the Home page singleton. */
    readonly readHome: () => Effect.Effect<HomeContent, ContentNotFoundError>;
    /** Reads the About page singleton. */
    readonly readAbout: () => Effect.Effect<AboutContent, ContentNotFoundError>;
  }
>() {}

export const ContentServiceLive = Layer.succeed(ContentService, {
  readWriteUp: (slug) =>
    Effect.tryPromise({
      try: async () => {
        const data = await reader.collections.writeUps?.read(slug, {
          resolveLinkedFiles: true,
        });
        if (!data) throw new ContentNotFoundError({ slug });
        return {
          slug,
          title: data.title,
          summary: data.summary,
          kind: data.kind,
          tags: data.tags,
          publishedAt: data.publishedAt,
          body: data.body,
        };
      },
      catch: (error) =>
        error instanceof ContentNotFoundError ? error : new ContentNotFoundError({ slug }),
    }),

  listWriteUps: () =>
    Effect.tryPromise(async () => {
      const entries = await reader.collections.writeUps?.all();
      return (entries ?? []).map((e) => ({
        slug: e.slug,
        title: e.entry.title,
        summary: e.entry.summary,
        kind: e.entry.kind,
        tags: e.entry.tags,
        publishedAt: e.entry.publishedAt,
        body: "",
      })) as readonly WriteUpContent[];
    }).pipe(Effect.catchAll(() => Effect.succeed([] as readonly WriteUpContent[]))),

  readHome: () =>
    Effect.gen(function* () {
      const data = yield* Effect.tryPromise({
        try: () => reader.singletons.home?.read(),
        catch: () => new ContentNotFoundError({ slug: "home" }),
      });

      if (!data) {
        return yield* Effect.fail(new ContentNotFoundError({ slug: "home" }));
      }

      return {
        heroEyebrow: data.heroEyebrow ?? "",
        heroHeading: data.heroHeading ?? "",
        heroParagraph1: data.heroParagraph1 ?? "",
        heroParagraph2: data.heroParagraph2 ?? "",
        focusAreas: ((data.focusAreas ?? []) as readonly { text: string }[]).map(
          (item: { text: string }) => item.text,
        ),
        experience: [...((data.experience ?? []) as readonly Experience[])].sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
        ),
      } as const;
    }),

  readAbout: () =>
    Effect.gen(function* () {
      const data = yield* Effect.tryPromise({
        try: () => reader.singletons.about?.read(),
        catch: () => new ContentNotFoundError({ slug: "about" }),
      });

      if (!data) {
        return yield* Effect.fail(new ContentNotFoundError({ slug: "about" }));
      }

      return {
        heading: data.heading ?? "",
        introParagraph1: data.introParagraph1 ?? "",
        introParagraph2: data.introParagraph2 ?? "",
        backgroundParagraph1: data.backgroundParagraph1 ?? "",
        backgroundParagraph2: data.backgroundParagraph2 ?? "",
        howIWork: (data.howIWork ?? []).map((item: { text: string }) => item.text),
        beyondTheLedger: data.beyondTheLedger ?? "",
      } as const;
    }),
});
