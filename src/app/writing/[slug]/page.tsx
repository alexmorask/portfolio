import { Effect } from "effect";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { PostBreadcrumb } from "@/components/writing/post-breadcrumb";
import { PostHeader } from "@/components/writing/post-header";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import { MDXContent } from "@/lib/mdx";
import { buildNavLinks } from "@/lib/nav";
import { calculateReadTime, formatDate, tagLabel } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Post({ params }: Props) {
  const { slug } = await params;

  const data = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;

      const [navLinks, flags] = yield* Effect.all([
        service.listNavLinks(),
        service
          .readFeatureFlags()
          .pipe(Effect.catchAll(() => Effect.succeed({ showWriting: false, showContact: false }))),
      ]);

      const post = yield* Effect.either(service.readPost(slug));

      return { post, navLinks, flags };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { post: postEither, navLinks, flags } = data;

  if (!flags.showWriting) notFound();

  const post = postEither._tag === "Right" ? postEither.right : notFound();
  const eyebrow = post.tags.length > 0 ? tagLabel(post.tags[0] ?? "").toUpperCase() : "POST";

  return (
    <SiteContainer>
      <Nav links={buildNavLinks(navLinks, flags)} />

      <PostBreadcrumb title={post.title} />

      <div className="px-5 py-9 lg:px-14 lg:pb-20">
        <article className="max-w-[760px]">
          <PostHeader
            eyebrow={eyebrow}
            title={post.title}
            date={formatDate(post.publishedAt)}
            readTime={calculateReadTime(post.body)}
            tags={post.tags}
          />

          <div className="prose-headings:mb-[14px] prose-headings:font-sans prose-headings:font-semibold prose-headings:text-foreground prose-headings:text-[19px] prose-headings:leading-snug lg:prose-headings:text-[22px] prose-p:mb-7 prose-p:text-base prose-p:leading-[1.75] prose-p:text-text-secondary">
            <MDXContent source={post.body} />
          </div>
        </article>
      </div>

      <Footer />
    </SiteContainer>
  );
}
