"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    title: "The Evolution of Translation: From Ancient Scripts to AI",
    description: "Journey through the history of translation technology",
    excerpt: "From ancient scribes to modern AI, discover the fascinating journey of how we've broken down language barriers throughout history.",
    link: "/news/translation-evolution",
  },
  {
    title: "AI Translation: The Future of Global Communication",
    description: "Revolutionizing how we connect across languages",
    excerpt: "Discover how artificial intelligence is revolutionizing language translation and reshaping global communication.",
    link: "/news/ai-translation-future",
  },
  {
    title: "Deep Talk Translation: Beyond Words",
    description: "Understanding emotions and cultural context",
    excerpt: "Experience translation that understands not just your words, but the emotions and cultural nuances behind them.",
    link: "/news/deep-talk-translation",
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
                  <CardDescription className="mt-2">{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">{article.excerpt}</p>
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
