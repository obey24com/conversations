"use client";

import { TranslationWindow } from "@/components/translation-window";
import { Benefits } from "@/components/sections/benefits";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Comparison } from "@/components/sections/comparison";
import { Navigation } from "@/components/sections/navigation";
import { BackToTop } from "@/components/sections/back-to-top";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Translation Interface */}
      <section className="relative min-h-[calc(100dvh-65px)] flex items-center">
        <div className="absolute inset-0 animated-dots opacity-50" />
        <div className="container mx-auto max-w-[1200px] px-6 py-12 w-full">
          <TranslationWindow />
        </div>
      </section>

      {/* Below the fold content */}
      <div className="relative bg-white">
        <Navigation />
        
        <div className="container mx-auto max-w-[1200px] px-6">
          <Benefits />
          <HowItWorks />
          <Comparison />
        </div>
      </div>

      <BackToTop />
    </main>
  );
}
