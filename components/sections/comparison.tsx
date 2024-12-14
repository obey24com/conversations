"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  {
    name: "Natural Language Processing",
    traditional: {
      has: false,
      description: "Rigid, word-by-word translation"
    },
    conversational: {
      has: true,
      description: "Understands context and natural speech patterns"
    }
  },
  {
    name: "Cultural Context",
    traditional: {
      has: false,
      description: "Limited cultural understanding"
    },
    conversational: {
      has: true,
      description: "Provides cultural insights and nuances"
    }
  },
  {
    name: "Real-time Voice Translation",
    traditional: {
      has: true,
      description: "Basic voice input support"
    },
    conversational: {
      has: true,
      description: "Advanced voice recognition with context awareness"
    }
  },
  {
    name: "Idiomatic Expressions",
    traditional: {
      has: false,
      description: "Literal translations of idioms"
    },
    conversational: {
      has: true,
      description: "Understands and properly translates idioms"
    }
  }
];

export function Comparison() {
  return (
    <section
      id="comparison"
      className="py-24 scroll-mt-16"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">How We Compare</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See how our conversational approach differs from traditional translation tools.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left font-medium text-gray-500">Feature</th>
              <th className="p-4 text-left font-medium text-gray-500">Traditional Translators</th>
              <th className="p-4 text-left font-medium text-gray-500">Our Conversational Approach</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border-b border-gray-100"
              >
                <td className="p-4 font-medium">{feature.name}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {feature.traditional.has ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-gray-600">{feature.traditional.description}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {feature.conversational.has ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-gray-600">{feature.conversational.description}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
