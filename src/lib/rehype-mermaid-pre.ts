import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

export default function rehypeMermaidPre() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "pre") return;
      const child = node.children[0];
      if (
        child?.type === "element" &&
        child.tagName === "code" &&
        Array.isArray(child.properties.className) &&
        child.properties.className.includes("language-mermaid")
      ) {
        node.properties.className = ["mermaid"];
        node.children = child.children;
      }
    });
  };
}
