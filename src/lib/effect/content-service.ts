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
import { ContentNotFoundError, ContentReadError } from "./errors";

const reader = createReader(process.cwd(), keystaticConfig);

type ContentError = ContentNotFoundError | ContentReadError;

export class ContentService extends Context.Tag("ContentService")<
  ContentService,
  {
    // ── Singletons ───────────────────────────────────────────────────────
    /** Reads the About page singleton. */
    readonly readAbout: () => Effect.Effect<AboutPage, ContentError>;
    /** Reads the Contact page singleton. */
    readonly readContact: () => Effect.Effect<ContactPage, ContentError>;
    /** Reads the Feature Flags singleton. */
    readonly readFeatureFlags: () => Effect.Effect<FeatureFlags, ContentError>;
    /** Reads the Home page singleton. */
    readonly readHome: () => Effect.Effect<HomePage, ContentError>;
    /** Reads the Writing page singleton. */
    readonly readWriting: () => Effect.Effect<WritingPage, ContentError>;

    // ── Collections ──────────────────────────────────────────────────────
    /** Lists all navigation links. */
    readonly listNavLinks: () => Effect.Effect<readonly NavLink[], never>;
    /** Lists all posts. */
    readonly listPosts: () => Effect.Effect<readonly Post[], never>;
    /** Lists all tags with their display labels. */
    readonly listTags: () => Effect.Effect<readonly { slug: string; label: string }[], never>;
    /** Reads a single post by slug. */
    readonly readPost: (slug: string) => Effect.Effect<Post, ContentError>;
  }
>() {}

export const ContentServiceLive = Layer.succeed(ContentService, {
  // ── Singletons ──────────────────────────────────────────────────────────
  readAbout: () =>
    Effect.gen(function* () {
      const data = yield* Effect.tryPromise({
        try: () => reader.singletons.about?.read(),
        catch: (cause) => new ContentReadError({ slug: "about", cause }),
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
      };
    }),

  readContact: () =>
    Effect.gen(function* () {
      const data = yield* Effect.tryPromise({
        try: () => reader.singletons.contact?.read(),
        catch: (cause) => new ContentReadError({ slug: "contact", cause }),
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
      };
    }),

  readFeatureFlags: () =>
    Effect.gen(function* () {
      const data = yield* Effect.tryPromise({
        try: () => reader.singletons.featureFlags?.read(),
        catch: (cause) => new ContentReadError({ slug: "featureFlags", cause }),
      });

      if (!data) {
        return yield* Effect.fail(new ContentNotFoundError({ slug: "featureFlags" }));
      }

      return {
        showWriting: data.showWriting ?? false,
        showContact: data.showContact ?? false,
      };
    }),

  readHome: () =>
    Effect.gen(function* () {
      const data = yield* Effect.tryPromise({
        try: () => reader.singletons.home?.read(),
        catch: (cause) => new ContentReadError({ slug: "home", cause }),
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
          items: (data.focusAreas?.items ?? []).map((item: { text: string }) => item.text),
        },
        experience: {
          heading: data.experience?.heading ?? "02 / EXPERIENCE",
          items: ((data.experience?.items ?? []) as readonly Experience[])
            .map((item) => ({ ...item, companyUrl: item.companyUrl ?? null }))
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        },
      };
    }),

  readWriting: () =>
    Effect.gen(function* () {
      const data = yield* Effect.tryPromise({
        try: () => reader.singletons.writing?.read(),
        catch: (cause) => new ContentReadError({ slug: "writing", cause }),
      });

      if (!data) {
        return yield* Effect.fail(new ContentNotFoundError({ slug: "writing" }));
      }

      return {
        title: data.title ?? "",
        description: data.description ?? "",
        featuredPostSlug: data.featuredPost ?? null,
      };
    }),

  // ── Collections ─────────────────────────────────────────────────────────
  listNavLinks: () =>
    Effect.tryPromise(async () => {
      const entries = await reader.collections.navLinks?.all();
      return (entries ?? [])
        .map((e) => ({
          label: e.entry.label,
          url: e.entry.url,
          sortOrder: e.entry.sortOrder,
        }))
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }).pipe(
      Effect.catchAll((error) => {
        console.error("Failed to list nav links:", error);
        return Effect.succeed([]);
      }),
    ),

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
      }));
    }).pipe(
      Effect.catchAll((error) => {
        console.error("Failed to list posts:", error);
        return Effect.succeed([]);
      }),
    ),

  listTags: () =>
    Effect.tryPromise(async () => {
      const entries = await reader.collections.tags?.all();
      return (entries ?? [])
        .map((e) => ({
          slug: e.slug,
          label: e.entry.label,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }).pipe(
      Effect.catchAll((error) => {
        console.error("Failed to list tags:", error);
        return Effect.succeed([]);
      }),
    ),

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
        error instanceof ContentNotFoundError
          ? error
          : new ContentReadError({ slug, cause: error }),
    }),
});
