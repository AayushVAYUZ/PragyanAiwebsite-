"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 10 — What We've Built.
 *
 * These are products built inside the business for its own problems, not client work, so
 * the copy stays on what each one is and why it was built. Detailed functionality belongs
 * on the product pages; listing it here only crowds the cards.
 *
 * The scene assembles itself once the section is on screen; nothing is tied to scroll.
 */


const PRODUCTS = [
  {
    id: "rex",
    name: "RAPYD Exchange (ReX)",
    short: "ReX",
    tagline: "ai for Recruitment",
    text: "Built internally to make hiring faster, more consistent and more intelligence-driven.",
    features: ["JD Generation", "Candidate Scoring & Benchmarking", "ai-powered Interview Assessment"],
    cta: "Explore ReX",
    image: "/images/rex-product-approved.png",
    alt: "Dark-mode recruitment intelligence interface with candidate matching visuals",
    tone: "cyan",
  },
  {
    id: "minuta",
    name: "BITOVN Minuta",
    short: "BITOVN Minuta",
    tagline: "ai for Meetings & Collaboration",
    text: "Built internally to capture conversations, decisions and actions without adding work to the team.",
    features: ["Live Captions & Auto-transcription", "Decision & Action Item Tracking", "Ready-to-send MoM"],
    cta: "Explore Minuta",
    image: "/images/minuta-product-approved.png",
    alt: "Dark-mode meeting intelligence interface with waveform and transcript panels",
    tone: "violet",
  },
] as const;

/** The tagline is set in uppercase by the design, so "ai" is opted out of the transform —
 * the same treatment the header gives "Ask P.ai". */
function renderTagline(text: string) {
  return text.split(/\b(ai)\b/g).map((part, i) =>
    part === "ai" ? (
      <span key={i} className="normal-case">
        ai
      </span>
    ) : (
      part
    ),
  );
}

function clear(el: HTMLElement | null) {
  if (!el) return;
  el.style.removeProperty("visibility");
  el.style.removeProperty("opacity");
  el.style.removeProperty("transform");
  el.style.removeProperty("filter");
}

export default function BuiltProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const els = useRef<{
    backdrop: HTMLElement | null;
    atmos: HTMLElement | null;
    head: HTMLElement | null;
    cards: (HTMLElement | null)[];
    media: (HTMLElement | null)[];
    bodies: (HTMLElement | null)[];
    sheens: (HTMLElement | null)[];
  }>({ backdrop: null, atmos: null, head: null, cards: [], media: [], bodies: [], sheens: [] });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const media = gsap.matchMedia();

    media.add(
      {
        // The two showcases need side-by-side room. Anywhere narrower, and under
        // reduced motion, the scene collapses to ordinary document flow.
        camera: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        flow: "(max-width: 1023.98px), (prefers-reduced-motion: reduce)",
      },
      (context) => {
        const e = els.current;

        if (!context.conditions?.camera) {
          section.dataset.motion = "off";
          [e.backdrop, e.atmos, e.head, ...e.cards, ...e.media, ...e.bodies, ...e.sheens].forEach(clear);
          return;
        }

        section.dataset.motion = "on";

        const cards = e.cards.filter(Boolean) as HTMLElement[];
        const bodies = e.bodies.filter(Boolean) as HTMLElement[];
        const arriving = [e.head, ...cards, ...bodies].filter(Boolean) as HTMLElement[];

        // The renders sit slightly oversized so the drift never exposes their edges.
        gsap.set(e.media.filter(Boolean), { scale: 1.06 });
        gsap.set(arriving, { autoAlpha: 0, y: 26 });

        // The showcases assemble once the section is on screen. Nothing is tied to scroll
        // position: scrubbing across four screens left an empty frame ahead of the content.
        const intro = gsap.timeline({ paused: true });
        if (e.head) intro.to(e.head, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0);
        if (cards.length) intro.to(cards, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.75, stagger: 0.12, ease: "power2.out" }, 0.28);
        if (bodies.length) intro.to(bodies, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, 0.48);

        // A single pass of light across each product image as its card lands, then done.
        const sheens = e.sheens.filter(Boolean) as HTMLElement[];
        sheens.forEach((sheen, i) => {
          intro.fromTo(
            sheen,
            { xPercent: -130, opacity: 0 },
            { xPercent: 130, duration: 1.2, ease: "power1.inOut", keyframes: { opacity: [0, 1, 1, 0] } },
            0.55 + i * 0.12,
          );
        });

        // Scroll keeps only a restrained depth drift on the environment.
        const drift = [e.backdrop, e.atmos].filter(Boolean) as HTMLElement[];
        if (drift.length) {
          gsap.fromTo(
            drift,
            { yPercent: -1.8 },
            { yPercent: 1.8, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }

        let started = false;
        const visibility = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !started) {
                started = true;
                intro.play();
              }
            });
          },
          { threshold: 0.15 },
        );
        visibility.observe(section);

        return () => {
          visibility.disconnect();
          intro.kill();
        };
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
      data-motion="off"
      className="built-scene"
    >
      <div className="built-viewport">
        {/* Environment: the generated enterprise backdrop, held behind everything */}
        <div aria-hidden="true" className="built-env">
          <div ref={(el) => void (els.current.backdrop = el)} className="built-backdrop">
            <Image
              src="/images/products-backdrop.jpg"
              alt=""
              fill
              priority={false}
              sizes="(min-width: 1024px) 130vw, 160vw"
              className="built-backdrop-img"
            />
          </div>
          <div className="built-backdrop-scrim" />
          <div ref={(el) => void (els.current.atmos = el)} className="built-atmos" />
        </div>

        <div className="built-inner">
          <header className="built-head-row">
            <div ref={(el) => void (els.current.head = el)} className="built-head">
              <h2 id="products-heading" className="built-title">
                <span>We build ai internally,</span>
                <span className="built-title-accent">put it into real workflows, and use it ourselves.</span>
              </h2>
            </div>
          </header>

          <ul className="built-grid" aria-label="Products">
            {PRODUCTS.map((product, i) => (
              <li
                key={product.id}
                ref={(el) => void (els.current.cards[i] = el)}
                className="built-card"
                data-tone={product.tone}
              >
                <div className="built-card-media">
                  <div ref={(el) => void (els.current.media[i] = el)} className="built-card-plate">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      sizes="(min-width: 1024px) 46vw, 100vw"
                      className="built-card-img"
                    />
                  </div>
                  <div aria-hidden="true" className="built-card-fade" />
                  <span ref={(el) => void (els.current.sheens[i] = el)} aria-hidden="true" className="built-card-sheen" />
                </div>

                <div ref={(el) => void (els.current.bodies[i] = el)} className="built-card-body">
                  <h3 className="built-card-name">{product.short}</h3>
                  {product.name !== product.short && <p className="built-card-full">{product.name}</p>}
                  <p className="built-card-tagline">{renderTagline(product.tagline)}</p>
                  <p className="built-card-text">{product.text}</p>

                  <ul className="built-features" aria-label={`${product.short} capabilities`}>
                    {product.features.map((f) => (
                      <li key={f} className="built-feature">
                        <span aria-hidden="true" className="built-feature-mark" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* No product page exists yet, so this is text, not a link. */}
                  <p className="built-cta">
                    <span>{product.cta}</span>
                    <span aria-hidden="true">→</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
