"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    title: "The Evolution of Translation",
    description: "From ancient scripts to modern AI solutions",
    link: "/news/translation-evolution",
  },
  {
    title: "AI Translation Future",
    description: "The future of global communication",
    link: "/news/ai-translation-future",
  },
  {
    title: "Deep Talk Translation",
    description: "Beyond words and context",
    link: "/news/deep-talk-translation",
  },
  {
    title: "Language Learning",
    description: "Modern approaches to mastering languages",
    link: "/news/language-learning",
  },
  {
    title: "Cultural Exchange",
    description: "Breaking cultural barriers through translation",
    link: "/news/cultural-exchange",
  },
  {
    title: "AI Translation",
    description: "Evolution of AI-powered translation",
    link: "/news/ai-translation",
  },
];

export function NewsTeaser() {
  return (
    <section id="news" className="py-24 scroll-mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center">Latest Insights</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Explore our latest articles about language translation, cultural exchange, and the future of global communication.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.div
              key={article.link}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={article.link}>
                    <Button variant="outline" className="w-full">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/news">
            <Button variant="outline" size="lg">
              View All Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
