"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { lockScroll } from "@/lib/scrollLock";
import { navigateToHash } from "@/lib/navigation";
import type { IntroPhase } from "@/components/cinematic/EyeBlinkPreloader";

const NAV_LINKS = [
  { label: "Who We Are", href: "#journey" },
  { label: "What We Do", href: "#prism" },
  { label: "What We Think", href: "#insights" },
  { label: "Work With Us", href: "#capabilities" },
  { label: "Connect With Us", href: "#contact" },
];

// The CTA renders inside an `uppercase`-styled pill; "ai" stays lowercase (brand rule).
const CTA_TEXT = (
  <>
    Ask P.<span className="normal-case">ai</span>
  </>
);
const CONTACT_HREF = "#contact";

interface HeaderProps {
  /** Drives the opening choreography: brand appears over the hero, then moves into the header, then nav settles in. */
  phase: IntroPhase;
}

export default function Header({ phase }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const [brandTransform, setBrandTransform] = useState("translate(0, 0) scale(1)");
  const [brandTransition, setBrandTransition] = useState(false);
  const interactive = phase === "nav";

  // The brand lockup is one element throughout: while it is the hero identity it is
  // displaced (via transform only) to sit centred over the eye; once the intro moves
  // past that moment the same element eases back to its natural place in the header.
  // Using the element's own measured position as the "end" state means this works at
  // any viewport size without hardcoding the header's geometry.
  useLayoutEffect(() => {
    const el = brandRef.current;
    if (!el) return;

    if (phase === "brand") {
      const place = () => {
        const rect = el.getBoundingClientRect();
        const heroX = window.innerWidth / 2;
        const heroY = window.innerHeight * 0.44;
        const dx = heroX - (rect.left + rect.width / 2);
        const dy = heroY - (rect.top + rect.height / 2);
        setBrandTransition(false);
        setBrandTransform(`translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(2.3)`);
      };
      place();
      window.addEventListener("resize", place);
      return () => window.removeEventListener("resize", place);
    }

    if (phase === "moving" || phase === "nav") {
      // The element already painted at the hero transform with no transition; enabling
      // the transition and relaxing to identity together still animates from that
      // previous frame, so both updates can land in the same callback.
      const raf = requestAnimationFrame(() => {
        setBrandTransition(true);
        setBrandTransform("translate(0, 0) scale(1)");
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [phase]);

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

  const brandStyle: CSSProperties = {
    transform: brandTransform,
    // Centre-anchored so the hero-position translate (computed centre-to-centre) lands exactly
    // where intended; a left-anchored origin would grow the box rightward under scale and throw
    // the horizontal centring off by half the added width.
    transformOrigin: "center center",
    transition: brandTransition
      ? "transform 700ms cubic-bezier(0.16,1,0.3,1), opacity 500ms ease-out"
      : "opacity 500ms ease-out",
    opacity: phase === "hidden" ? 0 : 1,
  };

  return (
    <header
      data-phase={phase}
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-50 ${interactive ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Soft top scrim keeps the navigation legible over bright cinematic moments; it
          arrives with the header chrome, once the brand starts its move upward. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[rgba(3,4,10,0.55)] to-transparent transition-opacity duration-700 ease-out ${
          phase === "moving" || phase === "nav" ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="header-intensity relative flex items-center justify-between px-[var(--gutter-x)] py-5 transition-opacity duration-500">
        <a
          ref={brandRef}
          href="#hero"
          onClick={(event) => interactive && onNavClick(event, "#hero")}
          tabIndex={interactive ? 0 : -1}
          className="relative z-10 flex items-center gap-1.5"
          aria-label="Pragyan ai — back to the opening"
          style={brandStyle}
        >
          <span className="text-lg font-light tracking-tight text-[var(--text-primary)]">Pragyan</span>
          <span className="bg-gradient-to-r from-[var(--electric-violet)] to-[var(--neon-cyan)] bg-clip-text text-lg font-bold tracking-tight text-transparent">
            ai
          </span>
        </a>

        <nav
          aria-label="Primary"
          className={`hidden items-center gap-9 lg:flex transition-opacity duration-500 ease-out ${
            phase === "nav" ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => onNavClick(event, link.href)}
              tabIndex={interactive ? 0 : -1}
              className="text-[13px] tracking-wide text-white/60 transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div
          className={`flex items-center gap-3 transition-opacity duration-500 ease-out ${
            phase === "nav" ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <a
            href={CONTACT_HREF}
            onClick={(event) => onNavClick(event, CONTACT_HREF)}
            tabIndex={interactive ? 0 : -1}
            className="glass-pill group hidden items-center gap-1.5 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/90 sm:flex"
          >
            <span className="opacity-40 transition-opacity group-hover:opacity-70">[</span>
            <span>{CTA_TEXT}</span>
            <span className="opacity-40 transition-opacity group-hover:opacity-70">]</span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            tabIndex={interactive ? 0 : -1}
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

      {/* Hero-phase tagline: fades in beside the brand lockup, then fades out once it
          starts travelling into the header (a header keeps only the wordmark). */}
      <p
        aria-hidden={phase !== "brand"}
        className="pointer-events-none fixed inset-x-0 text-center text-[clamp(0.8rem,1.6vw,1rem)] font-light tracking-wide text-[var(--text-secondary)] transition-opacity duration-500 ease-out"
        style={{
          top: "calc(44vh + 2.5rem)",
          opacity: phase === "brand" ? 1 : 0,
          transitionDelay: phase === "brand" ? "300ms" : "0ms",
        }}
      >
        Intelligence for Efficient Results
      </p>

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
            {CTA_TEXT} <span aria-hidden="true" className="text-[var(--neon-cyan)]">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
