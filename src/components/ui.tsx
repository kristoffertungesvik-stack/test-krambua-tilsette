/** Small shared pieces used by both the employee and manager screens. */

export function Avatar({
  initials,
  size = 36,
  variant = "default",
}: {
  initials: string;
  size?: number;
  variant?: "default" | "person" | "group";
}) {
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        background: variant === "group" ? "var(--color-neutral-900)" : "var(--color-accent-800)",
        color: variant === "group" ? "var(--color-accent)" : "var(--color-accent-300)",
      }}
    >
      {initials}
    </span>
  );
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
