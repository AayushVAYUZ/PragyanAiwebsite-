"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigateToHash } from "@/lib/navigation";

gsap.registerPlugin(ScrollTrigger);

/** Frame 06 — Our Journey. Copy from the approved Stitch reference and DESIGN.md §21. */
const MILESTONES = [
  { year: "2015", title: "Engineered Possibilities", detail: "Foundational scalable systems", tone: "cyan" },
  { year: "2018", title: "Scaled Delivery", detail: "Distributed architectures", tone: "cyan" },
  { year: "2021", title: "Embraced ai", detail: "Early foundational models", tone: "violet" },
  { year: "2024", title: "Built Pragyan", titleAccent: "ai", detail: "Autonomous cognitive framework", tone: "current" },
  { year: "2026+", title: "Amplifying Impact", detail: "Active horizon & beyond", tone: "horizon" },
] as const;

/**
 * The glowing path painted into journey-background.png, traced in the image's own
 * pixels (1600 × 889) and split where it narrows with distance. As the section
 * scrolls in, an energy trace (screen-blended, additive only) draws itself along
 * the painted path from the foreground up to the summit gateway, then settles to a
 * faint residual glow. The approved image itself is never altered.
 */
const PATH_SEGMENTS = [
  {
    d: "M0.0 882.7C22.2 877.8 88.9 864.2 133.3 853.3C177.8 842.4 222.2 829.1 266.7 817.3C311.1 805.6 355.6 794.0 400.0 782.7C444.4 771.3 493.3 759.6 533.3 749.3C573.3 739.1 604.4 733.6 640.0 721.3C675.6 709.1 716.7 689.1 746.7 676.0C776.7 662.9 801.1 653.6 820.0 642.7C838.9 631.8 849.6 620.4 860.0 610.7C870.4 600.9 872.7 591.8 882.7 584.0",
    core: 5,
    halo: 26,
    head: 34,
  },
  {
    d: "M882.7 584.0C892.7 576.2 902.7 569.3 920.0 564.0C937.3 558.7 957.8 556.2 986.7 552.0C1015.6 547.8 1060.0 543.6 1093.3 538.7C1126.7 533.8 1162.2 528.0 1186.7 522.7C1211.1 517.3 1229.3 511.6 1240.0 506.7C1250.7 501.8 1253.3 497.1 1250.7 493.3C1248.0 489.6 1239.1 486.9 1224.0 484.0C1208.9 481.1 1186.2 478.7 1160.0 476.0C1133.8 473.3 1095.6 470.9 1066.7 468.0C1037.8 465.1 1006.2 462.4 986.7 458.7C967.1 454.9 956.4 450.4 949.3 445.3C942.2 440.2 940.4 433.1 944.0 428.0",
    core: 3.5,
    halo: 17,
    head: 24,
  },
  {
    d: "M944.0 428.0C947.6 422.9 956.9 419.3 970.7 414.7C984.4 410.0 1010.0 405.3 1026.7 400.0C1043.3 394.7 1060.7 388.9 1070.7 382.7C1080.7 376.4 1085.1 368.9 1086.7 362.7C1088.2 356.4 1078.4 350.9 1080.0 345.3C1081.6 339.8 1088.0 333.6 1096.0 329.3C1104.0 325.1 1119.1 324.0 1128.0 320.0C1136.9 316.0 1144.4 311.1 1149.3 305.3C1154.2 299.6 1156.0 288.7 1157.3 285.3",
    core: 2.2,
    halo: 10,
    head: 15,
  },
];

