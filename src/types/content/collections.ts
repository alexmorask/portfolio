export interface NavLink {
  readonly label: string;
  readonly url: string;
  readonly sortOrder: number | null;
}

export interface Post {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly cardImage: string | null;
  readonly tags: readonly string[];
  readonly publishedAt: string | null;
  readonly body: string;
}
