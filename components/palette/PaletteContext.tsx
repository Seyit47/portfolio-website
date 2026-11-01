"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PaletteEntry } from "@/lib/content/types";

type PaletteContextValue = {
  entries: PaletteEntry[];
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const PaletteContext = createContext<PaletteContextValue | null>(null);

export function PaletteProvider({
  entries,
  children,
}: {
  entries: PaletteEntry[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const value = useMemo(
    () => ({ entries, open, setOpen, toggle, triggerRef }),
    [entries, open, toggle],
  );
  return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>;
}

export function usePalette(): PaletteContextValue {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used inside PaletteProvider");
  return ctx;
}
