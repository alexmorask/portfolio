import { Effect } from "effect";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SiteContainer } from "@/components/layout/site-container";
import { PostBreadcrumb } from "@/components/writing/post-breadcrumb";
import { PostHeader } from "@/components/writing/post-header";
import { TableOfContents } from "@/components/writing/table-of-contents";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import { MDXContent } from "@/lib/mdx";
import { calculateReadTime, formatDate, tagLabel } from "@/lib/posts";
import { extractToc } from "@/lib/table-of-contents";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;
      return yield* Effect.either(service.readPost(slug));
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  if (post._tag === "Left") {
    return { title: "Post not found" };
  }

  return {
    title: post.right.title,
    description: post.right.summary,
    openGraph: {
      title: post.right.title,
      description: post.right.summary,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.right.title,
      description: post.right.summary,
    },
  };
}

export default async function Post({ params }: Props) {
  const { slug } = await params;

  const data = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;

      const navLinks = yield* service.listNavLinks();
      const post = yield* Effect.either(service.readPost(slug));

      return { post, navLinks };
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const { post: postEither, navLinks } = data;

  const post = postEither._tag === "Right" ? postEither.right : notFound();
  const eyebrow = post.tags.length > 0 ? tagLabel(post.tags[0] ?? "").toUpperCase() : "POST";
  const toc = extractToc(post.body);

  return (
    <SiteContainer>
      <Nav links={navLinks} />

      <PostBreadcrumb title={post.title} />

      <div className="grid grid-cols-1 items-start gap-12 px-5 py-9 lg:max-w-[1068px] lg:grid-cols-[760px_260px] lg:px-14 lg:pb-20">
        <article className="max-w-[760px]">
          <PostHeader
            eyebrow={eyebrow}
            title={post.title}
            date={formatDate(post.publishedAt)}
            readTime={calculateReadTime(post.body)}
            tags={post.tags}
          />

          <div className="prose prose-invert max-w-none prose-headings:mb-[14px] prose-headings:font-sans prose-headings:font-semibold prose-headings:text-foreground prose-headings:text-[19px] prose-headings:leading-snug lg:prose-headings:text-[22px] prose-p:mb-7 prose-p:text-base prose-p:leading-[1.75] prose-p:text-text-secondary prose-code:text-primary prose-code:font-normal prose-code:before:content-none prose-code:after:content-none">
            <MDXContent source={post.body} />
          </div>
        </article>

        <div className="hidden lg:block">
          <TableOfContents entries={toc} />
        </div>
      </div>

      <Footer />
    </SiteContainer>
  );
}
