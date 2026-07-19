import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import type { ContactPage } from "@/types/content/singletons";

export function ContactSection({ contactPage }: { contactPage: ContactPage }) {
  return (
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
  );
}
