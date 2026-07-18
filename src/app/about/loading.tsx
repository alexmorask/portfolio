import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { Skeleton } from "@/components/ui/skeleton";

const HOW_I_WORK_KEYS = ["how-1", "how-2", "how-3", "how-4"];

export default function Loading() {
  return (
    <SiteContainer>
      <Nav />

      <section className="grid grid-cols-1 items-start gap-14 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-[72px]">
        <div>
          <Skeleton className="mb-4 h-3 w-32" />
          <Skeleton className="mb-[22px] h-9 w-56 lg:h-12 lg:w-72" />
          <Skeleton className="mb-3 h-5 w-full max-w-[520px]" />
          <Skeleton className="mb-3 h-4 w-full max-w-[480px]" />
          <Skeleton className="h-4 w-full max-w-[400px]" />
        </div>

        <Skeleton className="aspect-[2048/1367] w-full rounded-[10px]" />
      </section>

      <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
        <Skeleton className="mb-4 h-3 w-40" />
        <div className="max-w-[760px]">
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-14 lg:pb-[64px]">
        <Skeleton className="mb-4 h-3 w-40" />
        <div className="flex max-w-[760px] flex-col gap-[14px]">
          {HOW_I_WORK_KEYS.map((key) => (
            <Skeleton key={key} className="h-4 w-full" />
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-14 lg:pb-20">
        <Skeleton className="mb-4 h-3 w-48" />
        <Skeleton className="h-4 w-full max-w-[640px]" />
      </section>

      <Footer />
    </SiteContainer>
  );
}
