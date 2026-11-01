import type { ImgHTMLAttributes } from "react";

type PictureProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "width" | "height"
> & {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** `sizes` attribute, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes: string;
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean;
};

const WIDTHS = [360, 640, 768, 1024, 1280, 1440, 1920];
const QUALITY = 75;

function optimized(src: string, w: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${QUALITY}`;
}

/**
 * Responsive image without the next/image client runtime. Raster sources get a
 * srcset served by Next's image optimizer (AVIF/WebP, sized per breakpoint);
 * SVGs are served as-is. Explicit width/height reserve space (no layout shift).
 */
export function Picture({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  loading,
  decoding,
  ...rest
}: PictureProps) {
  const isSvg = /\.svg(\?|$)/i.test(src);
  const candidates = WIDTHS.filter((w) => w <= width * 2);
  const srcSet = isSvg ? undefined : candidates.map((w) => `${optimized(src, w)} ${w}w`).join(", ");
  return (
    // eslint-disable-next-line @next/next/no-img-element -- deliberate: srcset via the optimizer, no client JS
    <img
      src={isSvg ? src : optimized(src, candidates[candidates.length - 1] ?? width)}
      srcSet={srcSet}
      sizes={isSvg ? undefined : sizes}
      alt={alt}
      width={width}
      height={height}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding={decoding ?? "async"}
      fetchPriority={priority ? "high" : undefined}
      {...rest}
    />
  );
}
