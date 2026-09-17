"use client";

import Image from "next/image";
import { CINEMATIC_ASSETS } from "@/lib/cinematic/scene";
import { registerCinematicImage } from "@/lib/cinematic/assetReadiness";

const { human } = CINEMATIC_ASSETS;

/**
 * Independent human layer for Frame 03. It stands just in front of the
 * threshold at its own depth, so it moves with its own parallax.
 */
export default function HumanSilhouette({ layerRef }: { layerRef: (element: HTMLImageElement | null) => void }) {
  return (
    <Image
      ref={(img) => {
        registerCinematicImage("human", img);
        layerRef(img);
      }}
      src={human.src}
      alt="An anonymous human silhouette standing before the gateway"
      width={human.width}
      height={human.height}
      quality={90}
      loading="eager"
      draggable={false}
      data-layer="human"
      className="scene-layer"
      style={{ width: human.width, height: human.height }}
    />
  );
}
