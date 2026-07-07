import { createReader } from "@keystatic/core/reader";
import { Context, Effect, Layer } from "effect";
import keystaticConfig from "../../../keystatic.config";
import { ContentNotFoundError } from "./errors";

const reader = createReader(process.cwd(), keystaticConfig);

export interface NavLink {
  readonly label: string;
  readonly url: string;
  readonly sortOrder: number | null;
}

export interface PostContent {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
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
  readonly hero: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly introParagraph: string;
    readonly secondaryParagraph: string;
  };
  readonly focusAreas: {
    readonly heading: string;
    readonly items: readonly string[];
  };
  readonly experience: {
    readonly heading: string;
    readonly items: readonly Experience[];
  };
}

export interface AboutContent {
  readonly intro: {
    readonly heading: string;
    readonly introParagraph: string;
    readonly secondaryParagraph: string;
  };
  readonly background: {
    readonly body: string;
  };
  readonly howIWork: {
    readonly heading: string;
    readonly items: readonly string[];
  };
  readonly beyondTheLedger: {
    readonly heading: string;
    readonly body: string;
  };
}

export class ContentService extends Context.Tag("ContentService")<
  ContentService,
  {
    /** Reads a single post by slug. */
    readonly readPost: (slug: string) => Effect.Effect<PostContent, ContentNotFoundError>;
    /** Lists all posts. */
    readonly listPosts: () => Effect.Effect<readonly PostContent[], never>;
    /** Reads the Home page singleton. */
    readonly readHome: () => Effect.Effect<HomeContent, ContentNotFoundError>;
    /** Reads the About page singleton. */
    readonly readAbout: () => Effect.Effect<AboutContent, ContentNotFoundError>;
    /** Lists all navigation links. */
    readonly listNavLinks: () => Effect.Effect<readonly NavLink[], never>;
  }
>() {}

export const ContentServiceLive = Layer.succeed(ContentService, {
  readPost: (slug) =>
    Effect.tryPromise({
      try: async () => {
        const data = await reader.collections.posts?.read(slug, {
          resolveLinkedFiles: true,
        });
        if (!data) throw new ContentNotFoundError({ slug });
        return {
          slug,
          title: data.title,
          summary: data.summary,
          tags: data.tags,
          publishedAt: data.publishedAt,
          body: data.body,
        };
      },
      catch: (error) =>
        error instanceof ContentNotFoundError ? error : new ContentNotFoundError({ slug }),
    }),

  listPosts: () =>
    Effect.tryPromise(async () => {
      const entries = await reader.collections.posts?.all();
      return (entries ?? []).map((e) => ({
        slug: e.slug,
        title: e.entry.title,
        summary: e.entry.summary,
        tags: e.entry.tags,
        publishedAt: e.entry.publishedAt,
        body: "",
      })) as readonly PostContent[];
    }).pipe(Effect.catchAll(() => Effect.succeed([] as readonly PostContent[]))),

  listNavLinks: () =>
    Effect.tryPromise(async () => {
      const entries = await reader.collections.navLinks?.all();
      const links = (entries ?? [])
        .map((e) => ({
          label: e.entry.label,
          url: e.entry.url,
          sortOrder: e.entry.sortOrder,
        }))
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      return links;
    }).pipe(Effect.catchAll(() => Effect.succeed([] as readonly NavLink[]))),

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
        hero: {
          eyebrow: data.hero?.eyebrow ?? "",
          heading: data.hero?.heading ?? "",
          introParagraph: data.hero?.introParagraph ?? "",
          secondaryParagraph: data.hero?.secondaryParagraph ?? "",
        },
        focusAreas: {
          heading: data.focusAreas?.heading ?? "01 / FOCUS AREAS",
          items: ((data.focusAreas?.items ?? []) as readonly { text: string }[]).map(
            (item: { text: string }) => item.text,
          ),
        },
        experience: {
          heading: data.experience?.heading ?? "02 / EXPERIENCE",
          items: [...((data.experience?.items ?? []) as readonly Experience[])].sort(
            (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
          ),
        },
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
        intro: {
          heading: data.intro?.heading ?? "",
          introParagraph: data.intro?.introParagraph ?? "",
          secondaryParagraph: data.intro?.secondaryParagraph ?? "",
        },
        background: {
          body: data.background?.body ?? "",
        },
        howIWork: {
          heading: data.howIWork?.heading ?? "HOW I WORK",
          items: (data.howIWork?.items ?? []).map((item: { text: string }) => item.text),
        },
        beyondTheLedger: {
          heading: data.beyondTheLedger?.heading ?? "BEYOND THE LEDGER",
          body: data.beyondTheLedger?.body ?? "",
        },
      } as const;
    }),
});
