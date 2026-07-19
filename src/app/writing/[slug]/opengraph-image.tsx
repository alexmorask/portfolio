import { Effect } from "effect";
import { ImageResponse } from "next/og";
import { ContentService, ContentServiceLive } from "@/lib/effect/content-service";
import { tagLabel } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "System design write-up — alexmorask.dev";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;

  const post = await Effect.runPromise(
    Effect.gen(function* () {
      const service = yield* ContentService;
      return yield* service.readPost(slug);
    }).pipe(
      Effect.provide(ContentServiceLive),
      Effect.catchAll(() =>
        Effect.succeed({
          title: "Alex Morask",
          tags: [] as readonly string[],
        }),
      ),
    ),
  );

  const eyebrow =
    post.tags.length > 0 ? tagLabel(post.tags[0] ?? "").toUpperCase() : "SYSTEM DESIGN";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        backgroundColor: "#0e1117",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#d4923a",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          AM
        </div>
        <div style={{ display: "flex", fontSize: 20, color: "#e8eaed", fontWeight: 500 }}>
          alexmorask.dev
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 2,
            color: "#d4923a",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#f5f6f7",
            maxWidth: 980,
          }}
        >
          {post.title}
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 20, color: "#7a8494" }}>
        System design & payments engineering notes
      </div>
    </div>,
    { ...size },
  );
}
