"use client";

import { motion } from "framer-motion";
import { MessageSquare, Globe, Zap } from "lucide-react";

const benefits = [
  {
    icon: MessageSquare,
    title: "Natural Conversations",
    description: "Translate as you speak naturally, without rigid formatting or structure requirements."
  },
  {
    icon: Globe,
    title: "Cultural Context",
    description: "Get cultural insights and nuances that make your translations more meaningful and accurate."
  },
  {
    icon: Zap,
    title: "Real-time Translation",
    description: "Experience instant translations with our advanced AI-powered system."
  }
];

export function Benefits() {
  return (
    <section
      id="benefits"
      className="py-24 scroll-mt-16"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Why Conversational Translation?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Break down language barriers while maintaining the natural flow of conversation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
              <benefit.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
