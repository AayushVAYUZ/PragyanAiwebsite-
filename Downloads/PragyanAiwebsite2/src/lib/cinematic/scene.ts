/**
 * Pragyan ai — cinematic opening: camera model and scene state.
 *
 * Everything visual in the opening (Frames 01 → 04 → 04.5 → 05) is a pure
 * function of ONE normalized scroll progress `p` (0..1):
 *
 *   p ──sceneEase──▶ e (eased story progress) ──cameraZ──▶ z (camera depth)
 *
 * Layers and typography both read `e`, so they can never drift apart.
 * Objects live at fixed depths and are projected with scale = k / (depth − z),
 * so the eye (near), the gateway, the human (just in front of the gateway) and
 * the portal interior (behind it) move with real parallax. The same `p`
 * always produces the same frame, which makes reverse scrolling exact.
 *
 * This module has no imports on purpose: it is plain math that can be
 * exercised outside React.
 */

/* ------------------------------------------------------------------ */
/* Assets (measured from the image files)                               */
/* ------------------------------------------------------------------ */

export const CINEMATIC_ASSETS = {
  eye: {
    src: "/images/eye-plate.png",
    width: 1672,
    height: 941,
    /** Pupil centre and radius in image pixels (edge fit of the dark pupil disc). */
    pupil: { x: 835, y: 459, r: 125 },
    /** Soft organic matte of the real pupil, derived from eye-plate.png (eye-image pixels). */
    pupilMatte: { src: "/images/eye-pupil-matte.png", x: 615, y: 239, width: 440, height: 440 },
    /** Horizontal extent of the visible eye (corner to corner). */
    eyeSpan: { left: 131, right: 1351 },
  },
  gate: {
    src: "/images/gateway-portal-4k.png",
    width: 1114,
    height: 1411,
    /** Optical axis of the camera through the aperture (image pixels). */
    axis: { x: 580, y: 720 },
    /** Innermost opaque pixels of the frame: the frame has left the viewport once these have. */
    apertureCore: { left: 342, right: 818, top: 263 },
    /** Portal-interior clip; tucked under the opaque frame so no gap shows. */
    apertureClip: { left: 230, right: 880, top: 215, bottom: 1300, radius: 90 },
    floorY: 1300,
  },
  human: {
    src: "/images/human-silhouette.png",
    width: 940,
    height: 1672,
    feet: { x: 453, y: 1640 },
    headY: 42,
  },
  interior: {
    src: "/images/portal-interior.png",
    width: 1672,
    height: 941,
    vanishing: { x: 834, y: 464 },
  },
  deceleration: {
    src: "/images/deceleration.jpg",
    width: 1376,
    height: 768,
    focal: { x: 686, y: 381 },
  },
  constellation: {
    src: "/images/constellation-arrival.jpg",
    width: 1376,
    height: 577,
    node: { x: 940, y: 288 },
  },
  /** Frame 05 background (approved Phase 2A asset). Same constellation as the arrival plate, without bars. */
  beliefBackground: {
    src: "/images/constellation-arrival.png",
    width: 1690,
    height: 931,
    /** Measured registration: png px = arrival-plate px × scale + offset (node lands within 2 px). */
    fromArrival: { scale: 1.315, x: -68, y: 63 },
  },
} as const;

/** Node of the Frame 05 background in its own pixels, derived from the arrival plate registration. */
export const BELIEF_NODE = {
  x: CINEMATIC_ASSETS.constellation.node.x * CINEMATIC_ASSETS.beliefBackground.fromArrival.scale +
    CINEMATIC_ASSETS.beliefBackground.fromArrival.x,
  y: CINEMATIC_ASSETS.constellation.node.y * CINEMATIC_ASSETS.beliefBackground.fromArrival.scale +
    CINEMATIC_ASSETS.beliefBackground.fromArrival.y,
};

/** Natural (pre-transform) sizes of the gradient layers, in CSS px. */
export const GLOW_SIZES = {
  /** Eye-integration layers live in eye-image pixels and move with the eye. */
  irisSpill: { width: 900, height: 900 },
  cornealGlint: { width: 420, height: 150 },
  gateGlow: { width: 2400, height: 2600 },
  floorGlow: { width: 2200, height: 420 },
  thresholdFog: { width: 2600, height: 360 },
  rays: { width: 1600, height: 1600 },
  bloom: { width: 1200, height: 1200 },
  nodeGlow: { width: 420, height: 420 },
} as const;

/* ------------------------------------------------------------------ */
/* Story beats (in eased progress e)                                    */
/* ------------------------------------------------------------------ */

export const BEATS = {
  eyeGone: 0.24,
  frame02End: 0.4,
  monumental: 0.58,
  crossing: 0.655,
  bloomPeak: 0.765,
  collapseEnd: 0.84,
} as const;

