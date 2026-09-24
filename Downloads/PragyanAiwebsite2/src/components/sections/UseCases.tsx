"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 11 — Use Cases. Cinematic industry deck.
 *
 * Composition follows the approved Stitch screen: an editorial header over a panoramic
 * strip of industry cards. The content is the approved .docx list — nine industries and
 * the named use cases actually delivered in each. The Stitch screen's own ten sectors,
 * their descriptions and their per-card CTAs were written for the mockup, so none are here.
 *
 * Five of the nine have no approved photograph. Rather than invent one, those cards carry
 * a drawn lattice that assembles with the camera — the same treatment the earlier polish
 * pass used for this frame's photograph-less worlds.
 *
 * The strip scrolls horizontally on its own: the frame stays where it is and only the
 * cards move, driven by the reader rather than by page scroll. Vertical scrolling past
 * the section plays the cards in once, cumulatively — once an industry has arrived it stays.
 *
 * The first nine carry the use cases named in the document. The six after them are the
 * remaining sectors from the Stitch screen; no delivered work is documented for those yet,
 * so they carry the sector and nothing more. The Stitch screen's invented capability lines
 * for them ("Hyperspectral telemetry", "Sovereign LLM infrastructure", …) are not used.
 */

const ICON = {
  bank: "M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18M12 3 3 8h18l-9-5Z",
  sprout: "M12 21v-7m0 0C12 10 9 7 5 7c0 4 3 7 7 7Zm0 0c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z",
  stethoscope: "M6 3v5a4 4 0 0 0 8 0V3M6 3H4m2 0h2m6 0h2m-2 0h-2m-4 9v2a5 5 0 0 0 10 0v-1m0 0a2 2 0 1 0 0 .1Z",
  cart: "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6M9 21h.01M18 21h.01",
  truck: "M3 7h10v9H3zM13 11h4l3 3v2h-7M6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  civic: "M5 21V6l7-3 7 3v15M5 21h14M9 10h.01M9 14h.01M15 10h.01M15 14h.01M11 21v-4h2v4",
  factory: "M3 21V11l5 3V11l5 3V8l8 5v8H3ZM7 3h3l-.5 5h-2L7 3Z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  cap: "M12 4 2 9l10 5 10-5-10-5ZM6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5",
  home: "M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9Z",
} as const;

/**
 * The ten industries, in the order supplied. Four carry the use cases named in the
 * document; the other six have no documented delivered work yet, so they carry the
 * sector and nothing more. The Stitch screen's invented capability lines for them
 * ("Hyperspectral telemetry", "Sovereign LLM infrastructure", …) are not used.
 */
const INDUSTRIES = [
  {
    id: "bfsi",
    name: "BFSI",
    icon: ICON.bank,
    cases: ["Credit Covenant Intelligence", "Loan Risk Prediction", "RM Copilot"],
    image: "/images/usecase-bfsi.png",
    alt: "A banking headquarters at night with curved analytics screens",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: ICON.sprout,
    cases: [],
    image: "/images/usecase-agriculture.jpg",
    alt: "An autonomous tractor working a field at night under guidance lighting",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: ICON.stethoscope,
    cases: ["Diagnostic Capacity Forecasting", "Provider Fraud Detection"],
    image: "/images/usecase-healthcare.png",
    alt: "A clinical control centre at night with diagnostic telemetry",
  },
  {
    id: "retail-fmcg",
    name: "Retail & FMCG",
    icon: ICON.cart,
    cases: ["Inventory Intelligence", "Demand Forecasting", "Dynamic Pricing"],
    image: "/images/usecase-retail.png",
    alt: "A connected retail flagship at night with ambient display fixtures",
  },
  {
    id: "supply-chain",
    name: "Supply Chain",
    icon: ICON.truck,
    cases: [],
    image: "/images/usecase-logistics.png",
    alt: "An automated distribution hub at night with guided vehicles and conveyor tracks",
  },
  {
    id: "government",
    name: "Government",
    icon: ICON.civic,
    cases: [],
    image: "/images/usecase-government.jpg",
    alt: "An operations control room at night overlooking a lit city",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: ICON.factory,
    cases: ["Predictive Maintenance", "Quality Inspection", "Production Planning"],
    image: "/images/case-study-02-manufacturing.png",
    alt: "An automated manufacturing facility at night with precision robotics",
  },
  {
    id: "energy-utilities",
    name: "Energy & Utilities",
    icon: ICON.bolt,
    cases: [],
    image: "/images/usecase-energy-utilities.jpg",
    alt: "An electrical substation at night with transmission lines and wind turbines beyond",
  },
  {
    id: "education",
    name: "Education",
    icon: ICON.cap,
    cases: [],
    image: "/images/usecase-education.jpg",
    alt: "A dark hall of tall illuminated panels in drifting mist",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: ICON.home,
    cases: [],
    image: "/images/usecase-real-estate.jpg",
    alt: "An illuminated high-rise tower at night seen from the street",
  },
] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function smoothstep(edge0: number, edge1: number, v: number) {
  const t = clamp01((v - edge0) / (edge1 - edge0 || 1));
  return t * t * (3 - 2 * t);
}

