import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import { Suspense } from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const options: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
};

export function MDXContent({ source }: { source: string }) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <MDXRemote source={source} options={options} />
    </Suspense>
  );
}
