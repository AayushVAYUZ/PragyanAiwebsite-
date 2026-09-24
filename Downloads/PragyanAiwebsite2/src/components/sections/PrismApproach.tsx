"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigateToHash } from "@/lib/navigation";

gsap.registerPlugin(ScrollTrigger);

/** Frame 07 — PRISM / Our Approach. Copy from the approved Stitch reference and DESIGN.md §22. */
const STAGES = [
  {
    number: "01",
    name: "Orient",
    statement: "Understand the problem.",
    description: "Understand the business, existing bottlenecks, and core strategic intent.",
    tone: "cyan",
  },
  {
    number: "02",
    name: "Disperse",
    statement: "Explore the possibilities.",
    description: "Explore possibilities across autonomous cognition, generative workflows, and intelligent depth.",
    tone: "violet",
  },
  {
    number: "03",
    name: "Spectrum",
    statement: "Find what matters.",
    description: "Evaluate what matters. Filter noise, assess feasibility, and measure tangible enterprise return.",
    tone: "focus",
  },
  {
    number: "04",
    name: "Refract",
    statement: "Design the right solution.",
    description: "Design the right solution architecture, governance frameworks, and precision data pipelines.",
    tone: "violet",
  },
  {
    number: "05",
    name: "Emerge",
    statement: "Deliver and improve.",
    description: "Continuous feedback loops amplifying real-world operational impact.",
    tone: "cyan",
  },
] as const;

/**
 * Where the painted beam meets the glass, in the artwork's own pixels (1680 × 936). A
 * screen-blended overlay (additive only) sends one beam from that point to each methodology
 * stage; the artwork itself is never altered. Below lg the stages sit under the artwork rather
 * than beside it, so the beams fall back to a fixed fan.
 */
const PRISM_ENTRY = { x: 648, y: 458 };
const BEAM_END_X = 1680;
const FALLBACK_Y = [230, 350, 470, 580, 690];

/**
 * One shade per stage, in dispersion order: the shortest wavelengths bend hardest and leave
 * highest, the longest leave lowest — which is also the order the artwork itself paints, and
 * the brand's violet → blue → cyan ramp. Each beam leaves the glass still near-white and
 * separates into its own colour as it travels, the way real dispersion resolves with distance.
 */
const BEAM_SPECTRUM = [
  { tint: "#E9D2FF", hue: "#C86BFF" },
  { tint: "#D8C4FF", hue: "#8B2DFF" },
  { tint: "#CBD8FF", hue: "#5B7BFF" },
  { tint: "#C2ECFF", hue: "#26C6FF" },
  { tint: "#C6F6EE", hue: "#2FE6D0" },
];

/** Pacing of the reveal, in seconds: the lead-in as light enters the glass, and how long the
 * split takes to run out to the stages. The five beams leave together, so there is no beat
 * between them — the prism disperses once, not five times. */
const PRISM_SEQUENCE = { lead: 0.6, travel: 1.1 };

