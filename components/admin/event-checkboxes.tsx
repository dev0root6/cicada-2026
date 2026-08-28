export function EventCheckboxes({
  name,
  options,
  selected = [],
  legend,
}: {
  name: string
  options: { slug: string; title: string }[]
  selected?: string[]
  legend: string
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{legend}</legend>
      <div className="grid gap-1.5">
        {options.map((option) => (
          <label
            key={option.slug}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-primary/40 has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5"
          >
            <input
              type="checkbox"
              name={name}
              value={option.slug}
              defaultChecked={selected.includes(option.slug)}
              className="h-4 w-4 accent-[oklch(0.78_0.19_142)]"
            />
            <span className="min-w-0 flex-1 truncate">{option.title}</span>
            <span className="font-mono text-[0.65rem] text-muted-foreground">{option.slug}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
