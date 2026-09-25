"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode, type CSSProperties } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigateToHash } from "@/lib/navigation";

gsap.registerPlugin(ScrollTrigger);

type Tone = "cyan" | "violet" | "horizon";

/** A run of achievement text; `accent` renders it in the site's neon-cyan emphasis colour
 * (the PPT's own bold/highlight), and `ai` additionally wires it into the ai-glow-sweep. */
type AchievementSegment = { text: string; accent?: boolean; ai?: boolean };

interface Milestone {
  year: string;
  /** Precise PPT date, shown in the achievement panel for the two timeline endpoints. */
  dateLabel?: string;
  tone: Tone;
  echo: string[];
  paragraphs: AchievementSegment[][];
}

/**
 * Frame 06 — Our Journey. The complete VAYUZ → Pragyan ai timeline, copy transcribed
 * verbatim from "Our Tryst with ai" (Project True North source deck). Do not paraphrase.
 */
const MILESTONES: Milestone[] = [
  {
    year: "2015",
    dateLabel: "Oct 01, 2015",
    tone: "cyan",
    echo: ["FOUNDATION", "ENGINEERING", "ORIGIN"],
    paragraphs: [[{ text: "VAYUZ established. Setting up Foundation of Digital Engineering" }]],
  },
  {
    year: "2016",
    tone: "violet",
    echo: ["PRODUCT", "JUDICIARY", "VELOCITY"],
    paragraphs: [
      [{ text: "Work starts on " }, { text: "BITOVN Product Stack", accent: true }],
      [{ text: "VAYUZ works on US Court Case data to expedite decisions" }],
    ],
  },
  {
    year: "2019",
    tone: "cyan",
    echo: ["AUTOMATION", "COMMERCE", "DASHBOARDS"],
    paragraphs: [
      [{ text: "Deployed " }, { text: "1st Chatbot", accent: true }, { text: " based Food ordering App" }],
      [{ text: "Created unified dashboard for leading auto component maker" }],
    ],
  },
  {
    year: "2020",
    tone: "violet",
    echo: ["DATA", "SCIENCE", "TALENT"],
    paragraphs: [[{ text: "VAYUZ gets its " }, { text: "1st Data Scientist", accent: true }]],
  },
  {
    year: "2021",
    tone: "cyan",
    echo: ["HEALTHCARE", "FINTECH", "SUPPORT"],
    paragraphs: [[{ text: "Deployed " }, { text: "Chatbots for Healthcare, Fintech", accent: true }, { text: " clients" }]],
  },
  {
    year: "2022",
    tone: "violet",
    echo: ["FORECASTING", "ANALYTICS", "FRAMEWORK"],
    paragraphs: [
      [{ text: "Started working on " }, { text: "framework for stronger report and predictive analytics", accent: true }],
    ],
  },
  {
    year: "2023",
    tone: "cyan",
    echo: ["GRID", "REVENUE", "GOVERNANCE"],
    paragraphs: [
      [{ text: "Deployed Grid Intelligence and " }, { text: "ai revenue forecasting system", accent: true, ai: true }],
      [{ text: "Deployed Water Forecasting System for State Govt." }],
    ],
  },
  {
    year: "2024",
    tone: "violet",
    echo: ["PRAGYAN", "MISSION", "COGNITION"],
    paragraphs: [
      [{ text: "ai mission coined in VAYUZ", accent: true, ai: true }, { text: " as Pragyan (Pai)" }],
      [{ text: "Pai created ai droplets for Bitovn Suite" }],
    ],
  },
  {
    year: "2025",
    tone: "cyan",
    echo: ["WEALTH", "ATS", "DEPLOYMENT"],
    paragraphs: [
      [{ text: "Deployed " }, { text: "ai solutions for leading Wealth Management Firm", accent: true, ai: true }],
      [{ text: "RAPYD Exchange (V1): " }, { text: "ai-based ATS launched", accent: true, ai: true }],
    ],
  },
  {
    year: "2026",
    dateLabel: "May 07, 2026",
    tone: "horizon",
    echo: ["PRAGYAN", "AUTONOMOUS", "HORIZON"],
    paragraphs: [
      [
        { text: "Pragyan ai INNOVATIONS", accent: true, ai: true },
        { text: " spun off from VAYUZ Technologies as an independent ai organization" },
      ],
    ],
  },
];

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

