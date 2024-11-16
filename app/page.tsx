"use client";

import { TranslationInterface } from "@/components/translation-interface";

export default function Home() {
  return (
    <main
      className="flex min-h-[calc(100vh-65px)] flex-col pb-[116px]"
      style={{
        background: "linear-gradient(to top, #efefef, #ffffff)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <TranslationInterface />
    </main>
  );
}
