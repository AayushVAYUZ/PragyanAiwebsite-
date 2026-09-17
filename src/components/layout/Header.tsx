"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { lockScroll } from "@/lib/scrollLock";
import { navigateToHash } from "@/lib/navigation";

const NAV_LINKS = [
  { label: "Who We Are", href: "#journey" },
  { label: "What We Do", href: "#prism" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Products", href: "#products" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Insights", href: "#insights" },
];

const CONTACT_HREF = "#contact";

interface HeaderProps {
  /** False while the page-load preloader runs; the header stays hidden until the blink ends. */
  revealed: boolean;
}

export default function Header({ revealed }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Mobile menu: scroll lock, focus management, Escape to close, focus trap.
  useEffect(() => {
    if (!menuOpen) return;
    const unlock = lockScroll();
    const menu = menuRef.current;
    const toggle = toggleRef.current;
    const focusables = () =>
      Array.from(menu?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = [toggle, ...focusables()].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlock();
      toggle?.focus();
    };
  }, [menuOpen]);

  const onNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    navigateToHash(event, href);
  };

  return (
    <header
      data-revealed={revealed}
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-50 transition-[opacity,visibility] duration-700 ease-out ${
        revealed ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
      }`}
    >
      {/* Soft top scrim keeps the navigation legible over bright cinematic moments */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[rgba(3,4,10,0.55)] to-transparent"
      />

      <div className="header-intensity relative flex items-center justify-between px-[var(--gutter-x)] py-5 transition-opacity duration-500">
        <a
          href="#hero"
          onClick={(event) => onNavClick(event, "#hero")}
          className="relative z-10 flex items-center gap-1.5"
          aria-label="Pragyan ai — back to the opening"
        >
          <span className="text-lg font-light tracking-tight text-[var(--text-primary)]">Pragyan</span>
          <span className="bg-gradient-to-r from-[var(--electric-violet)] to-[var(--neon-cyan)] bg-clip-text text-sm font-light uppercase tracking-[0.2em] text-transparent">
            ai
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => onNavClick(event, link.href)}
              className="text-[13px] tracking-wide text-white/60 transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={CONTACT_HREF}
            onClick={(event) => onNavClick(event, CONTACT_HREF)}
            className="glass-pill group hidden items-center gap-1.5 rounded-full px-5 py-2 text-xs uppercase tracking-[0.18em] text-white/85 sm:flex"
          >
            <span className="opacity-40 transition-opacity group-hover:opacity-70">[</span>
            <span>Talk to Us</span>
            <span className="opacity-40 transition-opacity group-hover:opacity-70">]</span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[rgba(10,15,35,0.4)] lg:hidden"
          >
            <span
              aria-hidden="true"
              className={`absolute h-px w-4 bg-white/85 transition-transform duration-300 ${
                menuOpen ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-px w-4 bg-white/85 transition-transform duration-300 ${
                menuOpen ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        data-testid="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-0 bg-[rgba(3,4,10,0.96)] px-[var(--gutter-x)] pt-28 pb-10 lg:hidden"
      >
        <nav aria-label="Mobile" className="flex h-full flex-col justify-between">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="border-b border-[var(--border-subtle)]">
                <a
                  href={link.href}
                  onClick={(event) => onNavClick(event, link.href)}
                  className="flex items-center justify-between py-4 text-2xl font-light tracking-tight text-[var(--text-soft)]"
                >
                  {link.label}
                  <span aria-hidden="true" className="text-sm text-[var(--neon-cyan)]">→</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={CONTACT_HREF}
            onClick={(event) => onNavClick(event, CONTACT_HREF)}
            className="glass-pill inline-flex items-center justify-center gap-2 self-start rounded-full px-6 py-3 text-xs uppercase tracking-[0.18em] text-white/90"
          >
            Talk to Us <span aria-hidden="true" className="text-[var(--neon-cyan)]">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
