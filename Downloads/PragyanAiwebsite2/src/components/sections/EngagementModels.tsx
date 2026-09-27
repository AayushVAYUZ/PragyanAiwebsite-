"use client";

import { useCallback, useRef, useState } from "react";
import { ENGAGEMENT } from "@/content/story";
import { requestContact } from "@/lib/contact";
import { useReveal, useScrollIndex } from "@/lib/storyMotion";
import { showPrismStage } from "@/lib/prismLink";
import { StoryEyebrow, StoryHeading, StoryPill } from "./StoryParts";

/**
 * Engagement models: how can we work together? Four proposed starting points, each mapped to
 * the PRISM stages it covers; a stage chip opens that stage in the PRISM section above. One
 * section-level CTA leads to the contact form.
 */
export default function EngagementModels() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);
  useReveal(sectionRef);
  useScrollIndex(gridRef, ENGAGEMENT.models.length, useCallback((index: number) => setActive(index), []));

  return (
    <section
      id="engagement"
      ref={sectionRef}
      aria-labelledby="engage-heading"
      className="relative px-[var(--gutter-x)] py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div data-reveal className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-5">
            <StoryEyebrow>{ENGAGEMENT.label}</StoryEyebrow>
            <StoryHeading id="engage-heading">
              Start where the business <span className="service-accent font-normal">needs it.</span>
            </StoryHeading>
          </div>
          <p className="max-w-2xl text-base leading-relaxed font-light text-[var(--text-soft)] sm:text-lg lg:col-span-7">
            {ENGAGEMENT.lead}
          </p>
        </div>

        <ol ref={gridRef} aria-label="Engagement models" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENGAGEMENT.models.map((model, index) => (
            <li
              key={model.number}
              data-reveal
              className={`service-card relative flex flex-col overflow-hidden rounded-2xl p-6${index === active ? " is-active" : ""}`}
            >
              <span aria-hidden="true" className="service-sweep pointer-events-none absolute inset-0" />
              <div className="relative flex items-baseline gap-3">
                <span className="service-number font-[family-name:var(--font-mono)] text-xs tracking-wider text-cyan-300/70">
                  {model.number}
                </span>
                <h3 className="service-title text-lg font-medium tracking-[0.2em] text-[var(--text-primary)] uppercase">{model.name}</h3>
              </div>
              <p className="relative mt-3 text-[15px] leading-relaxed font-light text-[var(--text-soft)]">
                {model.summary}
              </p>

              <p className="service-label relative mt-5">Includes</p>
              <ul className="relative mt-1 flex flex-col gap-1.5 text-sm font-light text-[var(--text-secondary)]">
                {model.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-[var(--neon-cyan)]/60" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="service-label relative mt-5">Best for</p>
              <p className="relative mt-1 text-sm leading-relaxed text-[var(--text-soft)]">{model.bestFor}</p>

              <p className="service-label relative mt-5">PRISM stages</p>
              <ul className="relative mt-2 flex flex-wrap gap-2" aria-label={`PRISM stages for ${model.name}`}>
                {model.stages.map((stage) => (
                  <li key={stage.label}>
                    <a
                      href="#prism"
                      onClick={(event) => showPrismStage(event, stage.index)}
                      className="prism-engagement-chip engagement-stage-chip inline-block"
                    >
                      {stage.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div data-reveal className="mt-10">
          <StoryPill
            href="#contact"
            onClick={(event) => requestContact(event, ENGAGEMENT.cta.interest)}
          >
            {ENGAGEMENT.cta.label}
          </StoryPill>
        </div>
      </div>
    </section>
  );
}
