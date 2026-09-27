"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 13 — How We Think. Editorial header with the "Explore our thinking" pill on the right,
 * then the insight cards in a carousel: three to a view on desktop, two on tablet, one on
 * mobile. It advances on its own every few seconds, pausing while hovered, focused, off
 * screen or in a background tab, and not at all under reduced motion. Swipe, the arrows and
 * the dots move it by hand.
 *
 * "Explore our thinking" and each card's "Read insight" only render once they have a URL, so no
 * dead CTA ships. The photographs are artwork only: nothing visible inside them is repeated
 * as page copy.
 */

// TODO: insights index URL. "Explore our thinking" is hidden until this is set.
const INSIGHTS_URL: string | null = null;

interface Insight {
  id: string;
  title: string;
  description: string;
  /** Only confirmed authorship is shown; null keeps the field empty rather than inventing one. */
  author: string | null;
  /** Confirmed publication date, e.g. "12 Sep 2026"; null until one exists. */
  date: string | null;
  /** Article destination; "Read insight" only renders once this exists. */
  href: string | null;
  image: string;
  alt: string;
  accent: "cyan" | "violet";
}

// TODO: confirmed author, date and URL for each article. None exist in the approved content yet.
// The last three (production, sovereign, modernise) are draft copy awaiting approval.
const INSIGHTS: Insight[] = [
  {
    id: "adoption",
    title: "Rethinking ai Adoption in Enterprise",
    description: "Why organizational readiness, cognitive workflows, and operating architecture matter more than raw model benchmarks.",
    author: null,
    date: null,
    href: null,
    image: "/images/insight-card-01.jpg",
    alt: "Executives in discussion around a boardroom table at night, a city skyline behind them",
    accent: "cyan",
  },
  {
    id: "systems",
    title: "From Data to Decisions",
    description: "Bridging the gap between vast enterprise telemetry and decisive executive execution through structured contextual intelligence.",
    author: null,
    date: null,
    href: null,
    image: "/images/insight-card-02.jpg",
    alt: "A glowing crystalline data core inside a dark glass hall, two people studying a console beside it",
    accent: "violet",
  },
  {
    id: "leadership",
    title: "The Human Side of ai Transformation",
    description: "How human empathy, leadership intuition, and collaborative trust remain the ultimate differentiator in intelligent systems.",
    author: null,
    date: null,
    href: null,
    image: "/images/insight-card-03.jpg",
    alt: "Colleagues in conversation, silhouetted against floor-to-ceiling windows over a campus at dusk",
    accent: "cyan",
  },
  {
    id: "production",
    title: "From Pilot to Production",
    description: "Why so many promising proofs of concept stall, and what it takes to turn one into a dependable system the business runs on.",
    author: null,
    date: null,
    href: null,
    image: "/images/products-backdrop.jpg",
    alt: "A dark control room under a glass arch, streams of cyan and violet data flowing across the dome",
    accent: "violet",
  },
  {
    id: "sovereign",
    title: "Sovereign ai for Regulated Enterprises",
    description: "What data residency, model ownership and governance mean in practice when intelligence has to stay under your control.",
    author: null,
    date: null,
    href: null,
    image: "/images/usecase-government.jpg",
    alt: "A group standing at floor-to-ceiling windows over a city at night, data overlays glowing on the glass",
    accent: "cyan",
  },
  {
    id: "modernise",
    title: "Don't Rebuild. Make It Intelligent.",
    description: "How embedding ai into the platforms you already run delivers value sooner, and with less risk, than replacing them.",
    author: null,
    date: null,
    href: null,
    image: "/images/deceleration.jpg",
    alt: "Beams of violet and cyan light fanning out from a single bright point in deep space",
    accent: "violet",
  },
];

