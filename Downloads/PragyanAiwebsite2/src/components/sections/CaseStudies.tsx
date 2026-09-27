"use client";

import { useRef } from "react";
import Image from "next/image";
import { CASE_STUDIES, PROOF_CTA, type CaseStudy } from "@/content/caseStudies";
import { requestContact } from "@/lib/contact";
import { useReveal } from "@/lib/storyMotion";
import { StoryPill } from "./StoryParts";

/**
 * Frame 09 — Proof (Case Studies). Both cases in full, side by side from lg and stacked below
 * it, in the same card language as before: the photograph behind a heavy scrim, the case HUD,
 * the headline metric, the brief and the results. It sits inside the #case-studies proof block,
 * and ends with the block's one contact CTA.
 *
 * Every word and number is the approved content (`@/content/caseStudies`). Each headline metric
 * appears once per card. The rotating stage and the "Case archive" deck are gone: with both
 * cases shown in full there is nothing left to select.
 */
export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  return (
    <section
      id="case-study-details"
      ref={sectionRef}
      aria-labelledby="case-studies-heading"
      data-motion="off"
      className="proof-scene"
    >
      <div className="proof-viewport">
        <div aria-hidden="true" className="proof-env">
          <div className="proof-atmos" />
        </div>

        <div className="proof-inner">
          <header data-reveal className="proof-head">
            <h2 id="case-studies-heading" className="proof-title">
              ai solving <span className="proof-title-accent">real business problems.</span>
            </h2>
          </header>

          <ul className="proof-cases" aria-label="Case studies">
            {CASE_STUDIES.map((study) => (
              <li key={study.id} data-reveal className="flex">
                <CaseCard study={study} />
              </li>
            ))}
          </ul>

          <div data-reveal>
            <StoryPill href="#contact" onClick={(event) => requestContact(event)}>
              {PROOF_CTA}
            </StoryPill>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseCard({ study }: { study: CaseStudy }) {
  return (
    <article id={`case-study-${study.id}`} className="proof-stage w-full" data-tone={study.tone} aria-labelledby={`case-${study.id}-title`}>
      <div aria-hidden="true" className="proof-stage-media">
        <div className="proof-stage-plate">
          {study.image ? (
            <Image src={study.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="proof-stage-img" />
          ) : (
            <div className="proof-stage-img proof-placeholder" data-tone={study.tone} />
          )}
        </div>
        <div className="proof-stage-scrim" />
      </div>

      <div className="proof-stage-hud">
        <p className="proof-hud-id">
          <span aria-hidden="true" className="proof-hud-dot" />
          {study.index}
        </p>
        <p className="proof-hud-sector">{study.sector}</p>
      </div>

      <div className="proof-stage-body proof-case-body">
        <div className="proof-copy">
          <p className="proof-metric-label">{study.metricLabel}</p>
          <p className="proof-metric">{study.metric}</p>
          <h3 id={`case-${study.id}-title`} className="proof-case-title">
            {study.title}
          </h3>
          <p className="proof-case-summary">{study.summary}</p>
          {study.client && <p className="proof-client">{study.client}</p>}
        </div>

        <div className="proof-brief">
          <div className="proof-brief-block">
            <p className="proof-brief-label">The challenge</p>
            <p className="proof-brief-text">{study.challenge}</p>
          </div>
          <div className="proof-brief-block">
            <p className="proof-brief-label">What we built</p>
            <ul className="proof-chips">
              {study.solution.map((item) => (
                <li key={item} className="proof-chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {study.impact.length > 0 && (
          <div>
            <p className="proof-brief-label">Results</p>
            <ul className="proof-stats proof-results" aria-label="Results">
              {study.impact.map((item) => (
                <li key={item.text} className="proof-stat">
                  <span className="proof-stat-value">{item.value}</span>
                  <span className="proof-stat-text">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {study.scale && (
          <div className="proof-scale">
            <p className="proof-brief-label">Scale of delivery</p>
            <ul className="proof-scale-row" aria-label="Scale of delivery">
              {study.scale.items.map((item) => (
                <li key={item.label} className="proof-scale-item">
                  <span className="proof-stat-value">{item.value}</span>
                  <span className="proof-stat-text">{item.label}</span>
                </li>
              ))}
            </ul>
            <p className="proof-brief-text proof-scale-context">{study.scale.context}</p>
          </div>
        )}
      </div>
    </article>
  );
}
