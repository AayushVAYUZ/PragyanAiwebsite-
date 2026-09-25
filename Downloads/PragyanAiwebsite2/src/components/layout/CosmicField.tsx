import type { CSSProperties } from "react";

/**
 * One continuous field of deep space behind the whole page.
 *
 * Every section paints its own artwork over this, so the field is only seen through the
 * quiet stretches between them — which is the point: the gaps stop reading as dead black
 * and start reading as the same space the journey is travelling through.
 *
 * Fixed rather than scrolled, so the field holds still while sections pass over it. All of
 * it is CSS: no canvas, no per-frame JavaScript, nothing to schedule or clean up.
 */

/**
 * The sky is generated rather than hand-listed: at the density needed to read as a field
 * instead of a few specks, a literal would be ~90 lines of noise. The generator is a plain
 * LCG off a fixed seed, so it produces the identical sequence on the server and the client
 * and hydration matches.
 */
const STAR_COUNT = 88;

function makeStars(count: number, seed: number) {
  let state = seed;
  const rand = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  return Array.from({ length: count }, () => {
    // Most stars are faint pinpricks; a few are brighter and larger, which is what keeps
    // the field from looking like an evenly-stippled texture.
    const bright = rand() < 0.22;
    return {
      x: +(rand() * 100).toFixed(2),
      y: +(rand() * 100).toFixed(2),
      size: +((bright ? 1.9 : 1.2) + rand() * (bright ? 0.9 : 0.5)).toFixed(2),
      base: +((bright ? 0.6 : 0.3) + rand() * (bright ? 0.3 : 0.25)).toFixed(2),
      delay: +(rand() * 9).toFixed(2),
    };
  });
}

const STARS = makeStars(STAR_COUNT, 20260925);

/**
 * Three comets, each with its own lane, angle and long cycle. A pass takes about a quarter
 * of its cycle, and the three cycles are coprime enough not to sync up — so one crosses
 * every twenty seconds or so rather than a shower.
 */
const COMETS = [
  { top: 16, from: -12, to: 118, angle: 14, duration: 27, delay: 4, length: 180, hue: "rgba(186, 224, 255, 0.9)" },
  { top: 58, from: 114, to: -14, angle: -166, duration: 34, delay: 15, length: 150, hue: "rgba(201, 166, 255, 0.85)" },
  { top: 78, from: -10, to: 120, angle: 9, duration: 41, delay: 26, length: 200, hue: "rgba(160, 214, 255, 0.8)" },
] as const;

export default function CosmicField() {
  return (
    <div aria-hidden="true" className="cosmic-field">
      {STARS.map((star, i) => (
        <span
          key={i}
          className="cosmic-star"
          style={
            {
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              "--star-base": star.base,
            } as CSSProperties
          }
        />
      ))}

      {COMETS.map((comet, i) => (
        <span
          key={`c-${i}`}
          className="cosmic-comet"
          style={
            {
              top: `${comet.top}%`,
              width: `${comet.length}px`,
              animationDuration: `${comet.duration}s`,
              animationDelay: `${comet.delay}s`,
              "--from": `${comet.from}vw`,
              "--to": `${comet.to}vw`,
              "--angle": `${comet.angle}deg`,
              "--comet-hue": comet.hue,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
