"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 10 — What We've Built. Cinematic scroll scene.
 *
 * Composition follows the approved Stitch screen: an editorial header over an
 * atmospheric backdrop, then the two product showcases. Every word is the approved
 * .docx content — the Stitch screen's own product descriptions and capability badges
 * were written for the mockup, so the document's names, taglines, copy and feature
 * lists are used instead.
 *
 * The camera is a pure function of scroll progress written straight to the DOM.
 * Reveals are cumulative: once a showcase has arrived it stays for the rest of the scene.
 */

const PRODUCTS = [
  {
    id: "rex",
    name: "RAPYD Exchange (ReX)",
    short: "ReX",
    tagline: "Intelligence for effortless recruitment",
    text: "An end-to-end intelligent hiring suite that accelerates decisions and surfaces the right people, faster than ever.",
    features: [
      "JD Generation",
      "Candidate Scoring & Benchmarking",
      "AI-powered Assessment Creation",
      "AI-suggested Interview Questions",
      "Individual & Comparative Candidate Reports",
      "Customizable Interview Workflows",
      "Dashboard for JD & Candidate Pipeline",
    ],
    cta: "Explore ReX",
    image: "/images/rex-product-approved.png",
    alt: "Dark-mode recruitment intelligence interface with candidate matching visuals",
    tone: "cyan",
  },
  {
    id: "minuta",
    name: "BITOVN Minuta",
    short: "Minuta",
    tagline: "Intelligence for effortless discussions",
    text: "Meeting Insights Engine that tracks decisions and actionables and drafts ready-to-send MoM.",
    features: [
      "Ready-to-send draft MoM",
      "Live Captions and Auto-transcription",
      "Google Calendar Integration",
      "Minuta Mobile Application",
      "Key Decisions, Topics and Action Items tagged",
      "Speaker Tagging",
      "Multilingual Transcription and Translation",
      "AskPai Chatbot Integration",
    ],
    cta: "Explore Minuta",
    image: "/images/minuta-product-approved.png",
    alt: "Dark-mode meeting intelligence interface with waveform and transcript panels",
    tone: "violet",
  },
] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function smoothstep(edge0: number, edge1: number, v: number) {
  const t = clamp01((v - edge0) / (edge1 - edge0 || 1));
  return t * t * (3 - 2 * t);
}

interface Place {
  x?: number;
  y?: number;
  s?: number;
  o: number;
  blur?: number;
}

/** Writes a placement onto an element, skipping properties that have not changed. */
function write(el: HTMLElement | null, p: Place) {
  if (!el) return;
  const visible = p.o > 0.002;
  const visibility = visible ? "visible" : "hidden";
  if (el.style.visibility !== visibility) el.style.visibility = visibility;
  if (!visible) return;
  const o = p.o >= 0.999 ? "1" : p.o.toFixed(3);
  if (el.style.opacity !== o) el.style.opacity = o;
  const t = `translate3d(${(p.x ?? 0).toFixed(2)}px, ${(p.y ?? 0).toFixed(2)}px, 0) scale(${(p.s ?? 1).toFixed(4)})`;
  if (el.style.transform !== t) el.style.transform = t;
  const blur = p.blur ?? 0;
  const f = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
  if (el.style.filter !== f) el.style.filter = f;
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
    intro: HTMLElement | null;
    cards: (HTMLElement | null)[];
    media: (HTMLElement | null)[];
    bodies: (HTMLElement | null)[];
  }>({ backdrop: null, atmos: null, head: null, intro: null, cards: [], media: [], bodies: [] });

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
          [e.backdrop, e.atmos, e.head, e.intro, ...e.cards, ...e.media, ...e.bodies].forEach(clear);
          return;
        }

        section.dataset.motion = "on";

        const frame = (p: number) => {
          // The backdrop pushes slowly the whole way, so the scene never sits still.
          write(e.backdrop, { y: (p - 0.5) * -80, s: lerp(1.06, 1.2, p), o: 1 });
          write(e.atmos, { x: (p - 0.5) * 64, s: lerp(1, 1.14, p), o: lerp(0.55, 1, p) });

          // Header arrives first and holds for the whole scene.
          const headIn = smoothstep(0, 0.1, p);
          write(e.head, { y: lerp(48, 0, headIn) - p * 22, o: headIn, blur: lerp(8, 0, headIn) });
          const introIn = smoothstep(0.06, 0.18, p);
          write(e.intro, { y: lerp(38, 0, introIn) - p * 16, o: introIn, blur: lerp(6, 0, introIn) });

          // Each showcase arrives in turn and REMAINS. The second landing never takes
          // the first away — the pair accumulates.
          PRODUCTS.forEach((_, i) => {
            const start = 0.2 + i * 0.24;
            const arrived = smoothstep(start, start + 0.26, p);
            write(e.cards[i], {
              x: lerp(i === 0 ? -64 : 64, 0, arrived),
              y: lerp(64, 0, arrived),
              s: lerp(0.94, 1, arrived),
              o: arrived,
              blur: lerp(9, 0, arrived),
            });
            // The product render settles inside its frame a beat after the card lands.
            write(e.media[i], { y: lerp(26, 0, arrived) + (p - 0.5) * -18, s: lerp(1.12, 1.04, arrived), o: 1 });
            // Then the written detail fills in under it.
            const bodyIn = smoothstep(start + 0.16, start + 0.4, p);
            write(e.bodies[i], { y: lerp(26, 0, bodyIn), o: bodyIn, blur: lerp(5, 0, bodyIn) });
          });
        };

        frame(0);
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => frame(self.progress),
          onRefresh: (self) => frame(self.progress),
        });

        return () => trigger.kill();
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
              <p className="built-eyebrow">
                <span aria-hidden="true" className="built-dot" />
                10 — What We&rsquo;ve Built
              </p>
              <h2 id="products-heading" className="built-title">
                <span>We build with AI.</span>
                <span className="built-title-accent">We build AI too.</span>
              </h2>
            </div>

            <p ref={(el) => void (els.current.intro = el)} className="built-intro">
              Our products are another expression of how we work — applying intelligence to real workflows, real users
              and real enterprise problems.
            </p>
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
                </div>

                <div ref={(el) => void (els.current.bodies[i] = el)} className="built-card-body">
                  <h3 className="built-card-name">{product.short}</h3>
                  <p className="built-card-full">{product.name}</p>
                  <p className="built-card-tagline">{product.tagline}</p>
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
