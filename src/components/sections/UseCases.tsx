"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionContinuum from "./SectionContinuum";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 11 — Use Cases. Composition from the approved Stitch reference: a panoramic
 * strip of five industry panels that works as an accordion on wide screens (BFSI open
 * by default; hover or keyboard focus opens another) and as a card grid below 1280px.
 * Only approved copy is shown: tag, industry name and a non-interactive "Explore" label.
 * The photographs are visual artwork; any text inside them is not page copy.
 */
const INDUSTRIES = [
  {
    id: "bfsi",
    tag: "01 / BFSI",
    name: "BFSI",
    explore: "Explore Architecture",
    image: "/images/usecase-bfsi.png",
    alt: "A financial operations floor at night overlooking a city skyline",
    // Executives and the data wall sit right of centre.
    position: "62% 45%",
    accent: "cyan",
  },
  {
    id: "manufacturing",
    tag: "02 / Manufacturing",
    name: "Manufacturing",
    explore: "Explore Operations",
    // The dedicated usecase-manufacturing.png has not been supplied. This is the approved
    // Frame 09 production-floor image, cropped to the robotic arm so it reads differently here.
    image: "/images/case-study-02-manufacturing.png",
    alt: "A robotic arm on an automated production line",
    position: "28% 38%",
    accent: "violet",
  },
  {
    id: "logistics",
    tag: "03 / Logistics",
    name: "Logistics",
    explore: "Explore Fleet AI",
    image: "/images/usecase-logistics.png",
    alt: "An automated distribution hub with overhead conveyors and autonomous vehicles",
    position: "50% 55%",
    accent: "cyan",
  },
  {
    id: "healthcare",
    tag: "04 / Healthcare",
    name: "Healthcare",
    explore: "Explore Care AI",
    image: "/images/usecase-healthcare.png",
    alt: "Clinicians reviewing brain scans in a research laboratory",
    position: "52% 55%",
    accent: "violet",
  },
  {
    id: "retail",
    tag: "05 / Retail & Ecommerce",
    name: "Retail & Ecommerce",
    explore: "Explore Commerce",
    image: "/images/usecase-retail.png",
    alt: "A shopper at a digital display in a technology showroom at night",
    position: "58% 50%",
    accent: "cyan",
  },
] as const;

