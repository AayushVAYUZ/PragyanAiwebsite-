/**
 * Reference-counted page scroll lock.
 *
 * Used by the page-load preloader and the mobile navigation. `overflow: hidden`
 * on <html> blocks wheel and keyboard scrolling on desktop; the listeners also
 * block touch scrolling on mobile browsers that ignore overflow on the root.
 */

const SCROLL_KEYS = new Set([" ", "PageUp", "PageDown", "End", "Home", "ArrowUp", "ArrowDown"]);

let lockCount = 0;
let previousOverflow = "";

function preventScroll(event: Event) {
  event.preventDefault();
}

function preventScrollKeys(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null;
  const isEditable = target?.closest("input, textarea, select, [contenteditable='true']");
  if (!isEditable && SCROLL_KEYS.has(event.key)) event.preventDefault();
}

export function lockScroll(): () => void {
  if (typeof document === "undefined") return () => {};

  lockCount += 1;
  if (lockCount === 1) {
    const root = document.documentElement;
    previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys);
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount -= 1;
    if (lockCount === 0) {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys);
    }
  };
}
