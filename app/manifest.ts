import type { MetadataRoute } from "next";
import { getProfile } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  const profile = getProfile();
  return {
    name: `${profile.name} · ${profile.title}`,
    short_name: profile.name,
    description: profile.seo.defaultDescription,
    start_url: "/",
    display: "browser",
    background_color: "#fafaf9",
    theme_color: "#1d4ed8",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
  };
}