const smooth = (edge0: number, edge1: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export default function OurJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const parallax = section.querySelector<HTMLElement>("[data-journey-parallax]");
    const traces = Array.from(section.querySelectorAll<SVGPathElement>("[data-journey-trace]"));
    const traceGroup = section.querySelector<SVGGElement>("[data-journey-traces]");
    const head = section.querySelector<SVGGElement>("[data-journey-head]");
    const headGlow = section.querySelector<SVGCircleElement>("[data-journey-head] circle");
    const copy = Array.from(section.querySelectorAll<HTMLElement>("[data-journey-copy]"));
    const milestones = Array.from(section.querySelectorAll<HTMLElement>("[data-journey-milestone]"));
    const progressLine = section.querySelector<HTMLElement>("[data-journey-progress]");

    // Segment lengths (traces come in halo/core pairs per segment).
    const lengths = PATH_SEGMENTS.map((_, index) => traces[index * 2]?.getTotalLength() ?? 0);
    const total = lengths.reduce((sum, length) => sum + length, 0);
    traces.forEach((trace, index) => {
      const length = lengths[Math.floor(index / 2)];
      trace.style.strokeDasharray = `${length} ${length}`;
    });

    const reveal = (t: number) => {
      const lit = t * total;
      let start = 0;
      let headSet = false;
      PATH_SEGMENTS.forEach((segment, index) => {
        const length = lengths[index];
        const local = Math.min(Math.max(lit - start, 0), length);
        // Dash covers [0, local]: the part of this segment the energy has already travelled.
        traces[index * 2].style.strokeDashoffset = `${length - local}`;
        traces[index * 2 + 1].style.strokeDashoffset = `${length - local}`;
        if (!headSet && lit <= start + length && head) {
          const point = traces[index * 2].getPointAtLength(local);
          head.setAttribute("transform", `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`);
          headGlow?.setAttribute("r", `${segment.head}`);
          headSet = true;
        }
        start += length;
      });
      // The travelling light fades on arrival at the gateway; the trace settles to a faint residual glow.
      if (head) head.style.opacity = `${smooth(0, 0.04, t) * (1 - smooth(0.92, 1, t))}`;
      if (traceGroup) traceGroup.style.opacity = `${1 - 0.65 * smooth(0.9, 1, t)}`;
      milestones.forEach((milestone, index) => {
        const threshold = 0.12 + index * 0.17;
        const presence = smooth(threshold - 0.1, threshold, t);
        milestone.style.opacity = `${presence}`;
        milestone.style.transform = `translate3d(0, ${((1 - presence) * 12).toFixed(2)}px, 0)`;
      });
      if (progressLine) progressLine.style.transform = `scaleX(${t.toFixed(4)})`;
    };

    // The trace is laid out exactly like the image's object-fit: cover crop, including the
    // portrait crop that keeps the summit gateway in view (object-position 85% on narrow screens).
    const svg = section.querySelector<SVGSVGElement>("[data-journey-svg]");
    const narrow = window.matchMedia("(max-width: 639px)");
    const alignTrace = () => {
      if (!svg || !parallax) return;
      const width = parallax.clientWidth;
      const height = parallax.clientHeight;
      const scale = Math.max(width / 1600, height / 889);
      const drawnWidth = 1600 * scale;
      const drawnHeight = 889 * scale;
      const positionX = narrow.matches ? 0.85 : 0.5;
      svg.style.width = `${drawnWidth}px`;
      svg.style.height = `${drawnHeight}px`;
      svg.style.left = `${(width - drawnWidth) * positionX}px`;
      svg.style.top = `${(height - drawnHeight) * 0.5}px`;
    };
    alignTrace();
    const resizeObserver = new ResizeObserver(alignTrace);
    if (parallax) resizeObserver.observe(parallax);
    narrow.addEventListener("change", alignTrace);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      reveal(1);
      return () => {
        resizeObserver.disconnect();
        narrow.removeEventListener("change", alignTrace);
      };
    }

    reveal(0);
    const context = gsap.context(() => {
      if (parallax) {
        gsap.fromTo(
          parallax,
          { yPercent: -2.5 },
          { yPercent: 2.5, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
        );
      }
      gsap.fromTo(
        copy,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 80%", end: "top 30%", scrub: 0.6 },
        },
      );
      const path = { t: 0 };
      gsap.to(path, {
        t: 1,
        ease: "none",
        onUpdate: () => reveal(path.t),
        scrollTrigger: { trigger: section, start: "top 85%", end: "top 8%", scrub: 0.8 },
      });
    }, section);

    return () => {
      resizeObserver.disconnect();
      narrow.removeEventListener("change", alignTrace);
      context.revert();
    };
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      aria-labelledby="journey-heading"
      className="relative isolate min-h-[calc(var(--svh)*100)] overflow-hidden bg-[var(--void-black)]"
    >
      {/* Mountain environment with the painted journey path (restrained parallax) */}
      <div data-journey-parallax className="absolute inset-x-0 -top-[4%] -bottom-[4%]">
        <Image
          src="/images/journey-background.png"
          alt="A glowing violet and cyan path winding across night mountains to a gateway at the summit"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-[85%_50%] sm:object-center"
        />
        <svg
          data-journey-svg
          aria-hidden="true"
          viewBox="0 0 1600 889"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 h-full w-full mix-blend-screen"
        >
          <defs>
            <radialGradient id="journey-head-glow">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#8fe3ff" stopOpacity="0.7" />
              <stop offset="65%" stopColor="#8B2DFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8B2DFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g data-journey-traces>
            {PATH_SEGMENTS.map((segment) => [
              <path
                key={`${segment.d.slice(0, 12)}-halo`}
                data-journey-trace
                d={segment.d}
                fill="none"
                stroke="rgba(120, 190, 255, 0.16)"
                strokeWidth={segment.halo}
                strokeLinecap="round"
              />,
              <path
                key={`${segment.d.slice(0, 12)}-core`}
                data-journey-trace
                d={segment.d}
                fill="none"
                stroke="rgba(225, 244, 255, 0.85)"
                strokeWidth={segment.core}
                strokeLinecap="round"
              />,
            ])}
          </g>
          <g data-journey-head style={{ opacity: 0 }}>
            <circle r="34" fill="url(#journey-head-glow)" />
          </g>
        </svg>
      </div>

      {/* Filmic grading (Stitch) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--void-black)] via-transparent to-[var(--void-black)]/70" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--void-black)]/80 via-[var(--void-black)]/20 to-transparent" />
      <div aria-hidden="true" className="journey-vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-[calc(var(--svh)*100)] flex-col justify-between px-[var(--gutter-x)] pt-24 pb-20">
        <div className="max-w-3xl pt-4 lg:pt-8">
          <h2
            id="journey-heading"
            data-journey-copy
            className="mb-5 text-4xl leading-[1.08] font-light tracking-tight text-[var(--text-primary)] drop-shadow-[0_4px_24px_rgba(3,4,10,0.8)] sm:text-5xl lg:text-6xl"
          >
            Pragyan{" "}
            <span className="bg-gradient-to-r from-[var(--electric-violet)] via-[#7B4DFF] to-[var(--neon-cyan)] bg-clip-text font-normal text-transparent">
              ai
            </span>{" "}
            is new.
            <br />
            Our ai journey isn&apos;t.
          </h2>
          <p
            data-journey-copy
            className="mb-8 max-w-xl text-base leading-relaxed font-light text-[var(--text-soft)]/80 drop-shadow-[0_2px_12px_rgba(3,4,10,0.9)] sm:text-lg"
          >
            A decade of engineering, solving real problems and building for what&apos;s next. We didn&apos;t pivot to
            intelligence yesterday—we laid the computational groundwork over ten years of enterprise execution.
          </p>
          <div data-journey-copy>
            <a
              href="#journey-timeline"
              onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, "#journey-timeline")}
              className="group inline-flex items-center gap-3 rounded-full border border-[var(--border-active)] bg-white/[0.04] px-5 py-2.5 text-sm text-[var(--text-primary)] transition-[border-color,background-color,box-shadow] duration-300 hover:border-[var(--neon-cyan)]/50 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(38,198,255,0.2)]"
            >
              <span className="tracking-wide">Our Journey</span>
              <span aria-hidden="true" className="text-[var(--neon-cyan)] transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>

        <div id="journey-timeline" className="w-full max-w-6xl pt-10 pb-6">
          <div className="relative pt-6 pb-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[29px] right-3 left-3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <div
              aria-hidden="true"
              data-journey-progress
              className="pointer-events-none absolute top-[29px] right-3 left-3 h-px origin-left scale-x-0 bg-gradient-to-r from-[var(--neon-cyan)]/10 via-[var(--neon-cyan)]/60 to-[var(--electric-violet)]/70"
            />
            <ol aria-label="Our journey, 2015 to today" className="relative z-10 grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {MILESTONES.map((milestone) => (
                <li key={milestone.year} data-journey-milestone className="flex flex-col">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`flex items-center justify-center rounded-full ${
                        milestone.tone === "current"
                          ? "h-3 w-3 border border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/20 shadow-[0_0_12px_rgba(38,198,255,0.45)]"
                          : milestone.tone === "horizon"
                            ? "h-3 w-3 border border-[var(--neon-cyan)] bg-[var(--void-black)] shadow-[0_0_12px_rgba(139,45,255,0.7)]"
                            : milestone.tone === "violet"
                              ? "h-2.5 w-2.5 border border-[var(--electric-violet)]/80 bg-[var(--void-black)]"
                              : "h-2.5 w-2.5 border border-[var(--neon-cyan)]/60 bg-[var(--void-black)]"
                      }`}
                    >
                      <span
                        className={`rounded-full ${
                          milestone.tone === "current"
                            ? "h-1.5 w-1.5 bg-[var(--neon-cyan)]"
                            : milestone.tone === "horizon"
                              ? "h-1.5 w-1.5 bg-gradient-to-r from-[var(--electric-violet)] to-[var(--neon-cyan)]"
                              : milestone.tone === "violet"
                                ? "h-1 w-1 bg-[var(--electric-violet)]"
                                : "h-1 w-1 bg-[var(--neon-cyan)]/80"
                        }`}
                      />
                    </span>
                    <span
                      className={`font-[family-name:var(--font-mono)] text-xs tracking-wider ${
                        milestone.tone === "current"
                          ? "font-semibold text-[var(--text-primary)]"
                          : milestone.tone === "horizon"
                            ? "bg-gradient-to-r from-[var(--electric-violet)] to-[var(--neon-cyan)] bg-clip-text font-bold text-transparent"
                            : milestone.tone === "violet"
                              ? "font-semibold text-[var(--electric-violet)]"
                              : "font-semibold text-[var(--neon-cyan)]/90"
                      }`}
                    >
                      {milestone.year}
                    </span>
                  </div>
                  <div
                    className={`border-l pl-4 ${
                      milestone.tone === "current" ? "border-[var(--neon-cyan)]/40" : milestone.tone === "horizon" ? "border-white/10" : "border-white/5"
                    }`}
                  >
                    <h3 className="text-sm font-medium tracking-wide text-[var(--text-primary)]">
                      {milestone.title}
                      {"titleAccent" in milestone && (
                        <span className="ml-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--neon-cyan)]">
                          {milestone.titleAccent}
                        </span>
                      )}
                    </h3>
                    <p
                      className={`mt-0.5 text-[11px] font-light ${
                        milestone.tone === "current" ? "text-[var(--text-soft)]/70" : "text-[var(--text-muted)]"
                      }`}
                    >
                      {milestone.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
