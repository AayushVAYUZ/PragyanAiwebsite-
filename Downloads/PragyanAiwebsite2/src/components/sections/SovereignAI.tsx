"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SOVEREIGN, SOVEREIGN_GLOW } from "@/content/sovereign";
import { requestContact } from "@/lib/contact";
import { keepAiLowercase } from "@/lib/brandText";
import { StoryPill } from "./StoryParts";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 09 — Sovereign ai.
 *
 * On large screens the section pins below the header and scroll steps through the five
 * layers, 01 → 05: one layer open at a time, the rail filling behind it, the gate's glow
 * brightening per step. The gate itself is a fixed supporting visual on the right; it never
 * moves or scales. Below lg, on short screens and under reduced motion, the section is an
 * ordinary stacked document with every layer open.
 *
 * The id sits on the outer section and the pin (with its spacer) inside it, so `#sovereign-ai`
 * always lands at the start of the sequence and everything below keeps its real offset.
 */

const LAYERS = SOVEREIGN.layers;
const STEPS = LAYERS.length - 1;
/** Scroll given to each layer while pinned, as a fraction of the viewport height. */
const STEP_VH = 0.6;

export default function SovereignAI() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [stepping, setStepping] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)",
      () => {
        section.dataset.motion = "on";
        setStepping(true);

        let current = -1;
        const show = (index: number) => {
          if (index === current) return;
          current = index;
          setActive(index);
          gsap.to(glowRef.current, { opacity: SOVEREIGN_GLOW[index], duration: 0.8, ease: "power2.out", overwrite: true });
        };
        gsap.set(glowRef.current, { opacity: SOVEREIGN_GLOW[0] });
        show(0);

        triggerRef.current = ScrollTrigger.create({
          trigger: pin,
          pin: true,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * STEP_VH * LAYERS.length)}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / STEPS, inertia: false, duration: { min: 0.25, max: 0.6 }, delay: 0.08, ease: "power2.inOut" },
          onUpdate: (self) => show(Math.round(self.progress * STEPS)),
        });

        // Fonts and late images above can move the section after the first measure.
        const refresh = () => ScrollTrigger.refresh();
        document.fonts?.ready.then(refresh);
        window.addEventListener("load", refresh);

        return () => {
          window.removeEventListener("load", refresh);
          triggerRef.current = null;
          section.dataset.motion = "off";
          setStepping(false);
        };
      },
      section,
    );

    return () => media.revert();
  }, []);

  /** A click on a layer title scrolls to that layer's step. */
  const goTo = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const top = trigger.start + ((trigger.end - trigger.start) * index) / STEPS;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const [line1, line2, line3] = SOVEREIGN.heading;

  return (
    <section id="sovereign-ai" ref={sectionRef} aria-labelledby="sovereign-heading" data-motion="off" className="sov-scene">
      <div ref={pinRef} className="sov-pin">
        <div aria-hidden="true" className="sov-env">
          <div className="sov-grid" />
          <div className="sov-atmos" />
        </div>

        <div className="sov-inner">
          <div className="sov-head">
            <h2 id="sovereign-heading" className="sov-title">
              <span>{line1}</span>
              <span>{line2}</span>
              <span className="sov-title-accent">{keepAiLowercase(line3)}</span>
            </h2>
            <h3 className="sov-sub">{keepAiLowercase(SOVEREIGN.subheading)}</h3>
            <p className="sov-body">{SOVEREIGN.body}</p>
            <p className="sov-tagline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden="true">
                <path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" />
              </svg>
              {SOVEREIGN.tagline}
            </p>
          </div>

          {/* The gate: fixed in place; only its glow answers the scroll. */}
          <div className="sov-stage">
            <span ref={glowRef} aria-hidden="true" className="sov-glow">
              <span className="sov-glow-core" />
            </span>
            <Image
              src="/images/sovereign-portal.png"
              alt="The Pragyan enclave gateway"
              width={1117}
              height={1408}
              quality={90}
              sizes="(min-width: 1024px) 34vw, 60vw"
              className="sov-portal-img"
              onLoad={() => ScrollTrigger.refresh()}
            />
          </div>

          <ol className="sov-layers" aria-label="Sovereign ai layers">
            {LAYERS.map((layer, index) => {
              const isActive = !stepping || index === active;
              const isLit = !stepping || index <= active;
              return (
                <li
                  key={layer.number}
                  className={`sov-layer${isActive ? " is-active" : ""}${isLit ? " is-lit" : ""}`}
                  aria-current={stepping && index === active ? "step" : undefined}
                >
                  <span aria-hidden="true" className="sov-layer-node" />
                  <div className="sov-layer-head">
                    <span className="sov-layer-num">{layer.number}</span>
                    <h3 className="sov-layer-title">
                      {stepping ? (
                        <button type="button" onClick={() => goTo(index)} className="sov-layer-button">
                          {layer.title}
                        </button>
                      ) : (
                        layer.title
                      )}
                    </h3>
                    {layer.tag && <span className="sov-layer-tag">{layer.tag}</span>}
                  </div>
                  <div className="sov-layer-body">
                    <div>
                      <p>{layer.text}</p>
                      {layer.note && (
                        <p className="sov-layer-note">
                          <span>{layer.note.label}</span> {layer.note.text}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="sov-after">
        <div className="sov-after-inner">
          <StoryPill href="#contact" onClick={(event) => requestContact(event)}>
            {SOVEREIGN.cta}
          </StoryPill>
        </div>
      </div>
    </section>
  );
}
