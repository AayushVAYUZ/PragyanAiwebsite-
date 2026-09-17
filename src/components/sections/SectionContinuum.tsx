"use client";

import type { MouseEvent } from "react";
import { navigateToHash } from "@/lib/navigation";

/**
 * Restrained continuum row at the foot of a content frame (Stitch Frames 06–08):
 * frame index, section name and the next section. Navigation only, no telemetry.
 */
export default function SectionContinuum({
  index,
  title,
  next,
}: {
  index: string;
  title: string;
  next?: { href: string; label: string };
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 border-t border-white/[0.06] bg-[#03040A]/55 px-[var(--gutter-x)] py-3.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] text-[var(--text-muted)] uppercase">
      <div className="flex items-center gap-3">
        <span className="font-medium text-[var(--text-primary)]">{index}</span>
        <span className="text-white/20">/</span>
        <span>15</span>
        <span className="hidden pl-2 text-white/40 sm:inline">{title}</span>
      </div>
      {next && (
        <a
          href={next.href}
          onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, next.href)}
          className="group hidden items-center gap-2 text-white/70 transition-colors hover:text-white md:flex"
        >
          <span>{next.label}</span>
          <span aria-hidden="true" className="text-[var(--neon-cyan)] transition-transform group-hover:translate-y-0.5">
            ↓
          </span>
        </a>
      )}
      <span className="text-white/40">Scroll to explore</span>
    </div>
  );
}
