import { cn } from "@/lib/utils"

/**
 * Event copy is authored as plain text with `\n` breaks, bullet lines and a few
 * inline `<span>` highlights. Rather than dumping the whole string through one
 * `dangerouslySetInnerHTML`, split it into blocks so headings, bullets and
 * paragraphs each get real spacing.
 */
export function EventDescription({ description }: { description: string }) {
  const blocks = description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <div className="space-y-3">
      {blocks.map((line, index) => {
        const isHeading = /^<span class="text-white">.*<\/span>$/.test(line)
        const isBullet = /^[•\-]/.test(line)

        return (
          <p
            key={index}
            className={cn(
              "leading-relaxed",
              isHeading &&
                "pt-3 font-display text-lg font-semibold text-foreground first:pt-0 [&>span]:text-foreground",
              isBullet && "pl-4 text-sm text-muted-foreground",
              !isHeading && !isBullet && "text-muted-foreground",
            )}
            dangerouslySetInnerHTML={{ __html: line }}
          />
        )
      })}
    </div>
  )
}
