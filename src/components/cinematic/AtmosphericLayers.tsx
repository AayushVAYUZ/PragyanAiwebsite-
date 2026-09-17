"use client";

import { CINEMATIC_ASSETS, GLOW_SIZES } from "@/lib/cinematic/scene";

type LayerRef = (element: HTMLDivElement | null) => void;

const { pupilMatte } = CINEMATIC_ASSETS.eye;
const pupilMatteSize = { width: pupilMatte.width, height: pupilMatte.height };

/* ---------- Gateway embedded in the eye (Frame 01) ----------
   These layers are sized in eye-image pixels and share the eye's transform,
   so they stay registered to the pupil during the camera move. */

/** Depth haze inside the pupil: the distant gateway inherits the pupil's darkness. */
export function PupilDepthHaze({ layerRef }: { layerRef: LayerRef }) {
  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      data-layer="pupil-haze"
      className="scene-layer scene-pupil-matte scene-pupil-haze"
      style={pupilMatteSize}
    />
  );
}

/** Gateway light scattering inside the pupil, shaped by the real pupil outline. */
export function PupilLightScatter({ layerRef }: { layerRef: LayerRef }) {
  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      data-layer="pupil-glow"
      className="scene-layer scene-pupil-matte scene-pupil-glow"
      style={pupilMatteSize}
    />
  );
}

/** Violet (left) and cyan (right) light falling on the iris fibres around the pupil. */
export function IrisLightSpill({ layerRef }: { layerRef: LayerRef }) {
  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      data-layer="iris-spill"
      className="scene-layer scene-iris-spill"
      style={GLOW_SIZES.irisSpill}
    />
  );
}

/** Soft reflected impression of the gateway light on the cornea (light only, no shape). */
export function CornealReflection({ layerRef }: { layerRef: LayerRef }) {
  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      data-layer="corneal-glint"
      className="scene-layer scene-corneal-glint"
      style={GLOW_SIZES.cornealGlint}
    />
  );
}

/**
 * Light and atmosphere around the gateway. Each layer is a static gradient;
 * the master timeline animates only transform and opacity, so nothing here
 * repaints per frame.
 */

export function GateGlow({ layerRef }: { layerRef: LayerRef }) {
  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      data-layer="gate-glow"
      className="scene-layer scene-gate-glow"
      style={GLOW_SIZES.gateGlow}
    />
  );
}

export function FloorGlow({ layerRef }: { layerRef: LayerRef }) {
  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      data-layer="floor-glow"
      className="scene-layer scene-floor-glow"
      style={GLOW_SIZES.floorGlow}
    />
  );
}

/** Depth fog lying on the gateway threshold; softens where the portal interior meets the floor. */
export function ThresholdFog({ layerRef }: { layerRef: LayerRef }) {
  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      data-layer="threshold-fog"
      className="scene-layer scene-threshold-fog"
      style={GLOW_SIZES.thresholdFog}
    />
  );
}

export function LightRays({ layerRef }: { layerRef: LayerRef }) {
  return (
    <div ref={layerRef} aria-hidden="true" data-layer="rays" className="scene-layer scene-rays" style={GLOW_SIZES.rays} />
  );
}

export function LightBloom({ layerRef }: { layerRef: LayerRef }) {
  return (
    <div ref={layerRef} aria-hidden="true" data-layer="bloom" className="scene-layer scene-bloom" style={GLOW_SIZES.bloom} />
  );
}

export function Vignette({ layerRef }: { layerRef: LayerRef }) {
  return (
    <>
      <div
        ref={layerRef}
        aria-hidden="true"
        data-layer="vignette"
        className="vignette-layer pointer-events-none absolute inset-0"
      />
      <div aria-hidden="true" className="film-grain pointer-events-none absolute inset-0 opacity-25" />
    </>
  );
}
