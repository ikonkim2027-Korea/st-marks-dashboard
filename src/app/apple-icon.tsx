import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS home-screen icon. Next.js renders this JSX to a PNG at build time.
 * Matches St. Mark's CI (navy + gold) with an "SM" monogram.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#003057",
          color: "#C4A442",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: "-6px",
            lineHeight: 1,
          }}
        >
          SM
        </div>
        <div
          style={{
            marginTop: 10,
            width: 96,
            height: 5,
            background: "#C4A442",
            borderRadius: 3,
          }}
        />
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "4px",
          }}
        >
          HUB
        </div>
      </div>
    ),
    { ...size },
  );
}
