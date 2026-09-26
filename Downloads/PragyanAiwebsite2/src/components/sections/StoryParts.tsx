import type { MouseEvent, ReactNode } from "react";
import { keepAiLowercase } from "@/lib/brandText";

/**
 * Shared pieces for the business-story sections (stakes, why, engagement, PRISM offers,
 * impact, trust), so they read as one system with the rest of the page: the eyebrow and
 * heading scale of the Services section, one step smaller, and the "Talk to Us" pill for CTAs.
 */

export function StoryEyebrow({ children }: { children: string }) {
  return (
    <p className="mb-4 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[var(--neon-cyan)]/70 uppercase">
      {keepAiLowercase(children)}
    </p>
  );
}

export function StoryHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="text-3xl leading-[1.15] font-extralight tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl lg:text-[44px]"
    >
      {children}
    </h2>
  );
}

/** The final CTA's pill ("Talk to Us"), reused as-is for every new CTA. */
export function StoryPill({
  href,
  onClick,
  children,
  label,
}: {
  href: string;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  children: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={label}
      className="explore-pill inline-flex items-center gap-3 self-start rounded-full px-6 py-3 text-xs font-medium tracking-widest whitespace-nowrap uppercase"
    >
      <span>{keepAiLowercase(children)}</span>
      <span aria-hidden="true" className="text-[var(--neon-cyan)]">
        →
      </span>
    </a>
  );
}
