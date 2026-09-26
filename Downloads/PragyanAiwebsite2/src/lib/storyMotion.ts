import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Restrained motion for the business-story sections: content eases up once as the section
 * arrives, and one item at a time can be lit as the reader scrolls past. Reduced motion
 * leaves everything in place, fully visible, with nothing lit.
 */

/**
 * Reveals every `[data-reveal]` element in the section, in document order, the first time the
 * section comes into view. Elements sharing a `data-reveal` group value arrive together.
 */
export function useReveal(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", section);
      if (!items.length) return;
      gsap.set(items, { autoAlpha: 0, y: 18 });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.09,
        scrollTrigger: { trigger: section, start: "top 78%", toggleActions: "play none none none" },
      });
    });
    return () => media.revert();
  }, [sectionRef]);
}

/**
 * Lights one of `count` items as the reader scrolls through `trackRef`: the item index follows
 * scroll progress, so it works whether the items sit in a row or a column. Hands back -1 when
 * reduced motion is on, or before the track has been reached.
 */
export function useScrollIndex(
  trackRef: RefObject<HTMLElement | null>,
  count: number,
  onIndex: (index: number) => void,
  enabled = true,
) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !enabled) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let current = -2;
      const set = (index: number) => {
        if (index === current) return;
        current = index;
        onIndex(index);
      };
      const trigger = ScrollTrigger.create({
        trigger: track,
        start: "top 70%",
        end: "bottom 45%",
        onUpdate: (self) => set(Math.min(count - 1, Math.floor(self.progress * count))),
        onLeaveBack: () => set(-1),
      });
      return () => {
        trigger.kill();
        onIndex(-1);
      };
    });
    return () => media.revert();
  }, [trackRef, count, onIndex, enabled]);
}
