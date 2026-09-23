"use client";

import { useEffect, useEffectEvent, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { lockScroll } from "@/lib/scrollLock";
import { whenCinematicAssetsReady } from "@/lib/cinematic/assetReadiness";

/**
 * Stages of the page-load opening, in order. `Header` (and the hero brand
 * lockup it owns) reacts to this directly instead of a single boolean, so the
 * brand → blink → header → blink → nav choreography lives in one place.
 *
 *   hidden  — before anything is shown
 *   brand   — the eye is lit; "Pragyan ai" + tagline appear over the hero
 *   moving  — the brand lockup travels up into the header position
 *   nav     — settled in the header; navigation and the CTA are visible
 */
export type IntroPhase = "hidden" | "brand" | "moving" | "nav";

interface EyeBlinkPreloaderProps {
  onPhase: (phase: IntroPhase) => void;
  /** Fired once the header has settled, the moment the Gate is allowed to start revealing inside the iris. */
  onGateReady: () => void;
  onComplete: () => void;
}

/**
 * Page-load eye reveal, brand identity and the header handoff. Time-based and
 * independent of scroll; it runs once per page load and keeps scroll locked
 * until the whole sequence (through the second blink and the nav reveal) ends.
 *
 * The lids are a void-black layer with an elliptical opening (CSS mask).
 * --ry is the vertical radius of the opening: 0% = closed, 82% = fully open.
 * --cy is the vertical centre of the opening; it drops slightly as the lids
 * close because the upper lid travels further than the lower lid. The same
 * lids are reused for both blinks — the mechanism never changes, only how
 * far it closes.
 *
 * Sequence (non-reduced motion):
 * 0.00s  near-black
 * 0.45s  lids part, the eye is lit from darkness
 * 1.05s  "Pragyan ai" fades in over the hero, tagline follows
 * 2.80s  first blink: close 120ms → closed 60ms → reopen 280ms
 * 3.55s  header chrome fades in, the brand lockup travels up into it
 * 4.55s  second, subtler blink; navigation appears as the lids part again
 * 4.95s  header settled — the Gate is cleared to reveal inside the iris
 * 5.15s  hold, then unlock scroll and hand off to the cinematic scene
 */
export default function EyeBlinkPreloader({ onPhase, onGateReady, onComplete }: EyeBlinkPreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lidsRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const notifyComplete = useEffectEvent(() => onComplete());
  const notifyPhase = useEffectEvent((phase: IntroPhase) => onPhase(phase));
  const notifyGateReady = useEffectEvent(() => onGateReady());

  useEffect(() => {
    const root = rootRef.current;
    const lids = lidsRef.current;
    const veil = veilRef.current;
    if (!root || !lids || !veil) return;

    const unlock = lockScroll();
    if (!window.location.hash) window.scrollTo(0, 0);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        unlock();
        notifyComplete();
      },
    });

    const resumeWhenReady = () => {
      whenCinematicAssetsReady("all", 4000).then(() => {
        if (!cancelled) tl.play();
      });
    };

    if (reducedMotion) {
      // Calm version: no blink, the eye simply fades up from darkness, and every
      // stage still happens — just without the motion polish between them.
      gsap.set(lids, { "--ry": "82%" });
      tl.to(veil, { opacity: 0, duration: 0.9, ease: "power1.inOut" })
        .call(() => notifyPhase("brand"))
        .addPause("+=0.2", resumeWhenReady)
        .to({}, { duration: 0.2 })
        .call(() => notifyPhase("moving"))
        .to({}, { duration: 0.2 })
        .call(() => notifyPhase("nav"))
        .to({}, { duration: 0.2 })
        .call(() => notifyGateReady())
        .to({}, { duration: 0.2 })
        .set(root, { autoAlpha: 0 });
    } else {
      tl.to({}, { duration: 0.45 })
        .addLabel("wake")
        .to(veil, { opacity: 0, duration: 1.9, ease: "power1.inOut" }, "wake")
        .to(lids, { "--ry": "7%", duration: 0.55, ease: "power1.out" }, "wake")
        .to(lids, { "--ry": "82%", duration: 1.25, ease: "power2.inOut" }, "wake+=0.55")
        .call(() => notifyPhase("brand"), [], "wake+=0.6")
        .to({}, { duration: 0.55 })
        .addLabel("blink")
        .to(lids, { "--ry": "0.4%", "--cy": "52%", duration: 0.12, ease: "power2.in" }, "blink")
        .to(lids, { "--ry": "82%", "--cy": "50%", duration: 0.28, ease: "power2.out" }, "blink+=0.18")
        .addPause("+=0.5", resumeWhenReady)
        // The brand lockup travels up into the header; the header chrome fades in with it.
        .to({}, { duration: 0.3 })
        .call(() => notifyPhase("moving"))
        .to({}, { duration: 0.85 })
        // Second, subtler blink: the lids only partly close, and navigation is
        // revealed while they are down, so it "arrives" as the lids part again.
        .addLabel("blink2")
        .to(lids, { "--ry": "22%", "--cy": "51%", duration: 0.16, ease: "power2.in" }, "blink2")
        .call(() => notifyPhase("nav"), [], "blink2+=0.12")
        .to(lids, { "--ry": "82%", "--cy": "50%", duration: 0.26, ease: "power2.out" }, "blink2+=0.16")
        .to({}, { duration: 0.4 })
        // Header has settled; only now is the Gate allowed to start revealing inside the iris.
        .call(() => notifyGateReady())
        .to({}, { duration: 0.55 })
        .set(root, { autoAlpha: 0 });
    }

    whenCinematicAssetsReady(["eye"], 2500).then(() => {
      if (!cancelled) tl.play();
    });

    return () => {
      cancelled = true;
      tl.kill();
      unlock();
    };
  }, []);

  const lidMask = "radial-gradient(var(--rx) var(--ry) at 50% var(--cy), transparent 93%, #000 100%)";

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] pointer-events-none"
      aria-hidden="true"
      data-testid="eye-preloader"
    >
      {/* Darkness the eye emerges from */}
      <div ref={veilRef} className="absolute inset-0 bg-[var(--void-black)]" />

      {/* Eyelids — reused for both the wake-up reveal and both blinks */}
      <div
        ref={lidsRef}
        data-testid="eyelids"
        className="absolute inset-0 bg-[var(--void-black)]"
        style={
          {
            "--rx": "92%",
            "--ry": "0%",
            "--cy": "50%",
            WebkitMaskImage: lidMask,
            maskImage: lidMask,
          } as CSSProperties
        }
      />
    </div>
  );
}
