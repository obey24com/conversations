"use client";

import { TranslationInterface } from "@/components/translation-interface";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100dvh-65px)] flex-col pb-[116px] animated-dots bg-white/50">
      <TranslationInterface />
    </main>
  );
}
