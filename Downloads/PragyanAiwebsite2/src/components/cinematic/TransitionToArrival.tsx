"use client";

import Image from "next/image";
import { CINEMATIC_ASSETS, GLOW_SIZES } from "@/lib/cinematic/scene";
import { registerCinematicImage } from "@/lib/cinematic/assetReadiness";

const { deceleration, constellation, beliefBackground } = CINEMATIC_ASSETS;

export interface ArrivalLayerBindings {
  deceleration: (element: HTMLImageElement | null) => void;
  constellation: (element: HTMLImageElement | null) => void;
  nodeGlow: (element: HTMLDivElement | null) => void;
  /** Same position/scale/opacity as nodeGlow (written from the same frame value); its own
   * ::after spins independently so the JS-driven transform on this element is never touched. */
  nodeRays: (element: HTMLDivElement | null) => void;
  beliefBackground: (element: HTMLImageElement | null) => void;
  beliefGrade: (element: HTMLDivElement | null) => void;
}

/**
 * Frame 04.5 → Frame 05 arrival layers. They live inside the master cinematic
 * scene (no pin or ScrollTrigger of their own). The deceleration rays and the
 * constellation are registered on the same node point, which is where the
 * portal's light bloom collapses to.
 */
export default function TransitionToArrival({ bind }: { bind: ArrivalLayerBindings }) {
  return (
    <>
      <Image
        ref={(img) => {
          registerCinematicImage("deceleration", img);
          bind.deceleration(img);
        }}
        src={deceleration.src}
        alt=""
        aria-hidden="true"
        width={deceleration.width}
        height={deceleration.height}
        quality={90}
        loading="eager"
        draggable={false}
        data-layer="deceleration"
        className="scene-layer scene-arrival-plate"
        style={{ width: deceleration.width, height: deceleration.height }}
      />
      <Image
        ref={(img) => {
          registerCinematicImage("constellation", img);
          bind.constellation(img);
        }}
        src={constellation.src}
        alt="An intelligence constellation — a central glowing node connected by fine violet and cyan lines"
        width={constellation.width}
        height={constellation.height}
        quality={90}
        loading="eager"
        draggable={false}
        data-layer="constellation"
        className="scene-layer scene-arrival-plate"
        style={{ width: constellation.width, height: constellation.height }}
      />
      {/* Frame 05 background: the same constellation, registered on the plate above */}
      <Image
        ref={(img) => {
          registerCinematicImage("belief", img);
          bind.beliefBackground(img);
        }}
        src={beliefBackground.src}
        alt=""
        aria-hidden="true"
        width={beliefBackground.width}
        height={beliefBackground.height}
        quality={90}
        loading="eager"
        draggable={false}
        data-layer="belief-background"
        className="scene-layer"
        style={{ width: beliefBackground.width, height: beliefBackground.height }}
      />
      {/* Frame 05 atmosphere: matches the darker Stitch grade and keeps the editorial column readable */}
      <div
        ref={(element) => bind.beliefGrade(element)}
        aria-hidden="true"
        data-layer="belief-grade"
        className="scene-belief-grade pointer-events-none absolute inset-0 invisible opacity-0"
      />
      <div
        ref={(element) => bind.nodeGlow(element)}
        aria-hidden="true"
        data-layer="node-glow"
        className="scene-layer scene-node-glow"
        style={GLOW_SIZES.nodeGlow}
      />
      {/* Rotating ray pattern, kept in lockstep with nodeGlow's own position/scale (same
          frame value writes both) so the rays always sit exactly on the node. */}
      <div
        ref={(element) => bind.nodeRays(element)}
        aria-hidden="true"
        data-layer="node-rays"
        className="scene-layer scene-node-rays"
        style={GLOW_SIZES.nodeGlow}
      />
    </>
  );
}
