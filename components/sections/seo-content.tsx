"use client";

import { motion } from "framer-motion";
import { Globe2, Languages, Brain, Users } from "lucide-react";

export function SeoContent() {
  return (
    <section id="about" className="py-24 scroll-mt-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-none"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Breaking Language Barriers with AI</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Globe2 className="h-6 w-6" />
              Global Communication
            </h3>
            <p className="text-gray-600 mb-6">
              In today&apos;s interconnected world, effective communication across languages is more crucial than ever. 
              Our AI-powered translation service bridges the gap between different languages and cultures, 
              enabling seamless global communication for businesses, travelers, and individuals worldwide.
            </p>

            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Languages className="h-6 w-6" />
              Natural Language Understanding
            </h3>
            <p className="text-gray-600">
              Unlike traditional translation tools that often provide literal, word-for-word translations, 
              our advanced AI system understands context, idioms, and cultural nuances. This ensures your 
              message maintains its intended meaning and emotional impact across languages.
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Brain className="h-6 w-6" />
              Continuous Learning
            </h3>
            <p className="text-gray-600 mb-6">
              Our AI translation system continuously learns and improves from millions of conversations, 
              staying up-to-date with language evolution, new expressions, and cultural shifts. This ensures 
              increasingly accurate and natural-sounding translations over time.
            </p>

            <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
              <Users className="h-6 w-6" />
              Cultural Intelligence
            </h3>
            <p className="text-gray-600">
              Beyond simple translation, our service provides cultural context when necessary, helping users 
              understand cultural references, customs, and social norms. This cultural intelligence is 
              essential for building meaningful connections across borders.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
