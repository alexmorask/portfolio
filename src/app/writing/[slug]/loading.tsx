import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { Skeleton } from "@/components/ui/skeleton";

const TAG_KEYS = ["tag-1", "tag-2", "tag-3"];
const PARAGRAPH_KEYS = ["p-1", "p-2", "p-3", "p-4", "p-5"];
const TOC_KEYS = ["toc-1", "toc-2", "toc-3", "toc-4", "toc-5"];

export default function Loading() {
  return (
    <SiteContainer>
      <Nav />

      <div className="px-5 pt-6 lg:px-14">
        <Skeleton className="h-3 w-72" />
      </div>

      <div className="grid grid-cols-1 items-start gap-12 px-5 py-9 lg:max-w-[1068px] lg:grid-cols-[760px_260px] lg:px-14 lg:pb-20">
        <article className="max-w-[760px]">
          <Skeleton className="mb-[18px] h-3 w-24" />
          <Skeleton className="mb-2 h-8 w-full lg:h-10" />
          <Skeleton className="mb-5 h-8 w-2/3 lg:h-10" />
          <div className="mb-[14px] flex items-center gap-[10px] lg:gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="mb-10 flex flex-wrap gap-2">
            {TAG_KEYS.map((key) => (
              <Skeleton key={key} className="h-6 w-20 rounded-[5px]" />
            ))}
          </div>

          <div className="flex flex-col gap-7">
            {PARAGRAPH_KEYS.map((key) => (
              <div key={key} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>

          <Skeleton className="my-8 h-[280px] w-full rounded-lg" />
        </article>

        <div className="hidden lg:block">
          <div className="border-l border-border pl-6">
            <Skeleton className="mb-5 h-3 w-24" />
            <div className="flex flex-col gap-4">
              {TOC_KEYS.map((key) => (
                <Skeleton key={key} className="h-3 w-32" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </SiteContainer>
  );
}
