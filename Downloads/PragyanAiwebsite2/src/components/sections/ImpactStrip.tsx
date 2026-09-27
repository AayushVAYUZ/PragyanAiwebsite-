"use client";

import { useRef } from "react";
import { IMPACT } from "@/content/story";
import { useReveal } from "@/lib/storyMotion";
import { keepAiLowercase } from "@/lib/brandText";
import { StoryEyebrow, StoryHeading } from "./StoryParts";

/**
 * Impact: what has changed in real work? The outcomes already published in the case studies
 * and use cases, restated as large editorial proof statements and revealed one by one. Each
 * carries where it comes from, so the strip never stands apart from its evidence.
 */
export default function ImpactStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);
  const [lead, ...rest] = IMPACT.outcomes;

  return (
    <section
      id="impact"
      ref={sectionRef}
      aria-labelledby="impact-heading"
      className="relative px-[var(--gutter-x)] py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div data-reveal>
          <StoryEyebrow>{IMPACT.label}</StoryEyebrow>
          <StoryHeading id="impact-heading">
            Built for <span className="service-accent font-normal">outcomes.</span>
          </StoryHeading>
        </div>

        <ul aria-label="Outcomes" className="impact-grid mt-10 grid grid-cols-2 lg:grid-cols-3">
          <li data-reveal className="impact-item col-span-2 lg:col-span-3">
            <p className="story-figure impact-lead">{lead.value}</p>
            <ImpactCaption label={lead.label} source={lead.source} />
          </li>
          {rest.map((item) => (
            <li key={item.label} data-reveal className="impact-item">
              <p className="story-figure">{item.value}</p>
              <ImpactCaption label={item.label} source={item.source} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ImpactCaption({ label, source }: { label: string; source: string }) {
  return (
    <>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--text-soft)] sm:text-base">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] text-[var(--text-muted)] uppercase">
        {keepAiLowercase(source)}
      </p>
    </>
  );
}
