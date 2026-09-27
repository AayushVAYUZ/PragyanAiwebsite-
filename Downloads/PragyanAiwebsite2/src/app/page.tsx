"use client";

import { useCallback, useState } from "react";
import Header from "@/components/layout/Header";
import CosmicField from "@/components/layout/CosmicField";
import EyeBlinkPreloader, { type IntroPhase } from "@/components/cinematic/EyeBlinkPreloader";
import CinematicOpening from "@/components/cinematic/CinematicOpening";
import BeliefQuestions from "@/components/sections/BeliefQuestions";
import OurJourney from "@/components/sections/OurJourney";
import ProblemStakes from "@/components/sections/ProblemStakes";
import WhyPragyan from "@/components/sections/WhyPragyan";
import PersonaRouting from "@/components/sections/PersonaRouting";
import EngagementModels from "@/components/sections/EngagementModels";
import PrismApproach from "@/components/sections/PrismApproach";
import Capabilities from "@/components/sections/Capabilities";
import AiDroplets from "@/components/sections/AiDroplets";
import SovereignAI from "@/components/sections/SovereignAI";
import CaseStudies from "@/components/sections/CaseStudies";
import ImpactStrip from "@/components/sections/ImpactStrip";
import BuiltProducts from "@/components/sections/BuiltProducts";
import UseCases from "@/components/sections/UseCases";
import TrustSection from "@/components/sections/TrustSection";
import HowWeThink from "@/components/sections/HowWeThink";
import FinalContact from "@/components/sections/FinalContact";
import { StoryPill } from "@/components/sections/StoryParts";
import { requestContact } from "@/lib/contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [introPhase, setIntroPhase] = useState<IntroPhase>("hidden");
  const [gateReady, setGateReady] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);
  const handleGateReady = useCallback(() => setGateReady(true), []);

  return (
    <main className="relative min-h-screen bg-[var(--void-black)] text-[var(--text-primary)] selection:bg-[#8B2DFF]/30">
      {/* One continuous field of space behind every section, so the gaps between them read
          as the same dimension rather than dead black. */}
      <CosmicField />

      {/* Page-load eye reveal, brand identity and header handoff (time-based, runs once) */}
      <EyeBlinkPreloader onPhase={setIntroPhase} onGateReady={handleGateReady} onComplete={handleIntroComplete} />

      <Header phase={introPhase} />

      {/* Frames 01 → 04 → 04.5 → 05: one continuous scene on one scroll timeline; Frame 05 is its resting state */}
      <section id="hero" aria-label="Cinematic opening: from the eye, through the Gate of P.ai, to The Belief">
        <CinematicOpening introComplete={introComplete} gateReady={gateReady} />
      </section>

      {/* Frame 05 questions in normal flow on screens without room for the node network */}
      <BeliefQuestions />

      {/* Business context: the enterprise ai gap, then why Pragyan ai, then find your path */}
      <ProblemStakes />
      <WhyPragyan />
      <PersonaRouting />

      {/* The method, then how to engage with it */}
      <PrismApproach />
      <EngagementModels />

      <Capabilities />

      {/* Signature capabilities: ai Droplets and Sovereign ai */}
      <div id="signature">
        <AiDroplets />
        <SovereignAI />
        <div className="px-[var(--gutter-x)] pb-16">
          <div className="mx-auto w-full max-w-7xl">
            <StoryPill href="#contact" onClick={(event) => requestContact(event)}>
              Talk to us about Droplets or Sovereign ai
            </StoryPill>
          </div>
        </div>
      </div>

      {/* Proof: outcomes first, then the case studies behind them */}
      <section id="case-studies" aria-label="Proof">
        <ImpactStrip />
        <CaseStudies />
        <TrustSection />
      </section>

      <BuiltProducts />
      <UseCases />

      {/* Heritage: the journey behind the new name */}
      <OurJourney />

      <HowWeThink />

      {/* Final CTA + contact, one continuous block */}
      <FinalContact />
      <Footer />
    </main>
  );
}
