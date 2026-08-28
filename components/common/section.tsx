import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Container } from "./container"

type SectionProps = {
  children: ReactNode
  id?: string
  /** Monospace label above the title. */
  eyebrow?: string
  title?: ReactNode
  description?: ReactNode
  /** Headings sit left by default; centre them for showcase sections. */
  align?: "left" | "center"
  size?: "wide" | "default" | "narrow"
  className?: string
  /** Rendered opposite the heading on desktop — usually a link or button. */
  action?: ReactNode
}

export function Section({
  children,
  id,
  eyebrow,
  title,
  description,
  align = "left",
  size = "default",
  className,
  action,
}: SectionProps) {
  const hasHeading = Boolean(eyebrow || title || description)

  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <Container size={size}>
        {hasHeading && (
          <div
            className={cn(
              "mb-10 flex flex-col gap-6 md:mb-14",
              action && align === "left" && "md:flex-row md:items-end md:justify-between",
            )}
          >
            <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {title && (
                <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
              )}
              {description && (
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {action && <div className={cn(align === "center" && "text-center")}>{action}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}