/* ------------------------------------------------------------------ */
/* Math helpers                                                         */
/* ------------------------------------------------------------------ */

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const clamp01 = (v: number) => clamp(v, 0, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function smoothstep(edge0: number, edge1: number, v: number) {
  const t = clamp01((v - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** 0 → 1 over [inStart, inEnd], holds, then 1 → 0 over [outStart, outEnd]. */
export function presence(v: number, inStart: number, inEnd: number, outStart: number, outEnd: number) {
  const fadeIn = inEnd <= inStart ? 1 : smoothstep(inStart, inEnd, v);
  return fadeIn * (1 - smoothstep(outStart, outEnd, v));
}

export interface Spline {
  (x: number): number;
  derivative: (x: number) => number;
}

/**
 * Monotone cubic Hermite spline (Fritsch–Carlson). Position and velocity are
 * continuous at every knot, so a camera driven by it never jolts or stops at
 * a knot unless a zero slope is requested explicitly.
 */
export function createMonotoneSpline(xs: number[], ys: number[], slopes?: (number | null)[]): Spline {
  const n = xs.length;
  const secants: number[] = [];
  for (let i = 0; i < n - 1; i++) secants.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));

  const m: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const given = slopes?.[i];
    if (given != null) m[i] = given;
    else if (i === 0) m[i] = secants[0];
    else if (i === n - 1) m[i] = secants[n - 2];
    else if (secants[i - 1] * secants[i] <= 0) m[i] = 0;
    else m[i] = (secants[i - 1] + secants[i]) / 2;
  }

  // Fritsch–Carlson limiter keeps every segment monotone.
  for (let i = 0; i < n - 1; i++) {
    const d = secants[i];
    if (d === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d;
    const b = m[i + 1] / d;
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      m[i] = t * a * d;
      m[i + 1] = t * b * d;
    }
  }

  const segment = (x: number) => {
    if (x <= xs[0]) return 0;
    if (x >= xs[n - 1]) return n - 2;
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (xs[mid] <= x) lo = mid;
      else hi = mid;
    }
    return lo;
  };

  const evaluate = ((x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    const i = segment(x);
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    );
  }) as Spline;

  evaluate.derivative = (x: number) => {
    const xc = clamp(x, xs[0], xs[n - 1]);
    const i = segment(xc);
    const h = xs[i + 1] - xs[i];
    const t = (xc - xs[i]) / h;
    const t2 = t * t;
    return (
      ((6 * t2 - 6 * t) * ys[i]) / h +
      (3 * t2 - 4 * t + 1) * m[i] +
      ((-6 * t2 + 6 * t) * ys[i + 1]) / h +
      (3 * t2 - 2 * t) * m[i + 1]
    );
  };

  return evaluate;
}

/* ------------------------------------------------------------------ */
/* Scroll → eased story progress                                        */
/* ------------------------------------------------------------------ */

/**
 * Piecewise eased, velocity-continuous mapping. It starts gently (Frame 01
 * should feel almost still), keeps moving through every beat (no zero slope
 * inside the range), peaks through the portal passage, then decelerates into
 * a resting arrival at Frame 05.
 */
export const sceneEase = createMonotoneSpline(
  [0, 0.16, 0.36, 0.56, 0.66, 0.8, 0.92, 1],
  [0, 0.14, 0.36, 0.58, 0.7, 0.84, 0.985, 1],
  [0.55, 0.95, 1.1, 1.1, 1.3, 0.75, 0.22, 0],
);

/**
 * Distance travelled through the particle field (arbitrary units) as a
 * function of eased progress. Slow drift in Frames 01–03, a rush through the
 * portal passage, then deceleration into the arrival.
 */
export const particleTravel = createMonotoneSpline(
  [0, 0.2, 0.4, 0.58, 0.655, 0.72, 0.84, 1],
  [0, 0.3, 0.7, 1.25, 2.3, 3.9, 4.7, 4.95],
);

/* ------------------------------------------------------------------ */
/* Viewport-dependent camera rig                                        */
/* ------------------------------------------------------------------ */

const GATE_DEPTH = 1;
const INTERIOR_DEPTH = 1.6;
/** Gateway height at rest as a fraction of the pupil radius: a small, distant doorway. */
const GATE_IN_PUPIL = 0.7;
/** The human stands just in front of the threshold (projection ratio vs the gateway in Frame 03). */
const HUMAN_PARALLAX_AT_MONUMENTAL = 1.29;
/** Human height as a fraction of the gateway image height ("huge gate, small human"). */
const HUMAN_HEIGHT_RATIO = 0.27;

export interface SceneRig {
  width: number;
  height: number;
  compact: boolean;
  vpX: number;
  vpY: number;
  arrivalPanX: number;
  arrivalPanY: number;
  eyeBase: number;
  eyeDepth: number;
  humanDepth: number;
  /** Screen px per gateway image px at z = 0. */
  gateK0: number;
  zCross: number;
  humanScale: number;
  interiorK0: number;
  arrivalDepth: number;
  /** Screen px per Frame 05 background px once the camera has arrived. */
  beliefScale: number;
  decelerationK0: number;
  constellationK0: number;
  halfDiagonal: number;
  pupilRadius: number;
  cameraZ: Spline;
}

