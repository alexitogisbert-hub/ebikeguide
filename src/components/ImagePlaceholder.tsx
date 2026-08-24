export function ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center bg-surf border border-line px-3 text-center text-xs text-mut ${className}`}
    >
      <span className="line-clamp-3">{label}</span>
    </div>
  );
}
