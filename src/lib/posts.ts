const WORDS_PER_MINUTE = 200;

export function calculateReadTime(body: string): string {
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

export function tagLabel(slug: string): string {
  return slug.replace(/-/g, " ");
}