/**
 * @param beliefAnchor Screen position (relative to the scene viewport) of the Frame 05
 * network node, measured from the page layout. The camera settles so the constellation
 * node lands exactly there. `null` on layouts without the network (small screens).
 */
export function createSceneRig(width: number, height: number, beliefAnchor: { x: number; y: number } | null = null): SceneRig {
  const { eye, gate, human, interior, deceleration, beliefBackground } = CINEMATIC_ASSETS;
  const w = Math.max(width, 1);
  const h = Math.max(height, 1);
  const compact = w < 768;

  // Frame 01 framing: cover on landscape screens; on portrait screens the whole
  // eye (corner to corner) stays visible and the plate is feathered into darkness.
  const cover = Math.max(w / eye.width, h / eye.height);
  const eyeSpan = eye.eyeSpan.right - eye.eyeSpan.left;
  const eyeBase = Math.min(cover, (w * 1.12) / eyeSpan);
  const pupilRadius = eye.pupil.r * eyeBase;
  const halfDiagonal = Math.hypot(w / 2, h / 2);

  // The gateway starts as a small gate inside the pupil.
  const gateHeight0 = pupilRadius * GATE_IN_PUPIL;
  const gateK0 = gateHeight0 / gate.height;

  // Passage: scale at which the innermost frame pixels clear every viewport edge.
  const { axis, apertureCore } = gate;
  const kCross =
    Math.max(
      w / 2 / (axis.x - apertureCore.left),
      w / 2 / (apertureCore.right - axis.x),
      h / 2 / (axis.y - apertureCore.top),
    ) * 1.06;
  const gateAt = (scale: number) => GATE_DEPTH * (1 - 1 / scale);
  const zCross = gateAt(kCross / gateK0);

  // Keyframe gateway heights (screen px): monumental ≈ the viewport in Frame 03.
  const monumentalHeight = Math.min(h * 0.95, (w * 0.85 * gate.height) / gate.width);
  const s20 = 1.75;
  const s40 = Math.max((monumentalHeight * 0.42) / gateHeight0, s20 * 1.3);
  const s58 = Math.max(monumentalHeight / gateHeight0, s40 * 1.4);

  // Eye depth chosen so the pupil fills the viewport exactly when e = eyeGone.
  const z20 = gateAt(s20);
  const eyeCoverScale = (halfDiagonal / pupilRadius) * 1.02;
  const eyeDepth = (z20 * eyeCoverScale) / (eyeCoverScale - 1);

  // Portal interior covers the viewport at the moment the frame is crossed.
  const vx = interior.vanishing.x;
  const vy = interior.vanishing.y;
  const interiorCover =
    Math.max(w / 2 / Math.min(vx, interior.width - vx), h / 2 / Math.min(vy, interior.height - vy)) * 1.08;
  const interiorK0 = interiorCover * (INTERIOR_DEPTH - zCross);
  const zAtInteriorGrowth = (growth: number) => INTERIOR_DEPTH - (INTERIOR_DEPTH - zCross) / growth;

  const cameraZ = createMonotoneSpline(
    [0, BEATS.eyeGone, BEATS.frame02End, BEATS.monumental, BEATS.crossing, BEATS.bloomPeak, BEATS.collapseEnd, 1],
    [0, z20, gateAt(s40), gateAt(s58), zCross, zAtInteriorGrowth(1.9), zAtInteriorGrowth(2.4), zAtInteriorGrowth(2.6)],
    [0.8, null, null, null, null, null, null, 0],
  );

  // Where the intelligence node comes to rest (Frame 05).
  const arrivalPanX = beliefAnchor ? beliefAnchor.x - w / 2 : compact ? 0 : w < 1024 ? w * 0.08 : w * 0.14;
  // On narrow screens Frame 05 copy sits low, so the node settles into the upper third.
  const arrivalPanY = beliefAnchor ? beliefAnchor.y - h / 2 : compact ? -h * 0.2 : 0;
  const anchorX = w / 2 + arrivalPanX;
  const anchorY = h / 2 + arrivalPanY;

  // Arrival plates: far away, so they only swell gently while the camera settles.
  const zEnd = zAtInteriorGrowth(2.6);
  const arrivalDepth = zEnd + 0.9;
  const decelerationCover = Math.max(w / deceleration.width, h / deceleration.height) * 1.04;
  // The Frame 05 background must cover the viewport with its node pinned at the anchor;
  // the arrival plate ends at the registered equivalent scale so the two hand over seamlessly.
  const beliefScale = Math.max(
    Math.max(w / beliefBackground.width, h / beliefBackground.height) * 1.05,
    anchorX / BELIEF_NODE.x,
    (w - anchorX) / (beliefBackground.width - BELIEF_NODE.x),
    anchorY / BELIEF_NODE.y,
    (h - anchorY) / (beliefBackground.height - BELIEF_NODE.y),
  );
  const constellationFit = beliefScale * beliefBackground.fromArrival.scale;

  const humanContentHeight = human.feet.y - human.headY;
  const z58 = gateAt(s58);
  const humanDepth = z58 + (GATE_DEPTH - z58) / HUMAN_PARALLAX_AT_MONUMENTAL;

  return {
    width: w,
    height: h,
    compact,
    vpX: w / 2,
    vpY: h / 2,
    arrivalPanX,
    arrivalPanY,
    eyeBase,
    eyeDepth,
    humanDepth,
    gateK0,
    zCross,
    humanScale: (gate.height * HUMAN_HEIGHT_RATIO) / humanContentHeight,
    interiorK0,
    arrivalDepth,
    beliefScale,
    decelerationK0: decelerationCover * (arrivalDepth - zEnd),
    constellationK0: constellationFit * (arrivalDepth - zEnd),
    halfDiagonal,
    pupilRadius,
    cameraZ,
  };
}

