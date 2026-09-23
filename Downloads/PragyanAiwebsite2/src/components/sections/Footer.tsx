"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigateToHash } from "@/lib/navigation";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 15 — Footer / Journey Complete. The closing section, and the only one whose height
 * follows its content rather than the viewport. Composition from the approved Stitch
 * reference: the gateway backdrop returns as a bookend to Frame 02, with the wordmark and
 * newsletter block on the left, the section index in the centre and the pillar words on the right.
 *
 * The six navigation links are real in-page destinations. The newsletter has no backend, so its
 * field is a visual echo only: no form, no input, no submission and nothing focusable. Privacy
 * and Terms have no destination and are plain text; Contact points at Frame 14.
 */
const NAV_LINKS = [
  { label: "Who We Are", href: "#journey" },
  { label: "How We Work", href: "#prism" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Products", href: "#products" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Insights", href: "#insights" },
] as const;

const PILLARS = [
  { word: "People", className: "text-slate-300/90" },
  { word: "Ideas", className: "text-slate-300/90" },
  { word: "Technology", className: "footer-pillar-glow text-slate-300" },
  { word: "Impact", className: "text-slate-300/90" },
  { word: "Beyond", className: "footer-pillar-beyond font-medium" },
] as const;

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    // Every case needs one matching condition: matchMedia only runs the setup when one matches.
    const media = gsap.matchMedia();
    media.add(
      { reduceMotion: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        if (context.conditions?.reduceMotion) return;

        // The footer ends the page, so the trigger start is clamped: since the page can't
        // scroll past its own end, this guarantees the trigger still fires (at the closest
        // achievable position) even when the footer is short enough that "top 88%" is never
        // literally reachable.
        gsap.fromTo(
          "[data-footer-copy]",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: footer, start: "clamp(top 88%)", toggleActions: "play none none none" },
          },
        );
      },
      footer,
    );

    return () => media.revert();
  }, []);

  return (
    <footer
      id="footer"
      ref={footerRef}
      aria-labelledby="footer-heading"
      className="relative isolate overflow-hidden bg-[var(--void-black)]"
    >
      {/* Decorative gateway backdrop: the Frame 02 gate returning as a bookend. Scoped to the footer. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/images/footer-backdrop.jpg"
          alt=""
          fill
          loading="eager"
          quality={90}
          sizes="(min-width: 1024px) 100vw, 1376px"
          className="object-cover object-right"
        />
        <div className="footer-scrims absolute inset-0" />
      </div>

      <div className="footer-content relative z-10 px-[var(--gutter-x)] pt-24 pb-10">
        <div className="mx-auto w-full max-w-[1152px]">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Wordmark, tagline and the newsletter echo */}
            <div data-footer-copy className="flex flex-col gap-8 md:col-span-1 lg:col-span-5">
              <div>
                <h2 id="footer-heading" className="text-3xl font-semibold tracking-tight text-white">
                  Pragyan{" "}
                  <span className="bg-gradient-to-r from-[#8B2DFF] to-[var(--neon-cyan)] bg-clip-text text-transparent">ai</span>
                </h2>
                <p className="mt-1.5 text-sm font-light tracking-wide text-[#A2A8BC]">Intelligence for Efficient Results</p>
              </div>

              <div className="max-w-md pt-2">
                <h3 className="text-base font-medium text-slate-200">Stay in the loop</h3>
                {/* No newsletter backend exists: this is the Stitch field as a visual echo. It is not a
                    form, holds no input or button, submits nothing and is hidden from assistive tech. */}
                <div
                  aria-hidden="true"
                  className="footer-field mt-4 flex items-center justify-between gap-3 rounded-full p-1.5 pl-5"
                >
                  <span className="text-xs text-slate-500">Enter your email</span>
                  <span className="footer-field-button flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Section navigation: real in-page destinations */}
            <nav data-footer-copy aria-label="Footer" className="md:col-span-1 lg:col-span-3 lg:pl-4">
              <ul className="flex flex-col gap-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, link.href)}
                      className="footer-link text-xs tracking-wider"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Pillar words: left-aligned with a rule on small screens, right-aligned from lg */}
            <div data-footer-copy className="md:col-span-2 lg:col-span-4 lg:flex lg:justify-end">
              <ul className="footer-pillars flex flex-col gap-3.5 border-l border-slate-800 pl-6 font-[family-name:var(--font-mono)] text-[11px] font-light tracking-[0.32em] uppercase lg:border-l-0 lg:pr-8 lg:pl-0 lg:text-right">
                {PILLARS.map((pillar) => (
                  <li key={pillar.word} className={pillar.className}>
                    {pillar.word}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Legal row */}
      <div className="footer-legal footer-content relative z-10 w-full px-[var(--gutter-x)] py-5">
        <div className="mx-auto flex w-full max-w-[1152px] flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-[11px] text-slate-500">© 2026 Pragyan ai. All rights reserved.</p>

          <div className="flex items-center gap-6 text-xs font-light">
            {/* No Privacy or Terms page exists: plain text, not links. */}
            <span className="text-slate-500">Privacy</span>
            <span className="text-slate-500">Terms</span>
            <a
              href="#contact"
              onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, "#contact")}
              className="footer-link"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
