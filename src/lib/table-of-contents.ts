import GithubSlugger from "github-slugger";
import type { Heading, Root } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import remarkParse from "remark-parse";
import { unified } from "unified";

export interface TocEntry {
  readonly id: string;
  readonly title: string;
}

/**
 * Slugs every heading in document order (matching rehype-slug's own
 * github-slugger usage) so ids stay in sync with the rendered HTML,
 * then keeps only h2s for display.
 */
export function extractToc(source: string): TocEntry[] {
  const tree = unified().use(remarkParse).parse(source) as Root;
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];

  for (const node of tree.children) {
    if (node.type !== "heading") continue;
    const heading = node as Heading;
    const title = mdastToString(heading);
    const id = slugger.slug(title);
    if (heading.depth === 2) {
      entries.push({ id, title });
    }
  }

  return entries;
}
