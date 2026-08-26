import { BikeIcon } from "./icons";

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
      className={`flex flex-col items-center justify-center gap-2 border border-line bg-gradient-to-br from-acc-s to-surf px-3 text-center text-xs text-mut ${className}`}
    >
      <BikeIcon className="size-7 text-acc-d/40" />
      <span className="line-clamp-2 max-w-[26ch]">{label}</span>
    </div>
  );
}
