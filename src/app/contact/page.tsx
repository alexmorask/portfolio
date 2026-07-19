import { Effect } from "effect";
import { ContactSection } from "@/components/contact/contact-section";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import type { ContactPage } from "@/types/content/singletons";

function fallbackContactPage(): ContactPage {
  return {
    eyebrow: "05 / CONTACT",
    heading: "",
    description: "",
    availabilityLabel: "",
    email: "",
    github: "",
    linkedin: "",
    location: "",
  };
}

export default async function Contact() {
  const data = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;

      const [navLinks, contactPage] = yield* Effect.all([
        service.listNavLinks(),
        service.readContact().pipe(Effect.catchAll(() => Effect.succeed(fallbackContactPage()))),
      ]);

      return { contactPage, navLinks };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { contactPage, navLinks } = data;

  return (
    <SiteContainer>
      <Nav links={navLinks} />

      <ContactSection contactPage={contactPage} />

      <Footer />
    </SiteContainer>
  );
}
