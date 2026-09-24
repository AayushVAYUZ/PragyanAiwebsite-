"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 09 — Sovereign AI. A scroll-driven enclave blueprint.
 *
 * The scene is a pure function of scroll progress written straight to the DOM, so
 * React never re-renders while the camera moves. Reveals are CUMULATIVE: each layer
 * arrives, settles on its own anchor and stays for the rest of the scene — nothing
 * is removed because the next layer appeared.
 *
 * Copy is transcribed from the approved Stitch screen. Three strings from that screen
 * are deliberately left out because they assert operational state that is not real:
 * a live latency/drift readout, a physical coordinate, and a security attestation.
 */

const LAYERS = [
  {
    tag: "Layer 01 / Ingestion",
    title: "Data Ingestion & Knowledge Core",
    text: "Strict jurisdictional data residency with private vectorized enterprise memory, immutable audit logs and zero telemetry loops.",
    meta: "Residency: EU / US / SG / IN",
    stat: "100% Air-Isolated",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true">
        <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
        <path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
        <path d="M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
      </svg>
    ),
  },
  {
    tag: "Layer 02 / Models",
    title: "Proprietary Model Training",
    text: "Isolated parameter weights and sovereign fine-tuning. Model weights remain exclusive corporate intellectual property.",
    meta: "Weight encryption: AES-256",
    stat: "100% Client IP",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true">
        <rect x="7.5" y="7.5" width="9" height="9" rx="1.5" />
        <path d="M10.5 4V2M13.5 4V2M10.5 22v-2M13.5 22v-2M4 10.5H2M4 13.5H2M22 10.5h-2M22 13.5h-2" />
      </svg>
    ),
  },
  {
    tag: "Layer 03 / Silicon",
    title: "Dedicated Compute Fabric",
    text: "Single-tenant accelerated clusters and dedicated private silicon. Hardware partitions isolated from multitenant fabrics.",
    meta: "Chips: H100 / H200 / B200",
    stat: "Single Tenant",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
      </svg>
    ),
  },
  {
    tag: "Layer 04 / Runtime",
    title: "Secure Model Serving & Apps",
    text: "Localized inference gateways with zero token exposure, confidential enclave tokenization and air-tight APIs.",
    meta: "API: enclave guest mTLS",
    stat: "Isolated Runtime",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m7 9 3 3-3 3M13 15h4" />
      </svg>
    ),
  },
] as const;

/** Four stations that ride the orbit, each holding its own bearing around the gate. */
const ORBIT = [
  { label: "000° Prime Vector / Zero Leak", angle: 0 },
  { label: "090° Zenith / Topology ISO", angle: 90 },
  { label: "180° Azimuth / Boundary Lock", angle: 180 },
  { label: "270° Nadir / Encryption Valid", angle: 270 },
] as const;

const TOPOLOGY = ["On-Premises", "Region-Locked Cloud", "Hybrid Orchestration", "Air-Gapped"] as const;
const ASSURANCES = ["Zero-Trust Attribution", "Confidential Compute", "Model Weight Lock"] as const;

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

