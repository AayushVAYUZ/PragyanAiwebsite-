"use client";

import { useEffect, useEffectEvent, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { lockScroll } from "@/lib/scrollLock";
import { whenCinematicAssetsReady } from "@/lib/cinematic/assetReadiness";

interface EyeBlinkPreloaderProps {
  onComplete: () => void;
}

/**
 * Page-load eye reveal + one realistic blink. Time-based and independent of
 * scroll; it runs once per page load and keeps scroll locked until it ends.
 *
 * The lids are a void-black layer with an elliptical opening (CSS mask).
 * --ry is the vertical radius of the opening: 0% = closed, 82% = fully open.
 * --cy is the vertical centre of the opening; it drops slightly as the lids
 * close because the upper lid travels further than the lower lid.
 *
 * Sequence:
 * 0.00s  near-black
 * 0.45s  lids part, the eye is lit from darkness
 * 2.25s  eye fully open — hold
 * 2.80s  blink: close 120ms → closed 60ms → reopen 280ms
 * 3.26s  hold, wait for decoded cinematic assets, then unlock scroll
 */
export default function EyeBlinkPreloader({ onComplete }: EyeBlinkPreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lidsRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const notifyComplete = useEffectEvent(() => onComplete());

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
      // Calm version: no blink, the eye simply fades up from darkness.
      gsap.set(lids, { "--ry": "82%" });
      tl.to(veil, { opacity: 0, duration: 0.9, ease: "power1.inOut" })
        .addPause("+=0.2", resumeWhenReady)
        .set(root, { autoAlpha: 0 });
    } else {
      tl.to({}, { duration: 0.45 })
        .addLabel("wake")
        .to(veil, { opacity: 0, duration: 1.9, ease: "power1.inOut" }, "wake")
        .to(lids, { "--ry": "7%", duration: 0.55, ease: "power1.out" }, "wake")
        .to(lids, { "--ry": "82%", duration: 1.25, ease: "power2.inOut" }, "wake+=0.55")
        .to({}, { duration: 0.55 })
        .addLabel("blink")
        .to(lids, { "--ry": "0.4%", "--cy": "52%", duration: 0.12, ease: "power2.in" }, "blink")
        .to(lids, { "--ry": "82%", "--cy": "50%", duration: 0.28, ease: "power2.out" }, "blink+=0.18")
        .addPause("+=0.5", resumeWhenReady)
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

      {/* Eyelids */}
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
