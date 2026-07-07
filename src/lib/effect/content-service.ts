import { createReader } from "@keystatic/core/reader";
import { Context, Effect, Layer } from "effect";
import type { NavLink, Post } from "@/types/content/collections";
import type {
  AboutPage,
  ContactPage,
  Experience,
  FeatureFlags,
  HomePage,
  WritingPage,
} from "@/types/content/singletons";
import keystaticConfig from "../../../keystatic.config";
import { ContentNotFoundError } from "./errors";

const reader = createReader(process.cwd(), keystaticConfig);

export class ContentService extends Context.Tag("ContentService")<
  ContentService,
  {
    /** Reads a single post by slug. */
    readonly readPost: (slug: string) => Effect.Effect<Post, ContentNotFoundError>;
    /** Lists all posts. */
    readonly listPosts: () => Effect.Effect<readonly Post[], never>;
    /** Reads the Home page singleton. */
    readonly readHome: () => Effect.Effect<HomePage, ContentNotFoundError>;
    /** Reads the About page singleton. */
    readonly readAbout: () => Effect.Effect<AboutPage, ContentNotFoundError>;
    /** Lists all navigation links. */
    readonly listNavLinks: () => Effect.Effect<readonly NavLink[], never>;
    /** Reads the Writing page singleton. */
    readonly readWritingPage: () => Effect.Effect<WritingPage, ContentNotFoundError>;
    /** Lists all tags with their display labels. */
    readonly listTags: () => Effect.Effect<readonly { slug: string; label: string }[], never>;
    /** Reads the Feature Flags singleton. */
    readonly readFeatureFlags: () => Effect.Effect<FeatureFlags, ContentNotFoundError>;
    /** Reads the Contact page singleton. */
    readonly readContactPage: () => Effect.Effect<ContactPage, ContentNotFoundError>;
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
      })) as readonly Post[];
    }).pipe(Effect.catchAll(() => Effect.succeed([] as readonly Post[]))),

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

  readWritingPage: () =>
    Effect.gen(function* () {
      const data = yield* Effect.tryPromise({
        try: () => reader.singletons.writing?.read(),
        catch: () => new ContentNotFoundError({ slug: "writing" }),
      });

      if (!data) {
        return yield* Effect.fail(new ContentNotFoundError({ slug: "writing" }));
      }

      return {
        title: data.title ?? "",
        description: data.description ?? "",
        featuredPostSlug: data.featuredPost ?? null,
      } as const;
    }),

  listTags: () =>
    Effect.tryPromise(async () => {
      const entries = await reader.collections.tags?.all();
      const tags = (entries ?? []).map((e) => ({
        slug: e.slug,
        label: e.entry.label,
      }));
      return tags.sort((a, b) => a.label.localeCompare(b.label));
    }).pipe(
      Effect.catchAll(() => Effect.succeed([] as readonly { slug: string; label: string }[])),
    ),

  readFeatureFlags: () =>
    Effect.gen(function* () {
      const data = yield* Effect.tryPromise({
        try: () => reader.singletons.featureFlags?.read(),
        catch: () => new ContentNotFoundError({ slug: "featureFlags" }),
      });

      if (!data) {
        return yield* Effect.fail(new ContentNotFoundError({ slug: "featureFlags" }));
      }

      return {
        showWriting: data.showWriting ?? false,
        showContact: data.showContact ?? false,
      } as const;
    }),

  readContactPage: () =>
    Effect.gen(function* () {
      const data = yield* Effect.tryPromise({
        try: () => reader.singletons.contact?.read(),
        catch: () => new ContentNotFoundError({ slug: "contact" }),
      });

      if (!data) {
        return yield* Effect.fail(new ContentNotFoundError({ slug: "contact" }));
      }

      return {
        eyebrow: data.eyebrow ?? "05 / CONTACT",
        heading: data.heading ?? "",
        description: data.description ?? "",
        availabilityLabel: data.availabilityLabel ?? "",
        email: data.email ?? "",
        github: data.github ?? "",
        linkedin: data.linkedin ?? "",
        location: data.location ?? "",
      } as const;
    }),
});
