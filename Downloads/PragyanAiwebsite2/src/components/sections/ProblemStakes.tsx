"use client";

import { useRef } from "react";
import { PROBLEM } from "@/content/story";
import { useReveal } from "@/lib/storyMotion";
import { StoryHeading } from "./StoryParts";

/**
 * Problem / Stakes: why does this matter? The enterprise ai gap on the left, the market
 * evidence as three large editorial figures on the right, each with its source, then one line
 * that turns the stakes into the reason for a deliberate approach.
 */
export default function ProblemStakes() {
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  return (
    <section
      id="stakes"
      ref={sectionRef}
      aria-labelledby="stakes-heading"
      className="relative px-[var(--gutter-x)] py-20 lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col lg:col-span-6 lg:pr-6">
          <div data-reveal>
            <StoryHeading id="stakes-heading">
              <span className="block">{PROBLEM.heading[0]}</span>
              <span className="service-accent block font-normal">{PROBLEM.heading[1]}</span>
            </StoryHeading>
          </div>
          <p data-reveal className="mt-6 max-w-xl text-base leading-relaxed font-light text-[var(--text-soft)] sm:text-lg">
            {PROBLEM.lead}
          </p>
          <ul data-reveal className="stakes-frictions mt-7 flex max-w-xl flex-col gap-2 pl-5 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {PROBLEM.frictions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <ul aria-label="Market evidence" className="flex flex-col lg:col-span-6">
          {PROBLEM.evidence.map((item) => (
            <li
              key={item.value}
              data-reveal
              className="stakes-evidence grid grid-cols-1 gap-x-8 gap-y-2 py-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center"
            >
              <p className="story-figure">
                {item.value}
                {"unit" in item && item.unit && <span className="story-figure-unit">{item.unit}</span>}
              </p>
              <div>
                <p className="text-sm leading-relaxed font-light text-[var(--text-soft)] sm:text-base">{item.detail}</p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  Source:{" "}
                  <a href={item.source.url} target="_blank" rel="noopener noreferrer" className="stakes-source">
                    {item.source.publisher}, {item.source.year}
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p data-reveal className="mx-auto mt-12 w-full max-w-7xl text-lg leading-snug font-light text-[var(--text-primary)] sm:text-xl lg:mt-14">
        <span className="stakes-closing-rule mr-4 inline-block h-px w-10 align-middle" aria-hidden="true" />
        {PROBLEM.closing[0]} <span className="text-[var(--text-secondary)]">{PROBLEM.closing[1]}</span>
      </p>
    </section>
  );
}
