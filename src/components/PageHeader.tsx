import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
      {eyebrow && (
        <span className="inline-flex items-center rounded-full border border-line bg-surf px-3 py-1 text-xs font-semibold text-mut">
          {eyebrow}
        </span>
      )}
      <h1 className="mt-4 text-[clamp(30px,4vw,44px)] font-extrabold tracking-[-0.02em] text-ink">{title}</h1>
      {intro && <p className="mt-3 max-w-[65ch] text-lg text-mut">{intro}</p>}
      {children}
    </div>
  );
}