/* ------------------------------------------------------------------ */
/* Scene frame                                                          */
/* ------------------------------------------------------------------ */

export interface LayerState {
  x: number;
  y: number;
  s: number;
  o: number;
}

export interface SceneFrame {
  p: number;
  e: number;
  z: number;
  /** Camera speed along z per unit of eased progress (drives particle streaks). */
  speed: number;
  eye: LayerState;
  /** Depth haze inside the pupil, in front of the distant gateway. */
  pupilHaze: LayerState;
  /** Gateway light scattering inside the pupil. */
  pupilGlow: LayerState;
  /** Violet / cyan light falling on the iris fibres around the pupil. */
  irisSpill: LayerState;
  /** Soft reflected impression of the gateway light on the cornea. */
  cornealGlint: LayerState;
  gate: LayerState;
  /** Depth-of-field softening and restrained bloom on the gateway while it is inside the eye. */
  gateFilter: string | null;
  gateGlow: LayerState;
  floorGlow: LayerState;
  thresholdFog: LayerState;
  interior: LayerState & { clip: string | null };
  human: LayerState;
  rays: LayerState;
  bloom: LayerState;
  nodeGlow: LayerState;
  deceleration: LayerState;
  constellation: LayerState;
  /** Frame 05 background, registered on the arrival plate. */
  beliefBackground: LayerState;
  /** Frame 05 atmosphere / darkening overlay opacity. */
  beliefGrade: number;
  /** Frame 05 composition: node marker, connection lines, question cards, section chrome. */
  belief: BeliefState;
  vignette: number;
  scrim: number;
  text: { o: number; y: number }[];
  scrollHint: number;
  intense: boolean;
  particles: ParticleState;
}

export interface BeliefState {
  node: number;
  lines: number[];
  cards: { o: number; y: number }[];
  chrome: number;
}

export interface ParticleState {
  vpX: number;
  vpY: number;
  /** 0..1 — fraction of the particle pool that is lit. */
  density: number;
  /** 0..1 — how strongly motion is drawn as streaks. */
  streak: number;
  brightness: number;
  /** Deterministic distance travelled through the field. */
  travel: number;
  /** Travel per unit of eased progress (drives streak length). */
  travelSpeed: number;
}

const HIDDEN: LayerState = { x: 0, y: 0, s: 1, o: 0 };

/** Typography windows in eased progress: [inStart, inEnd, outStart, outEnd]. */
export const TEXT_WINDOWS: [number, number, number, number][] = [
  [-1, -1, 0.1, 0.16], // 01 — The Eye (visible at rest)
  [0.24, 0.29, 0.37, 0.42], // 02 — The Gate of P.ai (title + scroll cue; the Gate stays alone after this fades)
  [0.64, 0.68, 0.75, 0.79], // 03 — Pass through the gate
  [0.86, 0.93, 2, 3], // 04 — The Belief
];

function anchored(anchorX: number, anchorY: number, screenX: number, screenY: number, s: number, o: number): LayerState {
  return { x: screenX - anchorX * s, y: screenY - anchorY * s, s, o };
}

/** Frame 05 elements settle in one after another as the camera comes to rest. */
function beliefFrame(e: number, reducedMotion: boolean): BeliefState {
  return {
    node: smoothstep(0.895, 0.93, e),
    lines: [0, 1, 2, 3, 4, 5].map((i) => smoothstep(0.9 + i * 0.008, 0.925 + i * 0.008, e)),
    cards: [0, 1, 2, 3, 4, 5].map((i) => {
      const t = smoothstep(0.905 + i * 0.008, 0.935 + i * 0.008, e);
      return { o: t, y: reducedMotion ? 0 : (1 - t) * 14 };
    }),
    chrome: smoothstep(0.93, 0.97, e),
  };
}

