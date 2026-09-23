"use client";

import Image from "next/image";
import { CINEMATIC_ASSETS } from "@/lib/cinematic/scene";
import { registerCinematicImage } from "@/lib/cinematic/assetReadiness";

const { gate, interior } = CINEMATIC_ASSETS;

type LayerRef = (element: HTMLImageElement | null) => void;

/**
 * THE gateway — the single persistent gate element for Frames 01–04.
 * It is never swapped or duplicated; the master timeline only changes its
 * transform. Its geometry comes from one image at one aspect ratio.
 */
export function GatewayPortal({ layerRef }: { layerRef: LayerRef }) {
  return (
    <Image
      ref={(img) => {
        registerCinematicImage("gate", img);
        layerRef(img);
      }}
      src={gate.src}
      alt="The Gate of PAI — a glowing violet and cyan gateway"
      width={gate.width}
      height={gate.height}
      quality={90}
      loading="eager"
      fetchPriority="high"
      draggable={false}
      data-layer="gate"
      className="scene-layer"
      style={{ width: gate.width, height: gate.height }}
    />
  );
}

/**
 * The world beyond the gateway. Before the crossing it is clipped to the
 * gateway aperture; after the crossing it fills the view.
 */
export function PortalInterior({ layerRef }: { layerRef: LayerRef }) {
  return (
    <Image
      ref={(img) => {
        registerCinematicImage("interior", img);
        layerRef(img);
      }}
      src={interior.src}
      alt=""
      aria-hidden="true"
      width={interior.width}
      height={interior.height}
      quality={90}
      loading="eager"
      draggable={false}
      data-layer="interior"
      className="scene-layer"
      style={{ width: interior.width, height: interior.height }}
    />
  );
}
