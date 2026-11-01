import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const alt = "Seyit Geldiyev, Middle+ Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const profile = getProfile();
  const host = siteUrl().replace(/^https?:\/\//, "");
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #0f1013 0%, #1b2a4d 60%, #1d4ed8 100%)",
        color: "#f2f1ee",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#c2c0ba" }}
      >
        <div style={{ width: 16, height: 16, borderRadius: 999, background: "#4ade80" }} />
        {profile.availability.label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 44, color: "#c2c0ba" }}>{profile.title}</div>
        <div style={{ fontSize: 30, color: "#8ab4ff", maxWidth: 1000, lineHeight: 1.35 }}>
          {profile.tagline}
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#c2c0ba" }}
      >
        <span>{host}</span>
        <span>github.com/Seyit47</span>
      </div>
    </div>,
    { ...size },
  );
}
