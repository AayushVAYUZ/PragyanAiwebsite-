"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BACKGROUND = { width: 1690, height: 931 };
/** Core star of the crystal in capabilities-background.png (measured: brightest point of the core). */
const CORE_EMISSION = { x: 636, y: 472 };

const ICON_PROPS = { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true } as const;

/**
 * Frame 08 — Services. The eight service lines, named exactly as the source deck states them.
 * This is a catalogue, not a process: the order carries no dependency between entries.
 */
const SERVICES: { number: string; title: string; icon: ReactNode }[] = [
  {
    number: "01",
    title: "Agentic ai & Enterprise Automation",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <rect height="9" rx="1.5" width="9" x="7.5" y="7.5" />
        <path d="M10.5 4V2M13.5 4V2M10.5 22v-2M13.5 22v-2M4 10.5H2M4 13.5H2M22 10.5h-2M22 13.5h-2M7.5 4.5h9M7.5 19.5h9M4.5 7.5v9M19.5 7.5v9" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "ai Strategy & Transformation",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <circle cx="12" cy="12" r="9" />
        <polygon points="15.6 8.4 13.4 13.4 8.4 15.6 10.6 10.6 15.6 8.4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Knowledge & Data Intelligence",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
        <path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
        <path d="M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Predictive & Decision Intelligence",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <polyline points="3 16.5 9 10.5 13 14.5 21 6.5" />
        <polyline points="21 11 21 6.5 16.5 6.5" />
        <line x1="3" x2="3" y1="20.5" y2="3.5" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Custom ai & LLM Engineering",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <polyline points="8 7 3.5 12 8 17" />
        <polyline points="16 7 20.5 12 16 17" />
        <line x1="13.5" x2="10.5" y1="5.5" y2="18.5" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Multimodal ai Analysis",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <polygon points="12 3 21 7.5 12 12 3 7.5 12 3" />
        <polyline points="3 12.5 12 17 21 12.5" />
        <polyline points="3 16.5 12 21 21 16.5" />
      </svg>
    ),
  },
  {
    number: "07",
    title: "ai Droplets & Embedded Intelligence",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <path d="M12 3.5c3.2 3.6 5.5 6.4 5.5 9a5.5 5.5 0 0 1-11 0c0-2.6 2.3-5.4 5.5-9z" />
        <path d="M9.5 13.5a2.5 2.5 0 0 0 2.5 2.5" />
      </svg>
    ),
  },
  {
    number: "08",
    title: "Sovereign ai Infrastructure & Governance",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <path d="M12 2.8 4.5 6v6c0 4.3 3.1 7.9 7.5 9.2 4.4-1.3 7.5-4.9 7.5-9.2V6z" />
        <polyline points="9 12 11.3 14.3 15.5 10" />
      </svg>
    ),
  },
];

/**
 * When the section comes into view, in seconds. The entrance runs once; the scan then walks
 * 01 → 08 on repeat, resting for `loopGap` between passes with every card left readable.
 */
const SERVICE_TIMELINE = {
  heading: 0.5,
  support: 1.0,
  cards: 1.2,
  firstService: 1.5,
  serviceStep: 0.9,
  activeHold: 0.9,
  loopGap: 2.6,
};

/** The network the background runs on: long, shallow links rather than rays from the core. */
const STREAMS = [
  { d: "M -120 296 C 320 254, 720 338, 1560 244", direction: 1 },
  { d: "M -120 468 C 360 448, 820 502, 1560 424", direction: -1 },
  { d: "M -120 622 C 300 664, 800 598, 1560 690", direction: 1 },
  { d: "M -120 766 C 420 796, 940 716, 1560 802", direction: -1 },
];
const STREAM_VIEW = { width: 1440, height: 900 };

/** Two travelling motes per link; each fades in and out across its run rather than looping visibly. */
const MOTES = [
  { stream: 0, offset: 0, speed: 1, size: 1.9, alpha: 0.5, color: "#9FD8FF" },
  { stream: 0, offset: 0.55, speed: 1, size: 1.3, alpha: 0.36, color: "#C9A6FF" },
  { stream: 1, offset: 0.2, speed: 0.86, size: 2.1, alpha: 0.46, color: "#C9A6FF" },
  { stream: 1, offset: 0.72, speed: 0.86, size: 1.4, alpha: 0.32, color: "#9FD8FF" },
  { stream: 2, offset: 0.1, speed: 1.12, size: 1.7, alpha: 0.42, color: "#8FB6FF" },
  { stream: 2, offset: 0.62, speed: 1.12, size: 1.2, alpha: 0.3, color: "#9FD8FF" },
  { stream: 3, offset: 0.35, speed: 0.94, size: 1.8, alpha: 0.38, color: "#C9A6FF" },
  { stream: 3, offset: 0.85, speed: 0.94, size: 1.2, alpha: 0.28, color: "#8FB6FF" },
];
/** Below lg only the first four run, so narrow screens stay quiet. */
const COMPACT_MOTES = 4;