// The accordion (and its keyboard behaviour) only exists on wide screens.
const ACCORDION_QUERY = "(min-width: 1280px)";
const subscribeAccordion = (onChange: () => void) => {
  const query = window.matchMedia(ACCORDION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export default function UseCases() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState(0);
  const accordion = useSyncExternalStore(
    subscribeAccordion,
    () => window.matchMedia(ACCORDION_QUERY).matches,
    () => false,
  );

  // Roving focus: one tab stop for the strip; arrow keys move between panels.
  const onKeyDown = useCallback((event: KeyboardEvent<HTMLUListElement>) => {
    const last = INDUSTRIES.length - 1;
    const current = panelRefs.current.findIndex((panel) => panel === document.activeElement);
    if (current < 0) return;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? Math.min(current + 1, last)
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? Math.max(current - 1, 0)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setFocusIndex(next);
    panelRefs.current[next]?.focus();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Every case needs one matching condition: matchMedia only runs the setup when one matches.
    const media = gsap.matchMedia();
    media.add(
      { reduceMotion: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        if (context.conditions?.reduceMotion) return;

        gsap.fromTo(
          "[data-usecases-copy]",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 78%", end: "top 30%", scrub: 0.6 },
          },
        );

        // Panels rise in one after another as they reach the viewport.
        gsap.utils.toArray<HTMLElement>("[data-usecase-panel]").forEach((panel, index) => {
          const offset = index * 3;
          gsap.fromTo(
            panel,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: panel, start: `top ${97 - offset}%`, end: `top ${75 - offset}%`, scrub: 0.6 },
            },
          );
        });

        // The violet orb drifts slowly with the scroll.
        gsap.fromTo(
          "[data-usecases-orb]",
          { yPercent: -12 },
          { yPercent: 12, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
        );
      },
      section,
    );

    return () => media.revert();
  }, []);

  return (
    <section
      id="use-cases"
      ref={sectionRef}
      aria-labelledby="use-cases-heading"
      className="relative isolate min-h-[max(calc(var(--svh)*100),52rem)] overflow-hidden bg-[var(--void-black)]"
    >
      <div aria-hidden="true" className="usecases-ambient pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        data-usecases-orb
        className="usecases-orb pointer-events-none absolute top-1/4 -left-[10%] h-[500px] w-[500px] rounded-full"
      />

      <div className="relative z-10 flex min-h-[inherit] w-full flex-col justify-center px-[var(--gutter-x)] pt-28 pb-24">
        <div className="mx-auto w-full max-w-[1720px]">
          <div className="mb-10 grid grid-cols-1 items-end gap-6 lg:mb-12 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-3 lg:col-span-7">
              <p data-usecases-copy className="flex items-center gap-2">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_8px_#26C6FF]" />
                <span className="font-[family-name:var(--font-mono)] text-xs tracking-widest text-slate-400 uppercase">
                  11 — Use Cases
                </span>
              </p>
              <h2
                id="use-cases-heading"
                data-usecases-copy
                className="text-4xl leading-[1.12] font-light tracking-tight text-white md:text-5xl xl:text-6xl"
              >
                Where could{" "}
                <span className="usecases-headline-accent bg-gradient-to-r from-white via-cyan-100 to-[var(--neon-cyan)] bg-clip-text font-normal text-transparent">
                  intelligence
                </span>
                <br />
                change your business?
              </h2>
            </div>
            <div className="lg:col-span-5 lg:flex lg:justify-end lg:pb-2">
              {/* No use-case destinations exist yet: plain text in the Stitch CTA position. */}
              <p data-usecases-copy className="text-xs font-medium tracking-wider text-white/50 uppercase">
                Explore All Use Cases
              </p>
            </div>
          </div>

          <ul
            aria-label="Industries"
            onKeyDown={accordion ? onKeyDown : undefined}
            className="usecase-strip grid grid-cols-1 gap-3 rounded-2xl border border-[rgba(160,175,220,0.1)] bg-[#050711]/80 p-1.5 shadow-2xl sm:grid-cols-2 xl:flex xl:h-[520px]"
          >
            {INDUSTRIES.map((industry, index) => (
              <li
                key={industry.id}
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
                data-usecase-panel
                data-default={index === 0 ? "" : undefined}
                tabIndex={accordion ? (index === focusIndex ? 0 : -1) : undefined}
                onFocus={accordion ? () => setFocusIndex(index) : undefined}
                aria-labelledby={`usecase-${industry.id}`}
                className="usecase-panel h-[230px] sm:h-[300px] sm:last:col-span-2 xl:h-auto xl:last:col-span-1"
              >
                <Image
                  src={industry.image}
                  alt={industry.alt}
                  fill
                  loading="eager"
                  quality={85}
                  sizes={index === INDUSTRIES.length - 1 ? "(min-width: 1280px) 30vw, 100vw" : "(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"}
                  className="usecase-image object-cover"
                  style={{ objectPosition: industry.position }}
                />
                <div aria-hidden="true" className="usecase-shade pointer-events-none absolute inset-0" />
                <div aria-hidden="true" className="usecase-text-fade pointer-events-none absolute inset-0" />
                <div
                  aria-hidden="true"
                  className={`usecase-accent pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent to-transparent ${
                    industry.accent === "cyan" ? "via-[var(--neon-cyan)]/60" : "via-[var(--electric-violet)]/60"
                  }`}
                />

                <div className="relative z-10 flex h-full flex-col justify-end p-5 2xl:p-6">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="usecase-tag rounded border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] tracking-widest uppercase backdrop-blur-sm">
                      {industry.tag}
                    </span>
                    {index === 0 && (
                      <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--neon-cyan)]/80 shadow-[0_0_8px_#26C6FF]" />
                    )}
                  </div>
                  <h3 id={`usecase-${industry.id}`} className="usecase-title font-normal tracking-tight">
                    {industry.name}
                  </h3>
                  {/* No destination yet: plain text, not a link. */}
                  <p className="usecase-explore mt-4 border-t border-white/10 pt-3 text-[11px] font-medium tracking-wide text-slate-300 uppercase">
                    {industry.explore}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SectionContinuum index="11" title="Use Cases" next={{ href: "#client-proof", label: "Proceed to 12 — Client Proof" }} />
    </section>
  );
}
