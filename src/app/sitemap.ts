import { Effect } from "effect";
import type { MetadataRoute } from "next";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;
      return yield* service.listPosts();
    }).pipe(Effect.provide(ContentServiceLive)),
  );

  const publishedPosts = posts.filter((post) => post.publishedAt);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/writing`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${SITE_URL}/writing/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
