import { Effect } from "effect";
import { ExperienceTimeline } from "@/components/home/experience-timeline";
import { FocusAreas } from "@/components/home/focus-areas";
import { HeroSection } from "@/components/home/hero-section";
import { LatestPostCard } from "@/components/home/latest-post-card";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import type { HomePage } from "@/types/content/singletons";

function fallbackHome(): HomePage {
  return {
    hero: {
      eyebrow: "",
      heading: "Alex Morask",
      introParagraph: "",
      secondaryParagraph: "",
    },
    focusAreas: { heading: "", items: [] },
    experience: { heading: "", items: [] },
  };
}

export default async function Home() {
  const data = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;

      const [navLinks, posts] = yield* Effect.all([service.listNavLinks(), service.listPosts()]);

      const home = yield* service
        .readHome()
        .pipe(Effect.catchAll(() => Effect.succeed(fallbackHome())));

      const latestPost = posts
        .filter((p) => p.publishedAt)
        .sort(
          (a, b) =>
            new Date(b.publishedAt as string).getTime() -
            new Date(a.publishedAt as string).getTime(),
        )[0];

      return { home, navLinks, latestPost };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { home, navLinks, latestPost } = data;

  return (
    <SiteContainer>
      <Nav links={navLinks} />

      <HeroSection home={home} latestPost={latestPost} />

      <FocusAreas heading={home.focusAreas.heading} items={home.focusAreas.items} />

      <ExperienceTimeline heading={home.experience.heading} items={home.experience.items} />

      {latestPost && <LatestPostCard post={latestPost} />}

      <Footer />
    </SiteContainer>
  );
}
