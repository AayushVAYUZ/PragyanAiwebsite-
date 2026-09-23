"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import type { ParticleState } from "@/lib/cinematic/scene";

/**
 * Intelligent-data particles for the cinematic scene (DESIGN.md §34).
 *
 * - Stable pool: created once from a fixed seed; nothing is regenerated when
 *   density or the viewport changes.
 * - Deterministic: every particle's position is a pure function of the scene's
 *   progress (`travel`), so scrolling backwards reproduces the exact state.
 * - Depth: particles live in a 3D volume and are projected toward the camera;
 *   during the portal passage their motion is drawn as streaks.
 * - No animation loop: the canvas is only redrawn when the master timeline
 *   renders a frame, and it is skipped while the scene is off screen.
 */

export interface ParticleFieldHandle {
  render: (state: ParticleState) => void;
}

interface Particle {
  x: number;
  y: number;
  phase: number;
  size: number;
  alpha: number;
  threshold: number;
  sprite: number;
}

const POOL_SIZE = 260;
const COMPACT_POOL_SIZE = 110;
const NEAR = 0.06;
const FAR = 1.1;
const FOCAL = 0.14;

const SPRITE_COLORS = [
  [139, 45, 255], // electric violet
  [38, 198, 255], // neon cyan
  [214, 222, 255], // soft white-blue
] as const;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createPool(): Particle[] {
  const random = mulberry32(0x5a17);
  const pool: Particle[] = [];
  for (let i = 0; i < POOL_SIZE; i++) {
    const colorRoll = random();
    pool.push({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      phase: random(),
      size: 0.6 + random() * 1.3,
      alpha: 0.35 + random() * 0.65,
      // Evenly spread thresholds so density reveals particles progressively.
      threshold: (i + random()) / POOL_SIZE,
      sprite: colorRoll < 0.42 ? 1 : colorRoll < 0.78 ? 0 : 2,
    });
  }
  return pool;
}

function createSprite(rgb: readonly [number, number, number]) {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`);
    gradient.addColorStop(0.35, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.45)`);
    gradient.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return canvas;
}

const smooth = (edge0: number, edge1: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const fract = (v: number) => v - Math.floor(v);

export default function ParticleField({ ref }: { ref: Ref<ParticleFieldHandle> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ParticleFieldHandle | null>(null);

  useImperativeHandle(ref, () => ({
    render: (state: ParticleState) => engineRef.current?.render(state),
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const pool = createPool();
    const sprites = SPRITE_COLORS.map((rgb) => createSprite(rgb));
    let width = 0;
    let height = 0;
    let dpr = 1;
    let activeCount = POOL_SIZE;
    let onScreen = true;
    let lastState: ParticleState | null = null;

    const draw = (state: ParticleState) => {
      lastState = state;
      if (!onScreen || width === 0) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      const halfW = width / 2;
      const halfH = height / 2;
      const spread = Math.max(halfW, halfH);
      const streakTravel = state.streak * Math.min(state.travelSpeed * 0.008, 0.22);

      for (let i = 0; i < activeCount; i++) {
        const particle = pool[i];
        const gate = smooth(particle.threshold - 0.06, particle.threshold, state.density);
        if (gate <= 0) continue;

        const depth = NEAR + fract(particle.phase - state.travel) * (FAR - NEAR);
        const projection = FOCAL / depth;
        const sx = state.vpX + particle.x * spread * projection;
        const sy = state.vpY + particle.y * spread * projection;
        if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) continue;

        const alpha =
          particle.alpha *
          gate *
          state.brightness *
          smooth(FAR, FAR * 0.72, depth) * // fade in from the distance
          smooth(NEAR, NEAR + 0.12, depth); // fade out before reaching the lens
        if (alpha <= 0.004) continue;

        const radius = Math.min(particle.size * projection * 1.6, 4.5);
        const sprite = sprites[particle.sprite];

        if (streakTravel > 0.002) {
          const previousDepth = depth + streakTravel * (FAR - NEAR);
          if (previousDepth < FAR) {
            const previousProjection = FOCAL / previousDepth;
            const px = state.vpX + particle.x * spread * previousProjection;
            const py = state.vpY + particle.y * spread * previousProjection;
            const [r, g, b] = SPRITE_COLORS[particle.sprite];
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(alpha * 1.15, 1).toFixed(3)})`;
            ctx.lineWidth = Math.max(radius * 0.8, 0.9);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          }
        }

        const spriteSize = radius * 5;
        ctx.globalAlpha = Math.min(alpha, 1);
        ctx.drawImage(sprite, sx - spriteSize / 2, sy - spriteSize / 2, spriteSize, spriteSize);
        ctx.globalAlpha = 1;
      }
    };

    const resize = () => {
      const compact = canvas.clientWidth < 768;
      dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      activeCount = compact ? COMPACT_POOL_SIZE : POOL_SIZE;
      if (lastState) draw(lastState);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && lastState) draw(lastState);
    });
    intersectionObserver.observe(canvas);
    resize();

    engineRef.current = { render: draw };
    return () => {
      engineRef.current = null;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-layer="particles"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
