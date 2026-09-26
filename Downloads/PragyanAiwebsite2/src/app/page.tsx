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
import EngagementModels from "@/components/sections/EngagementModels";
import PrismApproach from "@/components/sections/PrismApproach";
import PrismOffers from "@/components/sections/PrismOffers";
import Capabilities from "@/components/sections/Capabilities";
import AiDroplets from "@/components/sections/AiDroplets";
import SovereignAI from "@/components/sections/SovereignAI";
import CaseStudies from "@/components/sections/CaseStudies";
import ImpactStrip from "@/components/sections/ImpactStrip";
import BuiltProducts from "@/components/sections/BuiltProducts";
import UseCases from "@/components/sections/UseCases";
import TrustSection from "@/components/sections/TrustSection";
import HowWeThink from "@/components/sections/HowWeThink";
import ReadyToExplore from "@/components/sections/ReadyToExplore";
import ContactSection from "@/components/sections/ContactSection";
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
      <section id="hero" aria-label="Cinematic opening: from the eye, through the Gate of PAI, to The Belief">
        <CinematicOpening introComplete={introComplete} gateReady={gateReady} />
      </section>

      {/* Frame 05 questions in normal flow on screens without room for the node network */}
      <BeliefQuestions />

      {/* Phase 2A content frames: normal scroll sections */}
      <OurJourney />

      {/* Business context: why enterprise ai is hard, then why Pragyan ai */}
      <ProblemStakes />
      <WhyPragyan />

      {/* How to engage, then the method and the offers it packages */}
      <EngagementModels />
      <PrismApproach />
      <PrismOffers />

      <Capabilities />

      {/* ai Droplets — making what the client already runs intelligent */}
      <AiDroplets />

      {/* Frame 09 — Sovereign AI: the enclave blueprint assembles as you scroll */}
      <SovereignAI />

      {/* Phase 2B content frames */}
      <CaseStudies />
      <ImpactStrip />
      <BuiltProducts />
      <UseCases />

      {/* Client proof / trust */}
      <TrustSection />

      {/* Phase 3 content frames */}
      <HowWeThink />
      <ReadyToExplore />
      <ContactSection />
      <Footer />
    </main>
  );
}
