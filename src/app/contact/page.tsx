import { Effect } from "effect";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import { buildNavLinks } from "@/lib/nav";

export default async function Contact() {
  const data = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;

      const [navLinks, flags] = yield* Effect.all([
        service.listNavLinks(),
        service
          .readFeatureFlags()
          .pipe(Effect.catchAll(() => Effect.succeed({ showWriting: false, showContact: false }))),
      ]);

      return { navLinks, flags };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { navLinks, flags } = data;

  if (!flags.showContact) {
    notFound();
  }

  return (
    <SiteContainer>
      <Nav links={buildNavLinks(navLinks, flags)} />

      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 py-20 text-center lg:px-14">
        <h1 className="font-sans text-3xl font-bold leading-[1.15] tracking-tight lg:text-5xl">
          Get in touch
        </h1>
        <p className="max-w-[520px] text-base leading-relaxed text-text-secondary">Coming soon.</p>
      </section>

      <Footer />
    </SiteContainer>
  );
}
