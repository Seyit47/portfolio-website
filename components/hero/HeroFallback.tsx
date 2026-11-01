/** Static gradient that sits under the hero; also the final state when the canvas never mounts. */
export function HeroFallback() {
  return <div aria-hidden="true" className="absolute inset-0 -z-10 hero-gradient" />;
}
