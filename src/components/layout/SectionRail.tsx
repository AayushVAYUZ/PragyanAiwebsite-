"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { navigateToHash, sectionScrollTop } from "@/lib/navigation";

const RAIL_SECTIONS = [
  { id: "belief", label: "The Belief" },
  { id: "journey", label: "Our Journey" },
  { id: "prism", label: "PRISM" },
  { id: "capabilities", label: "Capabilities" },
];

/**
 * Narrative progress rail for the content frames (05 onward). Hidden during the
 * cinematic opening. React state changes only when the active section changes.
 */
export default function SectionRail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    // Section start positions are measured on resize only; scrolling does arithmetic, no layout reads.
    let starts: { id: string; start: number }[] = [];
    let end = Infinity;

    const measure = () => {
      starts = [];
      for (const section of RAIL_SECTIONS) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        const top = sectionScrollTop(element);
        // The Belief becomes active as the arrival settles; later sections when they reach mid-screen.
        starts.push({ id: section.id, start: section.id === "belief" ? top - window.innerHeight * 0.1 : top - window.innerHeight * 0.5 });
      }
      const last = document.getElementById(RAIL_SECTIONS[RAIL_SECTIONS.length - 1].id);
      end = last ? last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.5 : Infinity;
    };

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      let current: string | null = null;
      for (const { id, start } of starts) if (y >= start) current = id;
      if (y > end) current = null;
      setActive((previous) => (previous === current ? previous : current));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const activeLabel = RAIL_SECTIONS.find((section) => section.id === active)?.label;

  return (
    <nav
      aria-label="Section progress"
      data-testid="section-rail"
      className={`fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 transition-opacity duration-500 xl:flex ${
        active ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span aria-hidden="true" className="h-10 w-px bg-white/10" />
      <ul className="flex flex-col items-center gap-2.5">
        {RAIL_SECTIONS.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, `#${section.id}`)}
                aria-label={section.label}
                aria-current={isActive ? "location" : undefined}
                tabIndex={active ? 0 : -1}
                className="flex h-4 w-4 items-center justify-center"
              >
                <span
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-2 w-2 bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]"
                      : "h-1 w-1 bg-white/30 hover:bg-white/70"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
      <span
        aria-hidden="true"
        className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.25em] text-[var(--text-muted)] uppercase [writing-mode:vertical-rl]"
      >
        {activeLabel ?? ""}
      </span>
      <span aria-hidden="true" className="h-10 w-px bg-white/10" />
    </nav>
  );
}
