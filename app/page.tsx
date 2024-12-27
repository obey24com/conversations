"use client";

import { TranslationWindow } from "@/components/translation-window";
import { 
  Benefits,
  HowItWorks, 
  Comparison,
  Navigation,
  BackToTop,
  SeoContent,
  NewsTeaser
} from "@/components/sections";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Translation Interface */}
      <section className="relative min-h-[calc(100dvh-65px)] flex items-center border-none">
        <div className="absolute inset-0 animated-dots" />
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
          <SeoContent />
          <NewsTeaser />
        </div>
      </div>

      <BackToTop />
    </main>
  );
}
