"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { usePalette } from "./PaletteContext";

const CommandPalette = dynamic(() => import("./CommandPalette.client"), { ssr: false });

/** Loads the palette bundle only once it has been requested. */
export function PaletteHost() {
  const { open } = usePalette();
  const [loaded, setLoaded] = useState(false);
  // Derived state: once the palette has been opened, keep its bundle mounted.
  if (open && !loaded) setLoaded(true);
  if (!loaded && !open) return null;
  return <CommandPalette />;
}
