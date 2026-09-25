"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CINEMATIC_ASSETS,
  computeSceneFrame,
  createSceneRig,
  type LayerState,
  type SceneFrame,
} from "@/lib/cinematic/scene";
import { registerCinematicImage } from "@/lib/cinematic/assetReadiness";
import { GatewayPortal, PortalInterior } from "./GatewayPortal";
import {
  CornealReflection,
  FloorGlow,
  GateGlow,
  IrisLightSpill,
  LightBloom,
  LightRays,
  PupilDepthHaze,
  PupilLightScatter,
  ThresholdFog,
  Vignette,
} from "./AtmosphericLayers";
import TransitionToArrival from "./TransitionToArrival";
import ParticleField, { type ParticleFieldHandle } from "./ParticleField";
import BeliefFrame from "../sections/BeliefFrame";

gsap.registerPlugin(ScrollTrigger);

type LayerKey =
  | "eye"
  | "pupilHaze"
  | "pupilGlow"
  | "irisSpill"
  | "cornealGlint"
  | "gateGlow"
  | "interior"
  | "floorGlow"
  | "thresholdFog"
  | "gate"
  | "rays"
  | "deceleration"
  | "constellation"
  | "nodeGlow"
  | "nodeRays"
  | "beliefBackground"
  | "bloom";

interface FrameCopy {
  /** Internal identifier only (React key); no numbered chapter label is rendered. */
  label: string;
  /** Simple per-line heading (each line is its own row). */
  heading?: string[];
  /** The Thought line only: sequential fragments that reveal one after another. */
  staged?: { text: string; accent?: boolean }[];
  /** One-off markup for headings the generic `heading`/`staged` shapes can't express
   * (the Gate title's mixed line sizes and accented internal dot). */
  custom?: ReactNode;
  headingLevel: "h1" | "h2";
  sub?: string[];
  /** A smaller, self-contained block (its own heading/tagline/copy) instead of a single big headline. */
  card?: ReactNode;
  /** Mirrors `card`/`heading` on the right side of the viewport, independent of the left column. */
  rightContent?: ReactNode;
  /** Centred near the bottom of the viewport, independent of the (left-aligned) heading column. */
  scrollCue?: string;
}

