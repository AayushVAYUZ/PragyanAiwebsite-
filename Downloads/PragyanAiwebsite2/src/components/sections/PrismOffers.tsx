"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { PRISM_OFFERS } from "@/content/story";
import { requestContact } from "@/lib/contact";
import { useReveal, useScrollIndex } from "@/lib/storyMotion";
import { StoryEyebrow, StoryHeading, StoryPill } from "./StoryParts";

/**
 * PRISM packaged offers: what happens when we start? Follows the PRISM section and turns its
 * five phases into engagement offers (not products: no prices, durations or terms). The phase
 * list is a tablist; scrolling lights the phases in order until the reader picks one.
 */
export default function PrismOffers() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [selected, setSelected] = useState(0);
  const [chosen, setChosen] = useState(false);
  const count = PRISM_OFFERS.offers.length;

  useReveal(sectionRef);
  useScrollIndex(
    listRef,
    count,
    // -1 ("nothing reached yet", or the link being switched off after a pick) keeps the current phase.
    useCallback((index: number) => {
      if (index >= 0) setSelected(index);
    }, []),
    !chosen,
  );

  const choose = (index: number, focus = false) => {
    setChosen(true);
    setSelected(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (event.key in keys) {
      event.preventDefault();
      choose((selected + keys[event.key] + count) % count, true);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      choose(event.key === "Home" ? 0 : count - 1, true);
    }
  };

  return (
    <section
      id="prism-offers"
      ref={sectionRef}
      aria-labelledby="prism-offers-heading"
      className="relative px-[var(--gutter-x)] py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div data-reveal className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-5">
            <StoryEyebrow>{PRISM_OFFERS.label}</StoryEyebrow>
            <StoryHeading id="prism-offers-heading">
              From methodology <span className="service-accent font-normal">to action.</span>
            </StoryHeading>
          </div>
          <p className="max-w-2xl text-base leading-relaxed font-light text-[var(--text-soft)] sm:text-lg lg:col-span-7">
            {PRISM_OFFERS.lead}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8">
          <div
            ref={listRef}
            data-reveal
            role="tablist"
            aria-label="PRISM phases"
            aria-orientation="vertical"
            className="flex flex-col gap-2 lg:col-span-5"
          >
            {PRISM_OFFERS.offers.map((item, index) => {
              const isSelected = index === selected;
              return (
                <button
                  key={item.number}
                  ref={(el) => void (tabRefs.current[index] = el)}
                  id={`prism-offer-tab-${item.number}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`prism-offer-panel-${item.number}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => choose(index)}
                  onKeyDown={onKeyDown}
                  className={`service-card prism-offer-tab relative flex items-center gap-4 overflow-hidden rounded-xl px-5 py-4 text-left${
                    isSelected ? " is-active" : ""
                  }`}
                >
                  <span className="service-number font-[family-name:var(--font-mono)] text-xs tracking-wider text-cyan-300/70">
                    {item.number}
                  </span>
                  <span className="flex flex-col items-start text-left">
                    <span className="text-xs font-semibold tracking-[0.2em] text-[var(--text-primary)] uppercase">{item.phase}</span>
                    <span className="service-title mt-0.5 text-sm text-[var(--text-soft)]">{item.offer}</span>
                  </span>
                  <span aria-hidden="true" className="prism-offer-arrow ml-auto text-[var(--neon-cyan)]">
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Every offer is laid out in the same grid cell, so the panel always takes the height of
              the longest one: switching phase never moves the sections below it. */}
          <div data-reveal className="prism-offer-panel grid rounded-2xl p-6 sm:p-8 lg:col-span-7">
            {PRISM_OFFERS.offers.map((offer, index) => {
              const isSelected = index === selected;
              return (
                <div
                  key={offer.number}
                  id={`prism-offer-panel-${offer.number}`}
                  role="tabpanel"
                  aria-labelledby={`prism-offer-tab-${offer.number}`}
                  aria-hidden={!isSelected}
                  inert={!isSelected}
                  className={`prism-offer-swap col-start-1 row-start-1 flex flex-col${isSelected ? " is-selected" : ""}`}
                >
                  <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.24em] text-[var(--neon-cyan)]/70 uppercase">
                    {offer.number} · {offer.phase}
                  </p>
                  <h3 className="mt-2 text-2xl leading-snug font-light tracking-tight text-[var(--text-primary)] sm:text-3xl">
                    {offer.offer}
                  </h3>

                  <p className="service-label mt-6">Outcome</p>
                  <p className="mt-1 max-w-xl text-base leading-relaxed font-light text-[var(--text-soft)]">{offer.outcome}</p>

                  <p className="service-label mt-6">Key deliverables</p>
                  <ul className="proof-chips" aria-label={`${offer.offer} deliverables`}>
                    {offer.deliverables.map((item) => (
                      <li key={item} className="proof-chip prism-offer-chip">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <StoryPill
                      href="#contact"
                      onClick={(event) =>
                        requestContact(event, undefined, `PRISM ${offer.number} ${offer.phase}: ${offer.offer}`)
                      }
                      label={`${PRISM_OFFERS.cta}: talk to us about ${offer.phase}, ${offer.offer}`}
                    >
                      {PRISM_OFFERS.cta}
                    </StoryPill>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
