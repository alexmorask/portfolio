import { Effect } from "effect";
import Link from "next/link";
import { ExperienceTimeline } from "@/components/home/experience-timeline";
import { FocusAreas } from "@/components/home/focus-areas";
import { HeroSection } from "@/components/home/hero-section";
import { LatestPostCard } from "@/components/home/latest-post-card";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import { buildNavLinks } from "@/lib/nav";
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

      const [navLinks, posts, flags] = yield* Effect.all([
        service.listNavLinks(),
        service.listPosts(),
        service
          .readFeatureFlags()
          .pipe(Effect.catchAll(() => Effect.succeed({ showWriting: false, showContact: false }))),
      ]);

      const home = yield* service
        .readHome()
        .pipe(Effect.catchAll(() => Effect.succeed(fallbackHome())));

      const latestPost = flags.showWriting
        ? posts
            .filter((p) => p.publishedAt)
            .sort(
              (a, b) =>
                new Date(b.publishedAt as string).getTime() -
                new Date(a.publishedAt as string).getTime(),
            )[0]
        : undefined;

      return { home, navLinks, latestPost, flags };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { home, navLinks, latestPost, flags } = data;

  return (
    <SiteContainer>
      <Nav links={buildNavLinks(navLinks, flags)} />

      <HeroSection home={home} latestPost={latestPost} showContact={flags.showContact} />

      <FocusAreas heading={home.focusAreas.heading} items={home.focusAreas.items} />

      <ExperienceTimeline heading={home.experience.heading} items={home.experience.items} />

      {latestPost && flags.showWriting && <LatestPostCard post={latestPost} />}

      <Footer>
        <div className="flex flex-col gap-[10px] lg:flex-row lg:gap-6">
          <Link
            href="mailto:alex@alexmorask.com"
            className="font-mono text-xs font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
          >
            alex@alexmorask.com
          </Link>
          <Link
            href="https://github.com/alexmorask"
            className="font-mono text-xs font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
          >
            github.com/alexmorask
          </Link>
          <Link
            href="https://linkedin.com/in/alexmorask"
            className="font-mono text-xs font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
          >
            linkedin.com/in/alexmorask
          </Link>
        </div>
      </Footer>
    </SiteContainer>
  );
}
