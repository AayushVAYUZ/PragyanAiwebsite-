"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 10 — What We've Built. Composition from the approved Stitch reference.
 * Only approved copy is shown: each product's name and tagline. Descriptions and
 * capability pills are pending approval, and no product destinations exist yet,
 * so the "Explore" labels are plain text. The product images are illustrative key
 * art; text inside them is artwork, not page copy.
 */
const PRODUCTS = [
  {
    name: "ReX",
    tagline: "Intelligent Talent Exchange",
    accent: "rex",
    image: "/images/rex-product-approved.png",
    alt: "Illustrative ReX product artwork: glass interface panels in a dark office",
    // The central panel carries the composition; keep it centred at every crop.
    position: "object-center",
  },
  {
    name: "Minuta",
    tagline: "Turn Meetings into Momentum",
    accent: "minuta",
    image: "/images/minuta-product-approved.png",
    alt: "Illustrative Minuta product artwork: a glass display with a waveform on a boardroom desk at night",
    // The display extends right of centre; a slight right shift keeps its right edge in narrow crops.
    position: "object-[60%_50%]",
  },
] as const;

export default function BuiltProducts() {
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
          "[data-built-copy]",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 78%", end: "top 30%", scrub: 0.6 },
          },
        );

        // Each panel rises in as it enters the viewport (Minuta slightly after ReX when side by side).
        // The product image is never hidden: it settles from a slight zoom while a soft light passes over it.
        gsap.utils.toArray<HTMLElement>("[data-built-panel]").forEach((panel, index) => {
          const offset = index * 5;
          gsap.fromTo(
            panel,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: panel, start: `top ${98 - offset}%`, end: `top ${78 - offset}%`, scrub: 0.6 },
            },
          );

          const frame = panel.querySelector<HTMLElement>("[data-built-media]");
          const sheen = panel.querySelector<HTMLElement>("[data-built-sheen]");
          if (frame) {
            gsap.fromTo(
              frame,
              { scale: 1.15 },
              { scale: 1, ease: "power2.out", scrollTrigger: { trigger: frame, start: `top ${95 - offset}%`, end: `top ${40 - offset}%`, scrub: 0.8 } },
            );
          }
          if (sheen) {
            gsap.fromTo(
              sheen,
              { xPercent: -120 },
              { xPercent: 120, ease: "none", scrollTrigger: { trigger: panel, start: `top ${85 - offset}%`, end: `top ${35 - offset}%`, scrub: 0.8 } },
            );
          }
        });
      },
      section,
    );

    return () => media.revert();
  }, []);

  return (
    <section
      id="products"
      ref={sectionRef}
      aria-labelledby="products-heading"
      className="relative isolate min-h-[max(calc(var(--svh)*100),52rem)] overflow-hidden bg-[var(--void-black)]"
    >
      <div aria-hidden="true" className="built-ambient pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex min-h-[inherit] w-full flex-col justify-center px-[var(--gutter-x)] pt-28 pb-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-14 grid grid-cols-1 items-end gap-6 lg:mb-16 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <h2
                id="products-heading"
                data-built-copy
                className="text-4xl leading-[1.08] font-normal tracking-tight text-white md:text-5xl lg:text-[54px]"
              >
                We build with ai.
                <br />
                <span className="bg-gradient-to-r from-white via-[#E0E5F5] to-[var(--neon-cyan)] bg-clip-text text-transparent">
                  We build ai too.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:flex lg:justify-end">
              {/* No product destinations exist yet: plain text in the Stitch CTA position. */}
              <p data-built-copy className="text-xs font-medium tracking-wider text-white/50 uppercase">
                Explore All Products
              </p>
            </div>
          </div>

          <ul aria-label="Products" className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            {PRODUCTS.map((product) => (
              <li key={product.name} data-built-panel>
                <article className={`built-panel built-panel-${product.accent} overflow-hidden rounded-2xl`}>
                  {/* The product key art is the panel's lead visual: full panel width, cropped to a tall frame. */}
                  <div className="relative h-[260px] w-full overflow-hidden border-b border-white/10 bg-[#050711] md:h-[300px] lg:h-[380px]">
                    <div data-built-media className="absolute inset-0">
                      <div className={`built-media-drift built-media-drift-${product.accent} absolute inset-0`}>
                        <Image
                          src={product.image}
                          alt={product.alt}
                          fill
                          loading="eager"
                          quality={90}
                          sizes="(min-width: 1024px) 44vw, 96vw"
                          className={`built-media-image object-cover ${product.position}`}
                        />
                      </div>
                    </div>
                    <div aria-hidden="true" className="built-media-fade pointer-events-none absolute inset-0" />
                    <div aria-hidden="true" data-built-sheen className="built-media-sheen pointer-events-none absolute inset-0" />
                  </div>

                  <div className="p-6 md:p-8">
                    <h3 className="text-3xl font-light tracking-tight text-white">{product.name}</h3>
                    <p
                      className={`mt-1 text-xs font-semibold tracking-wider uppercase ${
                        product.accent === "rex" ? "text-[var(--neon-cyan)]" : "text-[#C47FFF]"
                      }`}
                    >
                      {product.tagline}
                    </p>

                    {/* No destination yet: plain text, not a link. */}
                    <p className="mt-7 border-t border-white/10 pt-5 text-sm font-medium tracking-wide text-white/55">
                      Explore {product.name}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