const STAR_FIELD = [
  { x: 6, y: 14, size: 1.6, base: 0.34, delay: 0 },
  { x: 14, y: 42, size: 1.2, base: 0.26, delay: 1.4 },
  { x: 21, y: 8, size: 1.4, base: 0.3, delay: 2.6 },
  { x: 29, y: 63, size: 1.2, base: 0.22, delay: 0.8 },
  { x: 36, y: 26, size: 1.8, base: 0.36, delay: 3.2 },
  { x: 44, y: 78, size: 1.2, base: 0.24, delay: 1.9 },
  { x: 52, y: 17, size: 1.5, base: 0.3, delay: 4.1 },
  { x: 58, y: 54, size: 1.2, base: 0.22, delay: 2.2 },
  { x: 66, y: 31, size: 1.7, base: 0.34, delay: 0.5 },
  { x: 73, y: 71, size: 1.3, base: 0.26, delay: 3.6 },
  { x: 79, y: 12, size: 1.5, base: 0.3, delay: 1.1 },
  { x: 86, y: 48, size: 1.2, base: 0.24, delay: 4.6 },
  { x: 92, y: 24, size: 1.6, base: 0.32, delay: 2.9 },
  { x: 96, y: 66, size: 1.2, base: 0.22, delay: 0.3 },
  { x: 11, y: 86, size: 1.3, base: 0.24, delay: 3.9 },
  { x: 48, y: 92, size: 1.2, base: 0.2, delay: 1.6 },
];

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const background = section.querySelector<HTMLElement>("[data-service-background]");
    const coreLayers = Array.from(section.querySelectorAll<HTMLElement>("[data-service-core]"));
    const starLayer = section.querySelector<HTMLElement>("[data-service-stars]");
    const streamPaths = Array.from(section.querySelectorAll<SVGPathElement>("[data-service-stream]"));
    const pulsePaths = Array.from(section.querySelectorAll<SVGPathElement>("[data-service-pulse]"));
    const moteEls = Array.from(section.querySelectorAll<SVGCircleElement>("[data-service-mote]"));
    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-service-card]"));
    const headingEl = section.querySelector<HTMLElement>("[data-service-heading]");
    const labelEl = section.querySelector<HTMLElement>("[data-service-label]");
    const supportEl = section.querySelector<HTMLElement>("[data-service-support]");
    const cardGrid = section.querySelector<HTMLElement>("[data-service-grid]");

    const streamLengths = streamPaths.map((path) => path.getTotalLength());
    streamPaths.forEach((path, index) => {
      const pulse = pulsePaths[index];
      if (pulse) pulse.style.strokeDasharray = `110 ${streamLengths[index] + 240}`;
    });

    /** The core sits at a fixed point of the artwork, so it has to be placed through the cover crop. */
    const placeCore = () => {
      if (!background || !coreLayers.length) return;
      const box = background.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const scale = Math.max(box.width / BACKGROUND.width, box.height / BACKGROUND.height);
      const x = (box.width - BACKGROUND.width * scale) / 2 + CORE_EMISSION.x * scale;
      const y = (box.height - BACKGROUND.height * scale) / 2 + CORE_EMISSION.y * scale;
      coreLayers.forEach((layer) => {
        layer.style.left = `${x.toFixed(1)}px`;
        layer.style.top = `${y.toFixed(1)}px`;
      });
    };
    placeCore();
    const resizeObserver = new ResizeObserver(placeCore);
    if (background) resizeObserver.observe(background);

    const setActive = (index: number) => {
      cards.forEach((card, i) => card.classList.toggle("is-active", i === index));
    };
    const clearActive = () => cards.forEach((card) => card.classList.remove("is-active"));

    /** One soft crest down a link — the background acknowledging that another service is lit. */
    const firePulse = (streamIndex: number) => {
      const pulse = pulsePaths[streamIndex % pulsePaths.length];
      if (!pulse) return;
      const length = streamLengths[streamIndex % streamLengths.length];
      const travel = { v: 0 };
      gsap.killTweensOf(travel);
      gsap.to(travel, {
        v: 1,
        duration: 3,
        ease: "none",
        overwrite: true,
        onUpdate: () => {
          pulse.style.strokeDashoffset = `${(-travel.v * (length + 240)).toFixed(1)}`;
          pulse.style.opacity = `${(Math.sin(Math.PI * travel.v) * 0.5).toFixed(3)}`;
        },
        onComplete: () => {
          pulse.style.opacity = "0";
        },
      });
    };

    const media = gsap.matchMedia();
    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        roomy: "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
        compact: "(prefers-reduced-motion: no-preference) and (max-width: 1023px)",
      },
      (context) => {
        // Reduced motion: the heading and all eight services are simply there, background still.
        if (context.conditions?.reduceMotion) {
          gsap.set([labelEl, headingEl, supportEl, cardGrid].filter(Boolean), { autoAlpha: 1, y: 0 });
          return;
        }

        const roomy = Boolean(context.conditions?.roomy);
        const activeMotes = roomy ? moteEls.length : Math.min(COMPACT_MOTES, moteEls.length);
        moteEls.forEach((mote, index) => {
          mote.style.display = index < activeMotes ? "" : "none";
        });

        gsap.set([labelEl, headingEl, supportEl].filter(Boolean), { autoAlpha: 0, y: 18 });
        gsap.set(cardGrid, { autoAlpha: 0, y: 16 });

        // Stars drift a few pixels across the whole section — depth, not a screensaver.
        if (starLayer) {
          const drift = roomy ? 6 : 3;
          gsap.fromTo(
            starLayer,
            { y: -drift },
            { y: drift, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }

        // Motes travel their link continuously, fading in and out so they read as intermittent.
        const drift = { t: 0 };
        const driftLoop = gsap.to(drift, {
          t: 1,
          duration: 30,
          ease: "none",
          repeat: -1,
          paused: true,
          onUpdate: () => {
            for (let i = 0; i < activeMotes; i += 1) {
              const mote = MOTES[i];
              const el = moteEls[i];
              const path = streamPaths[mote.stream];
              if (!el || !path) continue;
              const cycle = (((drift.t * mote.speed + mote.offset) % 1) + 1) % 1;
              // Links run in both directions, so half the motes travel against the read order.
              const along = STREAMS[mote.stream].direction < 0 ? 1 - cycle : cycle;
              const point = path.getPointAtLength(along * streamLengths[mote.stream]);
              el.setAttribute("cx", point.x.toFixed(1));
              el.setAttribute("cy", point.y.toFixed(1));
              el.style.opacity = `${(Math.sin(Math.PI * cycle) ** 2 * mote.alpha).toFixed(3)}`;
            }
          },
        });

        // The entrance plays once: label, heading, supporting line, then the grid as one block
        // so no service is introduced ahead of any other.
        const { heading, support, cards: cardsAt, firstService, serviceStep, activeHold, loopGap } = SERVICE_TIMELINE;
        const intro = gsap.timeline({ paused: true });
        if (labelEl) intro.to(labelEl, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, heading - 0.2);
        if (headingEl) intro.to(headingEl, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, heading);
        if (supportEl) intro.to(supportEl, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, support);
        if (cardGrid) intro.to(cardGrid, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, cardsAt);

        // The scan keeps running: it walks 01 → 08, rests, and starts over. Every card stays
        // visible the whole time — only which one is lit changes.
        const scanSpan = (SERVICES.length - 1) * serviceStep + activeHold;
        const scan = gsap.timeline({ repeat: -1, repeatDelay: loopGap, paused: true, delay: firstService });
        SERVICES.forEach((_, index) => {
          scan.call(
            () => {
              setActive(index);
              firePulse(index);
            },
            undefined,
            index * serviceStep,
          );
        });
        // The catalogue returns to its calm state between passes.
        scan.call(clearActive, undefined, scanSpan);
        scan.to({}, { duration: 0.01 }, scanSpan);

        // Entrance plays once and is never re-armed by scrolling; the scan and the ambient
        // drift resume where they left off, and both idle while the section is off screen.
        let started = false;
        const visibility = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                if (!started) {
                  started = true;
                  intro.play();
                }
                driftLoop.play();
                scan.play();
              } else {
                driftLoop.pause();
                scan.pause();
              }
            });
          },
          { threshold: 0.2 },
        );
        visibility.observe(section);

        return () => {
          visibility.disconnect();
          driftLoop.kill();
          intro.kill();
          scan.kill();
          gsap.killTweensOf(pulsePaths);
          clearActive();
        };
      },
      section,
    );

    return () => {
      resizeObserver.disconnect();
      media.revert();
    };
  }, []);

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      aria-labelledby="capabilities-heading"
      className="relative isolate min-h-[clamp(40rem,calc(var(--svh)*100),46rem)] overflow-hidden"
    >
      {/* Crystalline intelligence environment (artwork unchanged) */}
      <div data-service-background className="absolute inset-0">
        <Image
          src="/images/capabilities-background.png"
          alt="A crystalline intelligence core emitting coherent rays of light to the right"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-center opacity-80"
        />
      </div>

      {/* Nebula: breathing rather than animated */}
      <div aria-hidden="true" className="service-nebula pointer-events-none absolute inset-0" />

      {/* Star field: a few pixels of parallax, no more */}
      <div data-service-stars aria-hidden="true" className="pointer-events-none absolute inset-0">
        {STAR_FIELD.map((star, index) => (
          <span
            key={index}
            className="service-star absolute rounded-full bg-white"
            style={
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
                "--star-base": star.base,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* Ambient core: an intelligence environment behind the catalogue, not its source */}
      <div
        data-service-core
        aria-hidden="true"
        className="service-core-ring pointer-events-none absolute h-[520px] w-[520px] rounded-full opacity-45"
      />
      <div
        data-service-core
        aria-hidden="true"
        className="service-core-glow pointer-events-none absolute h-[380px] w-[380px] rounded-full"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[rgba(3,4,10,0.36)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[var(--void-black)] via-[var(--void-black)]/60 to-transparent md:w-[65%]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--void-black)] via-transparent to-[var(--void-black)]/70" />
      <div aria-hidden="true" className="capability-cyan-tint pointer-events-none absolute inset-0" />

      {/* The intelligence network: slow links with a few travelling motes, and the pulse that
          answers each service as it lights. Sits under the grading so it never competes. */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${STREAM_VIEW.width} ${STREAM_VIEW.height}`}
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
      >
        <defs>
          <linearGradient id="service-stream-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={STREAM_VIEW.width} y2="0">
            <stop offset="0%" stopColor="#8B2DFF" stopOpacity="0.16" />
            <stop offset="45%" stopColor="#5B7BFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#26C6FF" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="service-pulse-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={STREAM_VIEW.width} y2="0">
            <stop offset="0%" stopColor="#C9A6FF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#9FD8FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#26C6FF" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {STREAMS.map((stream, index) => (
          <path key={`s-${index}`} data-service-stream d={stream.d} fill="none" stroke="url(#service-stream-line)" strokeWidth="1" />
        ))}
        {STREAMS.map((stream, index) => (
          <path
            key={`p-${index}`}
            data-service-pulse
            d={stream.d}
            fill="none"
            stroke="url(#service-pulse-line)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ opacity: 0 }}
          />
        ))}
        {MOTES.map((mote, index) => (
          <circle key={`m-${index}`} data-service-mote r={mote.size} fill={mote.color} style={{ opacity: 0 }} />
        ))}
      </svg>

      <div className="relative z-10 flex min-h-[inherit] w-full flex-col justify-center px-[var(--gutter-x)] pt-10 pb-20">
        {/* Top-aligned from lg: the editorial column starts level with the first service card
            rather than centring against the taller grid, which left it sitting low. */}
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="flex flex-col lg:col-span-5 lg:pr-8">
            <p
              data-service-label
              className="mb-5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[var(--neon-cyan)]/70 uppercase"
            >
              Our Services
            </p>
            <h2
              id="capabilities-heading"
              data-service-heading
              className="mb-6 text-4xl leading-[1.12] font-extralight tracking-[-0.03em] text-[var(--text-primary)] sm:text-5xl lg:text-[54px]"
            >
              Intelligence
              <br />
              across the <span className="service-accent font-normal">enterprise.</span>
            </h2>
            <p data-service-support className="max-w-lg text-base leading-relaxed font-light text-[var(--text-soft)] sm:text-lg">
              From strategy to deployment, we help you operationalize ai.
            </p>
          </div>

          <ul
            id="capability-domains"
            data-service-grid
            aria-label="Our services"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:col-span-7"
          >
            {SERVICES.map((service) => (
              <li
                key={service.number}
                data-service-card
                className="service-card group relative flex min-h-[112px] flex-col justify-between overflow-hidden rounded-xl p-4 sm:p-5"
              >
                <span aria-hidden="true" className="service-sweep pointer-events-none absolute inset-0" />
                <div className="relative flex items-start justify-between gap-3">
                  <span className="service-number font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-cyan-300/70">
                    {service.number}
                  </span>
                  <span className="text-[var(--text-secondary)] transition-colors group-hover:text-[var(--neon-cyan)]">
                    {service.icon}
                  </span>
                </div>
                <h3 className="service-title relative mt-3 text-sm leading-snug font-medium tracking-tight text-[var(--text-primary)]">
                  {service.title}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
