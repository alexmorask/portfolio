import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { Skeleton } from "@/components/ui/skeleton";

const TAG_PILL_KEYS = ["pill-1", "pill-2", "pill-3", "pill-4"];
const POST_ITEM_KEYS = ["post-1", "post-2", "post-3", "post-4"];

export default function Loading() {
  return (
    <SiteContainer>
      <Nav />

      <section className="px-5 py-8 lg:px-14 lg:py-14">
        <Skeleton className="mb-[18px] h-3 w-24" />
        <Skeleton className="mb-4 h-9 w-56 lg:h-11 lg:w-72" />
        <Skeleton className="h-4 w-full max-w-[640px]" />
      </section>

      <div className="flex flex-wrap gap-[10px] px-5 pb-10 lg:gap-2.5 lg:px-14 lg:pb-10">
        {TAG_PILL_KEYS.map((key) => (
          <Skeleton key={key} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      <div className="px-5 pb-14 lg:px-14 lg:pb-14">
        <Skeleton className="h-[220px] w-full rounded-[10px] lg:h-[320px]" />
      </div>

      <section className="flex flex-col gap-4 px-5 pb-20 lg:px-14 lg:pb-20">
        {POST_ITEM_KEYS.map((key) => (
          <Skeleton key={key} className="h-[150px] w-full rounded-[10px] lg:h-[192px]" />
        ))}
      </section>

      <Footer />
    </SiteContainer>
  );
}
