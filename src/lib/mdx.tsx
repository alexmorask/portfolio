import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import { Suspense } from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getMdxComponents } from "@/lib/diagrams";

const options: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypePrettyCode, { theme: "github-dark-default", keepBackground: false }],
      rehypeSlug,
      rehypeAutolinkHeadings,
    ],
  },
};

const components = getMdxComponents();

export function MDXContent({ source }: { source: string }) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <MDXRemote source={source} options={options} components={components} />
    </Suspense>
  );
}
