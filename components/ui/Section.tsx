import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SectionProps = HTMLAttributes<HTMLElement> & {
  id?: string;
  title?: ReactNode;
  eyebrow?: ReactNode;
  intro?: ReactNode;
  level?: 1 | 2 | 3;
  action?: ReactNode;
  children: ReactNode;
  width?: "content" | "prose";
};

export function Section({
  id,
  title,
  eyebrow,
  intro,
  level = 2,
  action,
  children,
  className,
  width = "content",
  ...rest
}: SectionProps) {
  const Heading = `h${level}` as const;
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn("py-12 md:py-16", className)}
      {...rest}
    >
      <div className={cn("container-content", width === "prose" && "max-w-(--prose-max)")}>
        {(title || eyebrow || intro || action) && (
          <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-(--prose-max)">
              {eyebrow && (
                <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                  {eyebrow}
                </p>
              )}
              {title && (
                <Heading
                  id={headingId}
                  className={cn(
                    "font-display font-semibold text-fg",
                    level === 1 ? "text-3xl" : "text-2xl",
                  )}
                >
                  {title}
                </Heading>
              )}
              {intro && <p className="mt-3 text-fg-muted">{intro}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
