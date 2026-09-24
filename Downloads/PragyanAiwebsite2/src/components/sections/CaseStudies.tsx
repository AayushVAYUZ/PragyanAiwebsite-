"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 09 — Proof (Case Studies). Cinematic interactive.
 *
 * Composition follows the approved Stitch screen: a master editorial header, a split
 * stage with an active case deep-dive on the left and a selectable archive deck on the
 * right. Every word and number is the approved .docx content — the Stitch screen's
 * global telemetry HUD, its third case, its named client and its production attestation
 * are all invented, so none of them are here.
 *
 * The camera is a pure function of scroll progress written straight to the DOM.
 * Reveals are cumulative: once a part of the dossier has arrived it stays. Selecting a
 * case is the one piece of React state — it changes content, not the camera.
 */

const CASES = [
  {
    id: "risk",
    index: "Case Study 01",
    sector: "Finance & Wealth Management",
    metric: "5 days → 3 seconds",
    metricLabel: "Decision turnaround",
    title: "AI-powered High Risk Prediction Software",
    summary:
      "Predictive analysis model for India's leading finance and wealth management firm, using multiple parameters to reduce decision time and effort from 5 days to 3 seconds.",
    challenge: "Manual credit assessment slowed lending decisions and limited risk visibility across the portfolio.",
    solution: ["Unified Data Intelligence", "Real-Time Risk Scoring", "Credit Behaviour Analysis", "Decision Intelligence Dashboard"],
    impact: [
      { value: "<1 sec", text: "risk assessment turnaround" },
      { value: "5 days → 3 seconds", text: "decision turnaround time" },
      { value: "70%", text: "parameters analysed" },
    ],
    cta: "View Case Study",
    image: "/images/case-study-p-and-c.png",
    alt: "A financial trading floor at night, analysts silhouetted against curved data screens",
    tone: "cyan",
  },
  {
    id: "talent",
    index: "Case Study 02",
    sector: "Talent Advisory",
    metric: "90% fewer billing errors",
    metricLabel: "Billing accuracy",
    title: "AI-backed Legacy Talent Advisory Platform",
    summary: "Modernising the legacy talent advisory platform with AI and intelligent automation.",
    challenge: "Data was spread across systems, billing remained manual, and leaders lacked real-time operational visibility.",
    solution: ["Enterprise CRM", "ATS", "Real-time MIS & Dashboards", "Automated & Pre-Billing Validation", "Single Sign-On & Data Governance"],
    impact: [
      { value: "90%", text: "reduction in billing errors" },
      { value: "100%", text: "real-time operational visibility" },
      { value: "70%", text: "time saved" },
    ],
    cta: "View Case Study",
    image: "/images/case-study-02-manufacturing.png",
    alt: "An advanced industrial facility at night, robotic systems lit by cool telemetry light",
    tone: "violet",
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
}

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // The camera's last progress, so a selection can re-place the swapped-in nodes
  // without waiting for the next scroll tick.
  const progress = useRef(0);
  const frameRef = useRef<((p: number) => void) | null>(null);

  const els = useRef<{
    atmos: HTMLElement | null;
    head: HTMLElement | null;
    stage: HTMLElement | null;
    media: HTMLElement | null;
    copy: HTMLElement | null;
    brief: HTMLElement | null;
    stats: (HTMLElement | null)[];
    cta: HTMLElement | null;
    deckLabel: HTMLElement | null;
    cards: (HTMLElement | null)[];
  }>({
    atmos: null,
    head: null,
    stage: null,
    media: null,
    copy: null,
    brief: null,
    stats: [],
    cta: null,
    deckLabel: null,
    cards: [],
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add(
      {
        // The split stage needs two columns. Anywhere narrower, and under reduced
        // motion, the frame collapses to ordinary document flow.
        camera: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        flow: "(max-width: 1023.98px), (prefers-reduced-motion: reduce)",
      },
      (context) => {
        const e = els.current;

        if (!context.conditions?.camera) {
          section.dataset.motion = "off";
          frameRef.current = null;
          [e.atmos, e.head, e.stage, e.media, e.copy, e.brief, e.cta, e.deckLabel, ...e.stats, ...e.cards].forEach(clear);
          return;
        }

        section.dataset.motion = "on";

        const frame = (p: number) => {
          progress.current = p;

          write(e.atmos, { x: (p - 0.5) * 80, s: lerp(1.02, 1.16, p), o: lerp(0.5, 1, p) });

          // Editorial header arrives first and holds for the whole scene.
          const headIn = smoothstep(0, 0.1, p);
          write(e.head, { y: lerp(46, 0, headIn) - p * 18, o: headIn, blur: lerp(8, 0, headIn) });

          // The deep-dive stage rises out of depth, then holds.
          const stageIn = smoothstep(0.1, 0.3, p);
          write(e.stage, { y: lerp(72, 0, stageIn), s: lerp(0.95, 1, stageIn), o: stageIn, blur: lerp(9, 0, stageIn) });
          // Slow drift inside the photograph, so the stage keeps breathing while held.
          write(e.media, { y: (p - 0.5) * -46, s: lerp(1.08, 1.16, p), o: 1 });

          // Then the dossier fills in, one band at a time, and each band stays.
          const copyIn = smoothstep(0.26, 0.42, p);
          write(e.copy, { y: lerp(34, 0, copyIn), o: copyIn, blur: lerp(6, 0, copyIn) });

          const briefIn = smoothstep(0.4, 0.56, p);
          write(e.brief, { y: lerp(28, 0, briefIn), o: briefIn, blur: lerp(5, 0, briefIn) });

          e.stats.forEach((stat, i) => {
            const start = 0.52 + i * 0.06;
            const statIn = smoothstep(start, start + 0.12, p);
            write(stat, { y: lerp(24, 0, statIn), s: lerp(0.96, 1, statIn), o: statIn, blur: lerp(4, 0, statIn) });
          });

          const ctaIn = smoothstep(0.78, 0.9, p);
          write(e.cta, { y: lerp(20, 0, ctaIn), o: ctaIn });

          // The archive deck assembles alongside, card by card, cumulatively.
          const deckIn = smoothstep(0.24, 0.36, p);
          write(e.deckLabel, { x: lerp(28, 0, deckIn), o: deckIn });

          e.cards.forEach((card, i) => {
            const start = 0.34 + i * 0.18;
            const arrived = smoothstep(start, start + 0.2, p);
            write(card, {
              x: lerp(56, 0, arrived),
              y: lerp(30, 0, arrived),
              s: lerp(0.95, 1, arrived),
              o: arrived,
              blur: lerp(7, 0, arrived),
            });
          });
        };

        frameRef.current = frame;
        frame(0);

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => frame(self.progress),
          onRefresh: (self) => frame(self.progress),
        });

        return () => {
          frameRef.current = null;
          trigger.kill();
        };
      },
      section,
    );

    return () => media.revert();
  }, []);

  // A selection remounts the deep-dive copy; place the fresh nodes at the camera's
  // current progress so nothing pops back to its un-animated state.
  useEffect(() => {
    frameRef.current?.(progress.current);
  }, [active]);

  const select = useCallback((i: number) => setActive(i), []);

  const study = CASES[active];

  return (
    <section
      id="case-studies"
      ref={sectionRef}
      aria-labelledby="case-studies-heading"
      data-motion="off"
      className="proof-scene"
    >
      <div className="proof-viewport">
        <div aria-hidden="true" className="proof-env">
          <div ref={(el) => void (els.current.atmos = el)} className="proof-atmos" />
        </div>

        <div className="proof-inner">
          {/* Master editorial header */}
          <header ref={(el) => void (els.current.head = el)} className="proof-head">
            <p className="proof-eyebrow">
              <span aria-hidden="true" className="proof-dot" />
              09 — Proof / Case Studies
            </p>
            <h2 id="case-studies-heading" className="proof-title">
              AI that has <span className="proof-title-accent">left the lab.</span>
            </h2>
            <p className="proof-intro">
              We work on problems where intelligence needs to create a measurable business outcome — not simply
              demonstrate what technology can do.
            </p>
          </header>

          <div className="proof-split">
            {/* Active case deep-dive */}
            <article
              ref={(el) => void (els.current.stage = el)}
              className="proof-stage"
              id={`case-panel-${study.id}`}
              role="tabpanel"
              aria-labelledby={`case-tab-${study.id}`}
              data-tone={study.tone}
            >
              <div aria-hidden="true" className="proof-stage-media">
                <div ref={(el) => void (els.current.media = el)} className="proof-stage-plate">
                  <Image
                    key={study.id}
                    src={study.image}
                    alt=""
                    fill
                    /* The plate is oversized and scaled for the drift, so it needs more than the column's width. */
                    sizes="(min-width: 1024px) 72vw, 100vw"
                    className="proof-stage-img"
                  />
                </div>
                <div className="proof-stage-scrim" />
              </div>

              <div className="proof-stage-hud">
                <p className="proof-hud-id">
                  <span aria-hidden="true" className="proof-hud-dot" />
                  {study.index}
                </p>
                <p className="proof-hud-sector">{study.sector}</p>
              </div>

              <div className="proof-stage-body">
                <div key={study.id} className="proof-swap">
                  <div ref={(el) => void (els.current.copy = el)} className="proof-copy">
                    <p className="proof-metric-label">{study.metricLabel}</p>
                    <p className="proof-metric">{study.metric}</p>
                    <h3 className="proof-case-title">{study.title}</h3>
                    <p className="proof-case-summary">{study.summary}</p>
                  </div>

                  <div ref={(el) => void (els.current.brief = el)} className="proof-brief">
                    <div className="proof-brief-block">
                      <p className="proof-brief-label">The challenge</p>
                      <p className="proof-brief-text">{study.challenge}</p>
                    </div>
                    <div className="proof-brief-block">
                      <p className="proof-brief-label">What we built</p>
                      <ul className="proof-chips">
                        {study.solution.map((s) => (
                          <li key={s} className="proof-chip">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <ul className="proof-stats" aria-label="Impact">
                    {study.impact.map((im, i) => (
                      <li key={im.text} ref={(el) => void (els.current.stats[i] = el)} className="proof-stat">
                        <span className="proof-stat-value">{im.value}</span>
                        <span className="proof-stat-text">{im.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* The full study is not published yet, so this is text, not a link. */}
                  <p ref={(el) => void (els.current.cta = el)} className="proof-cta">
                    <span>{study.cta}</span>
                    <span aria-hidden="true">→</span>
                  </p>
                </div>
              </div>
            </article>

            {/* Archive deck — selecting a case changes the stage */}
            <div className="proof-deck">
              <p ref={(el) => void (els.current.deckLabel = el)} className="proof-deck-label">
                <span>Case archive</span>
                <span className="proof-deck-cue">Select to open</span>
              </p>

              <div className="proof-deck-list" role="tablist" aria-label="Case studies">
                {CASES.map((c, i) => (
                  <div key={c.id} ref={(el) => void (els.current.cards[i] = el)} className="proof-card-anchor">
                    <button
                      type="button"
                      role="tab"
                      id={`case-tab-${c.id}`}
                      aria-selected={i === active}
                      aria-controls={`case-panel-${c.id}`}
                      tabIndex={i === active ? 0 : -1}
                      onClick={() => select(i)}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                          event.preventDefault();
                          select((i + 1) % CASES.length);
                        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                          event.preventDefault();
                          select((i - 1 + CASES.length) % CASES.length);
                        }
                      }}
                      className="proof-card"
                      data-tone={c.tone}
                      data-active={i === active ? "" : undefined}
                    >
                      <span className="proof-card-media">
                        {/* A tall thumbnail strip: cover crops to the height, not the width. */}
                        <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 240px, 128px" className="proof-card-img" />
                      </span>
                      <span className="proof-card-body">
                        <span className="proof-card-id">
                          <span aria-hidden="true" className="proof-card-dot" />
                          {c.index}
                          {i === active && <span className="proof-card-flag">Open</span>}
                        </span>
                        <span className="proof-card-title">{c.title}</span>
                        <span className="proof-card-metric">{c.metric}</span>
                        <span className="proof-card-sector">{c.sector}</span>
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
