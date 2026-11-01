import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Picture } from "@/components/ui/Picture";

function Anchor({ href = "", children, ...rest }: ComponentProps<"a">) {
  const isInternal = href.startsWith("/");
  if (isInternal) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 675,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-8">
      <Picture
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 42rem, 100vw"
        className="rounded-lg border border-border"
      />
      {caption && <figcaption className="mt-2 text-sm text-fg-subtle">{caption}</figcaption>}
    </figure>
  );
}

function Callout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <aside className="my-6 rounded-lg border-l-4 border-accent bg-accent-soft/40 p-4 text-fg">
      {title && <p className="mb-1 font-semibold">{title}</p>}
      {children}
    </aside>
  );
}

export const mdxComponents = {
  a: Anchor,
  Figure,
  Callout,
};
