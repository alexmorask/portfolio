import { Effect } from "effect";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact/contact-form";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SiteContainer } from "@/components/layout/site-container";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import { buildNavLinks } from "@/lib/nav";
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

      const [navLinks, flags, contactPage] = yield* Effect.all([
        service.listNavLinks(),
        service
          .readFeatureFlags()
          .pipe(Effect.catchAll(() => Effect.succeed({ showWriting: false, showContact: false }))),
        service.readContact().pipe(Effect.catchAll(() => Effect.succeed(fallbackContactPage()))),
      ]);

      return { contactPage, navLinks, flags };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { contactPage, navLinks, flags } = data;

  if (!flags.showContact) {
    notFound();
  }

  return (
    <SiteContainer>
      <Nav links={buildNavLinks(navLinks, flags)} />

      <section className="grid grid-cols-1 gap-16 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-14 lg:py-[72px]">
        <div>
          <SectionEyebrow>{contactPage.eyebrow}</SectionEyebrow>
          <h1 className="mb-5 font-sans text-3xl font-bold leading-[1.15] tracking-tight lg:text-[44px]">
            {contactPage.heading}
          </h1>
          <p className="mb-8 max-w-[420px] text-[17px] leading-[1.65] text-text-secondary">
            {contactPage.description}
          </p>

          {contactPage.availabilityLabel && (
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
              <span className="font-mono text-[10.5px] font-medium tracking-[0.04em] text-text-tertiary">
                {contactPage.availabilityLabel}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {contactPage.email && (
              <Link
                href={`mailto:${contactPage.email}`}
                className="font-mono text-sm font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
              >
                {contactPage.email}
              </Link>
            )}
            {contactPage.github && (
              <Link
                href={contactPage.github}
                className="font-mono text-sm font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
              >
                {contactPage.github.replace("https://", "")}
              </Link>
            )}
            {contactPage.linkedin && (
              <Link
                href={contactPage.linkedin}
                className="font-mono text-sm font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
              >
                {contactPage.linkedin.replace("https://", "")}
              </Link>
            )}
            {contactPage.location && (
              <span className="mt-2 font-mono text-[13px] text-text-tertiary">
                {contactPage.location}
              </span>
            )}
          </div>
        </div>

        <ContactForm />
      </section>

      <Footer />
    </SiteContainer>
  );
}
