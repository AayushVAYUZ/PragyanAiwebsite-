"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onCaseStudyRequest } from "@/lib/caseStudyLink";
import { requestContact } from "@/lib/contact";
import { CASE_STUDIES } from "@/content/caseStudies";

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
 * The scene assembles itself once the section is on screen; nothing is tied to scroll.
 * Reveals are cumulative: once a part of the dossier has arrived it stays. Selecting a
 * case is the one piece of React state — it changes content, not the camera.
 */

const CASES = CASE_STUDIES;

/** How long each case study holds the stage before the next one takes it, in seconds. */
const CASE_STUDY_INTERVAL = 4.5;

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

  // Settles nodes that a selection has just remounted, without waiting for anything.
  const frameRef = useRef<(() => void) | null>(null);

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

        // Everything the entrance brings in, and the settled state it leaves them at.
        const arriving = () =>
          [e.head, e.stage, e.copy, e.brief, e.cta, e.deckLabel, ...e.stats, ...e.cards].filter(Boolean) as HTMLElement[];

        // Places nodes at their finished state. A selection remounts the deep-dive copy, so
        // the fresh nodes are settled directly rather than replayed.
        const settle = () => {
          gsap.set(arriving(), { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: "none" });
        };
        frameRef.current = settle;

        // The photograph keeps a slow drift so the stage breathes while it is held.
        gsap.set(e.media, { scale: 1.12 });

        gsap.set(arriving(), { autoAlpha: 0, y: 24 });

        // The scene assembles itself once the section is on screen. Nothing is tied to scroll
        // position: scrubbing it across four screens left an empty frame ahead of the content.
        const intro = gsap.timeline({ paused: true });
        if (e.head) intro.to(e.head, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0);
        if (e.stage) intro.to(e.stage, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }, 0.12);
        if (e.deckLabel) intro.to(e.deckLabel, { autoAlpha: 1, x: 0, y: 0, duration: 0.6, ease: "power2.out" }, 0.28);
        if (e.copy) intro.to(e.copy, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.34);
        if (e.brief) intro.to(e.brief, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.46);
        const stats = e.stats.filter(Boolean) as HTMLElement[];
        if (stats.length) intro.to(stats, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.07, ease: "power2.out" }, 0.56);
        const cards = e.cards.filter(Boolean) as HTMLElement[];
        if (cards.length) intro.to(cards, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.4);
        if (e.cta) intro.to(e.cta, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.78);

        // Scroll keeps only a restrained depth drift on the environment and the photograph.
        const drift = [e.atmos, e.media].filter(Boolean) as HTMLElement[];
        if (drift.length) {
          gsap.fromTo(
            drift,
            { yPercent: -1.8 },
            { yPercent: 1.8, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }

        let started = false;
        const visibility = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !started) {
                started = true;
                intro.play();
              }
            });
          },
          { threshold: 0.15 },
        );
        visibility.observe(section);

        return () => {
          frameRef.current = null;
          visibility.disconnect();
          intro.kill();
        };
      },
      section,
    );

    return () => media.revert();
  }, []);

  // Links elsewhere on the page (a service's proof line) can ask for a specific case study.
  useEffect(
    () =>
      onCaseStudyRequest((id) => {
        const index = CASES.findIndex((c) => c.id === id);
        if (index >= 0) setActive(index);
      }),
    [],
  );

  // The deck advances on its own once the section is on screen — no click, hover or scroll.
  // Reduced motion holds the first case study instead.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    // Guarded so re-entering the section cannot stack a second timer on the first.
    const start = () => {
      if (timer !== undefined) return;
      timer = window.setInterval(() => setActive((i) => (i + 1) % CASES.length), CASE_STUDY_INTERVAL * 1000);
    };
    const stop = () => {
      if (timer === undefined) return;
      window.clearInterval(timer);
      timer = undefined;
    };

    const visibility = new IntersectionObserver(
      (entries) => entries.forEach((entry) => (entry.isIntersecting ? start() : stop())),
      { threshold: 0.25 },
    );
    visibility.observe(section);

    return () => {
      visibility.disconnect();
      stop();
    };
  }, []);

  // Advancing remounts the deep-dive copy; settle the fresh nodes so nothing is left at
  // the entrance's start state.
  useEffect(() => {
    frameRef.current?.();
  }, [active]);

  const study = CASES[active];

  return (
    <section
      id="case-study-details"
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
            <h2 id="case-studies-heading" className="proof-title">
              ai solving <span className="proof-title-accent">real business problems.</span>
            </h2>
          </header>

          <div className="proof-split">
            {/* Active case deep-dive */}
            <article
              ref={(el) => void (els.current.stage = el)}
              className="proof-stage"
              aria-live="polite"
              data-tone={study.tone}
            >
              <div aria-hidden="true" className="proof-stage-media">
                <div ref={(el) => void (els.current.media = el)} className="proof-stage-plate">
                  {study.image ? (
                    <Image
                      key={study.id}
                      src={study.image}
                      alt=""
                      fill
                      /* The plate is oversized and scaled for the drift, so it needs more than the column's width. */
                      sizes="(min-width: 1024px) 72vw, 100vw"
                      className="proof-stage-img"
                    />
                  ) : (
                    <div key={study.id} className="proof-stage-img proof-placeholder" data-tone={study.tone} />
                  )}
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

                  {/* No detail page is published yet, so the CTA leads to the contact form. */}
                  <a
                    ref={(el) => void (els.current.cta = el)}
                    href="#contact"
                    onClick={(event) => requestContact(event, study.interest)}
                    className="proof-cta"
                  >
                    <span>{study.cta}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </article>

            {/* Archive deck — selecting a case changes the stage */}
            <div className="proof-deck">
              <p ref={(el) => void (els.current.deckLabel = el)} className="proof-deck-label">
                <span>Case archive</span>
              </p>

              <ul className="proof-deck-list" aria-label="Case studies">
                {CASES.map((c, i) => (
                  <li key={c.id} ref={(el) => void (els.current.cards[i] = el)} className="proof-card-anchor">
                    <div
                      className="proof-card"
                      data-tone={c.tone}
                      data-active={i === active ? "" : undefined}
                      aria-current={i === active ? "true" : undefined}
                    >
                      <span className="proof-card-media">
                        {/* A tall thumbnail strip: cover crops to the height, not the width. */}
                        {c.image ? (
                          <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 240px, 128px" className="proof-card-img" />
                        ) : (
                          <span className="proof-card-img proof-placeholder" data-tone={c.tone} />
                        )}
                      </span>
                      <span className="proof-card-body">
                        <span className="proof-card-id">
                          <span aria-hidden="true" className="proof-card-dot" />
                          {c.index}
                        </span>
                        <span className="proof-card-title">{c.title}</span>
                        <span className="proof-card-metric">{c.metric}</span>
                        <span className="proof-card-sector">{c.sector}</span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
