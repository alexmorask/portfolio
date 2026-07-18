import { Effect } from "effect";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { FilteredPostList } from "@/components/writing/filtered-post-list";
import { WritingHeroSection } from "@/components/writing/writing-hero-section";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import type { WritingPage } from "@/types/content/singletons";

function fallbackWritingPage(): WritingPage {
  return {
    eyebrow: "WRITING",
    title: "Writing",
    description: "",
    featuredPostSlug: null,
  };
}

export default async function Writing() {
  const data = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;

      const [navLinks, posts, allTags] = yield* Effect.all([
        service.listNavLinks(),
        service.listPosts(),
        service.listTags(),
      ]);

      const writingPage = yield* service
        .readWriting()
        .pipe(Effect.catchAll(() => Effect.succeed(fallbackWritingPage())));

      return { writingPage, posts, allTags, navLinks };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { writingPage, posts, allTags, navLinks } = data;

  const publishedPosts = posts.filter((p) => p.publishedAt);

  const featuredPost = writingPage.featuredPostSlug
    ? (publishedPosts.find((p) => p.slug === writingPage.featuredPostSlug) ?? null)
    : null;

  const listPosts = featuredPost
    ? publishedPosts.filter((p) => p.slug !== featuredPost.slug)
    : publishedPosts;

  return (
    <SiteContainer>
      <Nav links={navLinks} />

      <WritingHeroSection writingPage={writingPage} />

      <FilteredPostList posts={listPosts} featuredPost={featuredPost} allTags={allTags} />

      <Footer />
    </SiteContainer>
  );
}
