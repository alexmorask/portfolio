import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SectionEyebrow } from "@/components/layout/section-eyebrow";
import { SiteContainer } from "@/components/layout/site-container";

export default function MockContactPage() {
  {
    /* TODO: wire to Phase D submitContactForm Server Action */
  }
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

        <form className="flex flex-col gap-[22px] rounded-[10px] border border-white/10 bg-card p-6 lg:p-9">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground"
              >
                NAME
              </label>
              <input
                type="text"
                id="name"
                placeholder="Jane Doe"
                className="rounded-md border border-input bg-background px-3.5 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground"
              >
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                placeholder="jane@company.com"
                className="rounded-md border border-input bg-background px-3.5 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="company"
              className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground"
            >
              COMPANY <span className="text-text-faint">(OPTIONAL)</span>
            </label>
            <input
              type="text"
              id="company"
              placeholder="Acme Inc."
              className="rounded-md border border-input bg-background px-3.5 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground"
            >
              MESSAGE
            </label>
            <textarea
              id="message"
              placeholder="What's on your mind?"
              rows={6}
              className="resize-y rounded-md border border-input bg-background px-3.5 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-primary px-[22px] py-3.5 font-sans text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:-translate-y-px"
          >
            Send message
          </button>
        </form>
      </section>

      <Footer />
    </SiteContainer>
  );
}
