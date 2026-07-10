import { Effect } from "effect";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { FilteredPostList } from "@/components/writing/filtered-post-list";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import { buildNavLinks } from "@/lib/nav";
import type { WritingPage } from "@/types/content/singletons";

function fallbackWritingPage(): WritingPage {
  return {
    title: "Writing",
    description: "",
    featuredPostSlug: null,
  };
}

export default async function Writing() {
  const data = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;

      const [navLinks, posts, allTags, flags] = yield* Effect.all([
        service.listNavLinks(),
        service.listPosts(),
        service.listTags(),
        service
          .readFeatureFlags()
          .pipe(Effect.catchAll(() => Effect.succeed({ showWriting: false, showContact: false }))),
      ]);

      const writingPage = yield* service
        .readWriting()
        .pipe(Effect.catchAll(() => Effect.succeed(fallbackWritingPage())));

      return { writingPage, posts, allTags, navLinks, flags };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { writingPage, posts, allTags, navLinks, flags } = data;

  if (!flags.showWriting) {
    notFound();
  }

  const publishedPosts = posts.filter((p) => p.publishedAt);

  const featuredPost = writingPage.featuredPostSlug
    ? (publishedPosts.find((p) => p.slug === writingPage.featuredPostSlug) ?? null)
    : null;

  const listPosts = featuredPost
    ? publishedPosts.filter((p) => p.slug !== featuredPost.slug)
    : publishedPosts;

  return (
    <SiteContainer>
      <Nav links={buildNavLinks(navLinks, flags)} />

      <section className="px-5 py-8 lg:px-14 lg:py-14">
        <div className="mb-[18px] font-mono text-xs font-medium tracking-[0.1em] text-primary">
          WRITING
        </div>
        <h1 className="mb-4 font-sans text-4xl font-bold leading-[1.15] tracking-tight lg:text-[44px]">
          {writingPage.title}
        </h1>
        <p className="max-w-[640px] text-base leading-[1.6] text-[#9aa3b2]">
          {writingPage.description}
        </p>
      </section>

      <FilteredPostList posts={listPosts} featuredPost={featuredPost} allTags={allTags} />

      <Footer>
        {flags.showContact && (
          <Link
            href="/contact"
            className="font-mono text-[13px] font-semibold text-primary transition-colors duration-150 hover:text-foreground"
          >
            Get in touch &rarr;
          </Link>
        )}
      </Footer>
    </SiteContainer>
  );
}
