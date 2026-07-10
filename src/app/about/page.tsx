import { Effect } from "effect";
import { BackgroundSection } from "@/components/about/background-section";
import { BeyondTheLedgerSection } from "@/components/about/beyond-the-ledger-section";
import { HowIWorkSection } from "@/components/about/how-i-work-section";
import { IntroSection } from "@/components/about/intro-section";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import { buildNavLinks } from "@/lib/nav";
import type { AboutPage } from "@/types/content/singletons";

function fallbackAbout(): AboutPage {
  return {
    intro: {
      heading: "",
      introParagraph: "",
      secondaryParagraph: "",
    },
    background: {
      body: "",
    },
    howIWork: {
      heading: "",
      items: [],
    },
    beyondTheLedger: {
      heading: "",
      body: "",
    },
  };
}

export default async function About() {
  const data = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;

      const [navLinks, flags] = yield* Effect.all([
        service.listNavLinks(),
        service
          .readFeatureFlags()
          .pipe(Effect.catchAll(() => Effect.succeed({ showWriting: false, showContact: false }))),
      ]);

      const about = yield* service
        .readAbout()
        .pipe(Effect.catchAll(() => Effect.succeed(fallbackAbout())));

      return { about, navLinks, flags };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { about, navLinks, flags } = data;

  return (
    <SiteContainer>
      <Nav links={buildNavLinks(navLinks, flags)} />

      <IntroSection about={about} />

      <BackgroundSection body={about.background.body} />

      <HowIWorkSection heading={about.howIWork.heading} items={about.howIWork.items} />

      <BeyondTheLedgerSection
        heading={about.beyondTheLedger.heading}
        body={about.beyondTheLedger.body}
      />

      <Footer showContact={flags.showContact} />
    </SiteContainer>
  );
}
