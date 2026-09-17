/**
 * Tracks when the cinematic images have been fetched AND decoded, so the
 * preloader can hold the eye open until nothing will pop in during scroll.
 *
 * Scene images register themselves through a ref callback; ref callbacks run
 * during commit, before any effect, so the registry is complete by the time
 * the preloader's effect asks for it.
 */

export type CinematicAssetKey = "eye" | "gate" | "human" | "interior" | "deceleration" | "constellation" | "belief";

const pending = new Map<CinematicAssetKey, Promise<void>>();

function decodeImage(img: HTMLImageElement): Promise<void> {
  const decode = () => img.decode().catch(() => undefined);
  if (img.complete && img.naturalWidth > 0) return decode();
  return new Promise<void>((resolve) => {
    const done = () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
      decode().then(resolve);
    };
    img.addEventListener("load", done);
    img.addEventListener("error", done);
  });
}

export function registerCinematicImage(key: CinematicAssetKey, img: HTMLImageElement | null) {
  if (!img) return;
  pending.set(key, decodeImage(img));
}

/** Resolves when the requested images are decoded, or after `timeoutMs`. */
export function whenCinematicAssetsReady(keys: CinematicAssetKey[] | "all", timeoutMs: number): Promise<void> {
  const selected = keys === "all" ? [...pending.values()] : keys.map((k) => pending.get(k)).filter(Boolean);
  const ready = Promise.all(selected).then(() => undefined);
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
  return Promise.race([ready, timeout]);
}
