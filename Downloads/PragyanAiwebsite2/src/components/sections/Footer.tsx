"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigateToHash } from "@/lib/navigation";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 15 — Footer / Journey Complete. The closing section, and the only one whose height
 * follows its content rather than the viewport. The gateway backdrop returns as a bookend to
 * Frame 02: it is given a tall panel and a light scrim so the portal reads as a full scene
 * rather than a sliver behind the copy, with the wordmark and newsletter block on the left,
 * the section index in the centre and the pillar words on the right.
 *
 * The six navigation links are real in-page destinations. The newsletter has no backend, so its
 * field is a visual echo only: no form, no input, no submission and nothing focusable. Privacy,
 * Terms and the social icons have no destination and are plain text; Contact points at Frame 14.
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
  { word: "Technology", className: "footer-pillar-glow text-slate-200" },
  { word: "Impact", className: "text-slate-300/90" },
  { word: "Beyond", className: "footer-pillar-beyond font-medium" },
] as const;

/* No social profiles are wired up yet, so these are icons only — not links. */
const SOCIALS = [
  {
    name: "LinkedIn",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05a4.17 4.17 0 0 1 3.75-2c4 0 4.75 2.63 4.75 6.06V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21h-4z",
  },
  { name: "X", path: "M17.53 3h3.2l-7 8 8.23 10h-6.44l-5.05-6.16L4.7 21H1.5l7.49-8.56L1.1 3h6.6l4.56 5.63zm-1.12 16h1.77L7.68 4.8H5.78z" },
  {
    name: "YouTube",
    path: "M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81zM10 15.02V8.98L15.2 12z",
  },
  {
    name: "Instagram",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z",
  },
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
      className="relative isolate flex min-h-[760px] flex-col overflow-hidden lg:min-h-[880px]"
    >
      {/* Decorative gateway backdrop: the Frame 02 gate returning as a bookend. Scoped to the footer.
          The landscape carries the scrim; the portal is composed on top of it so the shade that keeps
          the copy legible never dims the gateway itself. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* The landscape has its own fainter gateway painted into its right-hand quarter, which
            ghosted beside the real one. The plate is oversized and anchored left so that quarter
            falls outside the frame entirely: what is left is clean plain and mountains. */}
        <div className="footer-backdrop-plate">
          <Image
            src="/images/footer-backdrop.jpg"
            alt=""
            fill
            loading="eager"
            quality={90}
            sizes="140vw"
            className="object-cover object-left"
          />
        </div>
        <div className="footer-scrims absolute inset-0" />

        {/* The Frame 02 portal, stood on the horizon line between the link column and the pillars:
            a halo bleeding into the scene, the interior burst, the plasma frame over its edges,
            and the reflection it throws down the wet floor. */}
        <div className="footer-gate">
          <span className="footer-gate-aura" />
          <div className="footer-gate-interior">
            <Image src="/images/portal-interior.png" alt="" fill quality={85} sizes="40vw" className="object-cover" />
          </div>
          <Image
            src="/images/gateway-portal-4k.png"
            alt=""
            fill
            quality={90}
            sizes="40vw"
            className="footer-gate-frame object-contain"
          />
          <span className="footer-gate-reflection" />
        </div>
      </div>

      <div className="footer-content relative z-10 flex flex-1 items-center px-[var(--gutter-x)] pt-28 pb-16">
        <div className="mx-auto w-full max-w-[1560px]">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Wordmark, tagline and the newsletter echo */}
            <div data-footer-copy className="flex flex-col gap-10 md:col-span-1 lg:col-span-5">
              <div>
                <h2 id="footer-heading" className="text-4xl font-semibold tracking-tight text-white lg:text-[2.75rem]">
                  Pragyan{" "}
                  <span className="bg-gradient-to-r from-[#8B2DFF] to-[var(--neon-cyan)] bg-clip-text text-transparent">ai</span>
                </h2>
                <p className="mt-3 text-base font-light tracking-[0.18em] text-[#A2A8BC]">Intelligence for Efficient Results</p>
              </div>

              <div className="max-w-md">
                <h3 className="text-lg font-medium text-slate-200">Stay in the loop</h3>
                {/* No newsletter backend exists: this is the Stitch field as a visual echo. It is not a
                    form, holds no input or button, submits nothing and is hidden from assistive tech. */}
                <div
                  aria-hidden="true"
                  className="footer-field mt-5 flex items-center justify-between gap-3 rounded-full p-2 pl-6"
                >
                  <span className="text-sm text-slate-500">Enter your email</span>
                  <span className="footer-field-button flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Section navigation: real in-page destinations */}
            <nav data-footer-copy aria-label="Footer" className="md:col-span-1 lg:col-span-3 lg:pl-8">
              <ul className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, link.href)}
                      className="footer-link text-base font-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Pillar words, carried on a vertical gradient rail that runs the height of the column */}
            <div data-footer-copy className="md:col-span-2 lg:col-span-4 lg:flex lg:justify-end">
              <div className="flex items-stretch gap-7 lg:pr-4">
                <span aria-hidden="true" className="footer-pillar-rail" />
                <ul className="footer-pillars flex flex-col justify-center gap-5 py-2 font-[family-name:var(--font-mono)] text-sm font-light tracking-[0.3em] uppercase">
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
      </div>

      {/* Legal row */}
      <div className="footer-content relative z-10 w-full px-[var(--gutter-x)] pb-8">
        <div className="mx-auto w-full max-w-[1560px]">
          <div className="footer-rule" />
          <div className="flex flex-col items-center justify-between gap-6 pt-7 md:flex-row">
            <p className="text-sm text-slate-500">© 2026 Pragyan ai. All rights reserved.</p>

            <div className="flex flex-col items-center gap-6 sm:flex-row md:gap-8">
              <div className="flex items-center text-sm font-light whitespace-nowrap">
                {/* No Privacy or Terms page exists: plain text, not links. */}
                <span className="px-3 text-slate-400 sm:px-5">Privacy Policy</span>
                <span aria-hidden="true" className="footer-divider" />
                <span className="px-3 text-slate-400 sm:px-5">Terms of Use</span>
                <span aria-hidden="true" className="footer-divider" />
                <a
                  href="#contact"
                  onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, "#contact")}
                  className="footer-link px-3 sm:px-5"
                >
                  Contact
                </a>
              </div>

              <span aria-hidden="true" className="footer-divider hidden md:block" />

              {/* No social profiles are wired up: icons only, not links. */}
              <ul aria-label="Social profiles" className="flex items-center gap-6">
                {SOCIALS.map((social) => (
                  <li key={social.name} className="footer-social" title={social.name}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[18px] w-[18px]">
                      <path d={social.path} />
                    </svg>
                    <span className="sr-only">{social.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
