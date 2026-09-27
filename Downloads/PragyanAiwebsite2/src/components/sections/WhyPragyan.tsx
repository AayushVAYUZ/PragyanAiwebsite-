"use client";

import { useCallback, useRef, useState } from "react";
import { WHY_PRAGYAN } from "@/content/story";
import { useReveal, useScrollIndex } from "@/lib/storyMotion";
import { navigateToHash } from "@/lib/navigation";
import { StoryEyebrow, StoryHeading } from "./StoryParts";

/**
 * Why Pragyan: what makes the approach different? Four principles as large editorial blocks,
 * lit one at a time with the Services card glow as the reader scrolls through them.
 */
export default function WhyPragyan() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);
  useReveal(sectionRef);
  useScrollIndex(gridRef, WHY_PRAGYAN.pillars.length, useCallback((index: number) => setActive(index), []));

  return (
    <section
      id="why-pragyan"
      ref={sectionRef}
      aria-labelledby="why-pragyan-heading"
      className="relative px-[var(--gutter-x)] py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div data-reveal className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-5">
            <StoryEyebrow>{WHY_PRAGYAN.label}</StoryEyebrow>
            <StoryHeading id="why-pragyan-heading">
              Why Pragyan <span className="service-accent font-normal">ai</span>
            </StoryHeading>
          </div>
          <p className="max-w-2xl text-base leading-relaxed font-light text-[var(--text-soft)] sm:text-lg lg:col-span-7">
            {WHY_PRAGYAN.lead}
          </p>
        </div>

        <ol ref={gridRef} aria-label="What makes Pragyan ai different" className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
          {WHY_PRAGYAN.pillars.map((pillar, index) => (
            <li
              key={pillar.number}
              data-reveal
              className={`service-card relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6 sm:p-8${index === active ? " is-active" : ""}`}
            >
              <span aria-hidden="true" className="service-sweep pointer-events-none absolute inset-0" />
              <span className="service-number relative font-[family-name:var(--font-mono)] text-sm tracking-wider text-cyan-300/70">
                {pillar.number}
              </span>
              <h3 className="service-title relative text-xl leading-snug font-normal tracking-tight text-[var(--text-primary)] sm:text-2xl">
                {pillar.title}
              </h3>
              {pillar.equation && (
                <p className="why-equation relative text-sm font-medium sm:text-base">{pillar.equation}</p>
              )}
              <p className="relative max-w-lg text-sm leading-relaxed font-light text-[var(--text-secondary)] sm:text-base">
                {pillar.text}
              </p>
              {pillar.link && <PillarLink label={pillar.link.label} href={pillar.link.href} />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PillarLink({ label, href }: { label: string; href: `#${string}` }) {
  return (
    <a href={href} onClick={(event) => navigateToHash(event, href)} className="service-link relative self-start">
      {label} <span aria-hidden="true">→</span>
    </a>
  );
}
