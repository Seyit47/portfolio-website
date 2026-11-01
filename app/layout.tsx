import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { VercelAnalytics } from "@/components/layout/VercelAnalytics";
import { SkipLink } from "@/components/layout/SkipLink";
import { REVEAL_INLINE_SCRIPT } from "@/components/motion/reveal-inline";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { PaletteProvider } from "@/components/palette/PaletteContext";
import { PaletteHost } from "@/components/palette/PaletteHost";
import { PaletteTrigger } from "@/components/palette/PaletteTrigger";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getPaletteEntries, getProfile } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const profile = getProfile();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    template: `%s · ${profile.seo.siteName}`,
    default: `${profile.name} · ${profile.title}`,
  },
  description: profile.seo.defaultDescription,
  applicationName: profile.seo.siteName,
  authors: [{ name: profile.name, url: siteUrl() }],
  creator: profile.name,
  openGraph: {
    type: "website",
    siteName: profile.seo.siteName,
    locale: "en",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1013" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/* Marks html.js and reveals in-viewport content before hydration (see reveal-inline.ts). */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_INLINE_SCRIPT }} />
        <ThemeProvider>
          <PaletteProvider entries={getPaletteEntries()}>
            <RevealObserver />
            <SkipLink />
            <Header
              name={profile.name}
              tools={
                <>
                  <PaletteTrigger />
                  <ThemeToggle />
                </>
              }
            />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer profile={profile} />
            <PaletteHost />
          </PaletteProvider>
        </ThemeProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
