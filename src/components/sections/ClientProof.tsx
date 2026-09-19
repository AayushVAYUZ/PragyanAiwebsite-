"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionContinuum from "./SectionContinuum";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 12 — Client Proof. Composition from the approved Stitch reference: editorial
 * column on the left, a framed cinematic image with a violet/cyan halo on the right.
 *
 * The testimonial, its attribution, the trust line and the CTA are pending approved
 * copy. Their slots below are wired but empty (null), so they render nothing until the
 * approved text is supplied; no placeholder copy is shown in the meantime.
 */
const TRUST_LINE: string | null = null;
const TESTIMONIAL: { quote: string; attribution: string } | null = null;
const CTA: { label: string; href: string } | null = null;

const IMAGE = {
  src: "/images/client-proof-background.png",
  alt: "A dark reflective hall of glowing crystal monoliths, with fog and an illuminated arched portal",
};

export default function ClientProof() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Every case needs one matching condition: matchMedia only runs the setup when one matches.
    const media = gsap.matchMedia();
    media.add(
      { reduceMotion: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        if (context.conditions?.reduceMotion) return;

        gsap.fromTo(
          "[data-proof-copy]",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 78%", end: "top 30%", scrub: 0.6 },
          },
        );

        // The framed image rises in, and the photograph settles from a slight zoom as it arrives.
        gsap.fromTo(
          "[data-proof-frame]",
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, ease: "power2.out", scrollTrigger: { trigger: "[data-proof-frame]", start: "top 95%", end: "top 60%", scrub: 0.6 } },
        );
        gsap.fromTo(
          "[data-proof-media]",
          { scale: 1.03 },
          { scale: 1, ease: "power2.out", scrollTrigger: { trigger: "[data-proof-frame]", start: "top 95%", end: "top 35%", scrub: 0.8 } },
        );
      },
      section,
    );

    return () => media.revert();
  }, []);

  return (
    <section
      id="client-proof"
      ref={sectionRef}
      aria-labelledby="client-proof-heading"
      className="relative isolate min-h-[max(calc(var(--svh)*100),52rem)] overflow-hidden bg-[var(--void-black)]"
    >
      <div aria-hidden="true" className="proof-ambient pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-[inherit] w-full flex-col justify-center px-[var(--gutter-x)] pt-28 pb-24">
        <div className="mx-auto grid w-full max-w-[1720px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Editorial column */}
          <div className="flex flex-col gap-10 lg:col-span-7">
            <div className="flex flex-col gap-4">
              <p data-proof-copy className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_8px_#26C6FF]" />
                <span className="font-[family-name:var(--font-mono)] text-xs tracking-[0.22em] text-[#A2A8BC] uppercase">
                  12 — Client Proof
                </span>
              </p>
              <h2
                id="client-proof-heading"
                data-proof-copy
                className="text-4xl leading-[1.08] font-normal tracking-[-0.03em] text-white md:text-5xl lg:text-[62px]"
              >
                What changes
                <br />
                <span className="font-light text-neutral-300">when intelligence works.</span>
              </h2>
              {TRUST_LINE && (
                <p data-proof-copy className="pt-1 text-base font-light tracking-wide text-neutral-400 md:text-lg">
                  {TRUST_LINE}
                </p>
              )}
            </div>

            {/* Testimonial slot: renders only once approved copy exists. */}
            {TESTIMONIAL && (
              <figure data-proof-copy className="proof-quote flex flex-col gap-5 py-2 pl-6 md:pl-8">
                <blockquote className="text-2xl leading-[1.32] font-normal tracking-[-0.015em] text-[var(--text-primary)] md:text-3xl lg:text-[36px]">
                  {TESTIMONIAL.quote}
                </blockquote>
                <figcaption className="text-xs font-medium tracking-[0.14em] text-[#A2A8BC] uppercase md:text-sm">
                  {TESTIMONIAL.attribution}
                </figcaption>
              </figure>
            )}

            {/* CTA slot: renders only once a real destination exists. */}
            {CTA && (
              <div data-proof-copy className="pt-2">
                <a
                  href={CTA.href}
                  className="group inline-flex items-center gap-3 rounded-full border border-[rgba(160,175,220,0.22)] bg-[#070B18]/50 px-7 py-3 text-sm font-medium text-white transition-[border-color,background-color,box-shadow] duration-300 hover:border-[var(--neon-cyan)]/45 hover:bg-[#070B18]"
                >
                  <span>{CTA.label}</span>
                  <span aria-hidden="true" className="text-base text-[var(--neon-cyan)] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            )}
          </div>

          {/* Framed cinematic image with a CSS halo */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div aria-hidden="true" className="proof-halo pointer-events-none absolute -inset-4 rounded-3xl" />
            <div
              data-proof-frame
              className="proof-frame relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[rgba(160,175,220,0.16)] bg-[#070B18] lg:aspect-[4/3]"
            >
              {/* Focal points keep the cyan monolith, the fog and the arched portal in the crop: the 4:3 desktop
                  window shows 75% of the image width, the 16:10 mobile window 90%. */}
              <div data-proof-media className="absolute inset-0">
                <Image
                  src={IMAGE.src}
                  alt={IMAGE.alt}
                  fill
                  loading="eager"
                  quality={90}
                  sizes="(min-width: 1024px) 36vw, 92vw"
                  className="proof-image object-cover object-[55%_50%] lg:object-[68%_50%]"
                />
              </div>
              <div aria-hidden="true" className="proof-vignette pointer-events-none absolute inset-0" />
            </div>
          </div>
        </div>
      </div>

      <SectionContinuum index="12" title="Client Proof" />
    </section>
  );
}
