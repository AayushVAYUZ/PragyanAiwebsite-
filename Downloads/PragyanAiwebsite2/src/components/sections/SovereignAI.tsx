"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 09 — Sovereign AI.
 *
 * The gate holds the centre of the frame for as long as the section is on screen, and the
 * four capabilities assemble around it on their own clock once the section arrives. Nothing
 * is tied to scroll position.
 *
 * The scene deliberately carries no operational readouts. Residency lists, chip models,
 * cipher names, bearing labels and status chips read as a live monitoring dashboard, which
 * this is not — the four capabilities carry the offer on their own.
 */

const LAYERS = [
  {
    number: "01",
    title: "Data Ingestion & Knowledge Core",
    text: "Strict jurisdictional data residency with private enterprise memory and controlled data pipelines.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true">
        <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
        <path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
        <path d="M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Proprietary Model Training",
    text: "Isolated model training and sovereign fine-tuning. Model weights remain your intellectual property.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true">
        <rect x="7.5" y="7.5" width="9" height="9" rx="1.5" />
        <path d="M10.5 4V2M13.5 4V2M10.5 22v-2M13.5 22v-2M4 10.5H2M4 13.5H2M22 10.5h-2M22 13.5h-2" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Dedicated Compute Fabric",
    text: "Single-tenant compute and dedicated infrastructure isolated from shared environments.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Secure Model Serving & Apps",
    text: "Localized inference and secure APIs with controlled model and data access.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m7 9 3 3-3 3M13 15h4" />
      </svg>
    ),
  },
] as const;

/**
 * The focus scan, in seconds: how long one capability stays lit, and how often the whole
 * 01 → 04 pass repeats. The pass is deliberately far shorter than the gap between passes —
 * these are four capabilities being pointed at, not a sequence being stepped through.
 */
const FOCUS = { lit: 0.85, cycle: 10.5 };

/** Motes leaving the gate's edge: start offset, drift, and how often each one goes. */
const MOTES = [
  { sx: "-46%", sy: "-18%", ex: "-135%", ey: "-72%", delay: 0 },
  { sx: "44%", sy: "-30%", ex: "128%", ey: "-96%", delay: 4.2 },
  { sx: "-40%", sy: "26%", ex: "-120%", ey: "84%", delay: 7.6 },
  { sx: "46%", sy: "14%", ex: "132%", ey: "58%", delay: 10.9 },
  { sx: "-8%", sy: "-40%", ex: "-26%", ey: "-128%", delay: 13.4 },
] as const;

function clear(el: HTMLElement | null) {
  if (!el) return;
  el.style.removeProperty("visibility");
  el.style.removeProperty("opacity");
  el.style.removeProperty("transform");
  el.style.removeProperty("filter");
}

