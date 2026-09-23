import type { MouseEvent } from "react";

/**
 * Document scroll position of an in-page section. Frame 05 lives inside the
 * pinned cinematic viewport, so its position is the end of the cinematic scroll
 * (where the arrival has settled), not its sticky layout box.
 */
export function sectionScrollTop(target: HTMLElement): number {
  if (target.id === "hero") return 0;
  if (target.dataset.scrollTarget === "scene-end") {
    const scene = target.closest<HTMLElement>("[data-testid='cinematic-scene']");
    if (scene) return scene.getBoundingClientRect().top + window.scrollY + scene.offsetHeight - window.innerHeight;
  }
  return target.getBoundingClientRect().top + window.scrollY;
}

/**
 * Scrolls to an in-page section by id. Sections that are not built yet have no
 * element, so the click is ignored instead of jumping to a placeholder.
 */
export function navigateToHash(event: MouseEvent<HTMLAnchorElement>, href: string) {
  event.preventDefault();
  const target = document.getElementById(href.slice(1));
  if (!target) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.history.replaceState(null, "", href);
  window.scrollTo({ top: sectionScrollTop(target), behavior: reducedMotion ? "auto" : "smooth" });
}
