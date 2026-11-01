"use client";

import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

const VERTEX = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec2 vUv;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.06;
  vec2 drift = (uPointer - 0.5) * 0.25;
  float n1 = noise(p * 1.6 + vec2(t, -t * 0.7) + drift);
  float n2 = noise(p * 3.1 - vec2(t * 0.5, t) - drift);
  float blend = smoothstep(-0.6, 0.8, n1 + 0.5 * n2);
  vec3 col = mix(uColorB, uColorA, blend);
  float glow = smoothstep(0.9, 0.0, distance(uv, vec2(0.78 + drift.x, 0.3 - drift.y)));
  col = mix(col, uColorC, glow * 0.55);
  float vignette = smoothstep(1.3, 0.3, distance(uv, vec2(0.5)));
  col = mix(uColorB, col, vignette);
  gl_FragColor = vec4(col, 1.0);
}
`;

function cssColor(name: string): [number, number, number] {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const probe = document.createElement("div");
  probe.style.color = value;
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe)
    .color.match(/\d+(\.\d+)?/g)
    ?.slice(0, 3)
    .map(Number) ?? [0, 0, 0];
  probe.remove();
  return [rgb[0]! / 255, rgb[1]! / 255, rgb[2]! / 255];
}

export default function HeroCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        alpha: false,
        antialias: false,
      });
    } catch {
      return;
    }
    const gl = renderer.gl;
    gl.canvas.setAttribute("aria-hidden", "true");
    gl.canvas.setAttribute("data-hero-canvas", "");
    host.appendChild(gl.canvas as HTMLCanvasElement);

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: [0.5, 0.5] },
        uResolution: { value: [1, 1] },
        uColorA: { value: cssColor("--color-hero-a") },
        uColorB: { value: cssColor("--color-hero-b") },
        uColorC: { value: cssColor("--color-hero-c") },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let frame = 0;
    let running = true;
    let start = performance.now();

    function resize() {
      const { clientWidth, clientHeight } = host!;
      renderer.setSize(clientWidth, clientHeight);
      program.uniforms.uResolution!.value = [clientWidth, clientHeight];
    }

    function loop(now: number) {
      if (!running) return;
      frame = requestAnimationFrame(loop);
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      program.uniforms.uTime!.value = (now - start) / 1000;
      program.uniforms.uPointer!.value = [pointer.x, pointer.y];
      renderer.render({ scene: mesh });
    }

    function play() {
      if (running) return;
      running = true;
      start = performance.now() - program.uniforms.uTime!.value * 1000;
      frame = requestAnimationFrame(loop);
    }
    function pause() {
      running = false;
      cancelAnimationFrame(frame);
    }

    function onPointer(event: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / Math.max(rect.width, 1);
      pointer.ty = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
    }
    function onVisibility() {
      if (document.hidden) pause();
      else play();
    }

    const observer = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? play() : pause()),
      { threshold: 0.05 },
    );
    observer.observe(host);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    running = false;
    play();
    requestAnimationFrame(() => host.setAttribute("data-canvas-ready", "true"));

    return () => {
      pause();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
    // Theme changes swap the palette, so re-create the program when the resolved theme changes.
  }, [resolvedTheme]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-(--motion-slow) ease-(--ease-out) data-[canvas-ready=true]:opacity-100 [&_canvas]:block [&_canvas]:size-full"
    />
  );
}
