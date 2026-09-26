"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigateToHash } from "@/lib/navigation";
import { FOOTER, PRIMARY_NAV, type NavLink } from "@/content/navigation";
import NewsletterPrompt from "./NewsletterPrompt";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 15 — Footer / Journey Complete. The closing section, and the only one whose height
 * follows its content rather than the viewport. The gateway backdrop returns as a bookend to
 * Frame 02: it is given a tall panel and a light scrim so the portal reads as a full scene
 * rather than a sliver behind the copy.
 *
 * Left: the wordmark, tagline, positioning line and the newsletter proposition. Then the
 * Navigate and Company columns, stacked from lg so the right is left to the Gate. Entries without a destination
 * (see `@/content/navigation`) render as plain text, never as dead links; the newsletter field
 * is a visual echo until a provider exists.
 */

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
            {/* Wordmark, positioning and the newsletter proposition */}
            <div data-footer-copy className="flex flex-col gap-10 lg:col-span-4 lg:pr-4">
              <div>
                <h2 id="footer-heading" className="text-4xl font-semibold tracking-tight text-white lg:text-[2.75rem]">
                  Pragyan{" "}
                  <span className="bg-gradient-to-r from-[#8B2DFF] to-[var(--neon-cyan)] bg-clip-text text-transparent">ai</span>
                </h2>
                <p className="mt-3 text-base font-light tracking-[0.18em] text-[#A2A8BC]">{FOOTER.tagline}</p>
                <p className="mt-5 max-w-md text-sm leading-relaxed font-light text-[var(--text-soft)]">{FOOTER.description}</p>
              </div>

              <NewsletterPrompt />
            </div>

            {/* Navigate + Company: side by side below lg; stacked from lg, so the column stays clear
                of the Gate, which stands on the right from that width */}
            <div data-footer-copy className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-1 lg:gap-10 lg:pl-8">
              <FooterColumn title="Navigate" label="Footer" links={PRIMARY_NAV} />
              <FooterColumn title="Company" label="Company" links={FOOTER.company} />
            </div>
          </div>
        </div>
      </div>

      {/* Legal row */}
      <div className="footer-content relative z-10 w-full px-[var(--gutter-x)] pb-8">
        <div className="mx-auto w-full max-w-[1560px]">
          <div className="footer-rule" />
          <div className="flex flex-col items-center justify-between gap-5 pt-7 md:flex-row">
            <p className="text-sm text-slate-500">{FOOTER.copyright}</p>
            <ul aria-label="Legal" className="flex items-center text-sm font-light whitespace-nowrap">
              {FOOTER.legal.map((link, index) => (
                <li key={link.label} className="flex items-center">
                  {index > 0 && <span aria-hidden="true" className="footer-divider" />}
                  <FooterEntry link={link} className="px-3 sm:px-5" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, label, links }: { title: string; label: string; links: NavLink[] }) {
  return (
    <nav aria-label={label}>
      <p className="mb-5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[var(--neon-cyan)]/70 uppercase">
        {title}
      </p>
      <ul className="flex flex-col gap-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <FooterEntry link={link} className="text-[15px] font-light" />
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** A real in-page or external link where a destination exists; plain text where it does not. */
function FooterEntry({ link, className }: { link: NavLink; className: string }) {
  const { href } = link;
  if (!href) return <span className={`${className} text-slate-400`}>{link.label}</span>;
  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, href)} className={`footer-link ${className}`}>
        {link.label}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`footer-link ${className}`}>
      {link.label}
    </a>
  );
}
