"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame — ai Droplets. Make legacy intelligent.
 *
 * Composition follows the approved Stitch screen: a narrative column on the left and a
 * wide visual stage on the right, with the droplets pinned over the architecture render.
 *
 * The scene carries no operational readouts. The Stitch screen surrounds this with
 * coordinates, an enclave host, a kernel version, a runtime build, a compliance
 * certification and a live latency ticker that randomises itself every 2.4 seconds —
 * all of it reads as a live monitoring dashboard, which this is not. The proposition
 * and the fourteen droplets carry the frame on their own.
 *
 * The scene assembles once the section is on screen; nothing is tied to scroll position.
 */

/** Where each droplet sits over the render, and which side of it the label hangs. */
interface Droplet {
  n: string;
  name: string;
  pos: CSSProperties;
  side: "left" | "right";
  key: boolean;
}

const DROPLETS: Droplet[] = [
  // Ten, renumbered in place. The reference's fourteen carried four near-duplicates —
  // Enterprise Search beside Intelligent Search, Knowledge beside Document Intelligence,
  // Decision Support beside Predictive Insights, Workflow beside Automation.
  { n: "01", name: "Meeting Intelligence", pos: { top: "5%", left: "6%" }, side: "right", key: false },
  { n: "02", name: "Document Intelligence", pos: { top: "5%", right: "6%" }, side: "left", key: false },
  { n: "03", name: "Intelligent Search", pos: { top: "20%", left: "10%" }, side: "right", key: false },
  { n: "04", name: "Recommendation Engine", pos: { top: "22%", right: "7%" }, side: "left", key: false },
  { n: "05", name: "ai Copilot", pos: { top: "42%", left: "3%" }, side: "right", key: true },
  { n: "06", name: "Predictive Insights", pos: { top: "44%", right: "5%" }, side: "left", key: true },
  { n: "07", name: "Data Intelligence", pos: { top: "64%", left: "7%" }, side: "right", key: true },
  { n: "08", name: "Invoice Intelligence", pos: { top: "66%", right: "8%" }, side: "left", key: false },
  { n: "09", name: "Automation", pos: { bottom: "6%", left: "14%" }, side: "right", key: true },
  { n: "10", name: "Predictive Maintenance", pos: { bottom: "6%", right: "16%" }, side: "left", key: false },
];


/** The ambient scan: how long one droplet stays lit, and the gap before the pass repeats. */
const FOCUS = { lit: 0.7, cycle: 16 };

/** These labels are set in uppercase by the design, so "ai" is opted out of the
 * transform — the same treatment the header gives "Ask P.ai". */
function keepAiLowercase(text: string) {
  return text.split(/\b(ai)\b/g).map((part, i) =>
    part === "ai" ? (
      <span key={i} className="normal-case">
        ai
      </span>
    ) : (
      part
    ),
  );
}

function clear(el: HTMLElement | null) {
  if (!el) return;
  el.style.removeProperty("visibility");
  el.style.removeProperty("opacity");
  el.style.removeProperty("transform");
  el.style.removeProperty("filter");
}