const smooth = (edge0: number, edge1: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** The settled look of a stage once the light has reached it: a held, subtle glow. */
const REVEALED_NUMBER = "brightness(1.15) drop-shadow(0 0 5px rgba(139,45,255,0.45))";
const REVEALED_NAME = "brightness(1.12) drop-shadow(0 0 6px rgba(139,45,255,0.4)) drop-shadow(0 0 3px rgba(38,198,255,0.35))";

export default function PrismApproach() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const beamLayer = section.querySelector<HTMLElement>("[data-prism-beam-layer]");
    const svg = section.querySelector<SVGSVGElement>("[data-prism-svg]");
    const scrim = section.querySelector<HTMLElement>("[data-prism-scrim]");
    const entryLines = Array.from(section.querySelectorAll<SVGLineElement>("[data-prism-entry-line]"));
    const flare = section.querySelector<SVGCircleElement>("[data-prism-flare]");
    const beamGroups = Array.from(section.querySelectorAll<SVGGElement>("[data-prism-beam]"));
    const beamLines = beamGroups.map((group) => Array.from(group.querySelectorAll<SVGLineElement>("[data-prism-halo], [data-prism-core]")));
    const beamCores = beamGroups.map((group) => group.querySelector<SVGLineElement>("[data-prism-core]"));
    const beamPulses = beamGroups.map((group) => group.querySelector<SVGLineElement>("[data-prism-pulse]"));

    const stages = Array.from(section.querySelectorAll<HTMLElement>("[data-prism-stage]"));
    const stageNumbers = stages.map((el) => el.querySelector<HTMLElement>("[data-prism-number]"));
    const stageNames = stages.map((el) => el.querySelector<HTMLElement>("[data-prism-name]"));

    const beamProgress = STAGES.map(() => 0);
    const beamFlash = STAGES.map(() => 0);
    const beamLengths = STAGES.map(() => 0);
    const entryProgress = { v: 0 };

    const renderBeam = (index: number) => {
      const group = beamGroups[index];
      if (!group) return;
      const progress = beamProgress[index];
      const length = beamLengths[index];
      group.style.opacity = `${smooth(0, 0.1, progress).toFixed(3)}`;
      beamLines[index].forEach((line) => {
        line.style.strokeDashoffset = `${(length * (1 - progress)).toFixed(2)}`;
      });
      const core = beamCores[index];
      // The brief intensify as the light lands on a stage.
      if (core) core.setAttribute("stroke-width", `${(1.6 + beamFlash[index] * 1.1).toFixed(2)}`);
    };

    const renderEntry = () => {
      const length = beamLengths.length ? entryLength : 0;
      entryLines.forEach((line) => {
        line.style.strokeDashoffset = `${(length * (1 - entryProgress.v)).toFixed(2)}`;
      });
      if (flare) flare.style.opacity = `${(smooth(0.2, 1, entryProgress.v) * 0.55).toFixed(3)}`;
    };

    let entryLength = 0;

    /** Re-aims every beam at its stage and re-measures, keeping whatever each has already drawn. */
    const wide = window.matchMedia("(min-width: 1024px)");
    const alignBeams = () => {
      if (!svg || !beamLayer) return;
      const width = beamLayer.clientWidth;
      const height = beamLayer.clientHeight;
      const scale = Math.max(width / 1680, height / 936);
      const drawnWidth = 1680 * scale;
      const drawnHeight = 936 * scale;
      svg.style.width = `${drawnWidth}px`;
      svg.style.height = `${drawnHeight}px`;
      svg.style.left = `${(width - drawnWidth) * (wide.matches ? 0.5 : 0.36)}px`;
      svg.style.top = `${(height - drawnHeight) * 0.5}px`;

      const rect = svg.getBoundingClientRect();
      const canAim = wide.matches && rect.width > 0 && rect.height > 0;

      beamGroups.forEach((group, index) => {
        const card = stages[index];
        let x2 = BEAM_END_X;
        let y2 = FALLBACK_Y[index] ?? PRISM_ENTRY.y;
        if (canAim && card) {
          // The beam stops just short of the card it lights, in the artwork's own coordinates.
          const cardRect = card.getBoundingClientRect();
          x2 = ((cardRect.left - 12 - rect.left) / rect.width) * 1680;
          y2 = ((cardRect.top + cardRect.height / 2 - rect.top) / rect.height) * 936;
          x2 = Math.max(PRISM_ENTRY.x + 140, x2);
        }
        Array.from(group.querySelectorAll<SVGLineElement>("line")).forEach((line) => {
          line.setAttribute("x2", x2.toFixed(1));
          line.setAttribute("y2", y2.toFixed(1));
        });
        // Both ramps follow the beam, so each shade resolves along its real travel direction.
        [`prism-beam-core-${index}`, `prism-beam-glow-${index}`].forEach((id) => {
          const gradient = svg.querySelector<SVGLinearGradientElement>(`#${id}`);
          if (!gradient) return;
          gradient.setAttribute("x1", `${PRISM_ENTRY.x}`);
          gradient.setAttribute("y1", `${PRISM_ENTRY.y}`);
          gradient.setAttribute("x2", x2.toFixed(1));
          gradient.setAttribute("y2", y2.toFixed(1));
        });
        const core = beamCores[index];
        beamLengths[index] = core?.getTotalLength() ?? 0;
        beamLines[index].forEach((line) => {
          line.style.strokeDasharray = `${beamLengths[index]} ${beamLengths[index]}`;
        });
        const pulse = beamPulses[index];
        if (pulse) pulse.style.strokeDasharray = `70 ${beamLengths[index] + 160}`;
        renderBeam(index);
      });

      entryLength = entryLines[0]?.getTotalLength() ?? 0;
      entryLines.forEach((line) => {
        line.style.strokeDasharray = `${entryLength} ${entryLength}`;
      });
      renderEntry();
    };

    /** The held state of a stage the light has reached. It is never taken away again. */
    const settleStage = (index: number) => {
      const card = stages[index];
      if (card) gsap.set(card, { autoAlpha: 1 });
      if (stageNumbers[index]) gsap.set(stageNumbers[index], { filter: REVEALED_NUMBER });
      if (stageNames[index]) gsap.set(stageNames[index], { filter: REVEALED_NAME });
    };

    const revealStage = (index: number) => {
      const card = stages[index];
      if (card) gsap.to(card, { autoAlpha: 1, duration: 0.4, ease: "power2.out", overwrite: true });
      // A brighter instant as the light lands, easing down to the held glow — no slide, no
      // typewriter, and nothing that later takes the stage back off the screen.
      if (stageNumbers[index]) {
        gsap.fromTo(
          stageNumbers[index],
          { filter: "brightness(2.1) drop-shadow(0 0 12px rgba(139,45,255,0.85))" },
          { filter: REVEALED_NUMBER, duration: 0.85, ease: "power2.out", overwrite: true },
        );
      }
      if (stageNames[index]) {
        gsap.fromTo(
          stageNames[index],
          { filter: "brightness(1.8) drop-shadow(0 0 14px rgba(139,45,255,0.75)) drop-shadow(0 0 8px rgba(38,198,255,0.6))" },
          { filter: REVEALED_NAME, duration: 0.85, ease: "power2.out", overwrite: true },
        );
      }
    };

    alignBeams();
    const resizeObserver = new ResizeObserver(alignBeams);
    if (beamLayer) resizeObserver.observe(beamLayer);
    wide.addEventListener("change", alignBeams);

    const media = gsap.matchMedia();
    media.add(
      { reduceMotion: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        // Reduced motion: the whole methodology is simply already revealed.
        if (context.conditions?.reduceMotion) {
          entryProgress.v = 1;
          renderEntry();
          beamProgress.forEach((_, index) => {
            beamProgress[index] = 1;
            renderBeam(index);
          });
          if (scrim) scrim.style.opacity = "0";
          STAGES.forEach((_, index) => settleStage(index));
          return;
        }

        gsap.set(stages, { autoAlpha: 0 });
        if (scrim) scrim.style.opacity = "0.5";

        gsap.fromTo(
          "[data-prism-parallax]",
          { yPercent: -2 },
          { yPercent: 2, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.fromTo(
          "[data-prism-copy]",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 78%", toggleActions: "play none none none" },
          },
        );

        // The reveal: light enters the glass, then splits — all five beams travel outward at
        // once and the five stages light together. One timeline, played once; nothing here is
        // tied to scroll position.
        const { lead, travel } = PRISM_SEQUENCE;
        // Absolute positions throughout: relative ones ("<", ">") would be measured against
        // whatever was inserted last, and the long scrim tween would drag them out of place.
        const arrival = lead + travel * 0.9;
        const sequence = gsap.timeline({ paused: true });
        sequence.to(entryProgress, { v: 1, duration: lead, ease: "power2.out", onUpdate: renderEntry }, 0);

        // One value drives every beam, so they cannot drift apart.
        const split = { p: 0, flash: 0 };
        sequence.to(
          split,
          {
            p: 1,
            duration: travel,
            ease: "power2.inOut",
            onUpdate: () => {
              STAGES.forEach((_, index) => {
                beamProgress[index] = split.p;
                renderBeam(index);
              });
            },
          },
          lead,
        );
        sequence.add(() => STAGES.forEach((_, index) => revealStage(index)), arrival);
        sequence.to(
          split,
          {
            flash: 1,
            duration: 0.18,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
            onUpdate: () => {
              STAGES.forEach((_, index) => {
                beamFlash[index] = split.flash;
                renderBeam(index);
              });
            },
          },
          arrival,
        );

        if (scrim) sequence.to(scrim, { opacity: 0, duration: lead + travel, ease: "none" }, 0);

        // Afterwards the prism keeps pushing light outward — a slow crest along the lit beams,
        // so the light stays the section's primary movement without ever flashing.
        const crest = { v: 0 };
        const crestLoop = gsap.to(crest, {
          v: 1,
          duration: 3.4,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 1.8,
          paused: true,
          onUpdate: () => {
            const visible = Math.sin(Math.PI * crest.v) * 0.28;
            beamPulses.forEach((pulse, index) => {
              if (!pulse) return;
              pulse.style.strokeDashoffset = `${(-crest.v * (beamLengths[index] + 90)).toFixed(2)}`;
              pulse.style.opacity = `${(beamProgress[index] >= 1 ? visible : 0).toFixed(3)}`;
            });
          },
        });
        sequence.eventCallback("onComplete", () => crestLoop.play());

        // Plays once, the first time the section comes into view, and is never re-armed by
        // further scrolling. The crest loop idles whenever the section is off screen.
        ScrollTrigger.create({ trigger: section, start: "top 72%", once: true, onEnter: () => sequence.play() });
        const visibility = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!sequence.progress()) return;
              if (entry.isIntersecting) crestLoop.play();
              else crestLoop.pause();
            });
          },
          { threshold: 0 },
        );
        visibility.observe(section);

        return () => {
          visibility.disconnect();
          crestLoop.kill();
          sequence.kill();
        };
      },
      section,
    );

    return () => {
      resizeObserver.disconnect();
      wide.removeEventListener("change", alignBeams);
      media.revert();
    };
  }, []);

  return (
    <section
      id="prism"
      ref={sectionRef}
      aria-labelledby="prism-heading"
      className="relative isolate min-h-[clamp(53rem,calc(var(--svh)*100),55rem)] overflow-hidden bg-[var(--void-black)]"
    >
      {/* Crystalline prism: the dominant visual (subtle parallax) */}
      <div data-prism-parallax className="absolute inset-x-0 -top-[3%] -bottom-[3%]">
        <Image
          src="/images/prism-background.png"
          alt="A crystalline prism refracting a beam of light into violet and cyan rays"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-[36%_50%] lg:object-center"
        />
        {/* Holds the painted dispersion back until the prism starts sending light out. */}
        <div
          data-prism-scrim
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to right, transparent 0%, transparent 36%, rgba(3,4,10,0.88) 100%)", opacity: 0 }}
        />
      </div>

      {/* Grading: Stitch directional vignettes plus a moderate darkening (the approved asset is brighter) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[rgba(3,4,10,0.22)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--void-black)]/95 via-[var(--void-black)]/40 to-[var(--void-black)]/85" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--void-black)] via-transparent to-[var(--void-black)]/80" />
      <div aria-hidden="true" className="prism-core-glow pointer-events-none absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2" />

      {/* The prism's own light: a white core with a violet → blue → cyan glow, sent out to each
          stage in turn. It rides the artwork's parallax but sits above the grading so it reads. */}
      <div data-prism-beam-layer aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-[3%] -bottom-[3%]">
        <svg
          data-prism-svg
          viewBox="0 0 1680 936"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 h-full w-full mix-blend-screen"
        >
          <defs>
            <radialGradient id="prism-flare-glow">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#bfe6ff" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#8B2DFF" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#8B2DFF" stopOpacity="0" />
            </radialGradient>
            {/* The incoming beam brightens only as it nears the glass: its left half runs
                behind the editorial column, which must stay readable. */}
            <linearGradient id="prism-entry-core" x1="0" y1="0" x2={PRISM_ENTRY.x} y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EAF6FF" stopOpacity="0" />
              <stop offset="75%" stopColor="#EAF6FF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#EAF6FF" stopOpacity="0.62" />
            </linearGradient>
            <linearGradient id="prism-entry-halo" x1="0" y1="0" x2={PRISM_ENTRY.x} y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8B2DFF" stopOpacity="0" />
              <stop offset="70%" stopColor="#8B2DFF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#7FD8FF" stopOpacity="0.16" />
            </linearGradient>
            {/* Per beam: a core that leaves the glass near-white and resolves into its own
                shade with distance, and a wider glow in the same shade. Both are re-aimed
                with the beam they belong to. */}
            {STAGES.map((_, index) => {
              const { tint, hue } = BEAM_SPECTRUM[index];
              return (
                <g key={index}>
                  <linearGradient
                    id={`prism-beam-core-${index}`}
                    x1={PRISM_ENTRY.x}
                    y1={PRISM_ENTRY.y}
                    x2={BEAM_END_X}
                    y2={FALLBACK_Y[index]}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
                    <stop offset="22%" stopColor={tint} stopOpacity="0.52" />
                    <stop offset="100%" stopColor={hue} stopOpacity="0.72" />
                  </linearGradient>
                  <linearGradient
                    id={`prism-beam-glow-${index}`}
                    x1={PRISM_ENTRY.x}
                    y1={PRISM_ENTRY.y}
                    x2={BEAM_END_X}
                    y2={FALLBACK_Y[index]}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
                    <stop offset="40%" stopColor={hue} stopOpacity="0.24" />
                    <stop offset="100%" stopColor={hue} stopOpacity="0.14" />
                  </linearGradient>
                </g>
              );
            })}
          </defs>

          {/* The beam arriving at the glass */}
          <g data-prism-entry>
            <line
              data-prism-entry-line
              data-prism-halo
              x1="0"
              y1={PRISM_ENTRY.y}
              x2={PRISM_ENTRY.x}
              y2={PRISM_ENTRY.y}
              stroke="url(#prism-entry-halo)"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <line
              data-prism-entry-line
              data-prism-core
              x1="0"
              y1={PRISM_ENTRY.y}
              x2={PRISM_ENTRY.x}
              y2={PRISM_ENTRY.y}
              stroke="url(#prism-entry-core)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </g>

          {/* One beam per methodology stage */}
          {STAGES.map((_, index) => (
            <g key={index} data-prism-beam style={{ opacity: 0 }}>
              <line
                data-prism-halo
                x1={PRISM_ENTRY.x}
                y1={PRISM_ENTRY.y}
                x2={BEAM_END_X}
                y2={FALLBACK_Y[index]}
                stroke={`url(#prism-beam-glow-${index})`}
                strokeWidth="11"
                strokeLinecap="round"
              />
              <line
                data-prism-core
                x1={PRISM_ENTRY.x}
                y1={PRISM_ENTRY.y}
                x2={BEAM_END_X}
                y2={FALLBACK_Y[index]}
                stroke={`url(#prism-beam-core-${index})`}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <line
                data-prism-pulse
                x1={PRISM_ENTRY.x}
                y1={PRISM_ENTRY.y}
                x2={BEAM_END_X}
                y2={FALLBACK_Y[index]}
                stroke={BEAM_SPECTRUM[index].tint}
                strokeWidth="2.4"
                strokeLinecap="round"
                style={{ opacity: 0 }}
              />
            </g>
          ))}

          <circle data-prism-flare cx={PRISM_ENTRY.x} cy={PRISM_ENTRY.y} r="150" fill="url(#prism-flare-glow)" style={{ opacity: 0 }} />
        </svg>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[inherit] w-full max-w-[1720px] grid-cols-12 items-center gap-8 px-[var(--gutter-x)] pt-28 pb-8">
        {/* Editorial column */}
        <div className="col-span-12 flex flex-col justify-center gap-5 lg:col-span-4 lg:pr-4">
          <div data-prism-copy className="flex flex-col gap-3">
            <h2 id="prism-heading" className="text-4xl leading-[1.12] font-light tracking-[0.12em] xl:text-5xl">
              <span className="prism-title-sweep font-normal">PRISM</span>
            </h2>
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--text-soft)] uppercase">
              Pragyan Responsible Intelligence &amp; Solution Methodology
            </p>
          </div>

          <p data-prism-copy className="max-w-[420px] text-base leading-relaxed font-light text-[var(--text-soft)]">
            Our approach to turning ai possibilities into measurable business value.
          </p>

          <p data-prism-copy className="max-w-[420px] text-sm leading-relaxed text-[var(--text-secondary)]">
            Enterprise ai cannot remain an abstract experiment. PRISM brings structure to the journey — from
            understanding the business and exploring possibilities to identifying the right opportunities, designing
            the solution, and delivering measurable impact.
          </p>

          <p
            data-prism-copy
            className="w-fit rounded-r border-l border-[var(--electric-violet)]/50 bg-[var(--midnight-blue)]/40 px-4 py-2.5 font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[var(--text-secondary)]"
          >
            Possibility <span className="text-[var(--electric-violet)]">→</span> Cognitive Perspective{" "}
            <span className="text-[var(--neon-cyan)]">→</span> Practical Value
          </p>

          <div data-prism-copy className="pt-1">
            <a
              href="#prism-stages"
              onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, "#prism-stages")}
              className="group inline-flex items-center gap-3 rounded-full border border-[var(--border-active)] bg-[#0A0F23]/80 px-6 py-3 text-xs font-medium tracking-[0.16em] text-[var(--text-primary)] transition-[border-color,background-color,box-shadow] duration-300 hover:border-[var(--electric-violet)] hover:bg-[var(--electric-violet)]/15 hover:shadow-[0_0_24px_-4px_rgba(139,45,255,0.4)]"
            >
              <span>Explore PRISM</span>
              <span aria-hidden="true" className="text-[var(--neon-cyan)] transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Negative space for the crystalline prism */}
        <div aria-hidden="true" className="pointer-events-none relative hidden items-center justify-center lg:col-span-4 lg:flex">
          <div className="prism-ring h-[340px] w-[340px] rounded-full border border-dashed border-[rgba(160,175,220,0.1)] opacity-30" />
          <div className="absolute h-[460px] w-[460px] rounded-full border border-[var(--electric-violet)]/10 opacity-20" />
        </div>

        {/* The five methodology stages, lit one by one by the prism's light */}
        <ol
          id="prism-stages"
          aria-label="PRISM methodology stages"
          className="col-span-12 flex flex-col justify-center gap-3 lg:col-span-4 lg:pl-2"
        >
          {STAGES.map((stage) => (
            <li key={stage.number} data-prism-stage className="relative flex items-center">
              <span
                aria-hidden="true"
                className={`mr-2 -ml-8 hidden h-px w-8 bg-gradient-to-r from-transparent lg:block ${
                  stage.tone === "violet"
                    ? "to-[var(--electric-violet)]/40"
                    : stage.tone === "focus"
                      ? "to-[var(--neon-cyan)]/70"
                      : "to-[var(--neon-cyan)]/40"
                }`}
              />
              <div
                className={`prism-stage flex-1 rounded-xl p-4 ${
                  stage.tone === "focus"
                    ? "border border-[var(--electric-violet)]/40 bg-[var(--midnight-blue)]/60"
                    : "border border-[rgba(160,175,220,0.15)] bg-[var(--void-black)]/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    data-prism-number
                    className={`font-[family-name:var(--font-mono)] text-xs font-medium tracking-wider ${
                      stage.tone === "violet"
                        ? "text-[var(--electric-violet)]"
                        : stage.tone === "focus"
                          ? "text-[var(--text-soft)]"
                          : "text-[var(--neon-cyan)]"
                    }`}
                  >
                    {stage.number}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-3 w-1 rounded-full ${
                      stage.tone === "violet"
                        ? "bg-[var(--electric-violet)]/60"
                        : stage.tone === "focus"
                          ? "bg-gradient-to-b from-[var(--electric-violet)] to-[var(--neon-cyan)]"
                          : "bg-[var(--neon-cyan)]/60"
                    }`}
                  />
                  <h3 data-prism-name className="text-xs font-semibold tracking-[0.2em] text-[var(--text-primary)] uppercase">
                    {stage.name}
                  </h3>
                </div>
                <p className="mt-2 pl-7 text-[13px] leading-snug font-semibold text-[var(--text-primary)]">{stage.statement}</p>
                <p
                  className={`mt-1 pl-7 text-xs leading-relaxed ${
                    stage.tone === "focus" ? "text-[var(--text-soft)]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {stage.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
