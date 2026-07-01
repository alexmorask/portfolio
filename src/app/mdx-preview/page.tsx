import { MermaidDiagrams } from "@/components/mermaid-diagrams";
import { MDXContent } from "@/lib/mdx";

const sample = `
# MDX pipeline check

- [x] remark-gfm (task list)
- [ ] rehype-slug (this heading should have an id)

\`\`\`mermaid
graph TD;
  A[Request] --> B{Retry?};
  B -->|yes| A;
  B -->|no| C[Fail];
\`\`\`
`;

export default function MdxPreviewPage() {
  return (
    <main className="prose prose-invert mx-auto p-8">
      <MermaidDiagrams />
      <MDXContent source={sample} />
    </main>
  );
}
