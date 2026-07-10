import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0e1117",
        borderRadius: 6,
        border: "1px solid rgba(255,255,255,0.18)",
        fontFamily: "IBM Plex Mono",
        fontSize: 16,
        fontWeight: 600,
        color: "#d4923a",
      }}
    >
      AM
    </div>,
    { ...size },
  );
}