/** Centre of the painted summit gateway, in the same 1600 × 889 image-pixel space as PATH_SEGMENTS. */
const GATE_GLOW = { cx: 1150, cy: 205 };

/** Small, fixed star field for the sky-layer parallax — positions as a percentage of the image. */
const STAR_POINTS = [
  { x: 8, y: 10, size: 2, delay: 0, opacity: 0.35 },
  { x: 18, y: 22, size: 1.5, delay: 0.8, opacity: 0.3 },
  { x: 27, y: 6, size: 1.5, delay: 1.6, opacity: 0.4 },
  { x: 35, y: 30, size: 2, delay: 0.4, opacity: 0.28 },
  { x: 44, y: 14, size: 1.5, delay: 2.2, opacity: 0.35 },
  { x: 52, y: 26, size: 1.5, delay: 1.1, opacity: 0.3 },
  { x: 61, y: 8, size: 2, delay: 2.8, opacity: 0.4 },
  { x: 68, y: 34, size: 1.5, delay: 0.6, opacity: 0.28 },
  { x: 76, y: 16, size: 1.5, delay: 1.9, opacity: 0.32 },
  { x: 84, y: 28, size: 2, delay: 0.2, opacity: 0.35 },
  { x: 91, y: 12, size: 1.5, delay: 2.4, opacity: 0.3 },
  { x: 14, y: 38, size: 1.5, delay: 1.4, opacity: 0.25 },
] as const;

const PARAGRAPH =
  "A decade of engineering, solving real problems and building for what's next. We didn't pivot to intelligence yesterday—we laid the computational groundwork over ten years of enterprise execution.";

/**
 * Pacing of the self-running timeline, in seconds: how long a milestone holds once it is
 * fully lit, and how long the cross into the next one takes. One milestone therefore occupies
 * `hold + transition`, and a full 2015 → 2026 → 2015 loop is that times MILESTONES.length.
 * Adjust here — every dot, year, indicator and achievement transition derives from these.
 */
const MILESTONE_CYCLE = { hold: 2.5, transition: 0.8 };