export default function SovereignAI() {
  const sectionRef = useRef<HTMLElement>(null);
  const els = useRef<{
    plate: HTMLElement | null;
    atmos: HTMLElement | null;
    portal: HTMLElement | null;
    orbit: HTMLElement | null;
    spin: HTMLElement | null;
    nodes: (HTMLElement | null)[];
    head: HTMLElement | null;
    intro: HTMLElement | null;
    cards: (HTMLElement | null)[];
    bar: HTMLElement | null;
  }>({
    plate: null,
    atmos: null,
    portal: null,
    orbit: null,
    spin: null,
    nodes: [],
    head: null,
    intro: null,
    cards: [],
    bar: null,
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add(
      {
        // The camera needs the room the three-column blueprint asks for. Anywhere else —
        // narrow screens, reduced motion — the scene collapses to ordinary document flow,
        // so nothing can be left stranded invisible.
        camera: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        flow: "(max-width: 1023.98px), (prefers-reduced-motion: reduce)",
      },
      (context) => {
        const e = els.current;

        if (!context.conditions?.camera) {
          section.dataset.motion = "off";
          [e.plate, e.atmos, e.portal, e.orbit, e.head, e.intro, e.bar, ...e.cards].forEach(clear);
          e.spin?.style.removeProperty("transform");
          e.nodes.forEach((n) => n?.style.removeProperty("transform"));
          return;
        }

        section.dataset.motion = "on";

        const frame = (p: number) => {
          // Environment: a slow push so the enclave is never static.
          write(e.plate, { y: (p - 0.5) * -70, s: lerp(1.06, 1.2, p), o: 1 });
          write(e.atmos, { x: (p - 0.5) * 70, s: lerp(1, 1.18, p), o: lerp(0.45, 0.95, p) });

          // Headline and intro arrive first and stay for the whole scene.
          const headIn = smoothstep(0, 0.09, p);
          write(e.head, { y: lerp(44, 0, headIn) - p * 22, o: headIn, blur: lerp(7, 0, headIn) });
          const introIn = smoothstep(0.05, 0.16, p);
          write(e.intro, { y: lerp(38, 0, introIn) - p * 16, o: introIn, blur: lerp(6, 0, introIn) });

          // The gate rises out of depth, then holds station at the centre.
          const portalIn = smoothstep(0.08, 0.26, p);
          write(e.portal, {
            y: lerp(80, 0, portalIn),
            s: lerp(0.8, 1, portalIn) * lerp(1, 1.05, p),
            o: portalIn,
            blur: lerp(10, 0, portalIn),
          });

          // The orbit revolves continuously as the frame is scrolled, carrying its four
          // stations around the gate. Each node is counter-rotated so its label stays level.
          const spin = p * 300;
          write(e.orbit, { s: lerp(0.82, 1.03, portalIn), o: portalIn * 0.95 });
          if (e.spin) e.spin.style.transform = `rotate(${spin.toFixed(2)}deg)`;
          e.nodes.forEach((node, i) => {
            if (!node) return;
            node.style.transform = `rotate(${(-spin - ORBIT[i].angle).toFixed(2)}deg)`;
            // The label always sits on the far side of its dot, so it reads outside the
            // ring instead of crossing the gate as the station swings past the bottom.
            const bearing = (((spin + ORBIT[i].angle) % 360) + 360) % 360;
            const side = bearing > 90 && bearing < 270 ? "down" : "up";
            if (node.dataset.side !== side) node.dataset.side = side;
          });

          // The four layers arrive one per scroll beat and REMAIN. Once a layer has settled
          // on its anchor nothing takes it away — the blueprint accumulates.
          const FROM = 0.28;
          const SPAN = 0.14;
          LAYERS.forEach((_, i) => {
            const start = FROM + i * SPAN;
            const arrived = smoothstep(start, start + SPAN * 0.78, p);
            // Older layers settle back a little as newer ones land, but never leave.
            const settled = smoothstep(start + SPAN, start + SPAN * 3.2, p);
            write(e.cards[i], {
              x: lerp(i < 2 ? -56 : 56, 0, arrived),
              y: lerp(46, 0, arrived),
              s: lerp(0.94, 1, arrived) * lerp(1, 0.975, settled),
              o: arrived * lerp(1, 0.7, settled),
              blur: lerp(7, 0, arrived),
            });
          });

          // The deployment bar closes the blueprint.
          const barIn = smoothstep(0.84, 0.95, p);
          write(e.bar, { y: lerp(40, 0, barIn), o: barIn, blur: lerp(5, 0, barIn) });
        };

        frame(0);
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => frame(self.progress),
          onRefresh: (self) => frame(self.progress),
        });

        return () => trigger.kill();
      },
      section,
    );

    return () => media.revert();
  }, []);

  return (
    <section
      id="sovereign-ai"
      ref={sectionRef}
      aria-labelledby="sovereign-heading"
      data-motion="off"
      className="sov-scene"
    >
      <div className="sov-viewport">
        {/* Environment */}
        <div aria-hidden="true" className="sov-env">
          <div ref={(el) => void (els.current.plate = el)} className="sov-grid" />
          <div ref={(el) => void (els.current.atmos = el)} className="sov-atmos" />
        </div>

        <div className="sov-inner">
          {/* Headline */}
          <div ref={(el) => void (els.current.head = el)} className="sov-head">
            <p className="sov-eyebrow">
              <span aria-hidden="true" className="sov-dot" />
              System stage: active
              <span className="sov-eyebrow-sep">Air-gap isolation</span>
            </p>
            <h2 id="sovereign-heading" className="sov-title">
              <span>Your Data. Your</span>
              <span>Infrastructure.</span>
              <span className="sov-title-accent">Your AI.</span>
            </h2>
          </div>

          {/* Intro */}
          <div ref={(el) => void (els.current.intro = el)} className="sov-intro">
            <p className="sov-intro-text">
              Sovereign AI as a Service — controlled AI environments engineered precisely around your jurisdiction,
              private data corpus, isolated hardware topology and legal governance mandates.
            </p>
            <p className="sov-assure">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden="true">
                <path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" />
              </svg>
              Intelligence stays where you control it.
            </p>
          </div>

          {/* The gate and its revolving orbit */}
          <div className="sov-stage">
            <div ref={(el) => void (els.current.orbit = el)} aria-hidden="true" className="sov-orbit">
              <span className="sov-ring sov-ring-outer" />
              <span className="sov-ring sov-ring-inner" />
              <div ref={(el) => void (els.current.spin = el)} className="sov-spin">
                {ORBIT.map((o, i) => (
                  <span key={o.label} className="sov-station" style={{ transform: `rotate(${o.angle}deg)` }}>
                    <span ref={(el) => void (els.current.nodes[i] = el)} className="sov-node">
                      <span className="sov-node-dot" />
                      <span className="sov-node-label">{o.label}</span>
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <div ref={(el) => void (els.current.portal = el)} className="sov-portal">
              <Image
                src="/images/sovereign-portal.png"
                alt="The Pragyan enclave gateway, sealed"
                width={1117}
                height={1408}
                quality={90}
                sizes="(min-width: 1024px) 28vw, 62vw"
                className="sov-portal-img"
              />
              <span className="sov-portal-chip">Portal active</span>
              <span className="sov-portal-seal">Enclave sealed</span>
            </div>
          </div>

          {/* Flow-mode readout of the orbit bearings, so their text survives without the camera */}
          <ul className="sov-stations-flow" aria-label="Isolation bearings">
            {ORBIT.map((o) => (
              <li key={o.label}>{o.label}</li>
            ))}
          </ul>

          {/* The four enclave layers — each settles and stays */}
          <ul className="sov-layers" aria-label="Enclave layers">
            {LAYERS.map((layer, i) => (
              <li key={layer.tag} ref={(el) => void (els.current.cards[i] = el)} className="sov-card" data-slot={i}>
                <div className="sov-card-top">
                  <p className="sov-card-tag">
                    <span aria-hidden="true" className="sov-card-dot" />
                    {layer.tag}
                  </p>
                  <span aria-hidden="true" className="sov-card-icon">
                    {layer.icon}
                  </span>
                </div>
                <h3 className="sov-card-title">{layer.title}</h3>
                <p className="sov-card-text">{layer.text}</p>
                <p className="sov-card-meta">
                  <span>{layer.meta}</span>
                  <span className="sov-card-stat">{layer.stat}</span>
                </p>
              </li>
            ))}
          </ul>

          {/* Deployment topology */}
          <div ref={(el) => void (els.current.bar = el)} className="sov-bar">
            <div className="sov-bar-group">
              <p className="sov-bar-label">Deployment topology</p>
              <ul className="sov-chips">
                {TOPOLOGY.map((t) => (
                  <li key={t} className="sov-chip">
                    <span aria-hidden="true" className="sov-chip-dot" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <ul className="sov-assurances">
              {ASSURANCES.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            {/* No destination exists for this yet, so it is text, not a link. */}
            <p className="sov-cta">
              <span>Explore Sovereign AI</span>
              <span aria-hidden="true">→</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
