"use client";

import { useCallback, useState } from "react";
import Header from "@/components/layout/Header";
import EyeBlinkPreloader from "@/components/cinematic/EyeBlinkPreloader";
import CinematicOpening from "@/components/cinematic/CinematicOpening";
import SectionRail from "@/components/layout/SectionRail";
import BeliefQuestions from "@/components/sections/BeliefQuestions";
import OurJourney from "@/components/sections/OurJourney";
import PrismApproach from "@/components/sections/PrismApproach";
import Capabilities from "@/components/sections/Capabilities";
import CaseStudies from "@/components/sections/CaseStudies";
import BuiltProducts from "@/components/sections/BuiltProducts";
import UseCases from "@/components/sections/UseCases";
import ClientProof from "@/components/sections/ClientProof";
import HowWeThink from "@/components/sections/HowWeThink";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <main className="relative min-h-screen bg-[var(--void-black)] text-[var(--text-primary)] selection:bg-[#8B2DFF]/30">
      {/* Page-load eye reveal & blink (time-based, runs once) */}
      <EyeBlinkPreloader onComplete={handleIntroComplete} />

      <Header revealed={introComplete} />
      <SectionRail />

      {/* Frames 01 → 04 → 04.5 → 05: one continuous scene on one scroll timeline; Frame 05 is its resting state */}
      <section id="hero" aria-label="Cinematic opening: from the eye, through the Gate of PAI, to The Belief">
        <CinematicOpening introComplete={introComplete} />
      </section>

      {/* Frame 05 questions in normal flow on screens without room for the node network */}
      <BeliefQuestions />

      {/* Phase 2A content frames: normal scroll sections */}
      <OurJourney />
      <PrismApproach />
      <Capabilities />

      {/* Phase 2B content frames */}
      <CaseStudies />
      <BuiltProducts />
      <UseCases />
      <ClientProof />

      {/* Phase 3 content frames */}
      <HowWeThink />
    </main>
  );
}
