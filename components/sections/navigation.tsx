"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav 
      className="sticky top-[64px] z-40 border-b"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        WebkitBackdropFilter: 'saturate(180%) blur(10px)',
        backdropFilter: 'saturate(180%) blur(10px)',
      }}
    >
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="flex h-12 overflow-x-auto">
          {[
            { id: "benefits", label: "Why Conversational?" },
            { id: "how-it-works", label: "How It Works" },
            { id: "comparison", label: "Comparison" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={cn(
                "flex-shrink-0 border-b-2 px-4 text-sm font-medium transition-colors",
                "hover:text-gray-900",
                activeSection === id
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:border-gray-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
