"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionContinuum from "./SectionContinuum";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 13 — How We Think. Composition from the approved Stitch reference: editorial
 * header (label, headline, lead) with the "Read Insights" pill on the right, then three
 * equal insight cards with alternating cyan / violet / cyan accents.
 *
 * No article destinations exist yet, so "Read Insights" and "Explore Article" are plain
 * text and the cards are not links. The photographs are artwork only: nothing visible
 * inside them is repeated as page copy.
 */
const INSIGHTS = [
  {
    id: "adoption",
    tag: "01 // Adoption",
    title: "Rethinking AI Adoption in Enterprise",
    excerpt: "Why organizational readiness, cognitive workflows, and operating architecture matter more than raw model benchmarks.",
    image: "/images/insight-card-01.jpg",
    alt: "Executives in discussion around a boardroom table at night, a city skyline behind them",
    accent: "cyan",
  },
  {
    id: "systems",
    tag: "02 // Systems",
    title: "From Data to Decisions",
    excerpt: "Bridging the gap between vast enterprise telemetry and decisive executive execution through structured contextual intelligence.",
    image: "/images/insight-card-02.jpg",
    alt: "A glowing crystalline data core inside a dark glass hall, two people studying a console beside it",
    accent: "violet",
  },
  {
    id: "leadership",
    tag: "03 // Leadership",
    title: "The Human Side of AI Transformation",
    excerpt: "How human empathy, leadership intuition, and collaborative trust remain the ultimate differentiator in intelligent systems.",
    image: "/images/insight-card-03.jpg",
    alt: "Colleagues in conversation, silhouetted against floor-to-ceiling windows over a campus at dusk",
    accent: "cyan",
  },
] as const;

export default function HowWeThink() {
  const sectionRef = useRef<HTMLElement>(null);

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
          "[data-insights-copy]",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 78%", end: "top 30%", scrub: 0.6 },
          },
        );

        // Each card rises in on its own trigger, so stacked cards reveal as they arrive; the
        // offset start staggers the three when they share a row. clamp() keeps the last card's
        // range inside the page's scroll limit, so it always completes at the end of the page.
        gsap.utils.toArray<HTMLElement>("[data-insight-card]").forEach((card, index) => {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: `clamp(top ${96 - index * 4}%)`, end: `clamp(top ${72 - index * 4}%)`, scrub: 0.6 },
            },
          );
        });
      },
      section,
    );

    return () => media.revert();
  }, []);

  return (
    <section
      id="insights"
      ref={sectionRef}
      aria-labelledby="insights-heading"
      className="relative isolate min-h-[max(calc(var(--svh)*100),52rem)] overflow-hidden bg-[var(--void-black)]"
    >
      <div aria-hidden="true" className="insights-ambient pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-[inherit] w-full flex-col justify-center px-[var(--gutter-x)] pt-28 pb-24">
        <div className="mx-auto w-full max-w-[1400px]">
          {/* Editorial header */}
          <div className="mb-10 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-2xl flex-col gap-3">
              <p data-insights-copy className="flex items-center gap-2">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_8px_#26C6FF]" />
                <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.24em] text-[var(--neon-cyan)] uppercase">
                  13 — How We Think
                </span>
              </p>
              <h2
                id="insights-heading"
                data-insights-copy
                className="text-4xl leading-[1.08] font-light tracking-[-0.025em] text-white md:text-5xl lg:text-6xl"
              >
                Ideas for a more
                <br />
                <span className="bg-gradient-to-r from-white via-white to-[var(--neon-cyan)]/80 bg-clip-text pb-1 text-transparent">
                  intelligent tomorrow.
                </span>
              </h2>
              <p data-insights-copy className="max-w-lg pt-1 text-sm leading-relaxed font-light text-[#A2A8BC] md:text-base">
                Insights, perspectives and learnings from our team shaping the next frontier of enterprise intelligence.
              </p>
            </div>

            {/* No insights destination exists yet: plain text in the Stitch pill, not a link. */}
            <p data-insights-copy className="insights-pill inline-flex shrink-0 items-center gap-2.5 self-start rounded-full px-6 py-3 text-xs tracking-wider whitespace-nowrap uppercase md:mb-1 md:self-auto">
              <span>Read Insights</span>
              <span aria-hidden="true" className="insights-pill-arrow text-[var(--neon-cyan)]">
                →
              </span>
            </p>
          </div>

          {/* Insight cards: three columns on desktop, horizontal editorial rows on tablet, stacked on mobile. */}
          <ul aria-label="Insights" className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:gap-8">
            {INSIGHTS.map((insight) => (
              <li key={insight.id} data-insight-card className="flex">
                <article
                  tabIndex={0}
                  aria-labelledby={`insight-${insight.id}`}
                  data-accent={insight.accent}
                  className="insight-card relative flex w-full flex-col overflow-hidden rounded-2xl sm:flex-row lg:flex-col"
                >
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[var(--void-black)] sm:w-[42%] lg:w-full">
                    <Image
                      src={insight.image}
                      alt={insight.alt}
                      fill
                      loading="eager"
                      quality={90}
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 40vw, 92vw"
                      className="insight-image object-cover object-center"
                    />
                    <div aria-hidden="true" className="insight-fade pointer-events-none absolute inset-0" />
                    <span className="absolute top-4 left-4 rounded-full border border-white/10 bg-[#03040A]/70 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-widest text-[#A2A8BC] uppercase">
                      {insight.tag}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-5 p-6 md:p-7">
                    <div className="flex flex-col gap-2.5">
                      <h3 id={`insight-${insight.id}`} className="insight-title text-xl leading-snug font-normal xl:text-2xl">
                        {insight.title}
                      </h3>
                      <p className="text-sm leading-relaxed font-light text-[#A2A8BC]">{insight.excerpt}</p>
                    </div>
                    {/* No article destination yet: plain text, not a link. */}
                    <p className="insight-explore flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] tracking-wide uppercase">
                      <span>Explore Article</span>
                      <span aria-hidden="true" className="insight-arrow text-xs text-[var(--neon-cyan)]">
                        →
                      </span>
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SectionContinuum index="13" title="How We Think" />
    </section>
  );
}
