"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { keepAiLowercase } from "@/lib/brandText";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 13 — How We Think. Editorial header with the "Explore our thinking" pill on the right,
 * then a featured-insight rotation: the current insight fills a large card on the left with
 * its summary and key takeaways, and the next three wait in a compact queue on the right.
 * Every few seconds the next one moves into the large card. The rotation pauses while
 * hovered, focused, off screen or in a background tab, and does not run under reduced motion.
 * A queued card or the arrows feature an insight by hand.
 *
 * "Explore our thinking" and each insight's "Read insight" only render once they have a URL, so
 * no dead CTA ships. The photographs are artwork only: nothing visible inside them is repeated
 * as page copy.
 */

// TODO: insights index URL. "Explore our thinking" is hidden until this is set.
const INSIGHTS_URL: string | null = null;

interface Insight {
  id: string;
  title: string;
  description: string;
  /** The longer summary shown when the insight is featured. */
  detail: string;
  /** Three short takeaways shown when the insight is featured. */
  takeaways: string[];
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
// TODO: every `detail` and `takeaways`, and the last three insights (production, sovereign,
// modernise) in full, are draft copy awaiting approval.
const INSIGHTS: Insight[] = [
  {
    id: "adoption",
    title: "Rethinking ai Adoption in Enterprise",
    description: "Why organizational readiness, cognitive workflows, and operating architecture matter more than raw model benchmarks.",
    detail:
      "Model benchmarks make headlines, but they rarely decide whether ai succeeds inside an enterprise. What decides it is readiness: workflows designed around how people actually think and decide, and an operating architecture that can carry ai from a pilot into daily use.",
    takeaways: [
      "Readiness of people and process outweighs model choice",
      "Design workflows around decisions, not tools",
      "Plan the operating architecture before the pilot",
    ],
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
    detail:
      "Enterprises collect more telemetry than ever, yet leaders still wait on reports. Structured contextual intelligence closes that gap by connecting operational data to the decisions it should inform, so the right signal reaches the right person while it still matters.",
    takeaways: [
      "More data doesn't mean faster decisions",
      "Context is what turns telemetry into a signal",
      "Put intelligence where the decision is made",
    ],
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
    detail:
      "ai changes how work gets done, but people decide whether that change lands. Empathy, leadership intuition and trust between teams remain the difference between a system that is adopted and one that is quietly worked around.",
    takeaways: [
      "Adoption is a leadership question as much as a technical one",
      "Trust is built by involving people early",
      "ai should augment judgement, not replace it",
    ],
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
    detail:
      "A proof of concept only has to work once. A production system has to work every day, on real data, with monitoring, governance and people who own it. The gap between the two is where most enterprise ai stalls.",
    takeaways: [
      "Scope the pilot for production from day one",
      "Data, monitoring and ownership are part of the build",
      "Measure business outcomes, not demo accuracy",
    ],
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
    detail:
      "For banks, government and healthcare, where data lives and who controls the model are not technical details. Sovereign ai keeps data in its jurisdiction, keeps model weights as the enterprise's own property, and builds governance into the platform rather than around it.",
    takeaways: [
      "Data residency is a design requirement, not an afterthought",
      "Your model weights remain your intellectual property",
      "Governance belongs inside the platform",
    ],
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
    detail:
      "Replacing core platforms is slow, costly and risky. Embedding focused ai capabilities into the systems teams already use delivers value sooner, and lets intelligence grow one workflow at a time.",
    takeaways: [
      "Most of the value sits in systems you already run",
      "Small, embedded capabilities ship sooner",
      "Grow intelligence one workflow at a time",
    ],
    author: null,
    date: null,
    href: null,
    image: "/images/deceleration.jpg",
    alt: "Beams of violet and cyan light fanning out from a single bright point in deep space",
    accent: "violet",
  },
];

/** Seconds an insight stays featured before the next one moves in. */
const AUTOPLAY_SECONDS = 7;
/** How many insights wait in the queue beside the featured one. */
const QUEUE_SIZE = 3;

export default function HowWeThink() {
  const sectionRef = useRef<HTMLElement>(null);
  const rotationRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [offscreen, setOffscreen] = useState(true);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Every case needs one matching condition: matchMedia only runs the setup when one matches.
    const media = gsap.matchMedia();
    media.add(
      { reduceMotion: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        setAutoplay(!context.conditions?.reduceMotion);
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
      },
      section,
    );

    return () => media.revert();
  }, []);

  // Only rotate while the insights are actually on screen.
  useEffect(() => {
    const rotation = rotationRef.current;
    if (!rotation) return;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rotation);
    return () => observer.disconnect();
  }, []);

  const running = autoplay && !held && !offscreen;

  // One timer per featured insight: choosing one by hand, or pausing, starts the clock again.
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (!document.hidden) setActive((index) => (index + 1) % INSIGHTS.length);
    }, AUTOPLAY_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [running, active]);

  const feature = (index: number) => setActive(((index % INSIGHTS.length) + INSIGHTS.length) % INSIGHTS.length);
  const featured = INSIGHTS[active];
  const queue = Array.from({ length: QUEUE_SIZE }, (_, offset) => (active + offset + 1) % INSIGHTS.length);

  return (
    <section
      id="insights"
      ref={sectionRef}
      aria-labelledby="insights-heading"
      className="relative isolate min-h-[calc(var(--svh)*100)] overflow-hidden"
    >
      <div aria-hidden="true" className="insights-ambient pointer-events-none absolute inset-0" />

      {/* On large screens the heading and the whole rotation fit one screen: the rotation row
          takes whatever height the heading leaves. */}
      <div className="relative z-10 flex min-h-[inherit] w-full flex-col justify-center px-[var(--gutter-x)] pt-28 pb-16 lg:pt-24 lg:pb-10">
        <div className="mx-auto w-full max-w-[1400px]">
          {/* Editorial header */}
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between lg:mb-6">
            <div className="flex max-w-2xl flex-col gap-3">
              <h2
                id="insights-heading"
                data-insights-copy
                className="text-4xl leading-[1.08] font-light tracking-[-0.025em] text-white md:text-5xl"
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

            <div data-insights-copy className="flex items-center justify-end gap-3 md:mb-1">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => feature(active - 1)} aria-label="Previous insight" className="insights-arrow">
                  <span aria-hidden="true">←</span>
                </button>
                <button type="button" onClick={() => feature(active + 1)} aria-label="Next insight" className="insights-arrow">
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Featured insight + queue */}
          <div
            ref={rotationRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Insights"
            data-insights-copy
            onPointerEnter={() => setHeld(true)}
            onPointerLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeld(false);
            }}
          >
            <div className="grid grid-cols-1 gap-6 lg:h-[clamp(22rem,calc(var(--svh)*100-17rem),34rem)] lg:grid-cols-12 xl:gap-8">
              {/* The featured insight, re-keyed so each new one animates in */}
              <article
                key={featured.id}
                aria-roledescription="slide"
                aria-label={`${active + 1} of ${INSIGHTS.length}`}
                aria-live={running ? "off" : "polite"}
                aria-labelledby={`insight-${featured.id}`}
                data-accent={featured.accent}
                className="insight-card insight-featured relative flex flex-col overflow-hidden rounded-2xl lg:col-span-7"
              >
                <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[var(--void-black)] lg:aspect-auto lg:min-h-0 lg:flex-1 lg:shrink">
                  <Image
                    src={featured.image}
                    alt={featured.alt}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 56vw, 92vw"
                    className="insight-image object-cover object-center"
                  />
                  <div aria-hidden="true" className="insight-fade pointer-events-none absolute inset-0" />
                </div>

                <div className="flex flex-col gap-3 p-6 md:p-7 lg:shrink-0 lg:gap-2.5 lg:px-7 lg:pt-5 lg:pb-6">
                  <h3 id={`insight-${featured.id}`} className="insight-title text-2xl leading-snug font-normal xl:text-[1.75rem]">
                    {keepAiLowercase(featured.title)}
                  </h3>
                  <p className="text-sm leading-relaxed font-light text-[var(--text-soft)] lg:line-clamp-3 xl:text-[15px]">{featured.detail}</p>
                  <ul className="insight-takeaways grid gap-2 pt-1 sm:grid-cols-3 sm:gap-4">
                    {featured.takeaways.map((takeaway) => (
                      <li key={takeaway}>{keepAiLowercase(takeaway)}</li>
                    ))}
                  </ul>
                  {(featured.author || featured.date) && (
                    <p className="text-xs text-[var(--text-muted)]">{[featured.author, featured.date].filter(Boolean).join(" · ")}</p>
                  )}
                  {featured.href && (
                    <a
                      href={featured.href}
                      className="insight-explore mt-1 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] tracking-wide uppercase"
                    >
                      <span>Read insight</span>
                      <span aria-hidden="true" className="insight-arrow text-xs text-[var(--neon-cyan)]">
                        →
                      </span>
                    </a>
                  )}
                </div>

                {/* Time until the next insight moves in */}
                {autoplay && (
                  <span aria-hidden="true" className="insight-progress">
                    <span
                      key={`${active}-${running}`}
                      className="insight-progress-fill"
                      style={{ animationDuration: `${AUTOPLAY_SECONDS}s`, animationPlayState: running ? "running" : "paused" }}
                    />
                  </span>
                )}
              </article>

              {/* Up next: tap one to feature it */}
              <ul aria-label="More insights" className="flex flex-col gap-4 lg:col-span-5 lg:min-h-0 xl:gap-5">
                {queue.map((index, position) => {
                  const insight = INSIGHTS[index];
                  return (
                    <li key={insight.id} className="insight-queue-item flex-1 lg:min-h-0" style={{ animationDelay: `${position * 70}ms` }}>
                      <button
                        type="button"
                        onClick={() => feature(index)}
                        data-accent={insight.accent}
                        aria-label={`Feature: ${insight.title}`}
                        className="insight-card insight-queued flex h-full w-full overflow-hidden rounded-2xl text-left"
                      >
                        <span className="relative w-[38%] shrink-0 overflow-hidden bg-[var(--void-black)]">
                          <Image
                            src={insight.image}
                            alt=""
                            fill
                            quality={80}
                            sizes="(min-width: 1024px) 15vw, 36vw"
                            className="insight-image object-cover object-center"
                          />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 p-4 md:p-5">
                          <span className="insight-title text-base leading-snug font-normal xl:text-lg">{keepAiLowercase(insight.title)}</span>
                          <span className="line-clamp-2 text-xs leading-relaxed font-light text-[#A2A8BC] md:text-[13px]">
                            {insight.description}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
