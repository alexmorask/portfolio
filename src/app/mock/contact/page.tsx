import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SiteContainer } from "@/components/layout/site-container";
import { ContactForm } from "./contact-form";

export default function MockContactPage() {
  return (
    <SiteContainer>
      <Nav />

      <section className="grid grid-cols-1 gap-16 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-14 lg:py-[72px]">
        <div>
          <SectionEyebrow>05 / CONTACT</SectionEyebrow>
          <h1 className="mb-5 font-sans text-3xl font-bold leading-[1.15] tracking-tight lg:text-[44px]">
            Let&apos;s talk.
          </h1>
          <p className="mb-8 max-w-[420px] text-[17px] leading-[1.65] text-text-secondary">
            Open to consulting engagements, technical advising, and conversations about billing and
            payments systems. I read everything that comes through here.
          </p>

          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            <span className="font-mono text-[10.5px] font-medium tracking-[0.04em] text-text-tertiary">
              OPEN TO CONSULTING
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="mailto:alex@alexmorask.com"
              className="font-mono text-sm font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
            >
              alex@alexmorask.com
            </Link>
            <Link
              href="https://github.com/alexmorask"
              className="font-mono text-sm font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
            >
              github.com/alexmorask
            </Link>
            <Link
              href="https://linkedin.com/in/alexmorask"
              className="font-mono text-sm font-medium text-text-tertiary transition-colors duration-150 hover:text-primary"
            >
              linkedin.com/in/alexmorask
            </Link>
            <span className="mt-2 font-mono text-[13px] text-text-faint">Remote</span>
          </div>
        </div>

        <ContactForm />
      </section>

      <Footer />
    </SiteContainer>
  );
}