/** Frames of the opening scene, keyframed by scroll. The Belief frame follows as its resting state. */
const FRAMES: FrameCopy[] = [
  {
    label: "the-eye",
    headingLevel: "h1",
    staged: [
      { text: "A smarter" },
      { text: "yesterday", accent: true },
      { text: "is already looking at us." },
    ],
  },
  {
    label: "the-gate-of-p-ai",
    headingLevel: "h2",
    custom: (
      <>
        <span className="block">The Gate of</span>
        <span className="block text-[1.1em]">
          P<span className="gate-period">.</span>ai
        </span>
      </>
    ),
    scrollCue: "Scroll to Enter",
  },
  {
    label: "pragyan-ai-definition",
    headingLevel: "h2",
    card: (
      <div className="max-w-[30rem]">
        <h3 className="cinematic-headline text-[clamp(1.5rem,2.6vw,2.15rem)] text-[var(--text-primary)]">
          Pragyan{" "}
          <span className="inline-block rounded-[0.15em] bg-[var(--electric-violet)] px-[0.22em] py-[0.02em] text-[var(--void-black)]">
            ai
          </span>{" "}
          INNOVATIONS
        </h3>
        <p className="mt-2 text-base font-medium tracking-wide text-[#F2C744] sm:text-lg">
          Intelligence for Efficient Results
        </p>
        <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
          Pragyan ai INNOVATIONS is the dedicated artificial intelligence company of VAYUZ Technologies,
          focused on helping enterprises adopt ai with confidence. We combine research, engineering and
          innovation to create intelligent products, modernize enterprise platforms, integrate ai across
          digital ecosystems and build the foundation for a trusted Sovereign ai ecosystem.
        </p>
      </div>
    ),
    rightContent: (
      <p className="max-w-[24rem] text-lg leading-snug font-light text-[var(--text-primary)] sm:text-xl">
        Human Intelligence + Artificial Intelligence ={" "}
        <span className="relative inline-block pb-1.5">
          Infinite Possibilities
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden rounded-full bg-[#F2C744]/20"
          >
            <span className="definition-underline-sweep absolute inset-y-0 left-0 w-1/3 rounded-full bg-[#F2C744]" />
          </span>
        </span>
      </p>
    ),
  },
  {
    label: "pass-through-the-gate",
    heading: ["Beyond borders.", "Into intelligence."],
    headingLevel: "h2",
  },
];

/* ------------------------------------------------------------------ */
/* Direct style writes (no React state during scroll)                   */
/* ------------------------------------------------------------------ */

interface WrittenStyle {
  transform: string;
  opacity: string;
  visibility: string;
  clipPath: string;
  filter: string;
}

type StyledElement = HTMLElement | SVGElement;

const written = new WeakMap<StyledElement, WrittenStyle>();

function styleCache(el: StyledElement): WrittenStyle {
  let cached = written.get(el);
  if (!cached) {
    cached = { transform: "", opacity: "", visibility: "", clipPath: "", filter: "" };
    written.set(el, cached);
  }
  return cached;
}

function writeLayer(
  el: HTMLElement | undefined,
  state: LayerState,
  extra?: { clipPath?: string | null; filter?: string | null },
) {
  if (!el) return;
  const cache = styleCache(el);
  const visible = state.o > 0.001;
  const visibility = visible ? "visible" : "hidden";
  if (cache.visibility !== visibility) el.style.visibility = cache.visibility = visibility;
  if (!visible) return;

  const opacity = state.o >= 0.999 ? "1" : state.o.toFixed(3);
  if (cache.opacity !== opacity) el.style.opacity = cache.opacity = opacity;

  const transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) scale(${state.s.toFixed(5)})`;
  if (cache.transform !== transform) el.style.transform = cache.transform = transform;

  if (extra && "clipPath" in extra) {
    const clip = extra.clipPath ?? "none";
    if (cache.clipPath !== clip) el.style.clipPath = cache.clipPath = clip;
  }
  if (extra && "filter" in extra) {
    const filter = extra.filter ?? "none";
    if (cache.filter !== filter) el.style.filter = cache.filter = filter;
  }
}

function writeOpacity(el: StyledElement | null | undefined, opacity: number, translateY?: number) {
  if (!el) return;
  const cache = styleCache(el);
  const visibility = opacity > 0.001 ? "visible" : "hidden";
  if (cache.visibility !== visibility) el.style.visibility = cache.visibility = visibility;
  const value = opacity >= 0.999 ? "1" : opacity.toFixed(3);
  if (cache.opacity !== value) el.style.opacity = cache.opacity = value;
  if (translateY !== undefined) {
    const transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
    if (cache.transform !== transform) el.style.transform = cache.transform = transform;
  }
}

declare global {
  interface Window {
    /** Set by browser tests only; enables a per-frame "pragyan:scene-frame" event. */
    __PRAGYAN_DEBUG__?: boolean;
  }
}

export interface SceneFrameDebugDetail {
  frame: SceneFrame;
  /** ScrollTriggers attached to the cinematic scene (must stay 1). */
  scrollTriggers: number;
  /** All ScrollTriggers on the page, including the content frames. */
  allScrollTriggers: number;
}

/* ------------------------------------------------------------------ */
/* Master cinematic scene: Frame 01 → 02 → 03 → 04 → 04.5 → 05          */
/* ------------------------------------------------------------------ */

export default function CinematicOpening({
  introComplete,
  gateReady,
}: {
  introComplete: boolean;
  /** False until the header has settled after the opening blinks; the Gate stays fully
   * hidden inside the iris until then, then eases in over ~0.75s once it flips true. */
  gateReady: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Partial<Record<LayerKey, HTMLElement>>>({});
  const textRef = useRef<(HTMLElement | null)[]>([]);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<ParticleFieldHandle>(null);
  const beliefGradeRef = useRef<HTMLDivElement | null>(null);
  const gateRevealRef = useRef({ v: 0 });
  const renderRef = useRef<() => void>(() => {});
  const beliefRef = useRef<{
    nodeAnchor: HTMLElement | null;
    node: HTMLElement | null;
    lines: (SVGLineElement | null)[];
    cards: (HTMLElement | null)[];
  }>({ nodeAnchor: null, node: null, lines: [], cards: [] });

  const bindLayer = (key: LayerKey) => (element: HTMLElement | null) => {
    if (element) layersRef.current[key] = element;
    else delete layersRef.current[key];
  };
  const bindText = (index: number) => (element: HTMLElement | null) => {
    textRef.current[index] = element;
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const viewport = viewportRef.current;
    if (!wrapper || !viewport) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    // The arrival settles on the Frame 05 network node when that layout is present.
    const measureBeliefAnchor = () => {
      const anchor = beliefRef.current.nodeAnchor;
      if (!anchor || anchor.getClientRects().length === 0) return null;
      const anchorBox = anchor.getBoundingClientRect();
      const viewportBox = viewport.getBoundingClientRect();
      return { x: anchorBox.left - viewportBox.left, y: anchorBox.top - viewportBox.top };
    };
    let rig = createSceneRig(viewport.clientWidth, viewport.clientHeight, measureBeliefAnchor());
    let intense = false;
    const progress = { p: 0 };
    const debug = window.__PRAGYAN_DEBUG__ === true;

    const render = () => {
      const frame = computeSceneFrame(progress.p, rig, reducedMotion);
      const layers = layersRef.current;

      // Everything that would let the Gate (or its light) show inside the iris is held at
      // zero until the header has settled, then eased in by gateRevealRef — the eye must be
      // the first impression, with no Gate hint underneath it. Position/scale/filter are the
      // scene's own untouched math; only opacity is scaled, so the reveal still lands exactly
      // where the existing camera path already puts it.
      const gateReveal = gateRevealRef.current.v;
      const gated = (state: LayerState): LayerState =>
        gateReveal >= 0.999 ? state : { ...state, o: state.o * gateReveal };

      writeLayer(layers.eye, frame.eye);
      writeLayer(layers.gateGlow, gated(frame.gateGlow));
      writeLayer(layers.interior, gated(frame.interior), { clipPath: frame.interior.clip });
      writeLayer(layers.thresholdFog, gated(frame.thresholdFog));
      writeLayer(layers.floorGlow, gated(frame.floorGlow));
      writeLayer(layers.gate, gated(frame.gate), { filter: frame.gateFilter });
      writeLayer(layers.pupilHaze, gated(frame.pupilHaze));
      writeLayer(layers.pupilGlow, gated(frame.pupilGlow));
      writeLayer(layers.irisSpill, gated(frame.irisSpill));
      writeLayer(layers.cornealGlint, gated(frame.cornealGlint));
      writeLayer(layers.rays, frame.rays);
      writeLayer(layers.deceleration, frame.deceleration);
      writeLayer(layers.constellation, frame.constellation);
      writeLayer(layers.beliefBackground, frame.beliefBackground);
      writeLayer(layers.nodeGlow, frame.nodeGlow);
      writeLayer(layers.nodeRays, frame.nodeGlow);
      writeLayer(layers.bloom, frame.bloom);

      particlesRef.current?.render(frame.particles);

      const belief = beliefRef.current;
      writeOpacity(beliefGradeRef.current, frame.beliefGrade);
      writeOpacity(belief.node, frame.belief.node);
      frame.belief.lines.forEach((opacity, index) => writeOpacity(belief.lines[index], opacity));
      frame.belief.cards.forEach((card, index) => writeOpacity(belief.cards[index], card.o, card.y));

      writeOpacity(vignetteRef.current, frame.vignette);
      writeOpacity(scrimRef.current, frame.scrim);
      writeOpacity(hintRef.current, frame.scrollHint);
      frame.text.forEach((text, index) => writeOpacity(textRef.current[index], text.o, text.y));

      if (frame.intense !== intense) {
        intense = frame.intense;
        document.documentElement.toggleAttribute("data-scene-intense", intense);
      }
      if (debug) {
        const all = ScrollTrigger.getAll();
        const detail: SceneFrameDebugDetail = {
          frame,
          scrollTriggers: all.filter((instance) => instance.trigger === wrapper).length,
          allScrollTriggers: all.length,
        };
        window.dispatchEvent(new CustomEvent("pragyan:scene-frame", { detail }));
      }
    };
    renderRef.current = render;

    // ONE timeline + ONE ScrollTrigger drive the entire opening and arrival.
    const timeline = gsap.timeline({ paused: true, onUpdate: render });
    timeline.to(progress, { p: 1, duration: 1, ease: "none" });
    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      animation: timeline,
      scrub: reducedMotion ? true : 0.9,
    });

    const resizeObserver = new ResizeObserver(() => {
      rig = createSceneRig(viewport.clientWidth, viewport.clientHeight, measureBeliefAnchor());
      render();
    });
    resizeObserver.observe(viewport);
    if (beliefRef.current.nodeAnchor?.parentElement) resizeObserver.observe(beliefRef.current.nodeAnchor.parentElement);

    const onMotionPreferenceChange = () => {
      reducedMotion = motionQuery.matches;
      render();
    };
    motionQuery.addEventListener("change", onMotionPreferenceChange);

    render();

    return () => {
      motionQuery.removeEventListener("change", onMotionPreferenceChange);
      resizeObserver.disconnect();
      trigger.kill();
      timeline.kill();
      document.documentElement.removeAttribute("data-scene-intense");
    };
  }, []);

  // The Gate stays fully hidden inside the iris until the header has settled; once
  // `gateReady` flips true it eases in on its own short tween, independent of scroll.
  useEffect(() => {
    if (!gateReady) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = gateRevealRef.current;
    const tween = gsap.to(state, {
      v: 1,
      duration: reducedMotion ? 0.01 : 0.75,
      ease: "power1.out",
      onUpdate: () => renderRef.current(),
    });
    return () => {
      tween.kill();
    };
  }, [gateReady]);

  const { eye } = CINEMATIC_ASSETS;

  return (
    <div
      ref={wrapperRef}
      data-testid="cinematic-scene"
      className="relative h-[calc(var(--svh)*700)] md:h-[calc(var(--svh)*820)]"
    >
      {/* No background of its own: the cosmic field sits behind the whole page, and an opaque
          viewport here blanked it out for the entire opening — including the long stretch after
          the gate, which then read as dead black rather than open space. The eye and gate layers
          already cover the frame during the beats that need darkness. */}
      <div
        ref={viewportRef}
        className="sticky top-0 h-[calc(var(--lvh)*100)] w-full overflow-hidden"
      >
        {/* 01 — the eye (nearest to the camera) */}
        <Image
          ref={(img) => {
            registerCinematicImage("eye", img);
            bindLayer("eye")(img);
          }}
          src={eye.src}
          alt="Extreme close-up of a human eye emerging from darkness"
          width={eye.width}
          height={eye.height}
          quality={90}
          preload
          draggable={false}
          data-layer="eye"
          className="scene-layer scene-eye"
          style={{ width: eye.width, height: eye.height }}
        />

        {/* 02–04 — the gateway world */}
        <GateGlow layerRef={bindLayer("gateGlow")} />
        <PortalInterior layerRef={bindLayer("interior")} />
        <ThresholdFog layerRef={bindLayer("thresholdFog")} />
        <FloorGlow layerRef={bindLayer("floorGlow")} />
        <GatewayPortal layerRef={bindLayer("gate")} />

        {/* The gateway seen through the pupil: depth haze, scattered light, iris spill, corneal reflection */}
        <PupilDepthHaze layerRef={bindLayer("pupilHaze")} />
        <PupilLightScatter layerRef={bindLayer("pupilGlow")} />
        <IrisLightSpill layerRef={bindLayer("irisSpill")} />
        <CornealReflection layerRef={bindLayer("cornealGlint")} />

        <LightRays layerRef={bindLayer("rays")} />

        {/* 04.5 → 05 — deceleration and arrival */}
        <TransitionToArrival
          bind={{
            deceleration: bindLayer("deceleration"),
            constellation: bindLayer("constellation"),
            nodeGlow: bindLayer("nodeGlow"),
            nodeRays: bindLayer("nodeRays"),
            beliefBackground: bindLayer("beliefBackground"),
            beliefGrade: (element) => void (beliefGradeRef.current = element),
          }}
        />

        <ParticleField ref={particlesRef} />

        <LightBloom layerRef={bindLayer("bloom")} />
        <Vignette layerRef={(element) => void (vignetteRef.current = element)} />

        {/* Readability scrim for the editorial typography */}
        <div
          ref={scrimRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(3,4,10,0.82)_0%,rgba(3,4,10,0.45)_34%,transparent_58%)] opacity-0 md:bg-[linear-gradient(to_right,rgba(3,4,10,0.72)_0%,rgba(3,4,10,0.32)_36%,transparent_58%)]"
        />

        {/* Typography — driven by the same eased progress as the camera */}
        <div
          data-intro={introComplete}
          className={`pointer-events-none absolute inset-x-0 top-0 h-[calc(var(--svh)*100)] transition-opacity duration-1000 ease-out ${
            introComplete ? "opacity-100" : "opacity-0"
          }`}
        >
          {FRAMES.map((frame, index) => (
            <FrameCopyBlock key={frame.label} frame={frame} blockRef={bindText(index)} index={index} />
          ))}

          <BeliefFrame
            bind={{
              text: (element) => void (textRef.current[FRAMES.length] = element),
              nodeAnchor: (element) => void (beliefRef.current.nodeAnchor = element),
              node: (element) => void (beliefRef.current.node = element),
              line: (index) => (element) => void (beliefRef.current.lines[index] = element),
              card: (index) => (element) => void (beliefRef.current.cards[index] = element),
            }}
          />

          <div
            ref={hintRef}
            aria-hidden="true"
            className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2"
          >
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.35em] text-[var(--text-muted)]">
              Scroll
            </span>
            <span className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1">
              <span className="scroll-indicator-dot h-2 w-1 rounded-full bg-gradient-to-b from-[var(--electric-violet)] to-[var(--neon-cyan)]" />
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

function FrameCopyBlock({
  frame,
  blockRef,
  index,
}: {
  frame: FrameCopy;
  blockRef: (element: HTMLElement | null) => void;
  index: number;
}) {
  const Heading = frame.headingLevel;

  return (
    <article
      ref={blockRef}
      data-frame={index + 1}
      className="invisible absolute inset-0 flex flex-col px-[var(--gutter-x)] pt-24 pb-24 opacity-0 md:pt-28 md:pb-16"
    >
      <div className="mt-auto max-w-[36rem] md:my-auto">
        {frame.staged && (
          <Heading className="cinematic-headline text-[clamp(2.4rem,5.2vw,4.75rem)] text-[var(--text-primary)]">
            {frame.staged.map((part, i) => (
              <span
                key={part.text}
                className={`thought-fragment block${part.accent ? " thought-accent" : ""}`}
                style={{ animationDelay: `${i * 0.32}s` }}
              >
                {part.text}
              </span>
            ))}
          </Heading>
        )}

        {frame.custom && (
          <Heading className="cinematic-headline text-[clamp(2.4rem,5.2vw,4.75rem)] text-[var(--text-primary)]">
            {frame.custom}
          </Heading>
        )}

        {frame.heading && (
          <Heading className="cinematic-headline text-[clamp(2.4rem,5.2vw,4.75rem)] text-[var(--text-primary)]">
            {frame.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Heading>
        )}

        {frame.sub && (
          <div className="mt-6 flex flex-col gap-1 border-l border-white/20 py-0.5 pl-4">
            {frame.sub.map((line, i) => (
              <p
                key={line}
                className={
                  i === 0
                    ? "text-sm tracking-wide text-white/90 md:text-base"
                    : "text-xs font-light tracking-wide text-[var(--text-secondary)] md:text-sm"
                }
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {frame.card}
      </div>

      {frame.rightContent && (
        <div className="absolute top-1/2 right-[var(--gutter-x)] hidden -translate-y-1/2 md:block">
          {frame.rightContent}
        </div>
      )}

      {frame.scrollCue && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex items-center justify-center gap-3">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.35em] text-white/70">
            {frame.scrollCue}
          </span>
          <span
            aria-hidden="true"
            className="scroll-indicator-dot h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]"
          />
        </div>
      )}
    </article>
  );
}
