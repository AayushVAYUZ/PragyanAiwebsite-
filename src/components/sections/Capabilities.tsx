"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigateToHash } from "@/lib/navigation";
import SectionContinuum from "./SectionContinuum";

gsap.registerPlugin(ScrollTrigger);

const BACKGROUND = { width: 1690, height: 931 };
/** Core star of the crystal in capabilities-background.png, on the horizon line (measured: brightest point of the core). */
const CORE_EMISSION = { x: 636, y: 472 };

const ICON_PROPS = { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": true } as const;

/** Frame 08 — Capabilities. Copy and icons from the approved Stitch reference; domains from DESIGN.md §23. */
const DOMAINS: { number: string; title: string; description: string; icon: ReactNode; focus?: boolean; layout: string }[] = [
  {
    number: "01",
    title: "Strategy & Advisory",
    description: "Shape the right AI direction and high-value roadmaps.",
    layout: "",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Data & AI Engineering",
    description: "Build reliable and governed intelligence foundations.",
    layout: "",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <rect height="7" rx="1" width="7" x="3" y="3" />
        <rect height="7" rx="1" width="7" x="14" y="3" />
        <rect height="7" rx="1" width="7" x="14" y="14" />
        <rect height="7" rx="1" width="7" x="3" y="14" />
        <line x1="10" x2="14" y1="6.5" y2="6.5" />
        <line x1="6.5" x2="6.5" y1="10" y2="14" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Intelligent Applications",
    description: "Turn raw enterprise intelligence into autonomous operational workflows.",
    layout: "md:col-span-2 lg:col-span-1",
    focus: true,
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.4} className="h-4 w-4">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Platform Modernization",
    description: "Modernize the hybrid cloud systems behind core business logic.",
    layout: "lg:col-start-1",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" x2="12" y1="22.08" y2="12" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Managed Intelligence",
    description: "Continuously monitor, fine-tune, and evolve production AI models against real-time drifting and operational shifts.",
    layout: "lg:col-span-2",
    icon: (
      <svg {...ICON_PROPS} strokeWidth={1.2} className="h-5 w-5">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
      </svg>
    ),
  },
];

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lattice = section.querySelector<SVGSVGElement>("[data-capability-lattice]");
    const beams = Array.from(section.querySelectorAll<SVGPathElement>("[data-capability-beam]"));
    const pulses = Array.from(section.querySelectorAll<SVGCircleElement>("[data-capability-pulse]"));
    const gradient = section.querySelector<SVGLinearGradientElement>("#capability-beam-gradient");
    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-capability-card]"));
    const background = section.querySelector<HTMLElement>("[data-capability-background]");
    const wide = window.matchMedia("(min-width: 1024px)");
    let lengths: number[] = [];

    // Beams run from the crystal's emission point (mapped through the background's cover crop)
    // to the left edge of each capability module, behind the modules.
    const layoutBeams = () => {
      if (!lattice || !background || !wide.matches) return;
      const sectionBox = section.getBoundingClientRect();
      const bgBox = background.getBoundingClientRect();
      const scale = Math.max(bgBox.width / BACKGROUND.width, bgBox.height / BACKGROUND.height);
      const originX = bgBox.left - sectionBox.left + (bgBox.width - BACKGROUND.width * scale) / 2 + CORE_EMISSION.x * scale;
      const originY = bgBox.top - sectionBox.top + (bgBox.height - BACKGROUND.height * scale) / 2 + CORE_EMISSION.y * scale;
      lattice.setAttribute("viewBox", `0 0 ${sectionBox.width} ${sectionBox.height}`);
      gradient?.setAttribute("x1", `${originX}`);
      gradient?.setAttribute("x2", `${sectionBox.width}`);
      lengths = cards.map((card, index) => {
        const box = card.getBoundingClientRect();
        // Cards may be offset by their entrance transform; use their resting layout position.
        const offsetY = Number(card.dataset.restOffset ?? 0);
        const targetX = box.left - sectionBox.left;
        const targetY = box.top - sectionBox.top - offsetY + box.height / 2;
        const bend = (targetX - originX) * 0.45;
        const d = `M ${originX.toFixed(1)} ${originY.toFixed(1)} C ${(originX + bend).toFixed(1)} ${originY.toFixed(1)} ${(targetX - bend * 0.6).toFixed(1)} ${targetY.toFixed(1)} ${targetX.toFixed(1)} ${targetY.toFixed(1)}`;
        beams[index]?.setAttribute("d", d);
        pulses[index]?.setAttribute("cx", targetX.toFixed(1));
        pulses[index]?.setAttribute("cy", targetY.toFixed(1));
        const length = beams[index]?.getTotalLength() ?? 0;
        if (beams[index]) beams[index].style.strokeDasharray = `${length} ${length}`;
        return length;
      });
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    layoutBeams();
    const resizeObserver = new ResizeObserver(() => {
      layoutBeams();
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(section);

    if (reducedMotion) {
      beams.forEach((beam) => (beam.style.strokeDashoffset = "0"));
      return () => resizeObserver.disconnect();
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-capability-copy]",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 78%", end: "top 30%", scrub: 0.6 } },
      );
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.14,
          ease: "power2.out",
          onUpdate: () => cards.forEach((card) => (card.dataset.restOffset = `${gsap.getProperty(card, "y")}`)),
          scrollTrigger: { trigger: section, start: "top 68%", end: "top 15%", scrub: 0.7 },
        },
      );
      const draw = { t: 0 };
      gsap.to(draw, {
        t: 1,
        ease: "none",
        onUpdate: () => {
          beams.forEach((beam, index) => {
            const start = index * 0.1;
            const local = Math.min(Math.max((draw.t - start) / 0.6, 0), 1);
            beam.style.strokeDashoffset = `${(lengths[index] ?? 0) * (1 - local)}`;
            if (pulses[index]) pulses[index].style.opacity = `${local >= 1 ? 1 : 0}`;
          });
        },
        scrollTrigger: { trigger: section, start: "top 60%", end: "top 5%", scrub: 0.8 },
      });
    }, section);

    return () => {
      resizeObserver.disconnect();
      context.revert();
    };
  }, []);

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      aria-labelledby="capabilities-heading"
      className="relative isolate min-h-[max(calc(var(--svh)*100),52rem)] overflow-hidden bg-[var(--void-black)]"
    >
      {/* Crystalline intelligence core: strongest darkening of the content frames (the asset is much brighter than Stitch) */}
      <div data-capability-background className="absolute inset-0">
        <Image
          src="/images/capabilities-background.png"
          alt="A crystalline intelligence core emitting coherent rays of light to the right"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-center opacity-80"
        />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[rgba(3,4,10,0.36)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[var(--void-black)] via-[var(--void-black)]/60 to-transparent md:w-[65%]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--void-black)] via-transparent to-[var(--void-black)]/70" />
      <div aria-hidden="true" className="capability-cyan-tint pointer-events-none absolute inset-0" />

      {/* Beams connecting the core to the five domains (large screens) */}
      <svg
        data-capability-lattice
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="capability-beam-gradient" gradientUnits="userSpaceOnUse" x1="0" x2="1440" y1="0" y2="0">
            <stop offset="0%" stopColor="#8B2DFF" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#26C6FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#26C6FF" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        {DOMAINS.map((domain, index) => (
          <path
            key={domain.number}
            data-capability-beam
            fill="none"
            stroke="url(#capability-beam-gradient)"
            strokeWidth={index === 2 ? 1.1 : 0.85}
            opacity={index === 2 ? 0.65 : 0.5}
          />
        ))}
        {DOMAINS.map((domain, index) => (
          <circle
            key={domain.number}
            data-capability-pulse
            r={index === 2 ? 3 : 2.5}
            fill={index === 2 ? "#C47FFF" : "#26C6FF"}
            className="capability-pulse"
            style={{ opacity: 0 }}
          />
        ))}
      </svg>

      <div className="relative z-10 flex min-h-[inherit] w-full flex-col justify-center px-[var(--gutter-x)] pt-28 pb-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col justify-center lg:col-span-5 lg:pr-6">
            <p data-capability-copy className="mb-5 flex items-center gap-2.5">
              <span aria-hidden="true" className="capability-pulse h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)]" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.25em] text-cyan-300/90 uppercase">
                08 — Capabilities
              </span>
            </p>
            <h2
              id="capabilities-heading"
              data-capability-copy
              className="mb-6 text-4xl leading-[1.12] font-extralight tracking-[-0.03em] text-[var(--text-primary)] sm:text-5xl lg:text-[54px]"
            >
              Intelligence
              <br />
              across the <span className="capability-gradient font-normal">enterprise.</span>
            </h2>
            <p data-capability-copy className="mb-4 max-w-lg text-base leading-relaxed font-light text-[var(--text-soft)] sm:text-lg">
              From strategy to deployment, we help you operationalize AI.
            </p>
            <p data-capability-copy className="mb-8 max-w-md text-xs leading-relaxed font-light text-[var(--text-secondary)]/80 sm:text-sm">
              A unified intelligence substrate connecting governance, engineering, and execution into measurable organizational
              impact.
            </p>
            <div data-capability-copy>
              <a
                href="#capability-domains"
                onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, "#capability-domains")}
                className="group inline-flex items-center gap-3 rounded-full border border-[rgba(160,175,220,0.22)] bg-[#070B18]/60 px-6 py-3 text-xs tracking-wide text-[var(--text-soft)] shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-[border-color,background-color,color] duration-300 hover:border-[var(--neon-cyan)]/60 hover:bg-[#0A1024]/80 hover:text-[var(--text-primary)]"
              >
                <span>Explore Capabilities</span>
                <span aria-hidden="true" className="text-[var(--neon-cyan)] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>

          <ul
            id="capability-domains"
            aria-label="Capability domains"
            className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2 lg:col-span-7 lg:grid-cols-3"
          >
            {DOMAINS.map((domain) => (
              <li
                key={domain.number}
                data-capability-card
                className={`capability-node group relative flex min-h-[178px] flex-col justify-between overflow-hidden rounded-xl p-5 ${
                  domain.focus ? "capability-node-focus" : ""
                } ${domain.layout}`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <span
                    className={`font-[family-name:var(--font-mono)] text-[11px] tracking-wider ${
                      domain.focus ? "font-semibold text-[var(--electric-violet)]" : "text-cyan-300/70"
                    }`}
                  >
                    {domain.focus ? `${domain.number} · Active` : domain.number}
                  </span>
                  {domain.focus ? (
                    <span className="rounded-lg border border-[var(--electric-violet)]/40 bg-[var(--electric-violet)]/20 p-1.5 text-violet-300">
                      {domain.icon}
                    </span>
                  ) : (
                    <span className="text-[var(--text-secondary)] transition-colors group-hover:text-[var(--neon-cyan)]">{domain.icon}</span>
                  )}
                </div>
                <div>
                  <h3
                    className={`mb-1.5 text-sm font-medium tracking-tight transition-colors ${
                      domain.focus ? "text-white group-hover:text-[#C47FFF]" : "text-[var(--text-primary)] group-hover:text-cyan-200"
                    }`}
                  >
                    {domain.title}
                  </h3>
                  <p className={`text-xs leading-snug font-light ${domain.focus ? "text-[var(--text-soft)]" : "text-[var(--text-secondary)]"}`}>
                    {domain.description}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-px bg-gradient-to-r ${
                    domain.focus
                      ? "h-[1.5px] w-full from-[var(--electric-violet)] via-[var(--neon-cyan)] to-[var(--electric-violet)] opacity-90"
                      : "w-0 from-transparent via-[var(--neon-cyan)] to-transparent transition-all duration-500 group-hover:w-full"
                  }`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SectionContinuum index="08" title="Capabilities" next={{ href: "#case-studies", label: "Proceed to 09 — Proof (Case Studies)" }} />
    </section>
  );
}