function textFrames(e: number) {
  return TEXT_WINDOWS.map(([a, b, c, d]) => {
    const o = presence(e, a, b, c, d);
    const entering = b <= a ? 1 : smoothstep(a, b, e);
    const leaving = smoothstep(c, d, e);
    return { o, y: (1 - entering) * 18 - leaving * 18 };
  });
}

/**
 * Layers that embed the gateway in the eye. They are expressed in eye-image
 * pixels and share the eye's transform, so they stay registered to the pupil
 * while the camera moves, and they fade out with the eye.
 */
function eyeIntegrationLayers(
  eyeLayer: LayerState,
  strength: { haze: number; glow: number; spill: number; glint: number },
) {
  const { eye } = CINEMATIC_ASSETS;
  const { x, y, s, o } = eyeLayer;
  const at = (eyeX: number, eyeY: number, opacity: number): LayerState =>
    o > 0 ? { x: x + eyeX * s, y: y + eyeY * s, s, o: o * opacity } : HIDDEN;
  const matte = eye.pupilMatte;
  return {
    pupilHaze: at(matte.x, matte.y, strength.haze),
    pupilGlow: at(matte.x, matte.y, strength.glow),
    irisSpill: at(eye.pupil.x - GLOW_SIZES.irisSpill.width / 2, eye.pupil.y - GLOW_SIZES.irisSpill.height / 2, strength.spill),
    cornealGlint: at(eye.pupil.x - 250, eye.pupil.y - 245, strength.glint),
  };
}

/**
 * Depth cues for the gateway while it is deep inside the pupil: slightly
 * softer than the iris, with a restrained bloom that fades as it becomes the
 * open-space gateway. Radii are given in screen pixels and converted to the
 * element's local space (the filter is applied before its transform).
 */
function gatewayDepthFilter(e: number, gateScale: number): string | null {
  const softness = 0.5 * (1 - smoothstep(0.04, 0.24, e));
  const bloomAlpha = 0.45 * (1 - smoothstep(0.2, 0.32, e));
  if (softness <= 0.01 && bloomAlpha <= 0.005) return null;
  const bloomRadius = lerp(4, 10, smoothstep(0, 0.2, e));
  const blur = softness > 0.01 ? `blur(${(softness / gateScale).toFixed(1)}px) ` : "";
  return `${blur}drop-shadow(0 0 ${(bloomRadius / gateScale).toFixed(1)}px rgba(150, 110, 255, ${bloomAlpha.toFixed(3)}))`;
}

export function computeSceneFrame(p: number, rig: SceneRig, reducedMotion: boolean): SceneFrame {
  return reducedMotion ? computeReducedFrame(p, rig) : computeCinematicFrame(p, rig);
}