const smooth = (edge0: number, edge1: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Text colour (plus the constant glow for the horizon tone) shared by the axis year and the
 * achievement panel's date heading, so a milestone reads consistently in both places. */
const toneTextClass = (tone: Tone) =>
  tone === "horizon"
    ? "journey-text-glow bg-gradient-to-r from-[var(--electric-violet)] to-[var(--neon-cyan)] bg-clip-text font-bold text-transparent"
    : tone === "violet"
      ? "font-semibold text-[var(--electric-violet)]"
      : "font-semibold text-[var(--neon-cyan)]/90";

const toneDotOuterClass = (tone: Tone) =>
  tone === "horizon"
    ? "h-3 w-3 border border-[var(--neon-cyan)] bg-[var(--void-black)] shadow-[0_0_12px_rgba(139,45,255,0.7)]"
    : tone === "violet"
      ? "h-2 w-2 border border-[var(--electric-violet)]/80 bg-[var(--void-black)]"
      : "h-2 w-2 border border-[var(--neon-cyan)]/60 bg-[var(--void-black)]";

const toneDotInnerClass = (tone: Tone) =>
  tone === "horizon"
    ? "h-1.5 w-1.5 bg-gradient-to-r from-[var(--electric-violet)] to-[var(--neon-cyan)]"
    : tone === "violet"
      ? "h-1 w-1 bg-[var(--electric-violet)]"
      : "h-1 w-1 bg-[var(--neon-cyan)]/80";

/** Renders PARAGRAPH as inline-block word spans (for runtime line-grouping) separated by real space text nodes. */
function renderParagraphWords(text: string) {
  const words = text.split(" ");
  const nodes: ReactNode[] = [];
  words.forEach((word, index) => {
    nodes.push(
      <span key={`word-${index}`} data-journey-para-word className="inline-block">
        {word}
      </span>,
    );
    if (index < words.length - 1) nodes.push(" ");
  });
  return nodes;
}

export default function OurJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const parallax = section.querySelector<HTMLElement>("[data-journey-parallax]");
    const starsLayer = section.querySelector<HTMLElement>("[data-journey-stars]");
    const traces = Array.from(section.querySelectorAll<SVGPathElement>("[data-journey-trace]"));
    const traceGroup = section.querySelector<SVGGElement>("[data-journey-traces]");
    const head = section.querySelector<SVGGElement>("[data-journey-head]");
    const headGlow = section.querySelector<SVGCircleElement>("[data-journey-head] circle");
    const gateGlow = section.querySelector<SVGGElement>("[data-journey-gate]");
    const milestones = Array.from(section.querySelectorAll<HTMLElement>("[data-journey-milestone]"));
    const milestoneYears = milestones.map((el) => el.querySelector<HTMLElement>("[data-journey-year]"));
    const milestoneConnectors = milestones.map((el) => el.querySelector<HTMLElement>("[data-journey-connector]"));
    const milestoneDots = milestones.map((el) => el.querySelector<HTMLElement>("[data-journey-dot]"));
    const milestoneEchoGroups = milestones.map((el) => Array.from(el.querySelectorAll<HTMLElement>("[data-journey-echo-word]")));
    const achievementBlocks = Array.from(section.querySelectorAll<HTMLElement>("[data-journey-achievement]"));
    const aiTargets = Array.from(section.querySelectorAll<HTMLElement>("[data-journey-ai]")).map((el) => ({
      el,
      milestones: (el.dataset.journeyAiFor ?? "").split(",").filter(Boolean).map(Number),
    }));
    const progressLine = section.querySelector<HTMLElement>("[data-journey-progress]");

    // Only the active milestone's achievement text is ever shown; everything else starts hidden.
    achievementBlocks.forEach((block) => {
      block.style.opacity = "0";
      block.style.visibility = "hidden";
    });
    const showAchievementInstant = (index: number) => {
      achievementBlocks.forEach((block, i) => {
        block.style.opacity = i === index ? "1" : "0";
        block.style.visibility = i === index ? "visible" : "hidden";
      });
    };

    // Segment lengths (traces come in halo/core pairs per segment).
    const lengths = PATH_SEGMENTS.map((_, index) => traces[index * 2]?.getTotalLength() ?? 0);
    const total = lengths.reduce((sum, length) => sum + length, 0);
    traces.forEach((trace, index) => {
      const length = lengths[Math.floor(index / 2)];
      trace.style.strokeDasharray = `${length} ${length}`;
    });

    const { hold: holdSeconds, transition: transitionSeconds } = MILESTONE_CYCLE;

    // The axis state: the active dot, year and connector ease into their lit state while the
    // rest ease back. Tweened (not written per frame) so a milestone change reads as a
    // continuous move along the timeline rather than a cut. `animated: false` is the
    // reduced-motion path, which lands the same styling with no motion.
    const applyMilestoneState = (index: number, animated: boolean) => {
      const settle = (element: HTMLElement | null, vars: gsap.TweenVars) => {
        if (!element) return;
        if (animated) gsap.to(element, { ...vars, duration: transitionSeconds, ease: "power2.out", overwrite: true });
        else gsap.set(element, vars);
      };
      milestones.forEach((_, i) => {
        const isActive = i === index;
        settle(milestoneDots[i], { scale: isActive ? 1.3 : 1, filter: isActive ? "brightness(1.3)" : "brightness(1)" });
        settle(milestoneYears[i], { scale: isActive ? 1.1 : 1, filter: isActive ? "brightness(1.25)" : "brightness(1)" });
        settle(milestoneConnectors[i], { scaleY: isActive ? 1 : 0.45 });
      });
      // The indicator travels along the axis to the milestone in play. Index-based rather than
      // measured, so it stays monotonic when the axis wraps to two rows on narrow screens.
      const reached = MILESTONES.length > 1 ? index / (MILESTONES.length - 1) : 1;
      if (progressLine) {
        if (animated) gsap.to(progressLine, { scaleX: reached, duration: transitionSeconds, ease: "power2.inOut", overwrite: true });
        else gsap.set(progressLine, { scaleX: reached });
      }
    };

    // Runs once each time the self-running timeline reaches a milestone: moves the axis state,
    // swaps the achievement panel's content and fires the brief accents. Every year stays on
    // the axis throughout — only the achievement text is exchanged.
    const activateMilestone = (index: number) => {
      applyMilestoneState(index, true);
      // Every block except the incoming one fades out, so exactly one achievement is ever
      // readable. overwrite is required on both tweens: GSAP's default lets a block's outgoing
      // and incoming tweens run at once, and the longer-lived one then wins, stranding old
      // text on screen.
      achievementBlocks.forEach((block, i) => {
        // Every non-active block is tweened out unconditionally, including ones that still
        // read as opacity 0: a milestone left mid-delay would otherwise keep its pending
        // fade-in and strand two achievements on screen.
        if (i === index) return;
        gsap.to(block, {
          autoAlpha: 0,
          y: -8,
          duration: transitionSeconds * 0.7,
          ease: "power1.in",
          overwrite: true,
          onComplete: () => {
            block.style.visibility = "hidden";
          },
        });
      });
      const achievementBlock = achievementBlocks[index];
      if (achievementBlock) {
        achievementBlock.style.visibility = "visible";
        gsap.fromTo(
          achievementBlock,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: transitionSeconds,
            ease: "power2.out",
            delay: transitionSeconds * 0.3,
            overwrite: true,
          },
        );
      }

      const echoWords = milestoneEchoGroups[index];
      if (echoWords.length) {
        gsap.killTweensOf(echoWords);
        gsap.fromTo(
          echoWords,
          { autoAlpha: 0, y: 6 },
          {
            autoAlpha: 0.35,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power1.out",
            onComplete: () => {
              gsap.to(echoWords, { autoAlpha: 0, duration: 0.7, delay: 0.9, stagger: 0.04, ease: "power1.in" });
            },
          },
        );
      }
      // Not killTweensOf here: the headline's second "ai" is also entrance-animated once by
      // the word reveal, and killing a target that's part of an already-completed staggered
      // timeline tween resets it to that tween's start state instead of leaving it settled.
      // GSAP's default "auto" overwrite already handles two overlapping filter tweens safely.
      const matchingAi = aiTargets.filter((target) => target.milestones.includes(index)).map((target) => target.el);
      if (matchingAi.length) {
        gsap
          .timeline()
          .to(matchingAi, {
            filter: "brightness(1.35) drop-shadow(0 0 10px rgba(139,45,255,0.55)) drop-shadow(0 0 6px rgba(38,198,255,0.4))",
            duration: 0.45,
            stagger: 0.08,
            ease: "power1.out",
          })
          .to(matchingAi, { filter: "brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))", duration: 0.6, stagger: 0.08, ease: "power1.in" }, "-=0.1");
      }
    };

    // Scroll still drives the environment — the parallax, the energy trace climbing the
    // mountain and the gateway lighting up. Which year is active no longer depends on it.
    const reveal = (t: number) => {
      if (parallax) parallax.style.transform = `translateY(${(-2.5 + 5 * t).toFixed(3)}%)`;
      if (starsLayer) starsLayer.style.transform = `translateY(${(-1 + 2 * t).toFixed(3)}%)`;

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

      // The gateway glows in as the journey nears its final chapters, brightens through 2026,
      // and briefly flashes as the travelling light arrives and disappears into it.
      if (gateGlow) {
        const base = smooth(0.55, 1, t);
        const flash = smooth(0.9, 0.97, t) * (1 - smooth(0.97, 1, t)) * 0.3;
        gateGlow.style.opacity = `${Math.min(1, base + flash).toFixed(3)}`;
      }

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
      // No self-running timeline: the journey is shown arrived, resting on its latest chapter.
      const last = MILESTONES.length - 1;
      reveal(1);
      applyMilestoneState(last, false);
      showAchievementInstant(last);
      return () => {
        resizeObserver.disconnect();
        narrow.removeEventListener("change", alignTrace);
      };
    }

    reveal(0);
    const context = gsap.context(() => {
      // Entry: headline word-by-word, paragraph line-by-line, then the CTA. Time-based
      // (toggleActions, not scrub) so it plays once and stays visible regardless of scroll speed.
      const headlineWords = Array.from(section.querySelectorAll<HTMLElement>("[data-journey-word]"));
      const paraWords = Array.from(section.querySelectorAll<HTMLElement>("[data-journey-para-word]"));
      const ctaEl = section.querySelector<HTMLElement>("[data-journey-cta]");

      const lineGroups: HTMLElement[][] = [];
      paraWords.forEach((word) => {
        const top = word.offsetTop;
        const lastGroup = lineGroups[lineGroups.length - 1];
        if (lastGroup && Math.abs(top - lastGroup[0].offsetTop) < 4) {
          lastGroup.push(word);
        } else {
          lineGroups.push([word]);
        }
      });

      const introTl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
      });
      if (headlineWords.length) {
        introTl.fromTo(headlineWords, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.045, ease: "power2.out" });
      }
      lineGroups.forEach((group, index) => {
        introTl.fromTo(
          group,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          index === 0 ? "-=0.1" : "-=0.28",
        );
      });
      if (ctaEl) {
        introTl.fromTo(ctaEl, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.15");
      }

      // The energy trace climbing to the gateway still reads off the scroll, as the section
      // comes into view. It no longer decides which year is lit.
      const path = { t: 0 };
      gsap.to(path, {
        t: 1,
        ease: "none",
        onUpdate: () => reveal(path.t),
        scrollTrigger: { trigger: section, start: "top 85%", end: "top 8%", scrub: 0.8 },
      });
    }, section);

    // One self-running timeline walks 2015 → 2026 and loops back to 2015, indefinitely. A
    // single repeating timeline (rather than chained timeouts) means nothing accumulates: the
    // callbacks are fixed, and killing it on unmount stops everything.
    const stepSeconds = holdSeconds + transitionSeconds;
    const autoplay = gsap.timeline({ repeat: -1, paused: true });
    MILESTONES.forEach((_, index) => {
      autoplay.call(activateMilestone, [index], index * stepSeconds);
    });
    // Empty tail tween: reserves the final milestone's own hold, so 2026 is shown for as long
    // as the rest before the loop returns to 2015.
    autoplay.to({}, { duration: stepSeconds }, (MILESTONES.length - 1) * stepSeconds);

    // Idle off-screen — the sequence is only worth running while the section can be seen.
    const visibility = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? autoplay.play() : autoplay.pause()));
      },
      { threshold: 0 },
    );
    visibility.observe(section);

    return () => {
      visibility.disconnect();
      autoplay.kill();
      gsap.killTweensOf([...achievementBlocks, ...milestoneDots, ...milestoneYears, ...milestoneConnectors].filter(Boolean));
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
      className="relative isolate min-h-[calc(var(--svh)*100)] overflow-hidden"
    >
      <div className="relative h-[calc(var(--svh)*100)] w-full overflow-hidden">
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
          {/* Discrete star points — a second, independent parallax layer for sky depth. */}
          <div data-journey-stars aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {STAR_POINTS.map((star, index) => (
              <span
                key={index}
                className="journey-star absolute rounded-full bg-white"
                style={
                  {
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    animationDelay: `${star.delay}s`,
                    "--star-base": star.opacity,
                  } as CSSProperties
                }
              />
            ))}
          </div>
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
              <radialGradient id="journey-gate-glow">
                <stop offset="0%" stopColor="#eafcff" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#26C6FF" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#8B2DFF" stopOpacity="0.18" />
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
            {/* Summit gateway: glows in through the later chapters, fully lit and gently pulsing at 2026. */}
            <g data-journey-gate style={{ opacity: 0 }}>
              <circle cx={GATE_GLOW.cx} cy={GATE_GLOW.cy} r="150" fill="url(#journey-gate-glow)" />
              <circle
                className="journey-gate-pulse"
                cx={GATE_GLOW.cx}
                cy={GATE_GLOW.cy}
                r="85"
                fill="url(#journey-gate-glow)"
                style={{ transformOrigin: `${GATE_GLOW.cx}px ${GATE_GLOW.cy}px` }}
              />
            </g>
          </svg>
        </div>

        {/* Filmic grading (Stitch) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--void-black)] via-transparent to-[var(--void-black)]/70" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--void-black)]/80 via-[var(--void-black)]/20 to-transparent" />
        <div aria-hidden="true" className="journey-vignette pointer-events-none absolute inset-0" />

        <div className="relative z-10 flex h-full flex-col justify-between px-[var(--gutter-x)] pt-24 pb-8">
          <div className="max-w-3xl pt-4 lg:pt-6">
            <h2
              id="journey-heading"
              className="mb-4 text-4xl leading-[1.08] font-light tracking-tight text-[var(--text-primary)] drop-shadow-[0_4px_24px_rgba(3,4,10,0.8)] sm:text-5xl lg:text-6xl"
            >
              <span data-journey-word className="inline-block">
                Pragyan
              </span>{" "}
              <span
                data-journey-word
                className="journey-text-glow inline-block bg-gradient-to-r from-[var(--electric-violet)] via-[#7B4DFF] to-[var(--neon-cyan)] bg-clip-text font-normal text-transparent"
              >
                ai
              </span>{" "}
              <span data-journey-word className="inline-block">
                is
              </span>{" "}
              <span data-journey-word className="inline-block">
                new.
              </span>
              <br />
              <span data-journey-word className="inline-block">
                Our
              </span>{" "}
              <span data-journey-word data-journey-ai data-journey-ai-for="6,7,8,9" className="inline-block">
                ai
              </span>{" "}
              <span data-journey-word className="inline-block">
                journey
              </span>{" "}
              <span data-journey-word className="inline-block">
                isn&apos;t.
              </span>
            </h2>
            <p className="mb-6 max-w-xl text-base leading-relaxed font-light text-[var(--text-soft)]/80 drop-shadow-[0_2px_12px_rgba(3,4,10,0.9)] sm:text-lg">
              {renderParagraphWords(PARAGRAPH)}
            </p>
            <div data-journey-cta>
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

          <div id="journey-timeline" className="w-full max-w-6xl pt-4 pb-4">
            {/* Achievement panel: one milestone's exact PPT text at a time, crossfading as the
                journey progresses. 2026 has nothing after it, so it simply stays once reached. */}
            <div className="relative mb-6 min-h-[6.5rem] max-w-xl sm:min-h-[5rem]">
              {MILESTONES.map((milestone, index) => (
                <div key={milestone.year} data-journey-achievement className="absolute inset-x-0 top-0 flex flex-col gap-1">
                  <span className={`mb-1 font-[family-name:var(--font-mono)] text-xs tracking-[0.2em] uppercase ${toneTextClass(milestone.tone)}`}>
                    {milestone.dateLabel ?? milestone.year}
                  </span>
                  {milestone.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-sm leading-relaxed font-light text-[var(--text-soft)] sm:text-base">
                      {paragraph.map((segment, sIndex) =>
                        segment.accent ? (
                          <span
                            key={sIndex}
                            {...(segment.ai ? { "data-journey-ai": "true", "data-journey-ai-for": index } : {})}
                            className="font-medium text-[var(--neon-cyan)]"
                          >
                            {segment.text}
                          </span>
                        ) : (
                          <span key={sIndex}>{segment.text}</span>
                        ),
                      )}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Year axis: always visible, so the complete journey stays legible throughout. */}
            <div className="relative pt-4 pb-2">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[22px] right-3 left-3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <div
                aria-hidden="true"
                data-journey-progress
                className="pointer-events-none absolute top-[22px] right-3 left-3 h-px origin-left scale-x-0 bg-gradient-to-r from-[var(--neon-cyan)]/10 via-[var(--neon-cyan)]/60 to-[var(--electric-violet)]/70"
              />
              <ol aria-label="Our journey, 2015 to 2026" className="relative z-10 grid grid-cols-5 gap-x-1 gap-y-6 sm:grid-cols-10 sm:gap-x-1.5">
                {MILESTONES.map((milestone) => (
                  <li key={milestone.year} data-journey-milestone className="relative flex flex-col items-center">
                    {/* Data-echo words: a brief, low-opacity accent when this milestone becomes active. */}
                    <div
                      data-journey-echo
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 -top-4 flex justify-center gap-1 opacity-0"
                    >
                      {milestone.echo.map((word) => (
                        <span
                          key={word}
                          data-journey-echo-word
                          className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[6px] tracking-[0.1em] text-[var(--neon-cyan)]/80 uppercase sm:text-[7px]"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                    {/* Fixed-height well: the horizon dot is larger, and without this its year
                        label would sit lower than the rest of the axis. */}
                    <span aria-hidden="true" className="flex h-3 items-center justify-center">
                      <span data-journey-dot className={`flex items-center justify-center rounded-full ${toneDotOuterClass(milestone.tone)}`}>
                        <span className={`rounded-full ${toneDotInnerClass(milestone.tone)}`} />
                      </span>
                    </span>
                    <span
                      data-journey-year
                      className={`mt-1.5 font-[family-name:var(--font-mono)] text-[9px] tracking-wider sm:text-[11px] ${toneTextClass(milestone.tone)}`}
                    >
                      {milestone.year}
                    </span>
                    <span aria-hidden="true" data-journey-connector className="journey-connector mt-1 h-2 w-px bg-white/15" />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
