"use client";

import { useRef, type MouseEvent } from "react";
import { PERSONAS, type Persona } from "@/content/personas";
import { navigateToHash } from "@/lib/navigation";
import { keepAiLowercase } from "@/lib/brandText";
import { useReveal } from "@/lib/storyMotion";
import { StoryEyebrow, StoryHeading } from "./StoryParts";

/**
 * Persona routing: where do you sit in the business? Four compact paths, each a single link to
 * the existing section closest to that role's questions. Navigation only: no content is
 * repeated here and no outcome is promised.
 */
export default function PersonaRouting() {
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  const go = (event: MouseEvent<HTMLAnchorElement>, persona: Persona) => navigateToHash(event, persona.href);

  return (
    <section
      id="personas"
      ref={sectionRef}
      aria-labelledby="personas-heading"
      className="relative px-[var(--gutter-x)] py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div data-reveal className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <StoryEyebrow>Find your path</StoryEyebrow>
            <StoryHeading id="personas-heading">
              Where do you sit <span className="service-accent font-normal">in the business?</span>
            </StoryHeading>
          </div>
          <p className="text-base leading-relaxed font-light text-[var(--text-soft)] sm:text-lg lg:col-span-5">{PERSONAS.lead}</p>
        </div>

        <ul aria-label="Paths by role" className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {PERSONAS.paths.map((persona) => (
            <li key={persona.number} data-reveal className="flex">
              <a
                href={persona.href}
                onClick={(event) => go(event, persona)}
                aria-label={`${persona.name} (${persona.roles}): go to ${persona.destination}`}
                className="service-card persona-card group relative flex w-full flex-col gap-3 overflow-hidden rounded-xl p-5 sm:p-6"
              >
                <span className="service-number font-[family-name:var(--font-mono)] text-xs tracking-wider text-cyan-300/70">
                  {persona.number}
                </span>
                <span className="text-sm font-medium tracking-[0.16em] text-[var(--text-primary)] uppercase">
                  {keepAiLowercase(persona.name)}
                </span>
                <span className="text-sm leading-relaxed font-light text-[var(--text-secondary)]">{persona.roles}</span>
                <span aria-hidden="true" className="persona-arrow mt-auto pt-2 text-[var(--neon-cyan)]">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