function computeCinematicFrame(p: number, rig: SceneRig): SceneFrame {
  const { eye, gate, human, interior, deceleration, constellation } = CINEMATIC_ASSETS;
  const e = sceneEase(clamp01(p));
  const z = rig.cameraZ(e);
  const speed = rig.cameraZ.derivative(e);

  const pan = smoothstep(0.78, 0.95, e);
  const vpX = rig.vpX + rig.arrivalPanX * pan;
  const vpY = rig.vpY + rig.arrivalPanY * pan;

  /* Eye — nearest object; the camera flies through the pupil. */
  let eyeLayer = HIDDEN;
  let pupilCoverage = Infinity; // pupil radius relative to the half-diagonal; 1 = pupil fills the screen
  if (z < rig.eyeDepth) {
    const eyeScale = (rig.eyeBase * rig.eyeDepth) / (rig.eyeDepth - z);
    pupilCoverage = (eye.pupil.r * eyeScale) / rig.halfDiagonal;
    const o = 1 - smoothstep(0.55, 1, pupilCoverage);
    if (o > 0) eyeLayer = anchored(eye.pupil.x, eye.pupil.y, vpX, vpY, eyeScale, o);
  }

  /* Gateway discovery: dim, soft and embedded at rest; light builds as the camera approaches. */
  const discovery = smoothstep(0, 0.24, e);
  // Pupil haze / scatter describe the view INTO a small pupil. As the camera enters
  // the pupil they hand over to the gateway's own glow instead of growing into a wash.
  const insidePupilView = 1 - smoothstep(0.18, 0.42, pupilCoverage);
  const eyeIntegration = eyeIntegrationLayers(eyeLayer, {
    haze: 0.32 * (1 - smoothstep(0.03, 0.22, e)) * insidePupilView,
    glow: lerp(0.55, 1, discovery) * insidePupilView,
    spill: lerp(0.6, 1, discovery),
    glint: lerp(0.5, 1, discovery),
  });

  /* Gateway — one physical object from the pupil to the threshold. */
  const beforeCrossing = z < rig.zCross;
  const kg = beforeCrossing ? rig.gateK0 / (GATE_DEPTH - z) : rig.gateK0 / (GATE_DEPTH - rig.zCross);
  const gateLayer = beforeCrossing ? anchored(gate.axis.x, gate.axis.y, vpX, vpY, kg, lerp(0.8, 1, discovery)) : HIDDEN;
  const gateFilter = beforeCrossing ? gatewayDepthFilter(e, kg) : null;

  const glowPower = lerp(0.12, 0.95, smoothstep(0, 0.55, e)) * (1 - smoothstep(0.6, BEATS.crossing, e));
  const gateGlowLayer = beforeCrossing
    ? anchored(
        GLOW_SIZES.gateGlow.width / 2,
        GLOW_SIZES.gateGlow.height / 2,
        vpX + (580 - gate.axis.x) * kg,
        vpY + (760 - gate.axis.y) * kg,
        kg,
        glowPower,
      )
    : HIDDEN;
  const floorGlowLayer = beforeCrossing
    ? anchored(
        GLOW_SIZES.floorGlow.width / 2,
        GLOW_SIZES.floorGlow.height / 2,
        vpX,
        vpY + (gate.floorY - gate.axis.y) * kg,
        kg,
        lerp(0.06, 0.85, smoothstep(0.1, 0.5, e)) * (1 - smoothstep(0.58, 0.64, e)),
      )
    : HIDDEN;

  // Depth fog on the threshold softens the floor line of the portal interior.
  const thresholdFogLayer = beforeCrossing
    ? anchored(
        GLOW_SIZES.thresholdFog.width / 2,
        GLOW_SIZES.thresholdFog.height / 2,
        vpX,
        vpY + (gate.floorY - gate.axis.y) * kg,
        kg,
        smoothstep(0.12, 0.26, e) * (1 - smoothstep(0.6, BEATS.crossing, e)),
      )
    : HIDDEN;

  /* Portal interior — behind the gateway, seen through its aperture, fills the view after crossing. */
  let interiorLayer: SceneFrame["interior"] = { ...HIDDEN, clip: null };
  // A faint glimpse through the aperture at rest, so the doorway never reads as a lit card.
  const interiorOpacity =
    lerp(lerp(0.02, 0.3, smoothstep(0.06, 0.26, e)), 1, smoothstep(0.28, 0.52, e)) * (1 - smoothstep(0.775, 0.805, e));
  if (interiorOpacity > 0 && z < INTERIOR_DEPTH) {
    const ki = rig.interiorK0 / (INTERIOR_DEPTH - z);
    const layer = anchored(interior.vanishing.x, interior.vanishing.y, vpX, vpY, ki, interiorOpacity);
    let clip: string | null = null;
    if (beforeCrossing) {
      const c = gate.apertureClip;
      const gx = gateLayer.x;
      const gy = gateLayer.y;
      // Aperture rectangle converted into the interior image's own pixels.
      const toLocalX = (gateLocalX: number) => (gx + gateLocalX * kg - layer.x) / ki;
      const toLocalY = (gateLocalY: number) => (gy + gateLocalY * kg - layer.y) / ki;
      const top = Math.max(0, toLocalY(c.top));
      const left = Math.max(0, toLocalX(c.left));
      const right = Math.max(0, interior.width - toLocalX(c.right));
      const bottom = Math.max(0, interior.height - toLocalY(c.bottom));
      const radius = (c.radius * kg) / ki;
      clip = `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round ${radius.toFixed(1)}px)`;
    }
    interiorLayer = { ...layer, clip };
  }

  /* Human — stands just in front of the threshold; the camera passes over them. */
  let humanLayer = HIDDEN;
  const humanOpacity = smoothstep(0.4, 0.5, e);
  if (humanOpacity > 0 && z < rig.humanDepth) {
    const kh = rig.gateK0 / (rig.humanDepth - z);
    const feetY = vpY + (gate.floorY - gate.axis.y) * kh;
    const s = rig.humanScale * kh;
    const headY = feetY - (human.feet.y - human.headY) * s;
    if (headY < rig.height + 8) humanLayer = anchored(human.feet.x, human.feet.y, vpX, feetY, s, humanOpacity);
  }

  /* Volumetric rays from the portal toward the viewer. */
  const raysOpacity = presence(e, 0.38, 0.6, 0.72, 0.79) * 0.55;
  const raysScale = beforeCrossing ? kg : kg * (1 + (z - rig.zCross) * 4);
  const raysLayer =
    raysOpacity > 0
      ? anchored(GLOW_SIZES.rays.width / 2, GLOW_SIZES.rays.height / 2, vpX, vpY, raysScale, raysOpacity)
      : HIDDEN;

  /* Light bloom → energy collapses into the intelligence node. */
  const bloomUp = smoothstep(0.7, BEATS.bloomPeak, e);
  const collapse = smoothstep(BEATS.bloomPeak, 0.83, e);
  const bloomScale = lerp(lerp(0.15, 2.8, bloomUp), 0.035, collapse * collapse * collapse);
  const bloomOpacity = bloomUp * (1 - smoothstep(0.8, 0.845, e));
  const bloomLayer =
    bloomOpacity > 0
      ? anchored(GLOW_SIZES.bloom.width / 2, GLOW_SIZES.bloom.height / 2, vpX, vpY, bloomScale, bloomOpacity)
      : HIDDEN;
  // The collapsed light becomes the node; it calms to the restrained Frame 05 glow as the camera settles.
  const nodeOpacity = smoothstep(0.78, 0.84, e) * (1 - 0.6 * smoothstep(0.9, 0.97, e));
  const nodeLayer =
    nodeOpacity > 0
      ? anchored(GLOW_SIZES.nodeGlow.width / 2, GLOW_SIZES.nodeGlow.height / 2, vpX, vpY, rig.compact ? 0.7 : 1, nodeOpacity)
      : HIDDEN;

  /* Arrival plates, registered on the node so rays converge into it. */
  const arrivalProjection = 1 / Math.max(rig.arrivalDepth - z, 0.05);
  const decelerationOpacity = smoothstep(0.785, 0.82, e) * (1 - smoothstep(0.87, 0.95, e)) * 0.85;
  const decelerationLayer =
    decelerationOpacity > 0
      ? anchored(deceleration.focal.x, deceleration.focal.y, vpX, vpY, rig.decelerationK0 * arrivalProjection, decelerationOpacity)
      : HIDDEN;
  const constellationOpacity = smoothstep(0.83, 0.93, e);
  const constellationScale = rig.constellationK0 * arrivalProjection;
  const constellationLayer =
    constellationOpacity > 0
      ? anchored(constellation.node.x, constellation.node.y, vpX, vpY, constellationScale, constellationOpacity)
      : HIDDEN;
  // Frame 05: the same constellation continues in the approved background (registered, so no jump).
  const beliefOpacity = smoothstep(0.88, 0.95, e);
  const beliefBackgroundLayer =
    beliefOpacity > 0
      ? anchored(BELIEF_NODE.x, BELIEF_NODE.y, vpX, vpY, constellationScale / CINEMATIC_ASSETS.beliefBackground.fromArrival.scale, beliefOpacity)
      : HIDDEN;

  const text = textFrames(e);
  const passageEnergy = presence(e, 0.6, BEATS.crossing, 0.74, 0.8);

  return {
    p,
    e,
    z,
    speed,
    eye: eyeLayer,
    ...eyeIntegration,
    gate: gateLayer,
    gateFilter,
    gateGlow: gateGlowLayer,
    floorGlow: floorGlowLayer,
    thresholdFog: thresholdFogLayer,
    interior: interiorLayer,
    human: humanLayer,
    rays: raysLayer,
    bloom: bloomLayer,
    nodeGlow: nodeLayer,
    deceleration: decelerationLayer,
    constellation: constellationLayer,
    beliefBackground: beliefBackgroundLayer,
    beliefGrade: beliefOpacity,
    belief: beliefFrame(e, false),
    vignette: 1 - 0.65 * bloomUp * (1 - collapse),
    // The opening frames use the editorial scrim; the Belief frame has its own grade layer.
    scrim: Math.max(...text.slice(0, -1).map((t) => t.o)),
    text,
    scrollHint: 1 - smoothstep(0, 0.03, e),
    intense: passageEnergy > 0.5 || bloomOpacity > 0.5,
    particles: {
      vpX,
      vpY,
      density: lerp(0.18, 1, smoothstep(0.15, 0.62, e)) * (1 - 0.65 * smoothstep(0.8, 0.95, e)),
      streak: smoothstep(0.55, 0.68, e) * (1 - smoothstep(0.74, 0.86, e)),
      brightness: 1 - 0.5 * bloomUp * (1 - collapse),
      travel: particleTravel(e),
      travelSpeed: particleTravel.derivative(e),
    },
  };
}

