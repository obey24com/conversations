"use client";

import { motion } from "framer-motion";
import { Mic, ArrowRight, MessageSquare, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "Speak or Type",
    description: "Start by speaking into your device or typing your message naturally."
  },
  {
    icon: Sparkles,
    title: "AI Processing",
    description: "Our AI analyzes your input, considering context and cultural nuances."
  },
  {
    icon: MessageSquare,
    title: "Get Translation",
    description: "Receive accurate translations with cultural insights when relevant."
  }
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 scroll-mt-16"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A simple three-step process to get natural, context-aware translations.
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 hidden md:block" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6 relative z-10">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-6 z-20">
                  <ArrowRight className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
