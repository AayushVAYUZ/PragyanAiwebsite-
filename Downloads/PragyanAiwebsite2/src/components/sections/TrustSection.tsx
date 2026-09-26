"use client";

import { useRef } from "react";
import Image from "next/image";
import { TRUST } from "@/content/story";
import { useReveal } from "@/lib/storyMotion";
import { StoryEyebrow, StoryHeading } from "./StoryParts";

/**
 * Client proof / trust: who and what supports the claim? Operating-scale figures today. The
 * client quote and the leadership voices render only once they are approved (see
 * `@/content/story`), so the structure is in place without inventing anything. No logos:
 * none are approved.
 */
export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  return (
    <section
      id="client-proof"
      ref={sectionRef}
      aria-labelledby="client-proof-heading"
      className="relative px-[var(--gutter-x)] py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div data-reveal>
          <StoryEyebrow>{TRUST.label}</StoryEyebrow>
          <StoryHeading id="client-proof-heading">
            Real work. Real systems. <span className="service-accent font-normal">Real outcomes.</span>
          </StoryHeading>
        </div>

        <ul aria-label="Operating scale" className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--border-subtle)] lg:grid-cols-4">
          {TRUST.scale.map((item) => (
            <li key={item.label} data-reveal className="trust-cell flex flex-col gap-2 p-6 sm:p-8">
              <p className="story-figure trust-figure">{item.value}</p>
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.24em] text-[var(--text-secondary)] uppercase">
                {item.label}
              </p>
            </li>
          ))}
        </ul>

        {TRUST.quote && (
          <figure data-reveal className="mt-12 max-w-3xl">
            <blockquote className="text-xl leading-relaxed font-light text-[var(--text-primary)] sm:text-2xl">
              &ldquo;{TRUST.quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-sm text-[var(--text-secondary)]">
              <span className="text-[var(--text-primary)]">{TRUST.quote.name}</span>
              <span className="block">
                {TRUST.quote.role}, {TRUST.quote.organisation}
              </span>
            </figcaption>
          </figure>
        )}

        {TRUST.leadership.length > 0 && (
          <ul aria-label="Leadership" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST.leadership.map((person) => (
              <li key={person.name} data-reveal className="service-card flex items-center gap-4 rounded-xl p-5">
                {person.image && (
                  <Image src={person.image} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                )}
                <span className="flex flex-col">
                  <span className="text-base text-[var(--text-primary)]">{person.name}</span>
                  <span className="text-sm text-[var(--text-secondary)]">{person.role}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