/**
 * Reduced motion: no camera travel, no zoom, no streaks. The same story is
 * told as calm, static compositions that fade into one another.
 */
function computeReducedFrame(p: number, rig: SceneRig): SceneFrame {
  const { eye, gate, human, interior, deceleration, constellation } = CINEMATIC_ASSETS;
  const e = sceneEase(clamp01(p));
  const vpX = rig.vpX;
  const vpY = rig.vpY;

  const eyeOpacity = 1 - smoothstep(0.12, 0.2, e);
  const eyeLayer = anchored(eye.pupil.x, eye.pupil.y, vpX, vpY, rig.eyeBase, eyeOpacity);
  const eyeIntegration = eyeIntegrationLayers(eyeLayer, { haze: 0.32, glow: 0.55, spill: 0.6, glint: 0.5 });

  // Gate in the pupil fades out, then returns as a large static gate.
  const smallGateOpacity = 1 - smoothstep(0.1, 0.16, e);
  const largeGateOpacity = presence(e, 0.2, 0.28, 0.6, 0.66);
  const largeK = Math.min(rig.height * 0.62, (rig.width * 0.62 * gate.height) / gate.width) / gate.height;
  const useLarge = e >= 0.18;
  const kg = useLarge ? largeK : rig.gateK0;
  const gateLayer = anchored(gate.axis.x, gate.axis.y, vpX, vpY, kg, useLarge ? largeGateOpacity : smallGateOpacity * 0.8);

  const passageOpacity = presence(e, 0.64, 0.7, 0.76, 0.82);
  let interiorLayer: SceneFrame["interior"];
  if (e < 0.63) {
    const ki = (Math.max(rig.width / interior.width, rig.height / interior.height) * 0.9);
    // Fully faded before the switch to the full-frame composition at e = 0.63.
    // The small gateway inside the pupil only offers a faint glimpse of the interior.
    const glimpse = useLarge ? 0.9 : 0.03;
    const layer = anchored(interior.vanishing.x, interior.vanishing.y, vpX, vpY, ki, gateLayer.o * glimpse * (1 - smoothstep(0.56, 0.62, e)));
    const c = gate.apertureClip;
    const toLocalX = (gx: number) => (gateLayer.x + gx * kg - layer.x) / ki;
    const toLocalY = (gy: number) => (gateLayer.y + gy * kg - layer.y) / ki;
    const clip = `inset(${Math.max(0, toLocalY(c.top)).toFixed(1)}px ${Math.max(0, interior.width - toLocalX(c.right)).toFixed(1)}px ${Math.max(0, interior.height - toLocalY(c.bottom)).toFixed(1)}px ${Math.max(0, toLocalX(c.left)).toFixed(1)}px round ${((c.radius * kg) / ki).toFixed(1)}px)`;
    interiorLayer = { ...layer, clip };
  } else {
    const ki = Math.max(rig.width / interior.width, rig.height / interior.height) * 1.02;
    interiorLayer = { ...anchored(interior.vanishing.x, interior.vanishing.y, vpX, vpY, ki, passageOpacity), clip: null };
  }

  const humanOpacity = presence(e, 0.42, 0.5, 0.58, 0.64);
  const s = rig.humanScale * largeK;
  const feetY = vpY + (gate.floorY - gate.axis.y) * largeK;
  const humanLayer = anchored(human.feet.x, human.feet.y, vpX, feetY, s, humanOpacity);

  const decelerationCover = Math.max(rig.width / deceleration.width, rig.height / deceleration.height);
  const decelerationLayer = anchored(deceleration.focal.x, deceleration.focal.y, vpX, vpY, decelerationCover, presence(e, 0.8, 0.85, 0.88, 0.93) * 0.8);
  const constellationK = rig.constellationK0 / (rig.arrivalDepth - rig.cameraZ(1));
  const constellationLayer = anchored(constellation.node.x, constellation.node.y, vpX + rig.arrivalPanX, vpY + rig.arrivalPanY, constellationK, smoothstep(0.88, 0.95, e));
  const nodeOpacity = smoothstep(0.88, 0.95, e);
  const beliefBackgroundLayer = anchored(BELIEF_NODE.x, BELIEF_NODE.y, vpX + rig.arrivalPanX, vpY + rig.arrivalPanY, rig.beliefScale, smoothstep(0.9, 0.95, e));

  const text = textFrames(e);
  return {
    p,
    e,
    z: 0,
    speed: 0,
    eye: eyeLayer,
    ...eyeIntegration,
    gate: gateLayer,
    gateFilter: useLarge ? null : gatewayDepthFilter(0, kg),
    gateGlow: HIDDEN,
    floorGlow: HIDDEN,
    thresholdFog: anchored(
      GLOW_SIZES.thresholdFog.width / 2,
      GLOW_SIZES.thresholdFog.height / 2,
      vpX,
      vpY + (gate.floorY - gate.axis.y) * kg,
      kg,
      useLarge ? gateLayer.o : 0,
    ),
    interior: interiorLayer,
    human: humanLayer,
    rays: HIDDEN,
    bloom: HIDDEN,
    nodeGlow: anchored(GLOW_SIZES.nodeGlow.width / 2, GLOW_SIZES.nodeGlow.height / 2, vpX + rig.arrivalPanX, vpY + rig.arrivalPanY, rig.compact ? 0.7 : 1, nodeOpacity),
    deceleration: decelerationLayer,
    constellation: constellationLayer,
    beliefBackground: beliefBackgroundLayer,
    beliefGrade: smoothstep(0.9, 0.95, e),
    belief: beliefFrame(e, true),
    vignette: 1,
    // The opening frames use the editorial scrim; the Belief frame has its own grade layer.
    scrim: Math.max(...text.slice(0, -1).map((t) => t.o)),
    text,
    scrollHint: 1 - smoothstep(0, 0.03, e),
    intense: false,
    particles: { vpX, vpY, density: 0.35, streak: 0, brightness: 0.8, travel: 0, travelSpeed: 0 },
  };
}
