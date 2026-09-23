"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 09 — Proof / Case Studies. Composition from the approved Stitch reference.
 * Only approved content is shown: both clients are anonymous and their results,
 * descriptors and stories are pending, so each card carries its label and a
 * non-interactive "Read Story" marker. No destinations exist yet, so nothing links.
 */
const CASE_STUDIES = [
  {
    label: "Case Study 01",
    tone: "cyan",
    image: "/images/case-study-p-and-c.png",
    alt: "An analyst at a curved multi-monitor workstation in a glass-walled operations floor at night",
  },
  {
    label: "Case Study 02",
    tone: "violet",
    image: "/images/case-study-02-manufacturing.png",
    alt: "Robotic arms along an automated production line in a manufacturing facility",
  },
] as const;

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Every layout needs one matching condition: matchMedia only runs the setup when one matches.
    const media = gsap.matchMedia();
    media.add(
      { reduceMotion: "(prefers-reduced-motion: reduce)", stacked: "(max-width: 639px)", sideBySide: "(min-width: 640px)" },
      (context) => {
        const { reduceMotion, stacked } = context.conditions ?? {};
        if (reduceMotion) return;

        gsap.fromTo(
          "[data-cases-copy]",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 78%", end: "top 30%", scrub: 0.6 },
          },
        );

        // Side-by-side cards enter together with a stagger; stacked cards each enter as they reach the viewport.
        const cards = gsap.utils.toArray<HTMLElement>("[data-cases-card]");
        if (stacked) {
          cards.forEach((card) =>
            gsap.fromTo(
              card,
              { autoAlpha: 0, y: 28 },
              { autoAlpha: 1, y: 0, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 92%", end: "top 62%", scrub: 0.6 } },
            ),
          );
        } else {
          gsap.fromTo(
            cards,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: { trigger: section, start: "top 70%", end: "top 15%", scrub: 0.7 },
            },
          );
        }

        // Restrained image settle and parallax inside each card.
        gsap.utils.toArray<HTMLElement>("[data-cases-media]").forEach((frame) => {
          gsap.fromTo(
            frame,
            { scale: 1.05 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "top 25%", scrub: 0.8 } },
          );
          gsap.fromTo(
            frame,
            { yPercent: -3 },
            { yPercent: 3, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      },
      section,
    );

    return () => media.revert();
  }, []);

  return (
    <section
      id="case-studies"
      ref={sectionRef}
      aria-labelledby="case-studies-heading"
      className="relative isolate min-h-[max(calc(var(--svh)*100),52rem)] overflow-hidden bg-[var(--void-black)]"
    >
      <div aria-hidden="true" className="cases-ambient pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-[inherit] w-full flex-col justify-center px-[var(--gutter-x)] pt-28 pb-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col justify-center lg:col-span-5 lg:pr-4">
            <h2
              id="case-studies-heading"
              data-cases-copy
              className="text-5xl leading-[1.04] font-light tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-[68px]"
            >
              ai that
              <br />
              has left
              <br />
              <span className="cases-headline-gradient font-normal">the lab.</span>
            </h2>
          </div>

          <ul aria-label="Case studies" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            {CASE_STUDIES.map((study) => (
              <li key={study.label} data-cases-card>
                <article className="cases-card relative flex min-h-[510px] flex-col justify-end overflow-hidden rounded-2xl bg-[#070B18] p-7">
                  <div data-cases-media className="absolute inset-x-0 -top-[5%] -bottom-[5%]">
                    <Image
                      src={study.image}
                      alt={study.alt}
                      fill
                      sizes="(min-width: 1024px) 26vw, (min-width: 640px) 50vw, 100vw"
                      className="cases-card-image object-cover object-center"
                    />
                  </div>
                  <div aria-hidden="true" className="cases-card-gradient pointer-events-none absolute inset-0" />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5" />

                  <div className="relative z-10">
                    <h3 className="mb-4 flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${study.tone === "cyan" ? "bg-[var(--neon-cyan)]" : "bg-[var(--electric-violet)]"}`}
                      />
                      <span
                        className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${
                          study.tone === "cyan" ? "text-[var(--neon-cyan)]" : "text-[var(--electric-violet)]"
                        }`}
                      >
                        {study.label}
                      </span>
                    </h3>
                    {/* A marker for the story to come: plain text, not a link. */}
                    <p className="text-[11px] font-medium tracking-wider text-white/55 uppercase">Read Story</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
