"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMotionPreference } from "@/components/motion/useMotionPreference";

const HeroCanvas = dynamic(() => import("./HeroCanvas.client"), { ssr: false });

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Mounts the WebGL hero only after the page is idle and the visitor has
 * interacted (pointer, scroll, key or touch), only when motion is allowed,
 * WebGL exists and the test flag `?no-canvas=1` is absent. The interaction
 * gate keeps the hero out of the initial JavaScript budget while real
 * visitors trigger it within their first moments on the page.
 */
export function HeroCanvasLoader() {
  const { reduced } = useMotionPreference();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (new URLSearchParams(window.location.search).get("no-canvas") === "1") return;
    if (!webglAvailable()) return;
    const events = [
      "pointermove",
      "pointerdown",
      "scroll",
      "keydown",
      "touchstart",
      "wheel",
    ] as const;
    let idle = false;
    let interacted = false;
    const hasIdle = typeof window.requestIdleCallback === "function";
    const tryMount = () => {
      if (idle && interacted) setReady(true);
    };
    const onInteract = () => {
      interacted = true;
      events.forEach((e) => window.removeEventListener(e, onInteract));
      tryMount();
    };
    events.forEach((e) => window.addEventListener(e, onInteract, { passive: true, once: true }));
    const onIdle = () => {
      idle = true;
      tryMount();
    };
    const idleId: number = hasIdle
      ? window.requestIdleCallback(onIdle, { timeout: 2000 })
      : window.setTimeout(onIdle, 1500);
    return () => {
      events.forEach((e) => window.removeEventListener(e, onInteract));
      if (hasIdle) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, [reduced]);

  if (reduced || !ready) return null;
  return <HeroCanvas />;
}
