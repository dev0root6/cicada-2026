export function StatTile({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="surface p-5">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