/** Seconds each view holds before the carousel moves on by one card. */
const AUTOPLAY_SECONDS = 5;

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
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 78%", toggleActions: "play none none none" },
          },
        );

        // Each card rises in on its own trigger, so stacked cards reveal as they arrive; the
        // offset start staggers the three when they share a row. clamp() keeps the last card's
        // trigger inside the page's scroll limit, so it always fires before the end of the page.
        gsap.utils.toArray<HTMLElement>("[data-insight-card]").forEach((card, index) => {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: `clamp(top ${96 - index * 4}%)`, toggleActions: "play none none none" },
            },
          );
        });
      },
      section,
    );

    return () => media.revert();
  }, []);

  const trackRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState(0);
  const [stops, setStops] = useState(1);
  const paused = useRef({ hover: false, focus: false, offscreen: true });

  /** Distance between two cards' starts, and the number of positions the track can rest at. */
  const measure = useCallback(() => {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    const second = track?.children[1] as HTMLElement | undefined;
    if (!track || !first) return { step: 0, count: 1 };
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    const count = step ? Math.round((track.scrollWidth - track.clientWidth) / step) + 1 : 1;
    return { step, count: Math.max(1, count) };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const { step, count } = measure();
      const target = ((index % count) + count) % count;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: target * step, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [measure],
  );

  // Keep the dots in step with the track, however it was moved.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const sync = () => {
      const { step, count } = measure();
      setStops(count);
      setPosition(step ? Math.min(count - 1, Math.round(track.scrollLeft / step)) : 0);
    };
    sync();
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [measure]);

  // Autoplay: one card at a time, wrapping to the start after the last view.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const visibility = new IntersectionObserver(([entry]) => void (paused.current.offscreen = !entry.isIntersecting), {
      threshold: 0.3,
    });
    visibility.observe(track);
    const timer = window.setInterval(() => {
      const state = paused.current;
      if (state.hover || state.focus || state.offscreen || document.hidden) return;
      const { step, count } = measure();
      if (!step) return;
      goTo(Math.round(track.scrollLeft / step) + 1 >= count ? 0 : Math.round(track.scrollLeft / step) + 1);
    }, AUTOPLAY_SECONDS * 1000);
    return () => {
      window.clearInterval(timer);
      visibility.disconnect();
    };
  }, [goTo, measure]);

  return (
    <section
      id="insights"
      ref={sectionRef}
      aria-labelledby="insights-heading"
      className="relative isolate min-h-[max(calc(var(--svh)*100),52rem)] overflow-hidden"
    >
      <div aria-hidden="true" className="insights-ambient pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-[inherit] w-full flex-col justify-center px-[var(--gutter-x)] pt-28 pb-24">
        <div className="mx-auto w-full max-w-[1400px]">
          {/* Editorial header */}
          <div className="mb-10 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-2xl flex-col gap-3">
              <h2
                id="insights-heading"
                data-insights-copy
                className="text-4xl leading-[1.08] font-light tracking-[-0.025em] text-white md:text-5xl lg:text-6xl"
              >
                Ideas for a more
                <br />
                <span className="bg-gradient-to-r from-white via-white to-[var(--neon-cyan)]/80 bg-clip-text pb-1 text-transparent">
                  intelligent today.
                </span>
              </h2>
            </div>

            {INSIGHTS_URL && (
              <a
                href={INSIGHTS_URL}
                data-insights-copy
                className="insights-pill inline-flex shrink-0 items-center gap-2.5 self-start rounded-full px-6 py-3 text-xs tracking-wider whitespace-nowrap uppercase md:mb-1 md:self-auto"
              >
                <span>Explore our thinking</span>
                <span aria-hidden="true" className="insights-pill-arrow text-[var(--neon-cyan)]">
                  →
                </span>
              </a>
            )}
          </div>

          {/* Insight carousel */}
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Insights"
            data-insights-copy
            onPointerEnter={() => void (paused.current.hover = true)}
            onPointerLeave={() => void (paused.current.hover = false)}
            onFocus={() => void (paused.current.focus = true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) paused.current.focus = false;
            }}
          >
            <ul ref={trackRef} className="insights-track -mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-2">
              {INSIGHTS.map((insight, index) => (
                <li
                  key={insight.id}
                  data-insight-card
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${INSIGHTS.length}`}
                  className="flex shrink-0 basis-[86%] snap-start sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
                >
                  <article
                    aria-labelledby={`insight-${insight.id}`}
                    data-accent={insight.accent}
                    className="insight-card relative flex w-full flex-col overflow-hidden rounded-2xl"
                  >
                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[var(--void-black)]">
                      <Image
                        src={insight.image}
                        alt={insight.alt}
                        fill
                        quality={90}
                        sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 86vw"
                        className="insight-image object-cover object-center"
                      />
                      <div aria-hidden="true" className="insight-fade pointer-events-none absolute inset-0" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-5 p-6 md:p-7">
                      <div className="flex flex-col gap-2.5">
                        <h3 id={`insight-${insight.id}`} className="insight-title text-xl leading-snug font-normal xl:text-2xl">
                          {insight.title}
                        </h3>
                        <p className="text-sm leading-relaxed font-light text-[#A2A8BC]">{insight.description}</p>
                        {(insight.author || insight.date) && (
                          <p className="mt-1 text-xs text-[var(--text-muted)]">
                            {[insight.author, insight.date].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                      {insight.href && (
                        <a
                          href={insight.href}
                          className="insight-explore flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] tracking-wide uppercase"
                        >
                          <span>Read insight</span>
                          <span aria-hidden="true" className="insight-arrow text-xs text-[var(--neon-cyan)]">
                            →
                          </span>
                        </a>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            {stops > 1 && (
              <div className="mt-6 flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  {Array.from({ length: stops }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`Show insight ${index + 1}`}
                      aria-current={index === position ? "true" : undefined}
                      className={`insights-dot${index === position ? " is-active" : ""}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => goTo(position - 1)} aria-label="Previous insight" className="insights-arrow">
                    <span aria-hidden="true">←</span>
                  </button>
                  <button type="button" onClick={() => goTo(position + 1)} aria-label="Next insight" className="insights-arrow">
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
