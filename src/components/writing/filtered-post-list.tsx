"use client";

import { useState } from "react";
import { FeaturedPostCard } from "@/components/writing/featured-post-card";
import { PostListItem } from "@/components/writing/post-list-item";
import { TagFilter } from "@/components/writing/tag-filter";
import { formatDate } from "@/lib/posts";
import type { Post } from "@/types/content/collections";

export function FilteredPostList({
  posts,
  featuredPost,
  allTags,
}: {
  posts: readonly Post[];
  featuredPost: Post | null;
  allTags: readonly { slug: string; label: string }[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const usedTags = [...new Set(posts.flatMap((p) => p.tags))];
  const tagLabelMap = new Map(allTags.map((t) => [t.slug, t.label]));

  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;

  const filteredFeatured =
    featuredPost && (!activeTag || featuredPost.tags.includes(activeTag)) ? featuredPost : null;

  const pills = [
    {
      label: "All",
      active: activeTag === null,
      onClick: () => setActiveTag(null),
    },
    ...usedTags.map((slug) => ({
      label: tagLabelMap.get(slug) ?? slug,
      active: activeTag === slug,
      onClick: () => setActiveTag(slug),
    })),
  ];

  const getTagLabel = (slugs: readonly string[]) =>
    slugs.map((s) => tagLabelMap.get(s) ?? s).join(", ");

  const noResults = activeTag !== null && filtered.length === 0 && !filteredFeatured;

  return (
    <>
      <TagFilter pills={pills} />

      {filteredFeatured && (
        <FeaturedPostCard
          post={filteredFeatured}
          dateLabel={formatDate(filteredFeatured.publishedAt)}
        />
      )}

      <section className="flex flex-col gap-4 px-5 pb-20 lg:px-14 lg:pb-20">
        {filtered.map((post) => (
          <PostListItem
            key={post.slug}
            post={post}
            tagLabel={getTagLabel(post.tags)}
            dateLabel={formatDate(post.publishedAt)}
          />
        ))}

        {noResults && (
          <div className="py-10 text-center font-mono text-sm text-[#545c6b]">
            No posts match this tag yet.
          </div>
        )}
      </section>
    </>
  );
}