export default function AiDroplets() {
  const sectionRef = useRef<HTMLElement>(null);
  const [picked, setPicked] = useState<string | null>(null);
  // Which droplet the ambient scan is pointing at. A reader's pick outranks it.
  const [scanned, setScanned] = useState<string | null>(null);

  const els = useRef<{
    atmos: HTMLElement | null;
    head: HTMLElement | null;
    equation: HTMLElement | null;
    quote: HTMLElement | null;
    cta: HTMLElement | null;
    stage: HTMLElement | null;
    plate: HTMLElement | null;
    markers: (HTMLElement | null)[];
  }>({ atmos: null, head: null, equation: null, quote: null, cta: null, stage: null, plate: null, markers: [] });

  // A reader's choice outranks the ambient scan, so hold it until they pick another.
  const choose = useCallback((n: string) => setPicked((prev) => (prev === n ? null : n)), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add(
      {
        // Reduced motion gets the section outright: no entrance, no scan.
        // Below lg the two-column stage has no room, so the scene falls back to flow.
        reduceMotion: "(prefers-reduced-motion: reduce)",
        camera: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        flow: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const e = els.current;
        const camera = Boolean(context.conditions?.camera);
        const markers = e.markers.filter(Boolean) as HTMLElement[];

        section.dataset.motion = camera ? "on" : "off";

        if (context.conditions?.reduceMotion) {
          [e.atmos, e.head, e.equation, e.quote, e.cta, e.stage, e.plate, ...markers].forEach(clear);
          return;
        }

        const arriving = [e.head, e.equation, e.quote, e.cta, e.stage].filter(Boolean) as HTMLElement[];
        gsap.set(arriving, { autoAlpha: 0, y: 26 });
        if (camera) gsap.set(markers, { autoAlpha: 0, scale: 0.7 });
        gsap.set(e.plate, { scale: 1.06 });

        const intro = gsap.timeline({ paused: true });
        if (e.head) intro.to(e.head, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0);
        if (e.stage) intro.to(e.stage, { autoAlpha: 1, y: 0, duration: 0.85, ease: "power2.out" }, 0.1);
        if (e.equation) intro.to(e.equation, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.34);
        if (e.quote) intro.to(e.quote, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.46);
        if (e.cta) intro.to(e.cta, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.58);
        // The droplets settle onto the architecture once the stage is there.
        if (camera && markers.length) {
          intro.to(markers, { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.045, ease: "back.out(1.7)" }, 0.5);
        }

        // The scan only ever points at a droplet — it never hides or moves one, and it
        // rests far longer than it runs, so it reads as ambient rather than sequential.
        const scan = gsap.timeline({
          repeat: -1,
          repeatDelay: Math.max(0, FOCUS.cycle - DROPLETS.length * FOCUS.lit),
          paused: true,
        });
        DROPLETS.forEach((d) => {
          scan.call(() => setScanned(d.n), undefined, `+=${FOCUS.lit}`);
        });
        scan.call(() => setScanned(null), undefined, `+=${FOCUS.lit}`);

        // Scroll keeps only a restrained depth drift on the environment and the render.
        const drift = [e.atmos, e.plate].filter(Boolean) as HTMLElement[];
        if (drift.length) {
          gsap.fromTo(
            drift,
            { yPercent: -1.6 },
            { yPercent: 1.6, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }

        let started = false;
        const visibility = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !started) {
                started = true;
                intro.play();
                scan.play();
              }
            });
          },
          { threshold: 0.15 },
        );
        visibility.observe(section);

        return () => {
          visibility.disconnect();
          intro.kill();
          scan.kill();
        };
      },
      section,
    );

    return () => media.revert();
  }, []);

  const lit = picked ?? scanned;

  return (
    <section
      id="ai-droplets"
      ref={sectionRef}
      aria-labelledby="ai-droplets-heading"
      data-motion="off"
      className="drop-scene"
    >
      <div aria-hidden="true" className="drop-env">
        <div ref={(el) => void (els.current.atmos = el)} className="drop-atmos" />
      </div>

      <div className="drop-inner">
        {/* Narrative */}
        <div className="drop-narrative">
          <div ref={(el) => void (els.current.head = el)} className="drop-head">
            <p className="drop-eyebrow">
              <span aria-hidden="true" className="drop-dot" />
              {keepAiLowercase("ai Droplets — Modular Intelligence")}
            </p>
            <h2 id="ai-droplets-heading" className="drop-title">
              <span>Make Legacy</span>
              <span className="drop-title-accent">Intelligent.</span>
            </h2>
            <p className="drop-lead">
              Embed ai directly into the products, platforms and systems you already run. No architecture overhaul.
              No operational downtime.
            </p>
          </div>

          <div ref={(el) => void (els.current.equation = el)} className="drop-equation">
            <p className="drop-equation-label">Architectural augmentation</p>
            <p className="drop-equation-row">
              <span className="drop-term">Legacy systems</span>
              <span aria-hidden="true" className="drop-op">+</span>
              <span className="drop-term drop-term--accent">
                <span aria-hidden="true" className="drop-term-mark" />
                {DROPLETS.length} ai droplets
              </span>
              <span aria-hidden="true" className="drop-op drop-op--cyan">=</span>
              <span className="drop-term drop-term--result">Intelligent core</span>
            </p>
          </div>

          <blockquote ref={(el) => void (els.current.quote = el)} className="drop-quote">
            <p>Don&rsquo;t rebuild what already works. Make it intelligent.</p>
          </blockquote>

          {/* No destination exists for this yet, so it is text, not a link. */}
          <p ref={(el) => void (els.current.cta = el)} className="drop-cta">
            <span>{keepAiLowercase("Explore ai Droplets")}</span>
            <span aria-hidden="true">→</span>
          </p>
        </div>

        {/* Visual stage */}
        <div ref={(el) => void (els.current.stage = el)} className="drop-stage">
          <div className="drop-plate-frame">
            <div ref={(el) => void (els.current.plate = el)} className="drop-plate">
              <Image
                src="/images/ai-droplets-core.jpg"
                alt="A luminous droplet capsule suspended above a dark server and chip architecture, circuit traces spreading outward from it"
                fill
                sizes="(min-width: 1024px) 62vw, 100vw"
                className="drop-plate-img"
              />
            </div>
            <div aria-hidden="true" className="drop-plate-scrim" />

            {/* The droplets, pinned over the architecture */}
            <ul className="drop-markers" aria-label="ai Droplets">
              {DROPLETS.map((d, i) => (
                <li
                  key={d.n}
                  ref={(el) => void (els.current.markers[i] = el)}
                  className="drop-marker"
                  style={d.pos}
                  data-side={d.side}
                  data-key={d.key ? "" : undefined}
                  data-lit={lit === d.n ? "" : undefined}
                >
                  <button type="button" className="drop-marker-btn" onClick={() => choose(d.n)} aria-pressed={picked === d.n}>
                    <span aria-hidden="true" className="drop-bead">
                      <span className="drop-bead-core" />
                    </span>
                    <span className="drop-tag">
                      <span aria-hidden="true" className="drop-tag-dot" />
                      {d.n} / {keepAiLowercase(d.name)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