interface Place {
  x?: number;
  y?: number;
  s?: number;
  o: number;
  blur?: number;
}

/** Writes a placement onto an element, skipping properties that have not changed. */
function write(el: HTMLElement | null, p: Place) {
  if (!el) return;
  const visible = p.o > 0.002;
  const visibility = visible ? "visible" : "hidden";
  if (el.style.visibility !== visibility) el.style.visibility = visibility;
  if (!visible) return;
  const o = p.o >= 0.999 ? "1" : p.o.toFixed(3);
  if (el.style.opacity !== o) el.style.opacity = o;
  const t = `translate3d(${(p.x ?? 0).toFixed(2)}px, ${(p.y ?? 0).toFixed(2)}px, 0) scale(${(p.s ?? 1).toFixed(4)})`;
  if (el.style.transform !== t) el.style.transform = t;
  const blur = p.blur ?? 0;
  const f = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
  if (el.style.filter !== f) el.style.filter = f;
}

function clear(el: HTMLElement | null) {
  if (!el) return;
  el.style.removeProperty("visibility");
  el.style.removeProperty("opacity");
  el.style.removeProperty("transform");
  el.style.removeProperty("filter");
  el.style.removeProperty("stroke-dashoffset");
}

export default function UseCases() {
  const sectionRef = useRef<HTMLElement>(null);
  const els = useRef<{
    atmos: HTMLElement | null;
    head: HTMLElement | null;
    count: HTMLElement | null;
    deck: HTMLElement | null;
    track: HTMLElement | null;
    cards: (HTMLElement | null)[];
    closing: HTMLElement | null;
  }>({ atmos: null, head: null, count: null, deck: null, track: null, cards: [], closing: null });

  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({ start: true, end: false });

  /** Keeps the arrow buttons in step with where the strip actually is. */
  const syncEdges = useCallback(() => {
    const deck = els.current.deck;
    if (!deck) return;
    const max = deck.scrollWidth - deck.clientWidth;
    setEdge({ start: deck.scrollLeft <= 2, end: deck.scrollLeft >= max - 2 });
  }, []);

  /** Steps the strip by roughly one card, in whichever direction. */
  const step = useCallback((dir: 1 | -1) => {
    const deck = els.current.deck;
    const card = els.current.cards[0];
    if (!deck) return;
    const by = (card?.getBoundingClientRect().width ?? 280) + 16;
    deck.scrollBy({ left: dir * by, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add(
      {
        entrance: "(prefers-reduced-motion: no-preference)",
        flow: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const e = els.current;

        if (!context.conditions?.entrance) {
          section.dataset.motion = "off";
          [e.atmos, e.head, e.count, e.deck, e.track, e.closing, ...e.cards].forEach(clear);
          return;
        }

        section.dataset.motion = "on";

        // A single entrance as the section comes up the page. It plays once and never
        // reverses, so nothing a reader has already seen is taken away again.
        const play = (t: number) => {
          write(e.atmos, { s: lerp(1, 1.08, t), o: lerp(0.5, 1, t) });

          const headIn = smoothstep(0, 0.4, t);
          write(e.head, { y: lerp(40, 0, headIn), o: headIn, blur: lerp(7, 0, headIn) });
          const countIn = smoothstep(0.15, 0.55, t);
          write(e.count, { x: lerp(24, 0, countIn), o: countIn });

          const deckIn = smoothstep(0.2, 0.6, t);
          write(e.deck, { y: lerp(44, 0, deckIn), o: deckIn, blur: lerp(6, 0, deckIn) });
          write(e.track, { o: 1 });

          // The cards land one after another and stay. The last one's window has to close
          // before the tween ends, or it never reaches full opacity.
          INDUSTRIES.forEach((_, i) => {
            const from = 0.22 + (i / Math.max(1, INDUSTRIES.length - 1)) * 0.45;
            const arrived = smoothstep(from, from + 0.3, t);
            write(e.cards[i], {
              x: lerp(40, 0, arrived),
              y: lerp(28, 0, arrived),
              s: lerp(0.95, 1, arrived),
              o: arrived,
              blur: lerp(6, 0, arrived),
            });
          });

          const closeIn = smoothstep(0.75, 1, t);
          write(e.closing, { y: lerp(20, 0, closeIn), o: closeIn });
        };

        play(0);

        const tween = gsap.to(
          { t: 0 },
          {
            t: 1,
            duration: 1.5,
            ease: "power2.out",
            paused: true,
            onUpdate() {
              play((this.targets()[0] as { t: number }).t);
            },
          },
        );

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 78%",
          once: true,
          onEnter: () => tween.play(),
        });

        return () => {
          trigger.kill();
          tween.kill();
        };
      },
      section,
    );

    return () => media.revert();
  }, []);

  // The arrows only make sense once we know where the strip sits.
  useEffect(() => {
    syncEdges();
    const onResize = () => syncEdges();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncEdges]);

  return (
    <section
      id="use-cases"
      ref={sectionRef}
      aria-labelledby="use-cases-heading"
      data-motion="off"
      className="uc-scene"
    >
      <div className="uc-viewport">
        <div aria-hidden="true" className="uc-env">
          <div ref={(el) => void (els.current.atmos = el)} className="uc-atmos" />
        </div>

        <div className="uc-inner">
          <header className="uc-head-row">
            <div ref={(el) => void (els.current.head = el)} className="uc-head">
              <p className="uc-eyebrow">
                <span aria-hidden="true" className="uc-dot" />
                11 — Where We Apply Intelligence
              </p>
              <h2 id="use-cases-heading" className="uc-title">
                <span>Different industries.</span>
                <span className="uc-title-accent">Different problems.</span>
              </h2>
            </div>

            <div ref={(el) => void (els.current.count = el)} className="uc-count">
              <p className="uc-count-figure">
                <span className="uc-count-value">{INDUSTRIES.length}</span>
                <span className="uc-count-text">industries</span>
              </p>
              <div className="uc-controls">
                <button
                  type="button"
                  className="uc-arrow"
                  onClick={() => step(-1)}
                  disabled={edge.start}
                  aria-label="Show previous industries"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  className="uc-arrow"
                  onClick={() => step(1)}
                  disabled={edge.end}
                  aria-label="Show more industries"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </header>

          {/* A real scroll container: the frame holds still and only the strip moves. */}
          <div
            ref={(el) => void (els.current.deck = el)}
            className="uc-deck"
            role="group"
            aria-label="Industries, scroll sideways for more"
            tabIndex={0}
            onScroll={syncEdges}
          >
            <ul ref={(el) => void (els.current.track = el)} className="uc-track">
              {INDUSTRIES.map((industry, i) => (
                <li
                  key={industry.id}
                  ref={(el) => void (els.current.cards[i] = el)}
                  className="uc-card"
                  data-bare={industry.cases.length === 0 ? "" : undefined}
                >
                  <div className="uc-card-media">
                    <Image
                      src={industry.image}
                      alt={industry.alt}
                      fill
                      /* The card is taller than the source's 3:4, so cover crops the sides
                         and HEIGHT is what sets the scale — the hint has to exceed the
                         card's width or the served variant gets stretched. */
                      sizes="(min-width: 1024px) 400px, 95vw"
                      className="uc-card-img"
                    />
                    <div aria-hidden="true" className="uc-card-scrim" />
                  </div>

                  <div className="uc-card-body">
                    <p className="uc-card-tag">
                      <span aria-hidden="true" className="uc-card-dot" />
                      {String(i + 1).padStart(2, "0")} / {industry.name}
                    </p>
                    <h3 className="uc-card-name">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="uc-card-icon">
                        <path d={industry.icon} />
                      </svg>
                      {industry.name}
                    </h3>
                    {industry.cases.length > 0 && (
                      <ul className="uc-card-cases" aria-label={`${industry.name} use cases`}>
                        {industry.cases.map((c) => (
                          <li key={c} className="uc-case">
                            <span aria-hidden="true" className="uc-case-mark" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div ref={(el) => void (els.current.closing = el)} className="uc-closing">
            <p className="uc-closing-text">
              40+ production-ready AI model prototypes available for rapid customer demonstrations.
            </p>
            <p className="uc-hint">
              <span aria-hidden="true" className="uc-hint-mark" />
              Scroll the strip sideways for every industry
            </p>
            {/* No destination exists for this yet, so it is text, not a link. */}
            <p className="uc-cta">
              <span>Explore the Possibilities</span>
              <span aria-hidden="true">→</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
