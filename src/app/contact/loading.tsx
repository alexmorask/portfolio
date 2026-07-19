import { ContactForm } from "@/components/contact/contact-form";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SiteContainer>
      <Nav />

      <section className="grid grid-cols-1 gap-16 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-14 lg:py-[72px]">
        <div>
          <Skeleton className="mb-4 h-3 w-40" />
          <Skeleton className="mb-5 h-9 w-64 lg:h-11 lg:w-80" />
          <Skeleton className="mb-3 h-4 w-full max-w-[420px]" />
          <Skeleton className="mb-8 h-4 w-2/3 max-w-[420px]" />
          <Skeleton className="mb-10 h-7 w-44 rounded-full" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="mt-2 h-4 w-24" />
          </div>
        </div>

        <ContactForm />
      </section>

      <Footer />
    </SiteContainer>
  );
}
