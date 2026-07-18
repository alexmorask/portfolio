import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { Skeleton } from "@/components/ui/skeleton";

const FOCUS_AREA_KEYS = ["fa-1", "fa-2", "fa-3", "fa-4", "fa-5", "fa-6"];
const EXPERIENCE_KEYS = ["exp-1", "exp-2", "exp-3", "exp-4"];

export default function Loading() {
  return (
    <SiteContainer>
      <Nav />

      <section className="grid grid-cols-1 items-start gap-14 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-[72px]">
        <div>
          <Skeleton className="mb-5 h-3 w-64 lg:mb-[20px]" />
          <Skeleton className="mb-[22px] h-10 w-72 lg:h-12 lg:w-96" />
          <Skeleton className="mb-3 h-5 w-full max-w-[520px]" />
          <Skeleton className="mb-5 h-5 w-full max-w-[440px]" />
          <Skeleton className="mb-3 h-4 w-full max-w-[500px]" />
          <Skeleton className="mb-9 h-4 w-full max-w-[380px]" />
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-[14px]">
            <Skeleton className="h-11 w-48 rounded-md" />
            <Skeleton className="h-11 w-36 rounded-md" />
          </div>
        </div>

        <Skeleton className="hidden h-64 w-full rounded-lg lg:block lg:h-[280px]" />
      </section>

      <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
        <Skeleton className="mb-5 h-3 w-40" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {FOCUS_AREA_KEYS.map((key) => (
            <Skeleton key={key} className="h-[68px] rounded-lg lg:h-[92px]" />
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
        <Skeleton className="mb-5 h-3 w-40" />
        <div className="flex flex-col gap-6">
          {EXPERIENCE_KEYS.map((key) => (
            <Skeleton key={key} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
        <Skeleton className="mb-5 h-3 w-40" />
        <Skeleton className="h-64 w-full rounded-lg lg:h-[300px]" />
      </section>

      <Footer />
    </SiteContainer>
  );
}