export default function SovereignAI() {
  const sectionRef = useRef<HTMLElement>(null);
  const els = useRef<{
    plate: HTMLElement | null;
    atmos: HTMLElement | null;
    portal: HTMLElement | null;
    head: HTMLElement | null;
    intro: HTMLElement | null;
    introTitle: HTMLElement | null;
    introText: HTMLElement | null;
    assure: HTMLElement | null;
    stage: HTMLElement | null;
    links: HTMLElement | null;
    pulse: HTMLElement | null;
    cards: (HTMLElement | null)[];
  }>({
    plate: null,
    atmos: null,
    portal: null,
    head: null,
    intro: null,
    introTitle: null,
    introText: null,
    assure: null,
    stage: null,
    links: null,
    pulse: null,
    cards: [],
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add(
      {
        // Reduced motion gets the section outright: no entrance, no scan, no pulses.
        // Below lg the three-column stage has no room, so the scene falls back to ordinary
        // document flow — but the capability focus scan is layout-independent and still runs.
        reduceMotion: "(prefers-reduced-motion: reduce)",
        camera: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        flow: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const e = els.current;
        const camera = Boolean(context.conditions?.camera);
        const titleLines = e.head ? Array.from(e.head.querySelectorAll<HTMLElement>(".sov-title span")) : [];
        const cards = e.cards.filter(Boolean) as HTMLElement[];

        section.dataset.motion = camera ? "on" : "off";

        if (context.conditions?.reduceMotion) {
          [e.plate, e.atmos, e.portal, e.head, e.intro, ...titleLines, e.introTitle, e.introText, e.assure, ...cards].forEach(clear);
          return;
        }

        // The focus scan only ever points at a capability — it never hides or moves one, and
        // it rests far longer than it runs, so it reads as ambient rather than sequential.
        const setFocus = (index: number) => cards.forEach((card, i) => card.classList.toggle("is-focus", i === index));
        const clearFocus = () => cards.forEach((card) => card.classList.remove("is-focus"));

        // A mote from the gate toward whichever capability is lit, gone by the time it lands.
        const sendPulse = (index: number) => {
          const pulse = e.pulse;
          const links = e.links;
          const stage = e.stage;
          const card = cards[index];
          if (!pulse || !links || !stage || !card) return;
          const frame = links.getBoundingClientRect();
          const from = stage.getBoundingClientRect();
          const to = card.getBoundingClientRect();
          const x0 = from.left + from.width / 2 - frame.left;
          const y0 = from.top + from.height / 2 - frame.top;
          // Aim at the card's inner edge rather than its middle, so nothing crosses the text.
          const x1 = (index < 2 ? to.right : to.left) - frame.left;
          const y1 = to.top + to.height / 2 - frame.top;
          gsap.killTweensOf(pulse);
          gsap.fromTo(
            pulse,
            { x: x0, y: y0, opacity: 0, scale: 0.6 },
            {
              x: x1,
              y: y1,
              scale: 1,
              duration: 1.1,
              ease: "power2.inOut",
              keyframes: { opacity: [0, 0.75, 0.75, 0] },
              onComplete: () => gsap.set(pulse, { opacity: 0 }),
            },
          );
        };

        const scan = gsap.timeline({ repeat: -1, repeatDelay: Math.max(0, FOCUS.cycle - LAYERS.length * FOCUS.lit), paused: true });
        LAYERS.forEach((_, index) => {
          scan.call(
            () => {
              setFocus(index);
              if (camera) sendPulse(index);
            },
            undefined,
            index * FOCUS.lit,
          );
        });
        scan.call(clearFocus, undefined, LAYERS.length * FOCUS.lit);
        scan.to({}, { duration: 0.01 }, LAYERS.length * FOCUS.lit);

        let intro: gsap.core.Timeline | null = null;

        if (camera) {
          // The gate is simply there for as long as the section is — it holds the centre of
          // the frame the whole way through and never fades in or out.
          gsap.set(e.portal, { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: "none" });

          const arriving = [...titleLines, e.introTitle, e.introText, e.assure, ...cards].filter(Boolean) as HTMLElement[];
          gsap.set(arriving, { autoAlpha: 0, y: 22 });
          gsap.set([e.head, e.intro].filter(Boolean), { autoAlpha: 1, y: 0 });

          // One line at a time down the headline, then the proposition, then the capabilities.
          intro = gsap.timeline({ paused: true });
          titleLines.forEach((line, i) => {
            intro!.to(line, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, i * 0.16);
          });
          if (e.introTitle) intro.to(e.introTitle, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.3);
          if (e.introText) intro.to(e.introText, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.46);
          if (e.assure) {
            intro.to(e.assure, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.62);
            intro.call(() => e.assure?.classList.add("is-lit"), undefined, 0.95);
          }
          if (cards.length) intro.to(cards, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.09, ease: "power2.out" }, 0.5);

          // Scroll keeps only a restrained depth drift on the environment.
          const env = [e.plate, e.atmos].filter(Boolean) as HTMLElement[];
          if (env.length) {
            gsap.fromTo(
              env,
              { yPercent: -1.6 },
              { yPercent: 1.6, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
            );
          }
        }

        let started = false;
        const visibility = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (!started) {
                  started = true;
                  intro?.play();
                }
                scan.play();
              } else {
                scan.pause();
              }
            });
          },
          { threshold: 0.15 },
        );
        visibility.observe(section);

        return () => {
          visibility.disconnect();
          scan.kill();
          intro?.kill();
          if (e.pulse) gsap.killTweensOf(e.pulse);
          clearFocus();
          e.assure?.classList.remove("is-lit");
        };
      },
      section,
    );

    return () => media.revert();
  }, []);

  return (
    <section id="sovereign-ai" ref={sectionRef} aria-labelledby="sovereign-heading" data-motion="off" className="sov-scene">
      <div className="sov-viewport">
        {/* A single mote sent toward whichever capability is lit. */}
        <div ref={(el) => void (els.current.links = el)} aria-hidden="true" className="sov-links">
          <span ref={(el) => void (els.current.pulse = el)} className="sov-link-pulse" />
        </div>

        {/* Environment */}
        <div aria-hidden="true" className="sov-env">
          <div ref={(el) => void (els.current.plate = el)} className="sov-grid" />
          <div ref={(el) => void (els.current.atmos = el)} className="sov-atmos" />
          <span className="sov-scan" />
        </div>

        <div className="sov-inner">
          {/* Headline */}
          <div ref={(el) => void (els.current.head = el)} className="sov-head">
            <h2 id="sovereign-heading" className="sov-title">
              <span>Your Data. Your</span>
              <span>Infrastructure.</span>
              <span className="sov-title-accent">Your ai.</span>
            </h2>
          </div>

          {/* The offer */}
          <div ref={(el) => void (els.current.intro = el)} className="sov-intro">
            <h3 ref={(el) => void (els.current.introTitle = el)} className="sov-intro-title">
              Sovereign ai as a Service
            </h3>
            <p ref={(el) => void (els.current.introText = el)} className="sov-intro-text">
              Controlled ai environments engineered around your jurisdiction, private data and governance requirements.
            </p>
            <p ref={(el) => void (els.current.assure = el)} className="sov-assure">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden="true">
                <path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" />
              </svg>
              Intelligence stays where you control it.
            </p>
          </div>

          {/* The gate, given room to breathe */}
          <div ref={(el) => void (els.current.stage = el)} className="sov-stage">
            <span aria-hidden="true" className="sov-aura" />
            <span aria-hidden="true" className="sov-ripple" />
            <span aria-hidden="true" className="sov-ripple sov-ripple-b" />
            <span aria-hidden="true" className="sov-inner-light" />
            {MOTES.map((mote, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="sov-mote"
                style={{ "--sx": mote.sx, "--sy": mote.sy, "--ex": mote.ex, "--ey": mote.ey, animationDelay: `${mote.delay}s` } as CSSProperties}
              />
            ))}
            <span aria-hidden="true" className="sov-sheen">
              <span className="sov-sheen-turn" />
            </span>
            <div ref={(el) => void (els.current.portal = el)} className="sov-portal">
              <Image
                src="/images/sovereign-portal.png"
                alt="The Pragyan enclave gateway"
                width={1117}
                height={1408}
                quality={90}
                sizes="(min-width: 1024px) 28vw, 62vw"
                className="sov-portal-img"
              />
            </div>
          </div>

          {/* Data → Models → Compute → Applications */}
          <ul className="sov-layers" aria-label="Sovereign ai capabilities">
            {LAYERS.map((layer, i) => (
              <li key={layer.number} ref={(el) => void (els.current.cards[i] = el)} className="sov-card" data-slot={i}>
                <div className="sov-card-top">
                  <p className="sov-card-tag">
                    <span aria-hidden="true" className="sov-card-dot" />
                    {layer.number}
                  </p>
                  <span aria-hidden="true" className="sov-card-icon">
                    {layer.icon}
                  </span>
                </div>
                <h3 className="sov-card-title">{layer.title}</h3>
                <p className="sov-card-text">{layer.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
